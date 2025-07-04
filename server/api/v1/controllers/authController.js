import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { EmailService } from "../services/emailService.js";
import { RedisService } from "../services/redisService.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// Initialize services
const emailService = new EmailService();
const redisService = new RedisService();

// Generate 6-digit OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Step 1: Initiate registration with email only - send OTP
export const initiateSignUp = async (req, res) => {
    const { email } = req.body;
    console.log('Initiate sign up request:', { email });
    
    try {
        // Validate required fields
        if (!email) {
            return res.status(400).json({
                status: "failed",
                message: "Email is required"
            });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: "failed",
                message: "Please enter a valid email address"
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                status: "failed",
                message: "User with this email already exists"
            });
        }

        // Generate OTP
        const otp = generateOTP();
        
        // Store OTP in Redis (expires in 10 minutes)
        await redisService.storeOTP(email, otp, 10);

        // Send OTP email for FetalWatch
        await emailService.sendFetalWatchOTP(email, otp, 'User');

        res.status(200).json({
            status: "success",
            message: "Verification code sent to your email. Please check your inbox and verify to proceed.",
            data: {
                email: email,
                expiresIn: "10 minutes"
            }
        });

    } catch (error) {
        console.error('Initiate sign up error:', error);
        res.status(500).json({
            status: "failed",
            message: "Failed to send verification code",
            errorMessage: error.message
        });
    }
};

// Step 2: Verify OTP only - just confirm email verification
export const verifyEmailAndCompleteSignUp = async (req, res) => {
    const { email, otp } = req.body;
    console.log('Verify email attempt:', { email, otp: otp ? '******' : 'not provided' });
    
    try {
        // Validate input
        if (!email || !otp) {
            return res.status(400).json({
                status: "failed",
                message: "Email and OTP are required"
            });
        }

        // Verify OTP
        const isValidOTP = await redisService.verifyOTP(email, otp);
        if (!isValidOTP) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid or expired OTP"
            });
        }

        // Store email verification status (expires in 30 minutes)
        await redisService.cacheData(`email_verified:${email}`, { verified: true, otp: otp }, 0.5);

        res.status(200).json({
            status: "success",
            message: "Email verified successfully. You can now complete your registration.",
            data: {
                email: email,
                verified: true
            }
        });

    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({
            status: "failed",
            message: "Failed to verify email",
            errorMessage: error.message
        });
    }
};

// Resend OTP
export const resendOTP = async (req, res) => {
    const { email } = req.body;
    
    try {
        if (!email) {
            return res.status(400).json({
                status: "failed",
                message: "Email is required"
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                status: "failed",
                message: "User with this email already exists"
            });
        }

        // Generate new OTP
        const otp = generateOTP();
        
        // Update OTP in Redis
        await redisService.storeOTP(email, otp, 10);

        // Send new OTP
        await emailService.sendFetalWatchOTP(email, otp, 'User');

        res.status(200).json({
            status: "success",
            message: "New verification code sent to your email",
            data: {
                email: email,
                expiresIn: "10 minutes"
            }
        });

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            status: "failed",
            message: "Failed to resend verification code",
            errorMessage: error.message
        });
    }
};

//Step 3: Complete registration with all user details
export const signUp = async (req, res) => {
    const { firstName, lastName, email, password, role, otp } = req.body;
    console.log('Complete signup request:', { firstName, lastName, email, role, hasPassword: !!password, hasOtp: !!otp });
    
    try {
        // Validate required fields
        if (!firstName || !lastName || !email || !password || !role || !otp) {
            return res.status(400).json({
                status: "failed",
                message: "All fields are required"
            });
        }

        // Validate role for healthcare system
        const validRoles = ['patient', 'doctor', 'nurse', 'admin', 'midwife'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid role. Must be one of: patient, doctor, nurse, admin, midwife"
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                status: "failed",
                message: "User with this email already exists"
            });
        }

        // Check if email was verified
        const emailVerified = await redisService.getData(`email_verified:${email}`);
        if (!emailVerified || !emailVerified.verified) {
            return res.status(400).json({
                status: "failed",
                message: "Email verification required. Please verify your email first."
            });
        }

        // Verify the OTP matches the one used for email verification
        if (emailVerified.otp !== otp) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid verification code"
            });
        }

        // Create user in database
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            role,
            emailVerified: true,
            isActive: true
        });

        console.log('User created successfully:', {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            emailVerified: user.emailVerified
        });

        // Clean up verification data
        await redisService.deleteOTP(email);
        await redisService.deleteData(`email_verified:${email}`);

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            status: "success",
            message: "Registration completed successfully. Welcome to FetalWatch!",
            token: token,
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    emailVerified: user.emailVerified
                }
            }
        });

    } catch (error) {
        console.error('Complete signup error:', error);
        res.status(500).json({
            status: "failed",
            message: "Failed to complete registration",
            errorMessage: error.message
        });
    }
};

//user authentication handler
export const signIn = async (req, res) => {
    const { email, password } = req.body;
    console.log('Sign in attempt:', { email, password: password ? '****' : 'not provided' });
    
    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                status: "failed",
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email }).exec();
        console.log('User found:', user ? {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        } : 'no');
        
        if (!user) {
            return res.status(401).json({
                status: "failed",
                message: "Invalid email or password"
            });
        }

        // Check if email is verified 
        // Allow existing users with undefined emailVerified to sign in (legacy users)
        // But require verification for users where emailVerified is explicitly false
        if (user.emailVerified === false) {
            return res.status(401).json({
                status: "failed",
                message: "Please verify your email before signing in. Check your inbox for verification instructions.",
                requiresEmailVerification: true
            });
        }

        const validUser = await user.matchPassword(password);
        console.log('Password match:', validUser ? 'yes' : 'no');
        
        if (!validUser) {
            return res.status(401).json({
                status: "failed",
                message: "Invalid email or password"
            });
        }
        
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        
        const token = generateToken(user.id, user.role);
        
        res.status(200).json({
            status: "success",
            message: "Welcome back to FetalWatch! You have been authenticated successfully.",
            token: token,
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    lastLogin: user.lastLogin
                }
            }
        });
    } catch (error) {
        console.error('Sign in error:', error);
        res.status(500).json({
            status: "failed",
            message: "Authentication failed",
            errorMessage: error.message
        });
    }
};

// user signout handler
export const signoutUser = async (req, res) => {
    try {
        res.clearCookie("token");
        res
        .status(200)
        .json({ status: "success", message: "User signed out successfully" });
    } catch (error) {
        res
        .status(500)
        .json({ error: "Server error", errorMessage: error.message });
    }
};

// forgot password handler with OTP
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({
                status: "failed",
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "No account found with this email address"
            });
        }

        // Generate OTP for password reset
        const otp = generateOTP();
        
        // Store OTP in Redis (expires in 10 minutes)
        await redisService.storeOTP(`password_reset:${email}`, otp, 10);

        // Send password reset OTP
        await emailService.sendFetalWatchPasswordResetOTP(email, otp, user.firstName);

        res.status(200).json({
            status: "success",
            message: "Password reset verification code sent to your email",
            data: {
                email: email,
                expiresIn: "10 minutes"
            }
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            status: "failed",
            message: "Failed to process password reset request",
            errorMessage: error.message
        });
    }
};

// Verify password reset OTP
export const verifyPasswordResetOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        if (!email || !otp) {
            return res.status(400).json({
                status: "failed",
                message: "Email and OTP are required"
            });
        }

        // Verify OTP
        const isValidOTP = await redisService.verifyOTP(`password_reset:${email}`, otp);
        if (!isValidOTP) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid or expired verification code"
            });
        }

        // Generate temporary reset token (valid for 30 minutes)
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User not found"
            });
        }

        const resetToken = generateToken(user._id, user.role, { expiresIn: "30m" });
        
        // Store reset token in Redis
        await redisService.cacheData(`reset_token:${email}`, { 
            token: resetToken, 
            verified: true 
        }, 0.5); // 30 minutes

        // Clean up OTP
        await redisService.deleteOTP(`password_reset:${email}`);

        res.status(200).json({
            status: "success",
            message: "Verification successful. You can now reset your password.",
            data: {
                resetToken: resetToken,
                expiresIn: "30 minutes"
            }
        });
    } catch (error) {
        console.error('Verify password reset OTP error:', error);
        res.status(500).json({
            status: "failed",
            message: "Failed to verify reset code",
            errorMessage: error.message
        });
    }
};

// reset password handler
export const resetPassword = async (req, res) => {
    const { email, resetToken, password, confirmPassword } = req.body;

    try {
        // Validate input
        if (!email || !resetToken || !password || !confirmPassword) {
            return res.status(400).json({
                status: "failed",
                message: "Email, reset token, password and confirm password are required"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                status: "failed",
                message: "Passwords do not match"
            });
        }

        // Password strength validation
        if (password.length < 8) {
            return res.status(400).json({
                status: "failed",
                message: "Password must be at least 8 characters long"
            });
        }

        // Check if reset token exists and is valid
        const resetData = await redisService.getData(`reset_token:${email}`);
        if (!resetData || !resetData.verified || resetData.token !== resetToken) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid or expired reset token. Please request a new password reset."
            });
        }

        // Verify JWT token
        let decodedToken;
        try {
            decodedToken = jwt.verify(resetToken, process.env.JWT_SECRET);
        } catch (jwtError) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid or expired reset token"
            });
        }

        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User not found"
            });
        }

        // Check if user email matches
        if (user.email !== email) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid reset request"
            });
        }

        // Check if new password is different from old password
        const isSamePassword = await user.matchPassword(password);
        if (isSamePassword) {
            return res.status(400).json({
                status: "failed",
                message: "New password cannot be the same as your current password"
            });
        }

        // Update password
        user.password = password;
        user.passwordResetAt = new Date();
        await user.save();

        // Clean up reset token
        await redisService.deleteData(`reset_token:${email}`);

        // Send confirmation email
        await emailService.sendPasswordResetConfirmation(email, user.firstName);

        res.status(200).json({
            status: "success",
            message: "Password has been reset successfully. You can now sign in with your new password."
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            status: "failed",
            message: "Failed to reset password",
            errorMessage: error.message
        });
    }
};

// Email verification only - Step 1: Send OTP for email verification
export const verifyEmailOnly = async (req, res) => {
    const { email } = req.body;
    console.log('Email verification request:', { email });
    
    try {
        // Validate email
        if (!email) {
            return res.status(400).json({
                status: "failed",
                message: "Email is required"
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                status: "failed",
                message: "User with this email already exists"
            });
        }

        // Generate OTP
        const otp = generateOTP();
        
        // Store OTP in Redis for email verification (expires in 10 minutes)
        await redisService.storeOTP(`email_verify:${email}`, otp, 10);

        // Send OTP email for FetalWatch
        await emailService.sendFetalWatchOTP(email, otp, 'User');

        res.status(200).json({
            status: "success",
            message: "Verification code sent to your email. Please verify to continue registration.",
            data: {
                email: email,
                expiresIn: "10 minutes"
            }
        });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            status: "failed",
            message: "Failed to send verification code",
            errorMessage: error.message
        });
    }
};

// Step 2: Verify email OTP only
export const confirmEmailVerification = async (req, res) => {
    const { email, otp } = req.body;
    console.log('Confirm email verification attempt:', { email, otp: otp ? '******' : 'not provided' });
    
    try {
        // Validate input
        if (!email || !otp) {
            return res.status(400).json({
                status: "failed",
                message: "Email and verification code are required"
            });
        }

        // Verify OTP
        const isValidOTP = await redisService.verifyOTP(`email_verify:${email}`, otp);
        if (!isValidOTP) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid or expired verification code"
            });
        }

        // Store email verification status (expires in 30 minutes)
        await redisService.cacheData(`email_verified:${email}`, { verified: true }, 0.5);

        // Clean up email verification OTP
        await redisService.deleteOTP(`email_verify:${email}`);

        res.status(200).json({
            status: "success",
            message: "Email verified successfully. You can now complete your registration.",
            data: {
                email: email,
                verified: true
            }
        });

    } catch (error) {
        console.error('Confirm email verification error:', error);
        res.status(500).json({
            status: "failed",
            message: "Failed to verify email",
            errorMessage: error.message
        });
    }
};
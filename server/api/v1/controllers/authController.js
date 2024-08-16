import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js"

//Register a new user
export const signUp = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists)
            return res
                .status(400)
                .json({ status: "failed", message: "user already exists" });

        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            role
        });

        if (user)
            res.status(201).json({
                status: "success",
                message: "user created successfully",
                data: user
            });
    } catch (error) {
        res.status(500).json({ status: "failed", errorMessage: error.message });
    }
};

//user authentication handler
export const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).exec();
        if (!user) return res.status(401).json({
            status: "bad request",
            message: "invalid email"
        });

        const validUser = await user.matchPassword(password);
        if (!validUser) return res.status(401).json({
            status: "failed",
            message: "invilid password"
        });
        res.status(200).json({
            status: "success",
            message: "user authenticated successfully",
            token: generateToken(user.id, user.role),
        })
    }catch (error) {
        res.status(500).json({ status: "failed", errorMessage: error.message });
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

// forgot password handler
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
        return res
            .status(404)
            .json({ status: "failed", message: "User not found" });
        }

        const resetToken = generateToken(user._id, user.role, { expiresIn: "1h" });
        const resetUrl = `${process.env.RESET_PWD_URL}/${resetToken}`;

        const emailOptions = {
        from: process.env.EMAIL_USER,
        email: user.email,
        subject: "Password Reset",
        content: `<p>You requested to reset your password. Click this link to reset your password:</p> <a href="${resetUrl}">${resetUrl}</a>`,
        };

        await sendEmail(emailOptions);

        res.status(200).json({
        status: "success",
        message: "Password reset email sent successfully",
        });
    } catch (error) {
        res
        .status(500)
        .json({ error: "Server error", errorMessage: error.message });
    }
};

// reset password handler
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedToken.id);

        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }

        if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
        }

        user.password = password;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res
        .status(500)
        .json({ error: "Server error", errorMessage: error.message });
    }
};
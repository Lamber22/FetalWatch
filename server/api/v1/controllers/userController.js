// server/src/api/v1/controllers/userController.js
import User from "../models/userModel.js";
import { EmailService } from "../services/emailService.js";

// Initialize services
const emailService = new EmailService();

// Get all users (with facility filtering for non-system admins)
export const getUsers = async (req, res) => {
    try {
        const currentUser = req.user;
        let query = {};

        // System admins can see all users, facility admins see their own workers
        if (currentUser.role === 'healthProvider') {
            // Show the facility admin themselves and their healthcare workers
            query.$or = [
                { _id: currentUser.id }, // The facility admin themselves
                { facility: currentUser.id } // Their healthcare workers
            ];
        } else if (['doctor', 'nurse', 'midwife'].includes(currentUser.role)) {
            // Healthcare workers can see their facility admin and colleagues
            const user = await User.findById(currentUser.id);
            if (user.facility) {
                query.$or = [
                    { _id: user.facility }, // Their facility admin
                    { facility: user.facility } // Their colleagues
                ];
            }
        }
        // System admins see all users (no filter)

        const users = await User.find(query)
            .populate('facility', 'facilityName email')
            .select('-password');
            
        if (users.length === 0) {
            return res.json({ 
                status: "success",
                message: "No users found", 
                numUsers: 0, 
                data: [] 
            });
        }
        
        res.status(200).json({ 
            status: "success", 
            numUsers: users.length, 
            data: users 
        });
    } catch (error) {
        res.status(500).json({ 
            error: "Server error", 
            errorMessage: error.message 
        });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.json({ message: "No user found" });
        res.json({ status: "success", message: "User found", data: user });
    } catch (error) {
        res
        .status(500)
        .json({ error: "Server error", errorMessage: error.message });
    }
};

export const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;
        const currentUser = req.user;

        // Get all distinct roles from the database
        const roles = await User.distinct("role");

        if (!role) {
            return res.status(400).json({ 
                status: "fail", 
                message: "Role parameter is required" 
            });
        }

        // Check if the role exists in the database
        if (!roles.includes(role)) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid role parameter",
                availableRoles: roles,
            });
        }

        let query = { role: role };

        // System admins can see all users, others only see users from their facility
        if (currentUser.role !== 'admin') {
            const user = await User.findById(currentUser.id);
            if (!user.facility) {
                return res.status(400).json({
                    status: "failed",
                    message: "User not associated with any facility"
                });
            }
            query.facility = user.facility;
        }

        const users = await User.find(query)
            .populate('facility', 'facilityName facilityType')
            .select('-password');

        res.status(200).json({ 
            status: "success", 
            numUsers: users.length, 
            data: users 
        });
    } catch (error) {
        res.status(500).json({ 
            status: "error", 
            message: "Internal Server Error" 
        });
    }
};

// Update user
export const updateUser = async (req, res) => {
    const reqBody = req.body;
    const userId = req.params.userId;

    try {
        const user = await User.findByIdAndUpdate(
        userId,
        { ...reqBody, updatedAt: Date.now() },
        {
            new: true,
            runValidators: true,
        }
        );

        if (!user) {
        return res
            .status(404)
            .json({ status: "failed", message: "User not found" });
        }

        res.status(200).json({
        status: "success",
        message: "User updated successfully",
        data: user,
        });
    } catch (error) {
        res
        .status(500)
        .json({ error: "Server error", errorMessage: error.message });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);

        if (!user) {
        return res
            .status(404)
            .json({ status: "failed", message: "User not found" });
        }
        res.json({ status: "success", message: "User removed successfully" });
    } catch (error) {
        res
        .status(500)
        .json({ error: "Server error", errorMessage: error.message });
    }
    };

    // filter users by search query
    export const manageUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;

        const query = search
        ? {
            $or: [{ _id: search }, { email: { $regex: search, $options: "i" } }],
            }
        : {};

        const users = await User.find(query)
        .select("-password")
        .skip((page - 1) * limit)
        .limit(Number(limit));

        const totalUsers = await User.countDocuments(query);

        res.status(200).json({
        users,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: Number(page),
        });
    } catch (error) {
        res
        .status(500)
        .json({ error: "Server error", errorMessage: error.message });
    }
};

// Get current user
export const getCurrentUser = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ 
                status: 'fail', 
                message: 'Not authenticated. Please log in.' 
            });
        }

        const userId = req.user.id;
        
        const user = await User.findById(userId)
            .populate('facility', 'facilityName facilityType facilityAddress email facilityPhone')
            .select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                status: 'fail', 
                message: 'User not found' 
            });
        }

        // Ensure all fields are included in response
        const userData = {
            _id: user._id,
            id: user._id,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            emailVerified: user.emailVerified,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            facility: user.role === 'healthProvider' 
                ? user.getFacilityInfo()  // For facility admins, return their own facility info
                : (user.facility ? {      // For healthcare workers, return their assigned facility
                    id: user.facility._id,
                    facilityName: user.facility.facilityName,
                    email: user.facility.email,
                    phone: user.facility.facilityPhone,
                    facilityType: user.facility.facilityType,
                    facilityAddress: user.facility.facilityAddress
                } : null)
        };

        res.status(200).json({
            status: 'success',
            data: userData
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: 'Server error',
            error: error.message 
        });
    }
};

// Simplified: Create healthcare worker by facility admin (for doctor, nurse, midwife roles)
export const createHealthcareWorker = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        const creatorId = req.user.id;
        const creatorRole = req.user.role;

        if (!firstName || !lastName || !email || !password || !role) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }

        if (!['healthProvider', 'admin'].includes(creatorRole)) {
            return res.status(403).json({ status: "failed", message: "Unauthorized" });
        }

        const creator = await User.findById(creatorId);
        if (creatorRole === 'healthProvider' && !creator.facilityName) {
            return res.status(400).json({ status: "failed", message: "Creator not properly configured as facility admin" });
        }

        // Define allowed roles
        const allowedRoles = creatorRole === 'admin'
            ? ['admin']
            : ['doctor', 'nurse', 'midwife'];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ status: "failed", message: `Allowed roles: ${allowedRoles.join(', ')}` });
        }

        if (await User.findOne({ email })) {
            return res.status(400).json({ status: "failed", message: "User with this email already exists" });
        }

        // Special case: admin creating admin
        if (creatorRole === 'admin' && role === 'admin') {
            const user = await User.create({
                firstName, lastName, email, password, role,
                emailVerified: true, isActive: true, createdBy: creatorId
            });
            return res.status(201).json({
                status: "success",
                message: `Admin account created and activated successfully by admin.`,
                data: { user: {
                    id: user._id, firstName: user.firstName, lastName: user.lastName,
                    email: user.email, role: user.role, isActive: user.isActive, emailVerified: user.emailVerified
                }}
            });
        }

        // Default: create healthcare worker
        const user = await User.create({
            facility: creator._id,
            firstName, lastName, email, password, role,
            emailVerified: true, isActive: true, createdBy: creatorId
        });

        res.status(201).json({
            status: "success",
            message: `${role} account created and activated successfully in ${creator.facilityName || 'system'}.`,
            data: { user: {
                id: user._id, firstName: user.firstName, lastName: user.lastName,
                email: user.email, role: user.role, isActive: user.isActive, emailVerified: user.emailVerified,
                facilityAdmin: { id: creator._id, facilityName: creator.facilityName }
            }}
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Failed to create healthcare worker account",
            errorMessage: error.message
        });
    }
};

// Activate user account (admin only)
export const activateUserAccount = async (req, res) => {
    try {
        const { userId } = req.params;
        const adminId = req.user.id;
        const adminRole = req.user.role;

        // Only admins can activate accounts
        if (adminRole !== 'admin') {
            return res.status(403).json({
                status: "failed",
                message: "Only administrators can activate user accounts"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User not found"
            });
        }

        if (user.isActive) {
            return res.status(400).json({
                status: "failed",
                message: "User account is already active"
            });
        }

        // Activate the account
        user.isActive = true;
        user.activatedBy = adminId;
        user.activatedAt = new Date();
        await user.save();

        // Send account activation email notification
        try {
            await emailService.sendAccountActivationNotification(
                user.email,
                user.firstName,
                user.lastName,
                user.role,
                user.facilityName
            );
        } catch (emailError) {
            // Don't fail the activation if email fails, just log the error
        }

        res.status(200).json({
            status: "success",
            message: "User account activated successfully and notification email sent",
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive,
                    activatedAt: user.activatedAt
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Failed to activate user account",
            errorMessage: error.message
        });
    }
};

// Deactivate user account (admin only)
export const deactivateUserAccount = async (req, res) => {
    try {
        const { userId } = req.params;
        const adminRole = req.user.role;

        // Only admins can deactivate accounts
        if (adminRole !== 'admin') {
            return res.status(403).json({
                status: "failed",
                message: "Only administrators can deactivate user accounts"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User not found"
            });
        }

        if (!user.isActive) {
            return res.status(400).json({
                status: "failed",
                message: "User account is already inactive"
            });
        }

        // Deactivate the account
        user.isActive = false;
        user.activatedBy = null;
        user.activatedAt = null;
        await user.save();

        res.status(200).json({
            status: "success",
            message: "User account deactivated successfully",
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Failed to deactivate user account",
            errorMessage: error.message
        });
    }
};

// Get pending activation users (admin only)
export const getPendingActivationUsers = async (req, res) => {
    try {
        const adminRole = req.user.role;

        // Only admins can view pending activations
        if (adminRole !== 'admin') {
            return res.status(403).json({
                status: "failed",
                message: "Only administrators can view pending activations"
            });
        }

        const pendingUsers = await User.find({ 
            isActive: false,
            emailVerified: true,
            role: { $in: ['healthProvider'] } // Only healthProvider accounts need activation
        })
        .select('-password')
        .populate('createdBy', 'firstName lastName email role')
        .sort({ createdAt: -1 });

        res.status(200).json({
            status: "success",
            message: "Pending activation healthProvider accounts retrieved successfully",
            data: {
                count: pendingUsers.length,
                users: pendingUsers
            }
        });

    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Failed to retrieve pending activation users",
            errorMessage: error.message
        });
    }
};

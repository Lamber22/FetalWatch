// server/src/api/v1/controllers/userController.js
import User from "../models/userModel.js";

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (users.length === 0) return res.json({ message: "No users Database empty" });
        res
        .status(200)
        .json({ status: "success", numUsers: users.length, data: users });
    } catch (error) {
        console.error(error);
        res
        .status(500)
        .json({ error: "Server error", errorMessage: error.message });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.json({ message: "No user found" });
        res.json({ status: "success", message: "User found", data: user });
    } catch (error) {
        console.error(error);
        res
        .status(500)
        .json({ error: "Server error", errorMessage: error.message });
    }
};

export const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;

        // Get all distinct roles from the database
        const roles = await User.distinct("role");

        if (!role) {
        return res
            .status(400)
            .json({ status: "fail", message: "Role parameter is required" });
        }

        // Check if the role exists in the database
        if (!roles.includes(role)) {
        return res.status(400).json({
            status: "fail",
            message: "Invalid role parameter",
            availableRoles: roles,
        });
        }

        const users = await User.find({ role: role });

        res
        .status(200)
        .json({ status: "success", numUsers: users.length, data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};

// Update user
export const updateUser = async (req, res) => {
    // const reqBody = req.body;
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
        console.error(error);
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
        console.error(error);
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

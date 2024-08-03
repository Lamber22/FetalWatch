
import User from "../models/userModel.js";

//Register a new user
export const signUp = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    try {
        const userExists = await User.findone({ email });
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

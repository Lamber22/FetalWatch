import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js"

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

//user authentication handler
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findone({ email }).exec();
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
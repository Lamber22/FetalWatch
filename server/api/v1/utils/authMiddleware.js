import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const secretKey = process.env.JWT_SECRET;

// Middleware to authenticate user
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res
        .status(401)
        .json({
            status: "failed",
            message: "Authorization denied"
        });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ message: "Token is not valid" });
    }
};

const jsonParserMiddleware = (req, res, next) => {
    if (req.method === 'GET') {
        return next(); // Skip JSON parsing for GET requests
    }
    return express.json()(req, res, next); // Parse JSON payload for non-GET requests
};


export { authMiddleware, jsonParserMiddleware };
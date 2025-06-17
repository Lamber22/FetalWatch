import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_SECRET;

// Middleware to authenticate user using JWT token
export const authenticateToken = (req, res, next) => {
    try {
        console.log('AuthMiddleware: Checking authentication');
        
        // Get token from Authorization header
        const authHeader = req.header("Authorization");
        console.log('AuthMiddleware: Authorization header:', authHeader);
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log('AuthMiddleware: No valid authorization header found');
            return res.status(401).json({
                status: "fail",
                message: "Access denied. No token provided or invalid format."
            });
        }

        const token = authHeader.split(" ")[1];
        console.log('AuthMiddleware: Token extracted:', token ? 'yes' : 'no');

        if (!token) {
            console.log('AuthMiddleware: No token found after split');
            return res.status(401).json({
                status: "fail",
                message: "Access denied. No token provided."
            });
        }

        // Verify token
        const decoded = jwt.verify(token, secretKey);
        console.log('AuthMiddleware: Token decoded successfully:', decoded);
        
        // Add user info to request object
        req.user = decoded;
        next();
    } catch (error) {
        console.error("AuthMiddleware: Token verification error:", error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: "fail",
                message: "Token has expired"
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: "fail",
                message: "Invalid token"
            });
        } else {
            return res.status(401).json({
                status: "fail",
                message: "Token verification failed"
            });
        }
    }
};

// Optional: Middleware to check user roles
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: "fail",
                message: "User not authenticated"
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: "fail",
                message: "Access denied. Insufficient permissions."
            });
        }

        next();
    };
};

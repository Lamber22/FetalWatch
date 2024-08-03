import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET;

const generateToken = (id, role) => {
    const payload = { id, role };
    return jwt.sign(payload, secretKey, {
        expiresIn: "30d",
    });
};

export default generateToken;
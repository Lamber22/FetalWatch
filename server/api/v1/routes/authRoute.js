import { Router } from "express";
import { signUp, signIn } from "../controllers/authController.js";

const router = Router();

router.post("/signUp", (req, res) => {
    console.log('Received signUp request:', req.body); // Debug log
    signUp(req, res);
});

router.post("/signIn", (req, res) => {
    console.log('Received signIn request:', req.body); // Debug log
    signIn(req, res);
});

export default router;

import { Router } from "express";
import { signUp, signIn } from "../controllers/authController.js";

const router = Router();

router.post("/signUp", (req, res) => {
    signUp(req, res);
});

router.post("/signIn", (req, res) => {
    signIn(req, res);
});

export default router;

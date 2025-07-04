import { Router } from "express";
import { 
    signUp, 
    signIn, 
    signoutUser,
    initiateSignUp,
    verifyEmailAndCompleteSignUp,
    resendOTP,
    forgotPassword,
    verifyPasswordResetOTP,
    resetPassword,
    confirmEmailVerification
} from "../controllers/authController.js";

const router = Router();

router.post("/confirm-email-verification", (req, res) => {
    confirmEmailVerification(req, res);
});

// New registration flow with email verification
router.post("/initiate-signup", (req, res) => {
    initiateSignUp(req, res);
});

router.post("/verify-email", (req, res) => {
    verifyEmailAndCompleteSignUp(req, res);
});

router.post("/resend-otp", (req, res) => {
    resendOTP(req, res);
});

// Legacy signup route (now redirects to new flow)
router.post("/signUp", (req, res) => {
    signUp(req, res);
});

// Authentication
router.post("/signIn", (req, res) => {
    signIn(req, res);
});

router.post("/signout", (req, res) => {
    signoutUser(req, res);
});

// Password reset flow
router.post("/forgot-password", (req, res) => {
    forgotPassword(req, res);
});

router.post("/verify-reset-otp", (req, res) => {
    verifyPasswordResetOTP(req, res);
});

router.post("/reset-password", (req, res) => {
    resetPassword(req, res);
});

export default router;

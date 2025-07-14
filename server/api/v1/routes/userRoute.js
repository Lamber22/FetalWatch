import { Router } from "express";
import { authenticateToken } from "../../../middleware/authMiddleware.js";

import {
    getUsers,
    getUserById,
    getUsersByRole,
    updateUser,
    deleteUser,
    getCurrentUser,
    createHealthcareWorker,
    activateUserAccount,
    deactivateUserAccount,
    getPendingActivationUsers
} from "../controllers/userController.js";

const router = Router();

router.get("/", authenticateToken, getUsers);
router.get("/me", authenticateToken, getCurrentUser);
router.get("/pending-activation", authenticateToken, getPendingActivationUsers);
router.get("/:userId", authenticateToken, getUserById);
router.get("/role/:role", authenticateToken, getUsersByRole);
router.post("/create", authenticateToken, createHealthcareWorker);
router.put("/:userId", authenticateToken, updateUser);
router.put("/:userId/activate", authenticateToken, activateUserAccount);
router.put("/:userId/deactivate", authenticateToken, deactivateUserAccount);
router.delete("/:userId", authenticateToken, deleteUser);

export default router;
import { Router } from "express";
import { authenticateToken } from "../../../middleware/authMiddleware.js";

import {
    getUsers,
    getUserById,
    getUsersByRole,
    updateUser,
    deleteUser,
    getCurrentUser
} from "../controllers/userController.js";

const router = Router();

router.get("/", getUsers);
router.get("/current", authenticateToken, getCurrentUser);
router.get("/:userId", getUserById);
router.get("/role/:role", getUsersByRole);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);

export default router;
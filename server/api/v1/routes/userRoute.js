import { Router } from "express";

import {
    getUsers,
    getUserById,
    getUsersByRole,
    updateUser,
    deleteUser
} from "../controllers/userController.js";

const router = Router();

router.get("/", getUsers);
router.get("/:userId", getUserById);
router.get("/role:role", getUsersByRole);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);

export default router;
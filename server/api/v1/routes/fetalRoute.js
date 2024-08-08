import { Router } from "express";
import {
    createFetal,
    getFetals,
    getFetalById,
    updateFetal,
    deleteFetal
} from "../controllers/fetalController.js";

const router = Router();
router.post("/", createFetal);
router.get("/", getFetals);
router.get("/:id", getFetalById);
router.put("/:id", updateFetal);
router.delete("/:id", deleteFetal);

export default router;
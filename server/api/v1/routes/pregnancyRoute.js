import { Router } from "express";
import {
    createPregnancy,
    getPregnancies,
    updatePregnancy,
    getPregnancyById,
    deletePregnancy
} from "../controllers/pregnancyController.js";

const router = Router();

router.post("/", createPregnancy);
router.get("/", getPregnancies);
router.get("/:id", getPregnancyById);
router.put("/:id", updatePregnancy);
router.get("/:id", deletePregnancy);

export default router;
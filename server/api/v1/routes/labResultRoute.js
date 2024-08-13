import { Router } from "express";
import {
    createLabResult,
    getLabResults,
    getLabResultById,
    updateLabResult,
    deleteLabResult
} from "../controllers/labResultController.js";

const router = Router();

router.post("/", createLabResult);
router.get("/", getLabResults);
router.get("/:id", getLabResultById);
router.put("/:id", updateLabResult);
router.delete("/:id", deleteLabResult);

export default router;

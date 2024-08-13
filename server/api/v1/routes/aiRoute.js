import { Router } from "express";
import {
    newAiResult,
    getAiResults,
    getAiResultById,
    updateAiResult,
    deleteAiResult
} from "../controllers/aiController.js";

const router = Router();

router.post("/", newAiResult);
router.get("/", getAiResults);
router.get("/:id", getAiResultById);
router.put("/:id", updateAiResult);
router.delete("/:id", deleteAiResult);

export default router;
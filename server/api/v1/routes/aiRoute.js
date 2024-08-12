import { Router } from "express";
import {
    newAiResult,
    getAiResults,
    getAiResultById,
    updateAiresult,
    deleteAiResult
} from "../controllers/aiController.js";

const router = Router();

router.post("/", newAiResult);
router.get("/", getAiResults);
router.get("/:id", getAiResultById);
router.put("/:", updateAiresult);
router.delete("/:id", deleteAiResult);

export default router;
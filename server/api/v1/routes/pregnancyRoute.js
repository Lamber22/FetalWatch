import { Router } from "express";
import {
    createPregnancy,
    getPregnancies,
    updatePregnancy,
    getPregnancyById,
    deletePregnancy,
    getPregnanciesByPatientId
} from "../controllers/pregnancyController.js";

const router = Router();

router.post("/", createPregnancy);
router.get("/", getPregnancies);
router.get("/patient/:patientId", getPregnanciesByPatientId);
router.get("/:id", getPregnancyById);
router.put("/:id", updatePregnancy);
router.delete("/:id", deletePregnancy);

export default router;
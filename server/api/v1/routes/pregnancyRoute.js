import { Router } from "express";
import {
    createPregnancy,
    getPregnancies,
    updatePregnancy,
    getPregnancyById,
    deletePregnancy,
    getPregnanciesByPatientId
} from "../controllers/pregnancyController.js";
import { getFacilityContext, requireFacilityAccess } from "../../../middleware/facilityMiddleware.js";

const router = Router();

// Apply facility context and access control to all pregnancy routes
router.use(getFacilityContext);
router.use(requireFacilityAccess(['healthProvider', 'doctor', 'nurse', 'midwife']));

router.post("/", createPregnancy);
router.get("/", getPregnancies);
router.get("/patient/:patientId", getPregnanciesByPatientId);
router.get("/:id", getPregnancyById);
router.put("/:id", updatePregnancy);
router.delete("/:id", deletePregnancy);

export default router;
import { Router } from "express";
import {
    createPatient,
    getPatients,
    managePatients,
    getPatientById,
    updatePatient,
    deletePatient
} from "../controllers/patientController.js";
import { getFacilityContext, requireFacilityAccess } from "../../../middleware/facilityMiddleware.js";
import { authenticateToken } from "../../../middleware/authMiddleware.js";

const router = Router();

// Apply authentication, facility context, and access control to all patient routes
router.use(authenticateToken);
router.use(getFacilityContext);
router.use(requireFacilityAccess(['healthProvider', 'doctor', 'nurse', 'midwife']));

router.post("/", createPatient);
router.get("/", getPatients);
router.get("/manage", managePatients); // Changed route to avoid conflict
router.get("/:patientId", getPatientById);
router.put("/:patientId", updatePatient);
router.delete("/:patientId", deletePatient);

export default router;
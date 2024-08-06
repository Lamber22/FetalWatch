import { Router } from "express";
import {
    createPatient,
    getPatients,
    managePatients,
    getPatientById,
    updatePatient,
    deletePatient
} from "../controllers/patientController.js";

const router = Router();

router.post("/", createPatient);
router.get("/", getPatients);
router.get("/", managePatients);  // Use managePatients for pagination and search
router.get("/:patientId", getPatientById);
router.put("/:patientId", updatePatient);
router.delete("/:patientId", deletePatient);

export default router;
import { Router } from "express";
import {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient
} from "../controllers/patientController.js";

const router = Router();

router.post("/", createPatient);
router.get("/", getPatients);
router.get("/:patientId", getPatientById);
router.put("/:patientId", updatePatient);
router.delete("/:patientId", deletePatient);

export default router;
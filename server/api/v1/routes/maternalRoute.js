import { Router } from "express";
import {
    createMaternalHealth,
    getMaternalHealthRecords,
    getMaternalHealthById,
    getMaternalHealthByPatient,
    updateMaternalHealth,
    deleteMaternalHealth
} from "../controllers/maternalController.js";

const router = Router();

router.post("/", createMaternalHealth);
router.get("/", getMaternalHealthRecords);
router.get("/:id", getMaternalHealthById);
router.get("/patient/:patientId", getMaternalHealthByPatient);
router.put("/:id", updateMaternalHealth);
router.delete("/:id", deleteMaternalHealth);

export default router;

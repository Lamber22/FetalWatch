import { Router } from "express";
import {
    getFacilityDashboard,
    generatePatientReport,
    generateFacilityReport,
    getHighRiskIndicatorsReport,
    exportReport
} from "../controllers/reportController.js";

const router = Router();

router.get("/dashboard", getFacilityDashboard);
router.get("/patient/:patientId", generatePatientReport);
router.get("/facility", generateFacilityReport);
router.get("/risk-indicators", getHighRiskIndicatorsReport);
router.get("/export/:reportType", exportReport);

export default router;

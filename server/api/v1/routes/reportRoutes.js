import express from 'express';
import {
  getRiskAssessment,
  getVitalTrends,
  getPotentialComplications,
  getDashboardReport,
  getFacilityReport,
  getRiskIndicatorsReport,
  exportFacilityReport,
  exportDashboardReport,
  exportRiskIndicatorsReport
} from '../controllers/reportController.js';
import { authenticateToken } from '../../../middleware/authMiddleware.js';
import { getFacilityContext, requireFacilityAccess } from "../../../middleware/facilityMiddleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(getFacilityContext);
router.use(requireFacilityAccess(['healthProvider', 'doctor', 'nurse', 'midwife']));

// System-wide reports
router.get('/dashboard', getDashboardReport);
router.get('/facility', getFacilityReport);
router.get('/risk-indicators', getRiskIndicatorsReport);

// Export routes
router.get('/export/facility', exportFacilityReport);
router.get('/export/dashboard', exportDashboardReport);
router.get('/export/risk-indicators', exportRiskIndicatorsReport);

// Patient-specific reports
router.get('/risk-assessment/:patientId', getRiskAssessment);
router.get('/vital-trends/:patientId', getVitalTrends);
router.get('/complications/:patientId', getPotentialComplications);

export default router;
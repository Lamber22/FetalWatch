import express from 'express';
import { 
  createRiskAssessment, 
  getRiskAssessments, 
  getRiskAssessmentById, 
  getRiskAssessmentsByPatient,
  generateRiskAssessment,
  updateRiskAssessment,
  acknowledgeAlert,
  getHighRiskPatients
} from '../controllers/riskAssessmentController.js';

const router = express.Router();

router.post('/', createRiskAssessment);
router.get('/', getRiskAssessments);
router.get('/:id', getRiskAssessmentById);
router.get('/patient/:patientId', getRiskAssessmentsByPatient);
router.post('/generate/:patientId/:pregnancyId', generateRiskAssessment);
router.put('/:id', updateRiskAssessment);
router.put('/:assessmentId/alert/:alertIndex/acknowledge', acknowledgeAlert);
router.get('/high-risk/patients', getHighRiskPatients);

export default router;

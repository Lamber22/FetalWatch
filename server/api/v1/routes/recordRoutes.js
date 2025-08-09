import express from 'express';
import {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord
} from '../controllers/recordController.js';
import { authenticateToken } from '../../../middleware/authMiddleware.js';
import { getFacilityContext, requireFacilityAccess } from "../../../middleware/facilityMiddleware.js";
const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(getFacilityContext);
router.use(requireFacilityAccess(['healthProvider', 'doctor', 'nurse', 'midwife']));

// Create a new medical record
router.post('/', createMedicalRecord);
router.get('/patient/:patientId', getMedicalRecords);
router.get('/:recordId', getMedicalRecordById);
router.put('/:recordId', updateMedicalRecord);
router.delete('/:recordId', deleteMedicalRecord);

export default router;
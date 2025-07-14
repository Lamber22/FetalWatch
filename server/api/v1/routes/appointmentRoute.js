import express from 'express';
import {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
    getAppointmentsByPatient,
    getAppointmentsByDoctor,
    getTodaysAppointments,
    updateAppointmentStatus
} from '../controllers/appointmentController.js';
import { getFacilityContext, requireFacilityAccess } from '../../../middleware/facilityMiddleware.js';

const router = express.Router();

// Apply facility context and access control to all appointment routes
router.use(getFacilityContext);
router.use(requireFacilityAccess(['healthProvider', 'doctor', 'nurse', 'midwife']));

router.get('/', getAllAppointments);
router.get('/today', getTodaysAppointments);
router.get('/:id', getAppointmentById);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);
router.patch('/:id/status', updateAppointmentStatus);
router.patch('/:id/cancel', cancelAppointment);
router.delete('/:id', deleteAppointment);
router.get('/patient/:patientId', getAppointmentsByPatient);
router.get('/doctor/:doctor', getAppointmentsByDoctor);

export default router;
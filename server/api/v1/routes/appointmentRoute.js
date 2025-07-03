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

const router = express.Router();

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
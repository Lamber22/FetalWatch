import express from 'express';
import {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorsBySpecialization,
    getDoctorAvailability
} from '../controllers/doctorController.js';

const router = express.Router();

// GET /api/v1/doctors - Get all doctors with optional filtering and pagination
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.post('/', createDoctor);
router.put('/:id', updateDoctor);
router.delete('/:id', deleteDoctor);
router.get('/specialization/:specialization', getDoctorsBySpecialization);
router.get('/:id/availability', getDoctorAvailability);

export default router;
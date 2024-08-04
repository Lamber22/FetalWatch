import Patient from '../models/Patient';
import { validationResult } from 'express-validator';

// Create a new patient
export const createPatient = async (req, res) => {
    try {
        // Validate incoming request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Validate required fields
        const {
            firstName, lastName, dateOfBirth, age, gender,
            address, contactInformation, emergencyContact, medicalHistory
        } = req.body;

        if (!firstName ||
            !lastName ||
            !dateOfBirth ||
            !age ||
            !gender ||
            !address ||
            !contactInformation ||
            !emergencyContact) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create and save patient
        const patient = new Patient(req.body);
        await patient.save();
        res.status(201).json({ status: "success", message: "Patient created successfully", data: patient });
    } catch (error) {
        res.status(400).json({ status: "failed", error: error.message });
    }
};

// Get all patients
export const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json({ status: "success", numPatients: patients.length, data: patients });
    } catch (error) {
        res.status(500).json({status: "failed", error: error.message });
    }
};

// Get a specific patient
export const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json({ status: "success", message:"Patient found", data: patient });
    } catch (error) {
        res.status(500).json({status: "failed", error: error.message });
    }
};

// Update a patient
export const updatePatient = async (req, res) => {
    try {
        // Validate incoming request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Validate required fields
        const {
            firstName, lastName, dateOfBirth, age, gender,
            address, contactInformation, emergencyContact, medicalHistory
        } = req.body;

        if (!firstName ||
            !lastName ||
            !dateOfBirth ||
            !age ||
            !gender ||
            !address ||
            !contactInformation ||
            !emergencyContact ||
            !medicalHistory) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json({ status: "success", message: "Patient updated successfully", data: patient });
    } catch (error) {
        res.status(400).json({ status: "failed", error: error.message });
    }
};

// Delete a patient
export const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json({ status: "success", message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

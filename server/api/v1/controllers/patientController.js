import Patient from '../models/patientModel.js';
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
        if (patients.length === 0) return res.json({ message: "No patient found in Database" });
        res.status(200).json({
            status: "success",
            numPatients: patients.length,
            data: patients
        });
    } catch (error) {
        res.status(500).json({status: "failed", error: error.message });
    }
};

// Get a specific patient
export const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.patientId);
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
        const {
            firstName, lastName, dateOfBirth, age, gender,
            address, contactInformation, emergencyContact, medicalHistory
        } = req.body;

        const patient = await Patient.findByIdAndUpdate(req.params.patientId, req.body, { new: true });
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
        const patient = await Patient.findByIdAndDelete(req.params.patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json({ status: "success", message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// filter patients by search query
export const managePatients = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;

        const query = search
            ? {
                $or: [{ _id: search }, { email: { $regex: search, $options: "i" } }],
            }
            : {};

        const patients = await Patient.find(query)
            .select("-password")
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const totalPatients = await Patient.countDocuments(query);

        res.status(200).json({
            patients,
            totalPages: Math.ceil(totalPatients / limit),
            currentPage: Number(page),
        });
    } catch (error) {
        res.status(500).json({ error: "Server error", errorMessage: error.message });
    }
};

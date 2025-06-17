import Patient from '../models/patientModel.js';
import { validationResult } from 'express-validator';

// Create a new patient
export const createPatient = async (req, res) => {
    try {
        // Validate incoming request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                status: "failed",
                message: "Validation failed",
                errors: errors.array() 
            });
        }

        // Validate required fields
        const {
            name, dateOfBirth, gender, address, contact, weekOfPregnancy, expectedDeliveryDate
        } = req.body;

        console.log('Received patient data:', req.body); // Debug log

        if (!name || !dateOfBirth || !gender || !address || !contact) {
            return res.status(400).json({ 
                status: "failed",
                message: 'Missing required fields',
                required: ['name', 'dateOfBirth', 'gender', 'address', 'contact'],
                received: Object.keys(req.body)
            });
        }

        // Validate date format
        const birthDate = new Date(dateOfBirth);
        if (isNaN(birthDate.getTime())) {
            return res.status(400).json({ 
                status: "failed",
                message: 'Invalid date format for dateOfBirth' 
            });
        }

        // Validate week of pregnancy if provided
        if (weekOfPregnancy !== undefined && weekOfPregnancy !== null && weekOfPregnancy !== '') {
            const week = Number(weekOfPregnancy);
            if (isNaN(week) || week < 1 || week > 42) {
                return res.status(400).json({ 
                    status: "failed",
                    message: 'Week of pregnancy must be between 1 and 42' 
                });
            }
        }

        // Validate expected delivery date if provided
        let deliveryDate;
        if (expectedDeliveryDate) {
            deliveryDate = new Date(expectedDeliveryDate);
            if (isNaN(deliveryDate.getTime())) {
                return res.status(400).json({ 
                    status: "failed",
                    message: 'Invalid date format for expectedDeliveryDate' 
                });
            }
        }

        // Create patient data object
        const patientData = {
            name: name.trim(),
            dateOfBirth: birthDate,
            gender,
            address: address.trim(),
            contact: contact.trim()
        };

        // Add optional fields only if they have valid values
        if (weekOfPregnancy !== undefined && weekOfPregnancy !== null && weekOfPregnancy !== '') {
            patientData.weekOfPregnancy = Number(weekOfPregnancy);
        }

        if (expectedDeliveryDate && deliveryDate) {
            patientData.expectedDeliveryDate = deliveryDate;
        }

        // Create and save patient
        const patient = new Patient(patientData);
        
        await patient.save();
        
        console.log('Patient created successfully:', patient); // Debug log
        
        res.status(201).json({ 
            status: "success", 
            message: "Patient created successfully", 
            data: patient 
        });
    } catch (error) {
        console.error('Error creating patient:', error); // Debug log
        
        if (error.code === 11000) {
            return res.status(400).json({ 
                status: "failed", 
                message: "Duplicate entry detected" 
            });
        }
        
        res.status(400).json({ 
            status: "failed", 
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
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
            name, dateOfBirth, gender, address, contact, weekOfPregnancy, expectedDeliveryDate
        } = req.body;

        const updateData = {
            ...req.body,
            updatedAt: new Date()
        };

        const patient = await Patient.findByIdAndUpdate(req.params.patientId, updateData, { new: true });
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
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { contact: { $regex: search, $options: "i" } }
                ],
            }
            : {};

        const patients = await Patient.find(query)
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

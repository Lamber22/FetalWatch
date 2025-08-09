import MedicalRecord from '../models/medicalRecord.js';
import Patient from '../models/patientModel.js';
import { validationResult } from 'express-validator';
import { createFacilityFilter } from '../../../middleware/facilityMiddleware.js';

// Create a new medical record
export const createMedicalRecord = async (req, res) => {
    try {
        console.log('Received request body:', JSON.stringify(req.body, null, 2));
        console.log('User from request:', req.user);
        
        // Validate incoming request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                status: "failed",
                message: "Validation failed",
                errors: errors.array() 
            });
        }

        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                status: "failed",
                message: "User not authenticated"
            });
        }

        // Check if patient exists
        const patient = await Patient.findById(req.body.patient);
        if (!patient) {
            return res.status(404).json({
                status: "failed",
                message: "Patient not found"
            });
        }

        // Transform and prepare data for saving
        const recordData = {
            ...req.body,
            createdBy: req.user.id
        };

        // Convert date strings to Date objects if they exist
        if (recordData.date && typeof recordData.date === 'string') {
            recordData.date = new Date(recordData.date);
        }
        if (recordData.lastMenstrualPeriod && typeof recordData.lastMenstrualPeriod === 'string') {
            recordData.lastMenstrualPeriod = new Date(recordData.lastMenstrualPeriod);
        }
        if (recordData.expectedDueDate && typeof recordData.expectedDueDate === 'string') {
            recordData.expectedDueDate = new Date(recordData.expectedDueDate);
        }
        if (recordData.followUp?.nextVisitDate && typeof recordData.followUp.nextVisitDate === 'string') {
            recordData.followUp.nextVisitDate = new Date(recordData.followUp.nextVisitDate);
        }

        console.log('Transformed record data:', JSON.stringify(recordData, null, 2));

        // Create medical record
        const medicalRecord = new MedicalRecord(recordData);

        await medicalRecord.save();

        // No need to manually add to patient's records - handled by virtual field

        res.status(201).json({
            status: "success",
            message: "Medical record created successfully",
            data: medicalRecord
        });
    } catch (error) {
        console.error('Error creating medical record:', error);
        
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));
            
            return res.status(400).json({
                status: "failed",
                message: "Validation failed",
                errors: validationErrors
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({
                status: "failed",
                message: "Duplicate record found"
            });
        }

        res.status(400).json({
            status: "failed",
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};

// Get all medical records for a patient
export const getMedicalRecords = async (req, res) => {
    try {
        const { patientId } = req.params;
        
        // Check if patient exists
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                status: "failed",
                message: "Patient not found"
            });
        }

        // Get all medical records for the patient
        const medicalRecords = await MedicalRecord.find({ patient: patientId })
            .sort({ date: -1, createdAt: -1 });

        res.status(200).json({
            status: "success",
            count: medicalRecords.length,
            data: medicalRecords
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Failed to retrieve medical records",
            error: error.message
        });
    }
};

// Get a single medical record by ID
export const getMedicalRecordById = async (req, res) => {
    try {
        const { recordId } = req.params;
        
        const medicalRecord = await MedicalRecord.findById(recordId)
            .populate('patient', 'name dateOfBirth gender');

        if (!medicalRecord) {
            return res.status(404).json({
                status: "failed",
                message: "Medical record not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: medicalRecord
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Failed to retrieve medical record",
            error: error.message
        });
    }
};

// Update a medical record
export const updateMedicalRecord = async (req, res) => {
    try {
        const { recordId } = req.params;
        
        // Find and update the record
        const medicalRecord = await MedicalRecord.findByIdAndUpdate(
            recordId,
            { 
                ...req.body,
                updatedAt: new Date() 
            },
            { 
                new: true, 
                runValidators: true 
            }
        );

        if (!medicalRecord) {
            return res.status(404).json({
                status: "failed",
                message: "Medical record not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Medical record updated successfully",
            data: medicalRecord
        });
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: "Failed to update medical record",
            error: error.message
        });
    }
};

// Delete a medical record
export const deleteMedicalRecord = async (req, res) => {
    try {
        const { recordId } = req.params;
        
        // Find and delete the record
        const medicalRecord = await MedicalRecord.findByIdAndDelete(recordId);
        
        if (!medicalRecord) {
            return res.status(404).json({
                status: "failed",
                message: "Medical record not found"
            });
        }

        // No need to manually remove from patient's records - handled by virtual field

        res.status(200).json({
            status: "success",
            message: "Medical record deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Failed to delete medical record",
            error: error.message
        });
    }
};
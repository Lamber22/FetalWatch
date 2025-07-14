import Patient from '../models/patientModel.js';
import User from '../models/userModel.js';
import { validationResult } from 'express-validator';
import { createFacilityFilter } from '../../../middleware/facilityMiddleware.js';

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

        // Get current user and determine their facility admin
        const currentUser = await User.findById(req.user.id);
        let facilityAdminId;
        
        if (currentUser.role === 'healthProvider') {
            facilityAdminId = currentUser._id;
        } else if (['doctor', 'nurse', 'midwife'].includes(currentUser.role)) {
            facilityAdminId = currentUser.facility;
        } else if (currentUser.role === 'admin') {
            return res.status(403).json({
                status: "failed",
                message: "System admins cannot create patients directly. Please use a facility admin account."
            });
        } else {
            return res.status(400).json({
                status: "failed",
                message: "User not authorized to create patients"
            });
        }

        if (!facilityAdminId) {
            return res.status(400).json({
                status: "failed",
                message: "User not associated with any facility"
            });
        }

        // Validate required fields
        const {
            name, dateOfBirth, gender, address, contact, weekOfPregnancy, expectedDeliveryDate
        } = req.body;

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
            facility: facilityAdminId, // Associate patient with facility
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

        // Get facility admin info for response
        const facilityAdmin = await User.findById(facilityAdminId);
        
        res.status(201).json({ 
            status: "success", 
            message: `Patient created successfully in ${facilityAdmin.facilityName || 'facility'}`, 
            data: patient 
        });
    } catch (error) {
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

// Get all patients (with facility filtering)
export const getPatients = async (req, res) => {
    try {
        // Create facility-based filter
        const query = createFacilityFilter(req);
        
        const patients = await Patient.find(query)
            .populate('facility', 'facilityName email')
            .sort({ createdAt: -1 });
            
        if (patients.length === 0) {
            return res.json({ 
                status: "success",
                message: "No patients found in your facility",
                numPatients: 0,
                data: []
            });
        }
        
        res.status(200).json({
            status: "success",
            numPatients: patients.length,
            data: patients
        });
    } catch (error) {
        res.status(500).json({
            status: "failed", 
            message: "Failed to retrieve patients",
            error: error.message 
        });
    }
};

// Get a specific patient (with facility filtering)
export const getPatientById = async (req, res) => {
    try {
        // Create facility-based filter with patient ID
        const query = createFacilityFilter(req, { _id: req.params.patientId });
        
        const patient = await Patient.findOne(query)
            .populate('facility', 'facilityName email')
            .populate('pregnancies');
            
        if (!patient) {
            return res.status(404).json({ 
                status: "failed",
                message: 'Patient not found or not accessible from your facility' 
            });
        }
        
        res.status(200).json({ 
            status: "success", 
            message: "Patient found", 
            data: patient 
        });
    } catch (error) {
        res.status(500).json({
            status: "failed", 
            message: "Failed to retrieve patient",
            error: error.message 
        });
    }
};

// Update a patient (with facility filtering)
export const updatePatient = async (req, res) => {
    try {
        const {
            name, dateOfBirth, gender, address, contact, weekOfPregnancy, expectedDeliveryDate
        } = req.body;

        // Create facility-based filter with patient ID
        const query = createFacilityFilter(req, { _id: req.params.patientId });

        const updateData = {
            ...req.body,
            updatedAt: new Date()
        };

        const patient = await Patient.findOneAndUpdate(query, updateData, { new: true })
            .populate('facility', 'facilityName email');
            
        if (!patient) {
            return res.status(404).json({ 
                status: "failed",
                message: 'Patient not found or not accessible from your facility' 
            });
        }
        
        res.status(200).json({ 
            status: "success", 
            message: "Patient updated successfully", 
            data: patient 
        });
    } catch (error) {
        res.status(400).json({ 
            status: "failed", 
            message: "Failed to update patient",
            error: error.message 
        });
    }
};

// Delete a patient (with facility filtering)
export const deletePatient = async (req, res) => {
    try {
        // Create facility-based filter with patient ID
        const query = createFacilityFilter(req, { _id: req.params.patientId });
        
        const patient = await Patient.findOneAndDelete(query);
        if (!patient) {
            return res.status(404).json({ 
                status: "failed",
                message: 'Patient not found or not accessible from your facility' 
            });
        }
        
        res.json({ 
            status: "success", 
            message: 'Patient deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            status: "failed",
            message: "Failed to delete patient",
            error: error.message 
        });
    }
};

// Filter patients by search query (with facility filtering)
export const managePatients = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;

        // Base search query
        let searchQuery = {};
        if (search) {
            searchQuery = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { contact: { $regex: search, $options: "i" } }
                ]
            };
        }

        // Apply facility filtering to search query
        const query = createFacilityFilter(req, searchQuery);

        const patients = await Patient.find(query)
            .populate('facility', 'facilityName email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const totalPatients = await Patient.countDocuments(query);

        res.status(200).json({
            status: "success",
            patients,
            totalPages: Math.ceil(totalPatients / limit),
            currentPage: Number(page),
            totalPatients
        });
    } catch (error) {
        res.status(500).json({ 
            status: "failed",
            message: "Failed to retrieve patients", 
            error: error.message 
        });
    }
};

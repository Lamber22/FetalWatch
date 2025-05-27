import mongoose from 'mongoose';
import MaternalHealth from "../models/maternalHealth.js";
import Patient from "../models/patientModel.js";
import Pregnancy from "../models/pregnancyModel.js";

// Helper function to check if IDs are valid
const validateId = async (id, model) => {
    if (mongoose.isValidObjectId(id)) {
        return await model.findById(id);
    } else {
        return await model.findOne({ _id: id });
    }
};

// Create a new maternal health record
export const createMaternalHealth = async (req, res) => {
    try {
        const { patientId, pregnancyId } = req.body;

        // Validate and check patient
        const patientExists = await validateId(patientId, Patient);
        if (!patientExists) {
            console.log(`Patient not found: ${patientId}`);
            return res.status(400).json({ status: "failed", message: "Invalid patient ID" });
        }

        // Validate and check pregnancy
        const pregnancyExists = await validateId(pregnancyId, Pregnancy);
        if (!pregnancyExists) {
            console.log(`Pregnancy not found: ${pregnancyId}`);
            return res.status(400).json({ status: "failed", message: "Invalid pregnancy ID" });
        }

        // Create new maternal health record
        const maternalHealth = new MaternalHealth(req.body);
        const savedMaternalHealth = await maternalHealth.save();

        res.status(201).json({
            status: "success",
            message: "Maternal health record created successfully",
            data: savedMaternalHealth
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: "failed", error: error.message });
    }
};

// Get all maternal health records
export const getMaternalHealthRecords = async (req, res) => {
    try {
        const maternalHealthRecords = await MaternalHealth.find();
        if (maternalHealthRecords.length === 0) {
            return res.json({ message: "No maternal health records in Database" });
        }
        res.json({
            status: "success",
            message: "All maternal health records retrieved successfully",
            numRecords: maternalHealthRecords.length,
            data: maternalHealthRecords
        });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};

// Get maternal health records by patient ID
export const getMaternalHealthByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        
        const maternalHealthRecords = await MaternalHealth.find({ patientId });
        
        if (maternalHealthRecords.length === 0) {
            return res.json({ 
                message: "No maternal health records found for this patient" 
            });
        }
        
        res.json({
            status: "success",
            message: "Maternal health records retrieved successfully",
            numRecords: maternalHealthRecords.length,
            data: maternalHealthRecords
        });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};

// Get a specific maternal health record
export const getMaternalHealthById = async (req, res) => {
    try {
        const maternalHealth = await MaternalHealth.findById(req.params.id);
        if (!maternalHealth) {
            return res.status(404).json({ message: 'Maternal health record not found' });
        }
        res.json({
            status: "success",
            message: "Maternal health record retrieved successfully",
            data: maternalHealth
        });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};

// Update a maternal health record
export const updateMaternalHealth = async (req, res) => {
    try {
        const updatedMaternalHealth = await MaternalHealth.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        if (!updatedMaternalHealth) {
            return res.status(404).json({ message: 'Maternal health record not found' });
        }
        res.json({
            status: "success",
            message: "Maternal health record updated successfully",
            data: updatedMaternalHealth
        });
    } catch (error) {
        res.status(400).json({ status: "failed", error: error.message });
    }
};

// Delete a maternal health record
export const deleteMaternalHealth = async (req, res) => {
    try {
        const deletedMaternalHealth = await MaternalHealth.findByIdAndDelete(req.params.id);
        if (!deletedMaternalHealth) {
            return res.status(404).json({ message: 'Maternal health record not found' });
        }
        res.json({ 
            status: "success", 
            message: 'Maternal health record deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};

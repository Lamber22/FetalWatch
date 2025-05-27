import mongoose from 'mongoose';
import Postnatal from "../models/postnatal.js";
import Patient from "../models/patientModel.js";
import Delivery from "../models/delivery.js";

// Create a new postnatal record
export const createPostnatal = async (req, res) => {
    try {
        const postnatal = new Postnatal(req.body);
        const savedPostnatal = await postnatal.save();
        
        res.status(201).json({
            status: "success",
            message: "Postnatal record created successfully",
            data: savedPostnatal
        });
    } catch (error) {
        res.status(400).json({ 
            status: "failed", 
            message: "Failed to create postnatal record",
            error: error.message 
        });
    }
};

// Get all postnatal records
export const getPostnatalRecords = async (req, res) => {
    try {
        const postnatalRecords = await Postnatal.find();
        
        res.json({
            status: "success",
            message: "Postnatal records retrieved successfully",
            count: postnatalRecords.length,
            data: postnatalRecords
        });
    } catch (error) {
        res.status(500).json({ 
            status: "failed", 
            message: "Failed to retrieve postnatal records",
            error: error.message 
        });
    }
};

// Get a specific postnatal record by ID
export const getPostnatalById = async (req, res) => {
    try {
        const postnatal = await Postnatal.findById(req.params.id);
        
        if (!postnatal) {
            return res.status(404).json({ 
                status: "failed",
                message: "Postnatal record not found"
            });
        }
        
        res.json({
            status: "success",
            message: "Postnatal record retrieved successfully",
            data: postnatal
        });
    } catch (error) {
        res.status(500).json({ 
            status: "failed", 
            message: "Failed to retrieve postnatal record",
            error: error.message 
        });
    }
};

// Get postnatal records by patient ID
export const getPostnatalByPatient = async (req, res) => {
    try {
        const postnatalRecords = await Postnatal.find({ 
            patientId: req.params.patientId 
        }).sort({ followupDate: -1 });
        
        res.json({
            status: "success",
            message: "Postnatal records retrieved successfully",
            count: postnatalRecords.length,
            data: postnatalRecords
        });
    } catch (error) {
        res.status(500).json({ 
            status: "failed", 
            message: "Failed to retrieve patient's postnatal records",
            error: error.message 
        });
    }
};

// Get postnatal records by delivery ID
export const getPostnatalByDelivery = async (req, res) => {
    try {
        const postnatalRecords = await Postnatal.find({ 
            deliveryId: req.params.deliveryId 
        }).sort({ followupDate: -1 });
        
        res.json({
            status: "success",
            message: "Postnatal records retrieved successfully",
            count: postnatalRecords.length,
            data: postnatalRecords
        });
    } catch (error) {
        res.status(500).json({ 
            status: "failed", 
            message: "Failed to retrieve delivery's postnatal records",
            error: error.message 
        });
    }
};

// Update a postnatal record
export const updatePostnatal = async (req, res) => {
    try {
        const postnatal = await Postnatal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!postnatal) {
            return res.status(404).json({ 
                status: "failed",
                message: "Postnatal record not found" 
            });
        }
        
        res.json({
            status: "success",
            message: "Postnatal record updated successfully",
            data: postnatal
        });
    } catch (error) {
        res.status(400).json({ 
            status: "failed", 
            message: "Failed to update postnatal record",
            error: error.message 
        });
    }
};

// Delete a postnatal record
export const deletePostnatal = async (req, res) => {
    try {
        const postnatal = await Postnatal.findByIdAndDelete(req.params.id);
        
        if (!postnatal) {
            return res.status(404).json({ 
                status: "failed",
                message: "Postnatal record not found" 
            });
        }
        
        res.json({
            status: "success",
            message: "Postnatal record deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ 
            status: "failed", 
            message: "Failed to delete postnatal record",
            error: error.message 
        });
    }
};

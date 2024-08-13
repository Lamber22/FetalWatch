import mongoose from 'mongoose';
import FetalWatch from "../models/fetalWatch.js";
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

// Create a new fetal watch
export const createFetal = async (req, res) => {
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

        // Create new fetal watch record
        const fetalWatch = new FetalWatch(req.body);
        const savedFetalWatch = await fetalWatch.save();

        res.status(201).json({
            status: "success",
            message: "Fetal creation successful",
            data: savedFetalWatch
        });
    } catch (error) {
        console.error(error); // Log the full error for debugging
        res.status(400).json({ status: "failed", error: error.message });
    }
};

// Get all fetal watches
export const getFetals = async (req, res) => {
    try {
        const fetalWatches = await FetalWatch.find();
        if (fetalWatches.length === 0) return res.json({ message: "No fetal data in Database"})
        res.json({
            status: "success",
            message: "all fetal data retrieved successfully",
            numFetalData: fetalWatches.length,
            data: fetalWatches
        });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};

// Get a specific fetal watch
export const getFetalById = async (req, res) => {
    try {
        const fetalWatch = await FetalWatch.findById(req.params.id);
        if (!fetalWatch) {
        return res.status(404).json({ message: 'Fetal watch not found' });
        }
        res.json({
            status: "success",
            message: "fetal data retrieved successfully",
            numFetalData: fetalWatch.length,
            data: fetalWatch
        });
    } catch (error) {
        res.status(500).json({status: "failed", error: error.message });
    }
};

// Update a fetal watch
export const updateFetal = async (req, res) => {
    try {
        const updatedFetalWatch = await FetalWatch.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFetalWatch) {
        return res.status(404).json({ message: 'Fetal watch not found' });
        }
        res.json({
            status: "success",
            message: "fetal data updated successfully",
            numFetalData: updatedFetalWatch.length,
            data: updatedFetalWatch
        });
    } catch (error) {
        res.status(400).json({ status: "failed", error: error.message });
    }
};

// Delete a fetal watch
export const deleteFetal = async (req, res) => {
    try {
        const deletedFetalWatch = await FetalWatch.findByIdAndDelete(req.params.id);
        if (!deletedFetalWatch) {
        return res.status(404).json({ status: "success", message: 'Fetal watch not found' });
        }
        res.json({ message: 'Fetal watch deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};


import FetalWatch from "../models/fetalWatch.js";

// Create a new fetal watch
export const createFetal = async (req, res) => {
    try {
        const fetalWatch = new FetalWatch(req.body);
        const savedFetalWatch = await fetalWatch.save();
        res.status(201).json({
            status: "success",
            message: "fetal creation successful",
            data: savedFetalWatch
        });
    } catch (error) {
        res.status(400).json({status: "failed", error: error.message });
    }
};

// Get all fetal watches
export const getFetals = async (req, res) => {
    try {
        const fetalWatches = await FetalWatch.find();
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


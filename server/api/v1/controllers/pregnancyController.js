import Pregnancy from '../models/pregnancyModel.js';

// Create a new pregnancy
export const createPregnancy = async (req, res) => {
    try {
        const pregnancy = new Pregnancy(req.body);
        await pregnancy.save();
        res.status(201).json({
            status: "success",
            message: "Pregnancy created successfully",
            data: pregnancy
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all pregnancies
export const getPregnancies = async (req, res) => {
    try {
        const pregnancies = await Pregnancy.find().populate('patientId'); // Populate patient details
        res.status(200).json({
            status: "success",
            numPregnancies: pregnancies.length,
            data: pregnancies
        });
    } catch (error) {
        res.status(500).json({status: "failed", error: error.message });
    }
};

// Get a specific pregnancy
export const getPregnancyById = async (req, res) => {
    try {
        const pregnancy = await Pregnancy.findById(req.params.id).populate('patientId'); // Populate patient details
        if (!pregnancy) {
        return res.status(404).json({ message: 'Pregnancy not found' });
        }
        res.json({ status: "success", message: "Pregnancy found", data: pregnancy });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};

// Update a pregnancy
export const updatePregnancy = async (req, res) => {
    try {
        const pregnancy = await Pregnancy.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!pregnancy) {
        return res.status(404).json({ message: 'Pregnancy not found' });
        }
        res.json({
            status: "success",
            message: "Pregnancy updated successfully",
            data: pregnancy
        });
    } catch (error) {
        res.status(400).json({ status: "failed", error: error.message });
    }
};

// Delete a pregnancy
export const deletePregnancy = async (req, res) => {
    try {
        const pregnancy = await Pregnancy.findByIdAndDelete(req.params.id);
        if (!pregnancy) {
        return res.status(404).json({ message: 'Pregnancy not found' });
        }
        res.json({ status: "success", message: 'Pregnancy deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};


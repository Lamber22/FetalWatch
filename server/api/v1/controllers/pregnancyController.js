import mongoose from 'mongoose';
import Pregnancy from '../models/pregnancyModel.js';
import Patient from '../models/patientModel.js';

// Create a new pregnancy
const validateRequiredFields = ({ patientId, gestationalAge, expectedDeliveryDate }) => {
    if (!patientId || !gestationalAge || !expectedDeliveryDate) {
        return "Missing required fields: patientId, gestationalAge, or expectedDeliveryDate";
    }
    return null;
};

const validateDataTypes = ({ gestationalAge, expectedDeliveryDate, prenatalCare, vitalSigns }) => {
    if (typeof gestationalAge !== 'number' || isNaN(gestationalAge)) {
        return "Gestational age must be a valid number";
    }
    const date = new Date(expectedDeliveryDate);
    if (isNaN(date.getTime())) {
        return "Expected delivery date must be a valid date";
    }
    if (prenatalCare) {
        if (typeof prenatalCare.numberOfVisits !== 'number' || isNaN(prenatalCare.numberOfVisits)) {
            return "Number of visits in prenatal care must be a valid number";
        }
        if (typeof prenatalCare.adherence !== 'boolean') {
            return "Adherence in prenatal care must be a boolean";
        }
    }
    if (vitalSigns) {
        const { bloodPressure, temperature, pulse, respiratoryRate } = vitalSigns;
        if (bloodPressure && typeof bloodPressure !== 'string') return "Blood pressure must be a string";
        if (temperature && (typeof temperature !== 'number' || isNaN(temperature))) return "Temperature must be a valid number";
        if (pulse && (typeof pulse !== 'number' || isNaN(pulse))) return "Pulse must be a valid number";
        if (respiratoryRate && (typeof respiratoryRate !== 'number' || isNaN(respiratoryRate))) return "Respiratory rate must be a valid number";
    }
    return null;
};


// Create a new pregnancy
export const createPregnancy = async (req, res) => {
    const validationError = validateRequiredFields(req.body) || validateDataTypes(req.body);
    if (validationError) {
        return res.status(400).json({ status: "error", message: validationError });
    }

    try {
        // Create and save the new Pregnancy document
        const pregnancy = new Pregnancy(req.body);
        await pregnancy.save();

        // Update the Patient document to include this new Pregnancy
        await Patient.findByIdAndUpdate(
            req.body.patientId,
            { $push: { pregnancies: pregnancy._id } }
        );

        res.status(201).json({
            status: "success",
            message: "Pregnancy created and patient updated successfully",
            data: pregnancy
        });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};


// Get all pregnancies
export const getPregnancies = async (req, res) => {
    try {
        const pregnancies = await Pregnancy.find().populate('patientId'); // Populate patient details
        if (pregnancies.length === 0) return res.json({ message: "No pregnancy data found in Database" });
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


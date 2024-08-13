import LabResult from '../models/labResult.js';
import Pregnancy from '../models/pregnancyModel.js';

// Create a new lab result and associate it with a pregnancy
export const createLabResult = async (req, res) => {
    try {
        const labResult = new LabResult(req.body);
        const savedLabResult = await labResult.save();

        // Find the pregnancy and add the new lab result to the corresponding array
        const pregnancy = await Pregnancy.findById(labResult.pregnancyId);
        if (!pregnancy) {
            return res.status(404).json({ message: 'Pregnancy not found' });
        }

        if (labResult.type === 'finding') {
            pregnancy.ultrasoundFindings.push(savedLabResult._id);
        } else if (labResult.type === 'result') {
            pregnancy.laboratoryResults.push(savedLabResult._id);
        }

        await pregnancy.save();

        res.status(201).json({
            status: "success",
            message: "Lab result successfully created and associated with pregnancy",
            data: savedLabResult
        });
    } catch (error) {
        res.status(400).json({ status: "failed", error: error.message });
    }
};

// Get all lab results
export const getLabResults = async (req, res) => {
    try {
        const labResults = await LabResult.find();
        if (labResults.length === 0) return res.json({ message: "No lab results found in the database" });
        res.json({
            status: "success",
            message: "Lab results retrieved successfully",
            numOfData: labResults.length,
            data: labResults
        });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};

// Get a specific lab result
export const getLabResultById = async (req, res) => {
    try {
        const labResult = await LabResult.findById(req.params.id);
        if (!labResult) {
            return res.status(404).json({ message: 'Lab result not found' });
        }
        res.json({
            status: "success",
            message: "Lab result found",
            data: labResult
        });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};

// Update a lab result
export const updateLabResult = async (req, res) => {
    try {
        const updatedLabResult = await LabResult.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedLabResult) {
            return res.status(404).json({ message: 'Lab result not found' });
        }
        res.json({
            status: "success",
            message: "Lab result updated successfully",
            data: updatedLabResult
        });
    } catch (error) {
        res.status(400).json({ status: "failed", error: error.message });
    }
};

// Delete a lab result
export const deleteLabResult = async (req, res) => {
    try {
        const deletedLabResult = await LabResult.findByIdAndDelete(req.params.id);
        if (!deletedLabResult) {
            return res.status(404).json({ message: 'Lab result not found' });
        }

        // Remove the lab result from the pregnancy
        const pregnancy = await Pregnancy.findById(deletedLabResult.pregnancyId);
        if (pregnancy) {
            if (deletedLabResult.type === 'finding') {
                pregnancy.ultrasoundFindings.pull(deletedLabResult._id);
            } else if (deletedLabResult.type === 'result') {
                pregnancy.laboratoryResults.pull(deletedLabResult._id);
            }
            await pregnancy.save();
        }

        res.json({ status: "success", message: 'Lab result deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};

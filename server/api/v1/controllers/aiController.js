import AIResult from '../models/aiModelResult.js';
import FetalWatch from '../models/fetalWatch.js';

// Create a new AI result
export const newAiResult = async (req, res) => {
    try {
        // Check if the fetalWatchId is valid
        const fetalWatch = await FetalWatch.findById(req.body.fetalWatchId);
        if (!fetalWatch) {
            return res.status(404).json({ message: 'FetalWatch record not found' });
        }

        // Create and save the AI result
        const aiResult = new AIResult(req.body);
        const savedAIResult = await aiResult.save();

        // Update the FetalWatch document with the AI result ID
        fetalWatch.aiResults.push(savedAIResult._id);
        await fetalWatch.save();

        res.status(201).json({
            status: "success",
            message: "AI result successfully generated and associated with FetalWatch",
            data: savedAIResult
        });
    } catch (error) {
        res.status(400).json({ status: "failed", error: error.message });
    }
};

// Get all AI results
export const getAiResults = async (req, res) => {
    try {
        const aiResults = await AIResult.find();
        if (aiResults.length === 0) return res.json({ message: "No AI results available" });
        res.json({
            status: "success",
            message: "AI results retrieved successfully",
            numOfResults: aiResults.length,
            data: aiResults
        });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};

// Get a specific AI result
export const getAiResultById = async (req, res) => {
    try {
        const aiResult = await AIResult.findById(req.params.id);
        if (!aiResult) {
            return res.status(404).json({ message: 'AI result not found' });
        }
        res.json({
            status: "success",
            message: "AI result found",
            data: aiResult
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an AI result
export const updateAiResult = async (req, res) => {
    try {
        const updatedAIResult = await AIResult.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAIResult) {
            return res.status(404).json({ message: 'AI result not found' });
        }
        res.json({
            status: "success",
            message: "AI result updated successfully",
            data: updatedAIResult
        });
    } catch (error) {
        res.status(400).json({ status: "failed", error: error.message });
    }
};

// Delete an AI result
export const deleteAiResult = async (req, res) => {
    try {
        const deletedAIResult = await AIResult.findByIdAndDelete(req.params.id);
        if (!deletedAIResult) {
            return res.status(404).json({ message: 'AI result not found' });
        }

        // Remove the AI result from the FetalWatch document
        const fetalWatch = await FetalWatch.findById(deletedAIResult.fetalWatchId);
        if (fetalWatch) {
            fetalWatch.aiResults.pull(deletedAIResult._id);
            await fetalWatch.save();
        }

        res.json({
            status: "success",
            message: 'AI result deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};

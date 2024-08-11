import AIResult from '../models/AIResult';

// Create a new AI result
export const newAiResult = async (req, res) => {
    try {
        const aiResult = new AIResult(req.body);
        const savedAIResult = await aiResult.save();
        res.status(201).json({
            status: "success",
            message: "AI result successfully created",
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
        res.json({
            status: "success",
            message: " AI results retrieved successfully",
            numOfResult: aiResults.length,
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
export const updateAiresult = async (req, res) => {
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
        res.json({
            status: "success",
            message: 'AI result deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


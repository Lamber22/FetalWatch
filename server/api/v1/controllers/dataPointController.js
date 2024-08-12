import DataPoint from '../models/dataPoint.js';


// Create a new data point
export const newDatapoint = async (req, res) => {
    try {
        const dataPoint = new DataPoint(req.body);
        const savedDataPoint = await dataPoint.save();
        res.status(201).json(savedDataPoint);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all data points
export const getDataPoints = async (req, res) => {
    try {
        const dataPoints = await DataPoint.find();
        res.json(dataPoints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific data point
export const getDataPointById = async (req, res) => {
    try {
        const dataPoint = await DataPoint.findById(req.params.id);
        if (!dataPoint) {
        return res.status(404).json({ message: 'Data point not found' });
        }
        res.json(dataPoint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a data point
export const updateDataPoint = async (req, res) => {
    try {
        const updatedDataPoint = await DataPoint.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDataPoint) {
        return res.status(404).json({ message: 'Data point not found' });
        }
        res.json(updatedDataPoint);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a data point
export const deleteDataPoint = async (req, res) => {
    try {
        const deletedDataPoint = await DataPoint.findByIdAndDelete(req.params.id);
        if (!deletedDataPoint) {
        return res.status(404).json({ message: 'Data point not found' });
        }
        res.json({ message: 'Data point deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};

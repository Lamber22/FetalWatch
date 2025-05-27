import mongoose from 'mongoose';
import Delivery from "../models/delivery.js";
import Patient from "../models/patientModel.js";
import Pregnancy from "../models/pregnancyModel.js";

// Create a new delivery record
export const createDelivery = async (req, res) => {
    try {
        const delivery = new Delivery(req.body);
        const savedDelivery = await delivery.save();
        
        res.status(201).json({
            status: "success",
            message: "Delivery record created successfully",
            data: savedDelivery
        });
    } catch (error) {
        res.status(400).json({ status: "failed", error: error.message });
    }
};

// Get all delivery records
export const getDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find();
        
        res.json({
            status: "success",
            message: "Delivery records retrieved successfully",
            count: deliveries.length,
            data: deliveries
        });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};

// Get a specific delivery record by ID
export const getDeliveryById = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id);
        
        if (!delivery) {
            return res.status(404).json({ message: "Delivery record not found" });
        }
        
        res.json({
            status: "success",
            message: "Delivery record retrieved successfully",
            data: delivery
        });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};

// Get delivery records by patient ID
export const getDeliveriesByPatient = async (req, res) => {
    try {
        const deliveries = await Delivery.find({ patientId: req.params.patientId });
        
        res.json({
            status: "success",
            message: "Delivery records retrieved successfully",
            count: deliveries.length,
            data: deliveries
        });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};

// Update a delivery record
export const updateDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        if (!delivery) {
            return res.status(404).json({ message: "Delivery record not found" });
        }
        
        res.json({
            status: "success",
            message: "Delivery record updated successfully",
            data: delivery
        });
    } catch (error) {
        res.status(400).json({ status: "failed", error: error.message });
    }
};

// Delete a delivery record
export const deleteDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findByIdAndDelete(req.params.id);
        
        if (!delivery) {
            return res.status(404).json({ message: "Delivery record not found" });
        }
        
        res.json({
            status: "success",
            message: "Delivery record deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};

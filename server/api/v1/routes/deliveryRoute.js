import { Router } from "express";
import {
    createDelivery,
    getDeliveries,
    getDeliveryById,
    getDeliveriesByPatient,
    updateDelivery,
    deleteDelivery
} from "../controllers/deliveryController.js";

const router = Router();

// Create a new delivery record
router.post("/", createDelivery);

// Get all delivery records
router.get("/", getDeliveries);

// Get a specific delivery record by ID
router.get("/:id", getDeliveryById);

// Get delivery records by patient ID
router.get("/patient/:patientId", getDeliveriesByPatient);

// Update a delivery record
router.put("/:id", updateDelivery);

// Delete a delivery record
router.delete("/:id", deleteDelivery);

export default router;

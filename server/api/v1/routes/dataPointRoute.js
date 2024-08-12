import { Router } from "express";
import {
    newDatapoint,
    getDataPoints,
    getDataPointById,
    updateDataPoint,
    deleteDataPoint
} from "../controllers/dataPointController.js";

const router = Router();

router.post("/", newDatapoint);
router.get("/", getDataPoints);
router.get("/:id", getDataPointById);
router.put("/:id", updateDataPoint);
router.delete("/:id", deleteDataPoint);
export default router;
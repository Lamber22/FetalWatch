import { Router } from "express";
import {
    createPostnatal,
    getPostnatalRecords,
    getPostnatalById,
    getPostnatalByPatient,
    getPostnatalByDelivery,
    updatePostnatal,
    deletePostnatal
} from "../controllers/postnatalController.js";

const router = Router();

router.post("/", createPostnatal);
router.get("/", getPostnatalRecords);
router.get("/:id", getPostnatalById);
router.get("/patient/:patientId", getPostnatalByPatient);
router.get("/delivery/:deliveryId", getPostnatalByDelivery);
router.put("/:id", updatePostnatal);
router.delete("/:id", deletePostnatal);

export default router;

import express from 'express';
import fetalRoutes from './fetalRoutes.js';
import maternalRoutes from './maternalRoutes.js';
import riskAssessmentRoutes from './riskAssessmentRoutes.js';
import deliveryRoutes from './deliveryRoutes.js';
import postnatalRoutes from './postnatalRoutes.js';
import reportRoutes from './reportRoutes.js';
import patientRoutes from './patientRoutes.js';

const router = express.Router();

// Mount all routes
router.use('/api/v1/fetal', fetalRoutes);
router.use('/api/v1/maternal', maternalRoutes);
router.use('/api/v1/risk-assessment', riskAssessmentRoutes);
router.use('/api/v1/delivery', deliveryRoutes);
router.use('/api/v1/postnatal', postnatalRoutes);
router.use('/api/v1/reports', reportRoutes);
router.use('/api/v1/patients', patientRoutes);

// Base route for API health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'FetalWatch API is running',
    version: '1.0.0'
  });
});

export default router;

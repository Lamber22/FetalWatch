import mongoose from 'mongoose';
import RiskAssessment from "../models/riskAssessment.js";
import Patient from "../models/patientModel.js";
import Pregnancy from "../models/pregnancyModel.js";
import MaternalHealth from "../models/maternalHealth.js";
import FetalWatch from "../models/fetalWatch.js";

// Helper function to check if IDs are valid
const validateId = async (id, model) => {
    if (mongoose.isValidObjectId(id)) {
        return await model.findById(id);
    } else {
        return await model.findOne({ _id: id });
    }
};

// Create a new risk assessment
export const createRiskAssessment = async (req, res) => {
    try {
        const { patientId, pregnancyId } = req.body;

        // Validate patient and pregnancy
        const patientExists = await validateId(patientId, Patient);
        if (!patientExists) {
            return res.status(400).json({ status: "failed", message: "Invalid patient ID" });
        }

        const pregnancyExists = await validateId(pregnancyId, Pregnancy);
        if (!pregnancyExists) {
            return res.status(400).json({ status: "failed", message: "Invalid pregnancy ID" });
        }

        // Create new risk assessment
        const riskAssessment = new RiskAssessment(req.body);
        const savedRiskAssessment = await riskAssessment.save();

        res.status(201).json({
            status: "success",
            message: "Risk assessment created successfully",
            data: savedRiskAssessment
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: "failed", error: error.message });
    }
};

// Get all risk assessments
export const getRiskAssessments = async (req, res) => {
    try {
        const riskAssessments = await RiskAssessment.find();
        if (riskAssessments.length === 0) {
            return res.json({ message: "No risk assessments in database" });
        }
        
        res.json({
            status: "success",
            message: "All risk assessments retrieved successfully",
            numRecords: riskAssessments.length,
            data: riskAssessments
        });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};

// Get risk assessments by patient ID
export const getRiskAssessmentsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const riskAssessments = await RiskAssessment.find({ patientId })
            .sort({ assessmentDate: -1 });
        
        if (riskAssessments.length === 0) {
            return res.json({ message: "No risk assessments found for this patient" });
        }
        
        res.json({
            status: "success",
            message: "Risk assessments retrieved successfully",
            numRecords: riskAssessments.length,
            data: riskAssessments
        });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};

// Get a specific risk assessment
export const getRiskAssessmentById = async (req, res) => {
    try {
        const riskAssessment = await RiskAssessment.findById(req.params.id);
        if (!riskAssessment) {
            return res.status(404).json({ message: 'Risk assessment not found' });
        }
        
        res.json({
            status: "success",
            message: "Risk assessment retrieved successfully",
            data: riskAssessment
        });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};

// Calculate and generate a new risk assessment
export const generateRiskAssessment = async (req, res) => {
    try {
        const { patientId, pregnancyId } = req.params;

        // Validate patient and pregnancy
        const patientExists = await validateId(patientId, Patient);
        if (!patientExists) {
            return res.status(400).json({ status: "failed", message: "Invalid patient ID" });
        }

        const pregnancyExists = await validateId(pregnancyId, Pregnancy);
        if (!pregnancyExists) {
            return res.status(400).json({ status: "failed", message: "Invalid pregnancy ID" });
        }

        // Get latest maternal health record
        const maternalHealth = await MaternalHealth.findOne({ 
            patientId, 
            pregnancyId 
        }).sort({ dateRecorded: -1 });

        // Get latest fetal health record
        const fetalHealth = await FetalWatch.findOne({ 
            patientId, 
            pregnancyId 
        }).sort({ dateRecorded: -1 });

        // Calculate gestational age
        const gestationalAge = {
            weeks: pregnancyExists.currentGestationalAge?.weeks || 0,
            days: pregnancyExists.currentGestationalAge?.days || 0
        };

        // Initialize risk factors array
        const riskFactors = [];
        
        // Assess maternal risk factors if maternal health data exists
        if (maternalHealth) {
            // Blood pressure risk
            if (maternalHealth.vitalSigns?.bloodPressure) {
                const { systolic, diastolic } = maternalHealth.vitalSigns.bloodPressure;
                
                if (systolic >= 140 || diastolic >= 90) {
                    riskFactors.push({
                        category: 'maternal',
                        factor: 'High blood pressure',
                        severity: (systolic >= 160 || diastolic >= 110) ? 'high' : 'medium',
                        notes: `BP: ${systolic}/${diastolic} mmHg`
                    });
                }
            }

            // Hemoglobin risk (anemia)
            if (maternalHealth.labTests?.hemoglobinLevel) {
                const hemoglobin = maternalHealth.labTests.hemoglobinLevel;
                if (hemoglobin < 11) {
                    riskFactors.push({
                        category: 'maternal',
                        factor: 'Anemia',
                        severity: hemoglobin < 9 ? 'high' : 'medium',
                        notes: `Hemoglobin: ${hemoglobin} g/dL`
                    });
                }
            }
            
            // BMI risk
            if (maternalHealth.bodyMetrics?.bmi) {
                const bmi = maternalHealth.bodyMetrics.bmi;
                if (bmi < 18.5 || bmi > 30) {
                    riskFactors.push({
                        category: 'maternal',
                        factor: bmi < 18.5 ? 'Underweight' : 'Obesity',
                        severity: (bmi < 17 || bmi > 35) ? 'high' : 'medium',
                        notes: `BMI: ${bmi}`
                    });
                }
            }

            // Proteinuria risk
            if (maternalHealth.labTests?.urineProtein && 
                ['2+', '3+', '4+'].includes(maternalHealth.labTests.urineProtein)) {
                riskFactors.push({
                    category: 'maternal',
                    factor: 'Proteinuria',
                    severity: maternalHealth.labTests.urineProtein === '4+' ? 'high' : 'medium',
                    notes: `Urine protein: ${maternalHealth.labTests.urineProtein}`
                });
            }
        }
        
        // Assess fetal risk factors if fetal health data exists
        if (fetalHealth) {
            // Abnormal fetal heart rate
            if (fetalHealth.fetalData?.fetalHeartbeat) {
                const heartRate = fetalHealth.fetalData.fetalHeartbeat;
                if (heartRate < 120 || heartRate > 160) {
                    riskFactors.push({
                        category: 'fetal',
                        factor: 'Abnormal fetal heart rate',
                        severity: (heartRate < 100 || heartRate > 180) ? 'high' : 'medium',
                        notes: `Fetal HR: ${heartRate} bpm`
                    });
                }
            }
            
            // Reduced fetal movements
            if (fetalHealth.fetalData?.fetalMovements?.frequency) {
                const movements = fetalHealth.fetalData.fetalMovements.frequency;
                if (movements < 10) {  // Less than 10 movements per hour is concerning
                    riskFactors.push({
                        category: 'fetal',
                        factor: 'Reduced fetal movements',
                        severity: movements < 5 ? 'high' : 'medium',
                        notes: `${movements} movements per hour`
                    });
                }
            }
        }
        
        // Add medical history risk factors
        if (maternalHealth?.medicalHistory?.previousComplications?.length > 0) {
            riskFactors.push({
                category: 'obstetric',
                factor: 'Previous pregnancy complications',
                severity: 'medium',
                notes: maternalHealth.medicalHistory.previousComplications.join(', ')
            });
        }
        
        if (maternalHealth?.medicalHistory?.previousCsections > 0) {
            riskFactors.push({
                category: 'obstetric',
                factor: 'Previous C-sections',
                severity: maternalHealth.medicalHistory.previousCsections > 1 ? 'high' : 'medium',
                notes: `${maternalHealth.medicalHistory.previousCsections} previous C-section(s)`
            });
        }
        
        // Calculate overall risk level
        let overallRiskLevel = 'low';
        const hasHighRisk = riskFactors.some(factor => factor.severity === 'high');
        const hasMediumRisk = riskFactors.some(factor => factor.severity === 'medium');
        
        if (hasHighRisk) {
            overallRiskLevel = 'high';
        } else if (hasMediumRisk || riskFactors.length >= 2) {
            overallRiskLevel = 'medium';
        }
        
        // Generate recommended actions based on risk level
        const recommendedActions = [];
        
        if (overallRiskLevel === 'high') {
            recommendedActions.push({
                action: 'Refer to specialized care/obstetrician',
                urgency: 'urgent'
            });
            recommendedActions.push({
                action: 'Schedule follow-up within 1-2 days',
                urgency: 'prompt'
            });
        } else if (overallRiskLevel === 'medium') {
            recommendedActions.push({
                action: 'Schedule follow-up within 1 week',
                urgency: 'prompt'
            });
        } else {
            recommendedActions.push({
                action: 'Continue routine prenatal care',
                urgency: 'routine'
            });
        }
        
        // Generate alerts for high-risk factors
        const alerts = riskFactors
            .filter(factor => factor.severity === 'high')
            .map(factor => ({
                message: `High-risk factor detected: ${factor.factor}`,
                type: 'critical',
                acknowledged: {
                    status: false
                }
            }));
        
        // Create the risk assessment
        const newRiskAssessment = new RiskAssessment({
            patientId,
            pregnancyId,
            assessmentDate: new Date(),
            gestationalAge,
            riskFactors,
            overallRiskLevel,
            recommendedActions,
            alerts,
            recordedBy: req.body.userId || null
        });
        
        const savedRiskAssessment = await newRiskAssessment.save();
        
        res.status(201).json({
            status: "success",
            message: "Risk assessment generated successfully",
            data: savedRiskAssessment
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", error: error.message });
    }
};

// Update a risk assessment
export const updateRiskAssessment = async (req, res) => {
    try {
        const updatedRiskAssessment = await RiskAssessment.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        
        if (!updatedRiskAssessment) {
            return res.status(404).json({ message: 'Risk assessment not found' });
        }
        
        res.json({
            status: "success",
            message: "Risk assessment updated successfully",
            data: updatedRiskAssessment
        });
    } catch (error) {
        res.status(400).json({ status: "failed", error: error.message });
    }
};

// Acknowledge an alert in a risk assessment
export const acknowledgeAlert = async (req, res) => {
    try {
        const { assessmentId, alertIndex } = req.params;
        const { userId } = req.body;
        
        const riskAssessment = await RiskAssessment.findById(assessmentId);
        
        if (!riskAssessment) {
            return res.status(404).json({ message: 'Risk assessment not found' });
        }
        
        if (!riskAssessment.alerts[alertIndex]) {
            return res.status(404).json({ message: 'Alert not found' });
        }
        
        // Update the alert's acknowledged status
        riskAssessment.alerts[alertIndex].acknowledged = {
            status: true,
            date: new Date(),
            by: userId
        };
        
        await riskAssessment.save();
        
        res.json({
            status: "success",
            message: "Alert acknowledged successfully",
            data: riskAssessment
        });
    } catch (error) {
        res.status(400).json({ status: "failed", error: error.message });
    }
};

// Get high-risk patients
export const getHighRiskPatients = async (req, res) => {
    try {
        // Find the latest risk assessment for each patient with high risk
        const highRiskAssessments = await RiskAssessment.aggregate([
            { $match: { overallRiskLevel: 'high' } },
            { $sort: { assessmentDate: -1 } },
            { $group: {
                _id: "$patientId",
                latestAssessment: { $first: "$$ROOT" }
            }},
            { $replaceRoot: { newRoot: "$latestAssessment" } }
        ]);
        
        // Populate patient information
        const populatedAssessments = await Promise.all(
            highRiskAssessments.map(async (assessment) => {
                const patient = await Patient.findById(assessment.patientId);
                return {
                    ...assessment,
                    patient: patient ? {
                        name: `${patient.firstName} ${patient.lastName}`,
                        age: patient.age
                    } : null
                };
            })
        );
        
        res.json({
            status: "success",
            message: "High-risk patients retrieved successfully",
            numRecords: populatedAssessments.length,
            data: populatedAssessments
        });
    } catch (error) {
        res.status(500).json({ status: "failed", error: error.message });
    }
};

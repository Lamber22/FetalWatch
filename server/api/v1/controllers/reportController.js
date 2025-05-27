import mongoose from 'mongoose';
import Patient from "../models/patientModel.js";
import Pregnancy from "../models/pregnancyModel.js";
import MaternalHealth from "../models/maternalHealth.js";
import FetalWatch from "../models/fetalWatch.js";
import RiskAssessment from "../models/riskAssessment.js";
import Delivery from "../models/delivery.js";
import Postnatal from "../models/postnatal.js";

// Get facility dashboard statistics
export const getFacilityDashboard = async (req, res) => {
    try {
        // Get total number of patients
        const totalPatients = await Patient.countDocuments();
        
        // Get number of high-risk pregnancies (from latest risk assessments)
        const highRiskCount = await RiskAssessment.aggregate([
            { $match: { overallRiskLevel: 'high' } },
            { $sort: { assessmentDate: -1 } },
            { $group: {
                _id: "$patientId",
                latestAssessment: { $first: "$$ROOT" }
            }},
            { $count: "count" }
        ]);
        
        // Get number of active pregnancies
        const activePregnancies = await Pregnancy.countDocuments({ 
            isCompleted: false 
        });
        
        // Get recent checkups
        const recentCheckups = await MaternalHealth.find()
            .sort({ dateRecorded: -1 })
            .limit(5);
            
        // Get delivery statistics (if available)
        const deliveryStats = await Delivery.aggregate([
            { 
                $group: {
                    _id: "$deliveryMethod",
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Convert to more readable format
        const deliveryMethods = {};
        deliveryStats.forEach(stat => {
            deliveryMethods[stat._id] = stat.count;
        });
        
        res.json({
            status: "success",
            data: {
                totalPatients,
                highRiskPregnancies: highRiskCount.length > 0 ? highRiskCount[0].count : 0,
                activePregnancies,
                recentCheckups: recentCheckups.map(checkup => ({
                    id: checkup._id,
                    patientId: checkup.patientId,
                    date: checkup.dateRecorded,
                    bloodPressure: checkup.vitalSigns?.bloodPressure || null
                })),
                deliveryMethods
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", error: error.message });
    }
};

// Generate patient-specific health report
export const generatePatientReport = async (req, res) => {
    try {
        const { patientId } = req.params;
        
        // Get patient details
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        
        // Get current/latest pregnancy
        const pregnancy = await Pregnancy.findOne({ 
            patientId, 
            isCompleted: false 
        }).sort({ startDate: -1 });
        
        // If no active pregnancy, get the most recent completed one
        const latestPregnancy = pregnancy || await Pregnancy.findOne({ 
            patientId 
        }).sort({ startDate: -1 });
        
        if (!latestPregnancy) {
            return res.status(404).json({ message: 'No pregnancy records found for this patient' });
        }
        
        // Get maternal health records
        const maternalHealthRecords = await MaternalHealth.find({ 
            patientId,
            pregnancyId: latestPregnancy._id 
        }).sort({ dateRecorded: -1 });
        
        // Get fetal health records
        const fetalHealthRecords = await FetalWatch.find({ 
            patientId,
            pregnancyId: latestPregnancy._id 
        }).sort({ dateRecorded: -1 });
        
        // Get risk assessments
        const riskAssessments = await RiskAssessment.find({ 
            patientId,
            pregnancyId: latestPregnancy._id 
        }).sort({ assessmentDate: -1 });
        
        // Get latest risk assessment
        const latestRiskAssessment = riskAssessments.length > 0 ? riskAssessments[0] : null;
        
        // Get delivery record if pregnancy is completed
        let deliveryRecord = null;
        let postnatalRecords = [];
        
        if (latestPregnancy.isCompleted) {
            deliveryRecord = await Delivery.findOne({ 
                patientId,
                pregnancyId: latestPregnancy._id 
            });
            
            if (deliveryRecord) {
                postnatalRecords = await Postnatal.find({ 
                    patientId,
                    pregnancyId: latestPregnancy._id,
                    deliveryId: deliveryRecord._id
                }).sort({ followupDate: -1 });
            }
        }
        
        // Construct health trends
        const healthTrends = {
            bloodPressure: maternalHealthRecords.map(record => ({
                date: record.dateRecorded,
                systolic: record.vitalSigns?.bloodPressure?.systolic,
                diastolic: record.vitalSigns?.bloodPressure?.diastolic
            })).filter(bp => bp.systolic && bp.diastolic),
            
            weight: maternalHealthRecords.map(record => ({
                date: record.dateRecorded,
                value: record.bodyMetrics?.weight
            })).filter(w => w.value),
            
            fetalHeartRate: fetalHealthRecords.map(record => ({
                date: record.dateRecorded,
                value: record.fetalData?.fetalHeartbeat
            })).filter(fhr => fhr.value)
        };
        
        // Generate comprehensive report
        const report = {
            patientInfo: {
                id: patient._id,
                name: `${patient.firstName} ${patient.lastName}`,
                age: patient.age,
                contactInfo: patient.contactInfo
            },
            pregnancyInfo: {
                id: latestPregnancy._id,
                gestationalAge: latestPregnancy.currentGestationalAge,
                startDate: latestPregnancy.startDate,
                estimatedDueDate: latestPregnancy.estimatedDueDate,
                isCompleted: latestPregnancy.isCompleted
            },
            riskLevel: latestRiskAssessment ? latestRiskAssessment.overallRiskLevel : 'unknown',
            riskFactors: latestRiskAssessment ? latestRiskAssessment.riskFactors : [],
            healthTrends,
            latestCheckup: maternalHealthRecords.length > 0 ? {
                date: maternalHealthRecords[0].dateRecorded,
                vitalSigns: maternalHealthRecords[0].vitalSigns,
                symptoms: maternalHealthRecords[0].symptoms,
                notes: maternalHealthRecords[0].notes
            } : null,
            latestFetalAssessment: fetalHealthRecords.length > 0 ? {
                date: fetalHealthRecords[0].dateRecorded,
                fetalHeartbeat: fetalHealthRecords[0].fetalData?.fetalHeartbeat,
                fetalMovements: fetalHealthRecords[0].fetalData?.fetalMovements,
                notes: fetalHealthRecords[0].notes
            } : null,
            deliveryInfo: deliveryRecord ? {
                date: deliveryRecord.deliveryDate,
                method: deliveryRecord.deliveryMethod,
                complications: deliveryRecord.complications,
                outcome: deliveryRecord.maternalOutcome,
                newborns: deliveryRecord.newborns
            } : null,
            postnatalSummary: postnatalRecords.length > 0 ? {
                followups: postnatalRecords.length,
                latestFollowup: {
                    date: postnatalRecords[0].followupDate,
                    maternalStatus: postnatalRecords[0].maternalAssessment,
                    newbornStatus: postnatalRecords[0].newbornAssessments
                }
            } : null,
            generatedAt: new Date()
        };
        
        res.json({
            status: "success",
            message: "Patient report generated successfully",
            data: report
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", error: error.message });
    }
};

// Generate facility-level report with aggregate statistics
export const generateFacilityReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        // Parse dates or use defaults (last 30 days)
        const parsedEndDate = endDate ? new Date(endDate) : new Date();
        const parsedStartDate = startDate ? 
            new Date(startDate) : 
            new Date(parsedEndDate.getTime() - (30 * 24 * 60 * 60 * 1000)); // 30 days ago
            
        // Query filters
        const dateFilter = {
            $gte: parsedStartDate,
            $lte: parsedEndDate
        };
        
        // Get total patient count
        const totalPatients = await Patient.countDocuments();
        
        // Get new patients registered in the period
        const newPatients = await Patient.countDocuments({
            createdAt: dateFilter
        });
        
        // Get checkups performed in the period
        const checkups = await MaternalHealth.countDocuments({
            dateRecorded: dateFilter
        });
        
        // Get deliveries in the period
        const deliveries = await Delivery.countDocuments({
            deliveryDate: dateFilter
        });
        
        // Get delivery methods breakdown
        const deliveryMethods = await Delivery.aggregate([
            { $match: { deliveryDate: dateFilter } },
            { $group: {
                _id: "$deliveryMethod",
                count: { $sum: 1 }
            }}
        ]);
        
        // Get complications breakdown
        const deliveryComplications = await Delivery.aggregate([
            { $match: { deliveryDate: dateFilter } },
            { $unwind: "$complications" },
            { $group: {
                _id: "$complications",
                count: { $sum: 1 }
            }}
        ]);
        
        // Get risk level distribution
        const riskLevelDistribution = await RiskAssessment.aggregate([
            { $match: { assessmentDate: dateFilter } },
            { $group: {
                _id: "$overallRiskLevel",
                count: { $sum: 1 }
            }}
        ]);
        
        // Format the report data
        const report = {
            period: {
                startDate: parsedStartDate,
                endDate: parsedEndDate
            },
            patientStatistics: {
                totalPatients,
                newPatients
            },
            activityStatistics: {
                totalCheckups: checkups,
                totalDeliveries: deliveries
            },
            deliveryStatistics: {
                methods: deliveryMethods.reduce((acc, method) => {
                    acc[method._id] = method.count;
                    return acc;
                }, {}),
                complications: deliveryComplications.reduce((acc, complication) => {
                    acc[complication._id] = complication.count;
                    return acc;
                }, {})
            },
            riskStatistics: riskLevelDistribution.reduce((acc, level) => {
                acc[level._id] = level.count;
                return acc;
            }, {}),
            generatedAt: new Date()
        };
        
        res.json({
            status: "success",
            message: "Facility report generated successfully",
            data: report
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", error: error.message });
    }
};

// Get statistics on high-risk indicators for monitoring trends
export const getHighRiskIndicatorsReport = async (req, res) => {
    try {
        const { months = 3 } = req.query;
        
        // Calculate start date (default to 3 months ago)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - parseInt(months));
        
        // Get high blood pressure trends
        const highBpTrend = await MaternalHealth.aggregate([
            { 
                $match: {
                    dateRecorded: { $gte: startDate, $lte: endDate },
                    "vitalSigns.bloodPressure.systolic": { $gte: 140 }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$dateRecorded" },
                        month: { $month: "$dateRecorded" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);
        
        // Get anemia trends
        const anemiaTrend = await MaternalHealth.aggregate([
            { 
                $match: {
                    dateRecorded: { $gte: startDate, $lte: endDate },
                    "labTests.hemoglobinLevel": { $lt: 11 }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$dateRecorded" },
                        month: { $month: "$dateRecorded" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);
        
        // Get abnormal fetal heart rate trends
        const abnormalFhrTrend = await FetalWatch.aggregate([
            { 
                $match: {
                    dateRecorded: { $gte: startDate, $lte: endDate },
                    $or: [
                        { "fetalData.fetalHeartbeat": { $lt: 120 } },
                        { "fetalData.fetalHeartbeat": { $gt: 160 } }
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$dateRecorded" },
                        month: { $month: "$dateRecorded" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);
        
        // Format the trend data into usable format with month names
        const formatTrendData = (trendData) => {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            return trendData.map(item => ({
                period: `${monthNames[item._id.month - 1]} ${item._id.year}`,
                count: item.count,
                year: item._id.year,
                month: item._id.month
            }));
        };
        
        res.json({
            status: "success",
            message: "High risk indicators report generated successfully",
            data: {
                highBloodPressure: formatTrendData(highBpTrend),
                anemia: formatTrendData(anemiaTrend),
                abnormalFetalHeartRate: formatTrendData(abnormalFhrTrend)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", error: error.message });
    }
};

// Export report in various formats
export const exportReport = async (req, res) => {
  try {
    const { reportType } = req.params;
    const { format = 'json', startDate, endDate } = req.query;
    
    // Implementation for exporting reports
    // This would typically generate files in the requested format
    
    res.json({
      status: "success",
      message: `Export of ${reportType} report initiated in ${format} format`,
      // The actual implementation would handle file generation and download
    });
  } catch (error) {
    res.status(500).json({ status: "failed", error: error.message });
  }
};

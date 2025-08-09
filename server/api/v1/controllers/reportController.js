import MedicalRecord from '../models/medicalRecord.js';
import Patient from '../models/patientModel.js';

/**
 * @description Analyzes medical records for potential risks and complications
 */

// Risk assessment constants
const RISK_FACTORS = {
  HIGH_BP: { threshold: 140, points: 2 },
  DIABETES: { points: 2 },
  PREECLAMPSIA: { points: 3 },
  MULTIPLE_PREGNANCY: { threshold: 1, points: 2 },
  PREVIOUS_CESAREAN: { threshold: 1, points: 2 },
  ADVANCED_MATERNAL_AGE: { threshold: 35, points: 1 },
  UNDERWEIGHT: { bmiThreshold: 18.5, points: 1 },
  OVERWEIGHT: { bmiThreshold: 25, points: 1 },
  OBESE: { bmiThreshold: 30, points: 2 },
  ANEMIA: { hgbThreshold: 11, points: 1 },
  GESTATIONAL_DIABETES: { fbsThreshold: 92, points: 2 }
};

/**
 * @desc    Get comprehensive risk assessment for a patient
 * @route   GET /api/v1/reports/risk-assessment/:patientId
 * @access  Private
 */
export const getRiskAssessment = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Get patient information first
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        status: 'failed',
        message: 'Patient not found'
      });
    }

    // Get all medical records for the patient
    const records = await MedicalRecord.find({ patient: patientId })
      .sort({ date: -1 });

    // If no medical records, return basic assessment with patient info
    if (!records || records.length === 0) {
      return res.status(200).json({
        status: 'success',
        data: {
          patient: {
            id: patient._id,
            name: patient.name,
            age: patient.age
          },
          riskAssessment: {
            riskScore: 0,
            riskLevel: 'unknown',
            riskFactors: [],
            bmi: null,
            lastCheckup: null,
            recommendations: [{
              type: 'info',
              priority: 'medium',
              description: 'Initial medical assessment recommended',
              details: 'No medical records found. Please schedule a comprehensive initial assessment.'
            }]
          }
        }
      });
    }

    const latestRecord = records[0];

    // Calculate BMI if height and weight are available
    let bmi = null;
    if (latestRecord.physicalExam?.height && latestRecord.physicalExam?.weight) {
      const heightInMeters = latestRecord.physicalExam.height / 100;
      bmi = latestRecord.physicalExam.weight / (heightInMeters * heightInMeters);
    }

    // Check for risk factors
    const riskFactors = [];
    let riskScore = 0;

    // Check blood pressure
    if (latestRecord.physicalExam?.bloodPressure) {
      const [systolic] = latestRecord.physicalExam.bloodPressure.split('/').map(Number);
      if (systolic >= RISK_FACTORS.HIGH_BP.threshold) {
        riskFactors.push('High blood pressure');
        riskScore += RISK_FACTORS.HIGH_BP.points;
      }
    }

    // Check diabetes
    if (latestRecord.medicalHistory?.diabetes) {
      riskFactors.push('Pre-existing diabetes');
      riskScore += RISK_FACTORS.DIABETES.points;
    }

    // Check for gestational diabetes
    const latestLab = latestRecord.labs?.sort((a, b) => b.visitNumber - a.visitNumber)[0];
    if (latestLab?.fbsRbs) {
      const fbs = parseFloat(latestLab.fbsRbs);
      if (!isNaN(fbs) && fbs >= RISK_FACTORS.GESTATIONAL_DIABETES.fbsThreshold) {
        riskFactors.push('Potential gestational diabetes');
        riskScore += RISK_FACTORS.GESTATIONAL_DIABETES.points;
      }
    }

    // Check BMI categories
    if (bmi !== null) {
      if (bmi < RISK_FACTORS.UNDERWEIGHT.bmiThreshold) {
        riskFactors.push('Underweight');
        riskScore += RISK_FACTORS.UNDERWEIGHT.points;
      } else if (bmi >= RISK_FACTORS.OBESE.bmiThreshold) {
        riskFactors.push('Obesity');
        riskScore += RISK_FACTORS.OBESE.points;
      } else if (bmi >= RISK_FACTORS.OVERWEIGHT.bmiThreshold) {
        riskFactors.push('Overweight');
        riskScore += RISK_FACTORS.OVERWEIGHT.points;
      }
    }

    // Check for anemia
    if (latestLab?.hgb) {
      const hgb = parseFloat(latestLab.hgb);
      if (!isNaN(hgb) && hgb < RISK_FACTORS.ANEMIA.hgbThreshold) {
        riskFactors.push('Anemia');
        riskScore += RISK_FACTORS.ANEMIA.points;
      }
    }

    // Check for previous cesarean
    if (latestRecord.cesareanSection && latestRecord.cesareanCount > 0) {
      riskFactors.push(`Previous cesarean (${latestRecord.cesareanCount})`);
      riskScore += RISK_FACTORS.PREVIOUS_CESAREAN.points;
    }

    // Determine risk level
    let riskLevel = 'low';
    if (riskScore >= 5) riskLevel = 'high';
    else if (riskScore >= 3) riskLevel = 'moderate';

    res.status(200).json({
      status: 'success',
      data: {
        patient: {
          id: patient._id,
          name: patient.name,
          age: patient.age
        },
        riskAssessment: {
          riskScore,
          riskLevel,
          riskFactors,
          bmi,
          lastCheckup: latestRecord.date,
          recommendations: generateRecommendations(riskFactors)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate risk assessment',
      error: error.message
    });
  }
};

/**
 * @desc    Get trends for a patient's vital signs
 * @route   GET /api/v1/reports/vital-trends/:patientId
 * @access  Private
 */
export const getVitalTrends = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Get patient information first
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        status: 'failed',
        message: 'Patient not found'
      });
    }
    
    const records = await MedicalRecord.find(
      { 
        patient: patientId,
        'physicalExam.weight': { $exists: true },
        'physicalExam.bloodPressure': { $exists: true }
      },
      'date physicalExam.weight physicalExam.bloodPressure physicalExam.temperature physicalExam.pulse physicalExam.respiratoryRate'
    ).sort({ date: 1 });

    // Return empty array if no records found instead of 404
    const trends = records.map(record => ({
      date: record.date,
      weight: record.physicalExam?.weight,
      bloodPressure: record.physicalExam?.bloodPressure,
      temperature: record.physicalExam?.temperature,
      pulse: record.physicalExam?.pulse,
      respiratoryRate: record.physicalExam?.respiratoryRate
    }));

    res.status(200).json({
      status: 'success',
      data: {
        patient: patientId,
        vitalTrends: trends
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve vital trends',
      error: error.message
    });
  }
};

/**
 * @desc    Get potential complications based on medical history and current condition
 * @route   GET /api/v1/reports/complications/:patientId
 * @access  Private
 */
export const getPotentialComplications = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Get patient information first
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        status: 'failed',
        message: 'Patient not found'
      });
    }
    
    const records = await MedicalRecord.find({ patient: patientId })
      .sort({ date: -1 });

    // Return empty complications array if no records found
    if (!records || records.length === 0) {
      return res.status(200).json({
        status: 'success',
        data: {
          patient: patientId,
          complications: []
        }
      });
    }

    const latestRecord = records[0];
    const complications = [];

    // Check for preeclampsia risk
    if (latestRecord.physicalExam?.bloodPressure) {
      const [systolic] = latestRecord.physicalExam.bloodPressure.split('/').map(Number);
      if (systolic >= 140 && latestRecord.physicalExam.proteinInUrine) {
        complications.push({
          name: 'Preeclampsia',
          probability: 'high',
          description: 'High blood pressure with protein in urine',
          recommendations: ['Immediate medical attention required', 'Monitor blood pressure and fetal movement closely']
        });
      } else if (systolic >= 140) {
        complications.push({
          name: 'Gestational Hypertension',
          probability: 'moderate',
          description: 'High blood pressure during pregnancy',
          recommendations: ['Regular blood pressure monitoring', 'Follow-up with healthcare provider']
        });
      }
    }

    // Check for gestational diabetes risk
    const latestLab = latestRecord.labs?.sort((a, b) => b.visitNumber - a.visitNumber)[0];
    if (latestLab?.fbsRbs) {
      const fbs = parseFloat(latestLab.fbsRbs);
      if (!isNaN(fbs) && fbs >= 92) {
        complications.push({
          name: 'Gestational Diabetes',
          probability: 'moderate',
          description: 'High blood sugar levels during pregnancy',
          recommendations: ['Consult with an endocrinologist', 'Monitor blood sugar levels', 'Follow a diabetic diet']
        });
      }
    }

    // Check for anemia
    if (latestLab?.hgb) {
      const hgb = parseFloat(latestLab.hgb);
      if (!isNaN(hgb) && hgb < 11) {
        complications.push({
          name: 'Anemia',
          probability: hgb < 9 ? 'high' : 'moderate',
          description: 'Low hemoglobin levels',
          recommendations: ['Iron supplementation recommended', 'Include iron-rich foods in diet']
        });
      }
    }

    // Check for multiple pregnancy
    if (latestRecord.gravida > 1) {
      complications.push({
        name: 'Multiple Pregnancy',
        probability: 'high',
        description: `Gravida: ${latestRecord.gravida}, Para: ${latestRecord.para}`,
        recommendations: ['Requires specialized prenatal care and monitoring']
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        patient: patientId,
        complications,
        lastUpdated: latestRecord.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to assess potential complications',
      error: error.message
    });
  }
};

/**
 * @desc    Generate personalized recommendations based on risk factors
 * @param   {Array} riskFactors - Array of identified risk factors
 * @returns {Array} Array of recommendation objects
 */
function generateRecommendations(riskFactors) {
  const recommendations = [];
  
  if (riskFactors.includes('High blood pressure')) {
    recommendations.push({
      type: 'lifestyle',
      priority: 'high',
      description: 'Monitor blood pressure regularly',
      details: 'Check blood pressure at least twice a week and keep a log.'
    });
  }
  
  if (riskFactors.includes('Potential gestational diabetes') || 
      riskFactors.includes('Pre-existing diabetes')) {
    recommendations.push({
      type: 'medical',
      priority: 'high',
      description: 'Glucose monitoring',
      details: 'Monitor blood sugar levels fasting and 2 hours after meals.'
    });
  }
  
  if (riskFactors.includes('Anemia')) {
    recommendations.push({
      type: 'nutrition',
      priority: 'moderate',
      description: 'Iron-rich diet',
      details: 'Include more leafy greens, red meat, and iron-fortified foods in your diet.'
    });
  }
  
  if (riskFactors.includes('Obesity') || riskFactors.includes('Overweight')) {
    recommendations.push({
      type: 'lifestyle',
      priority: 'moderate',
      description: 'Regular physical activity',
      details: 'Engage in at least 30 minutes of moderate exercise most days of the week.'
    });
  }
  
  // Always include general pregnancy recommendations
  recommendations.push(
    {
      type: 'general',
      priority: 'low',
      description: 'Prenatal vitamins',
      details: 'Continue taking prenatal vitamins as prescribed.'
    },
    {
      type: 'general',
      priority: 'low',
      description: 'Regular check-ups',
      details: 'Attend all scheduled prenatal appointments.'
    }
  );
  
  return recommendations;
}

/**
 * @desc    Get dashboard report with overall statistics
 * @route   GET /api/v1/reports/dashboard
 * @access  Private
 */
export const getDashboardReport = async (req, res) => {
  try {
    // Get counts from different collections
    const totalPatients = await Patient.countDocuments();
    const totalRecords = await MedicalRecord.countDocuments();
    
    // Get high-risk patients
    const allPatients = await Patient.find().select('_id name age');
    let highRiskCount = 0;
    let moderateRiskCount = 0;
    let lowRiskCount = 0;

    // Calculate risk for each patient (simplified)
    for (const patient of allPatients) {
      const latestRecord = await MedicalRecord.findOne({ patient: patient._id }).sort({ date: -1 });
      
      if (latestRecord) {
        let riskScore = 0;
        
        // Check blood pressure
        if (latestRecord.physicalExam?.bloodPressure) {
          const [systolic] = latestRecord.physicalExam.bloodPressure.split('/').map(Number);
          if (systolic >= 140) riskScore += 2;
        }
        
        // Check diabetes
        if (latestRecord.medicalHistory?.diabetes) riskScore += 2;
        
        // Determine risk level
        if (riskScore >= 5) highRiskCount++;
        else if (riskScore >= 3) moderateRiskCount++;
        else lowRiskCount++;
      } else {
        lowRiskCount++;
      }
    }

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentRecords = await MedicalRecord.countDocuments({
      date: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      status: 'success',
      data: {
        generatedAt: new Date().toISOString(),
        summary: {
          totalPatients,
          totalRecords,
          highRiskPatients: highRiskCount,
          moderateRiskPatients: moderateRiskCount,
          lowRiskPatients: lowRiskCount,
          recentActivity: recentRecords
        },
        riskDistribution: {
          high: highRiskCount,
          moderate: moderateRiskCount,
          low: lowRiskCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate dashboard report',
      error: error.message
    });
  }
};

/**
 * @desc    Get facility report with facility-wide statistics
 * @route   GET /api/v1/reports/facility
 * @access  Private
 */
export const getFacilityReport = async (req, res) => {
  try {
    // Get current month and year
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Monthly statistics for the last 6 months
    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(currentYear, currentMonth - i, 1);
      const nextMonth = new Date(currentYear, currentMonth - i + 1, 1);
      
      const monthlyPatients = await Patient.countDocuments({
        createdAt: {
          $gte: monthDate,
          $lt: nextMonth
        }
      });
      
      const monthlyRecords = await MedicalRecord.countDocuments({
        date: {
          $gte: monthDate,
          $lt: nextMonth
        }
      });
      
      monthlyStats.push({
        month: monthDate.toLocaleString('default', { month: 'short' }),
        year: monthDate.getFullYear(),
        patients: monthlyPatients,
        records: monthlyRecords
      });
    }

    // Get total counts
    const totalPatients = await Patient.countDocuments();
    const totalRecords = await MedicalRecord.countDocuments();

    res.status(200).json({
      status: 'success',
      data: {
        generatedAt: new Date().toISOString(),
        facilityName: 'FetalWatch Healthcare Facility',
        period: {
          from: monthlyStats[0]?.month + ' ' + monthlyStats[0]?.year,
          to: monthlyStats[monthlyStats.length - 1]?.month + ' ' + monthlyStats[monthlyStats.length - 1]?.year
        },
        overview: {
          totalPatients,
          totalRecords,
          averageRecordsPerPatient: totalPatients > 0 ? Math.round(totalRecords / totalPatients) : 0
        },
        monthlyStats
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate facility report',
      error: error.message
    });
  }
};

/**
 * @desc    Get risk indicators report with system-wide risk analysis
 * @route   GET /api/v1/reports/risk-indicators
 * @access  Private
 */
export const getRiskIndicatorsReport = async (req, res) => {
  try {
    // Get all patients with their latest records
    const patients = await Patient.find().select('_id name age');
    const riskIndicators = [];
    
    for (const patient of patients) {
      const latestRecord = await MedicalRecord.findOne({ patient: patient._id }).sort({ date: -1 });
      
      if (latestRecord) {
        const indicators = [];
        let riskScore = 0;
        
        // Check various risk factors
        if (latestRecord.physicalExam?.bloodPressure) {
          const [systolic] = latestRecord.physicalExam.bloodPressure.split('/').map(Number);
          if (systolic >= 140) {
            indicators.push('High Blood Pressure');
            riskScore += 2;
          }
        }
        
        if (latestRecord.medicalHistory?.diabetes) {
          indicators.push('Diabetes');
          riskScore += 2;
        }
        
        const latestLab = latestRecord.labs?.sort((a, b) => b.visitNumber - a.visitNumber)[0];
        if (latestLab?.hgb && parseFloat(latestLab.hgb) < 11) {
          indicators.push('Anemia');
          riskScore += 1;
        }
        
        if (latestRecord.cesareanSection && latestRecord.cesareanCount > 0) {
          indicators.push('Previous Cesarean');
          riskScore += 2;
        }
        
        // Only include patients with risk indicators
        if (indicators.length > 0) {
          let riskLevel = 'low';
          if (riskScore >= 5) riskLevel = 'high';
          else if (riskScore >= 3) riskLevel = 'moderate';
          
          riskIndicators.push({
            patientId: patient._id,
            patientName: patient.name,
            age: patient.age,
            riskLevel,
            riskScore,
            indicators,
            lastCheckup: latestRecord.date
          });
        }
      }
    }
    
    // Sort by risk score (highest first)
    riskIndicators.sort((a, b) => b.riskScore - a.riskScore);
    
    // Calculate summary statistics
    const highRisk = riskIndicators.filter(r => r.riskLevel === 'high').length;
    const moderateRisk = riskIndicators.filter(r => r.riskLevel === 'moderate').length;
    const lowRisk = riskIndicators.filter(r => r.riskLevel === 'low').length;
    
    res.status(200).json({
      status: 'success',
      data: {
        generatedAt: new Date().toISOString(),
        summary: {
          totalPatientsWithRisk: riskIndicators.length,
          highRiskCount: highRisk,
          moderateRiskCount: moderateRisk,
          lowRiskCount: lowRisk
        },
        riskIndicators: riskIndicators.slice(0, 50) // Limit to 50 for performance
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate risk indicators report',
      error: error.message
    });
  }
};

/**
 * @desc    Export facility report as CSV
 * @route   GET /api/v1/reports/export/facility
 * @access  Private
 */
export const exportFacilityReport = async (req, res) => {
  try {
    // Get current month and year
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Monthly statistics for the last 6 months
    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(currentYear, currentMonth - i, 1);
      const nextMonth = new Date(currentYear, currentMonth - i + 1, 1);
      
      const monthlyPatients = await Patient.countDocuments({
        createdAt: {
          $gte: monthDate,
          $lt: nextMonth
        }
      });
      
      const monthlyRecords = await MedicalRecord.countDocuments({
        date: {
          $gte: monthDate,
          $lt: nextMonth
        }
      });
      
      monthlyStats.push({
        month: monthDate.toLocaleString('default', { month: 'short' }),
        year: monthDate.getFullYear(),
        patients: monthlyPatients,
        records: monthlyRecords
      });
    }

    // Get total counts
    const totalPatients = await Patient.countDocuments();
    const totalRecords = await MedicalRecord.countDocuments();

    // Generate CSV content
    const csvHeader = 'Month,Year,New Patients,Medical Records\n';
    const csvRows = monthlyStats.map(stat => 
      `${stat.month},${stat.year},${stat.patients},${stat.records}`
    ).join('\n');
    
    const csvContent = csvHeader + csvRows;

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="facility-report.csv"');
    
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to export facility report',
      error: error.message
    });
  }
};

/**
 * @desc    Export dashboard report as CSV
 * @route   GET /api/v1/reports/export/dashboard
 * @access  Private
 */
export const exportDashboardReport = async (req, res) => {
  try {
    // Get counts from different collections
    const totalPatients = await Patient.countDocuments();
    const totalRecords = await MedicalRecord.countDocuments();
    
    // Get high-risk patients
    const allPatients = await Patient.find().select('_id name age');
    let highRiskCount = 0;
    let moderateRiskCount = 0;
    let lowRiskCount = 0;

    // Calculate risk for each patient (simplified)
    for (const patient of allPatients) {
      const latestRecord = await MedicalRecord.findOne({ patient: patient._id }).sort({ date: -1 });
      
      if (latestRecord) {
        let riskScore = 0;
        
        // Check blood pressure
        if (latestRecord.physicalExam?.bloodPressure) {
          const [systolic] = latestRecord.physicalExam.bloodPressure.split('/').map(Number);
          if (systolic >= 140) riskScore += 2;
        }
        
        // Check diabetes
        if (latestRecord.medicalHistory?.diabetes) riskScore += 2;
        
        // Determine risk level
        if (riskScore >= 5) highRiskCount++;
        else if (riskScore >= 3) moderateRiskCount++;
        else lowRiskCount++;
      } else {
        lowRiskCount++;
      }
    }

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentRecords = await MedicalRecord.countDocuments({
      date: { $gte: thirtyDaysAgo }
    });

    // Generate CSV content
    const csvContent = `Metric,Count
Total Patients,${totalPatients}
Total Records,${totalRecords}
High Risk Patients,${highRiskCount}
Moderate Risk Patients,${moderateRiskCount}
Low Risk Patients,${lowRiskCount}
Recent Activity (30 days),${recentRecords}`;

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="dashboard-report.csv"');
    
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to export dashboard report',
      error: error.message
    });
  }
};

/**
 * @desc    Export risk indicators report as CSV
 * @route   GET /api/v1/reports/export/risk-indicators
 * @access  Private
 */
export const exportRiskIndicatorsReport = async (req, res) => {
  try {
    // Get all patients with their latest records
    const patients = await Patient.find().select('_id name age');
    const riskIndicators = [];
    
    for (const patient of patients) {
      const latestRecord = await MedicalRecord.findOne({ patient: patient._id }).sort({ date: -1 });
      
      if (latestRecord) {
        const indicators = [];
        let riskScore = 0;
        
        // Check various risk factors
        if (latestRecord.physicalExam?.bloodPressure) {
          const [systolic] = latestRecord.physicalExam.bloodPressure.split('/').map(Number);
          if (systolic >= 140) {
            indicators.push('High Blood Pressure');
            riskScore += 2;
          }
        }
        
        if (latestRecord.medicalHistory?.diabetes) {
          indicators.push('Diabetes');
          riskScore += 2;
        }
        
        const latestLab = latestRecord.labs?.sort((a, b) => b.visitNumber - a.visitNumber)[0];
        if (latestLab?.hgb && parseFloat(latestLab.hgb) < 11) {
          indicators.push('Anemia');
          riskScore += 1;
        }
        
        if (latestRecord.cesareanSection && latestRecord.cesareanCount > 0) {
          indicators.push('Previous Cesarean');
          riskScore += 2;
        }
        
        // Only include patients with risk indicators
        if (indicators.length > 0) {
          let riskLevel = 'low';
          if (riskScore >= 5) riskLevel = 'high';
          else if (riskScore >= 3) riskLevel = 'moderate';
          
          riskIndicators.push({
            patientName: patient.name,
            age: patient.age,
            riskLevel,
            riskScore,
            indicators: indicators.join('; '),
            lastCheckup: latestRecord.date.toISOString().split('T')[0]
          });
        }
      }
    }
    
    // Sort by risk score (highest first)
    riskIndicators.sort((a, b) => b.riskScore - a.riskScore);
    
    // Generate CSV content
    const csvHeader = 'Patient Name,Age,Risk Level,Risk Score,Risk Indicators,Last Checkup\n';
    const csvRows = riskIndicators.map(indicator => 
      `"${indicator.patientName}",${indicator.age},${indicator.riskLevel},${indicator.riskScore},"${indicator.indicators}",${indicator.lastCheckup}`
    ).join('\n');
    
    const csvContent = csvHeader + csvRows;

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="risk-indicators-report.csv"');
    
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to export risk indicators report',
      error: error.message
    });
  }
};

export default {
  getRiskAssessment,
  getVitalTrends,
  getPotentialComplications,
  getDashboardReport,
  getFacilityReport,
  getRiskIndicatorsReport,
  exportFacilityReport,
  exportDashboardReport,
  exportRiskIndicatorsReport
};
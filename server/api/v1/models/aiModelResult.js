import mongoose from 'mongoose';

// Define the detailsSchema
const detailsSchema = new mongoose.Schema({
    anomaliesDetected: { type: [String], required: false },
    fetalMeasurements: {
        headCircumference: Number,
        abdominalCircumference: Number,
        femurLength: Number,
    },
    riskAssessment: {
        riskLevel: { type: String, enum: ["low", "moderate", "high"] },
        riskFactors: [String],
    },
    imageAnalysis: {
        placentalLocation: String,
        amnioticFluidVolume: Number,
        fetalPosition: String,
    },
    predictiveInsights: {
        estimatedDeliveryDate: Date,
        growthRate: Number,
        developmentalStage: String,
    },
    confidenceScores: {
        anomalyDetection: Number,
        measurementsAccuracy: Number,
    },
    recommendations: {
        followUpActions: [String],
        nextSteps: String,
    },
});

// Define the AIResultSchema and integrate detailsSchema
const AIResultSchema = new mongoose.Schema({
    fetalWatchId: { type: mongoose.Schema.Types.ObjectId, ref: 'FetalWatch', required: true },
    analysisDate: { type: Date, default: Date.now },
    details: { type: detailsSchema, required: true },
});

const AIResult = mongoose.model('AIResult', AIResultSchema);
export default AIResult;

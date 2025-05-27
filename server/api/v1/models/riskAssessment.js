import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RiskAssessmentSchema = new Schema({
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    pregnancyId: {
        type: Schema.Types.ObjectId,
        ref: 'Pregnancy',
        required: true
    },
    assessmentDate: {
        type: Date,
        default: Date.now
    },
    gestationalAge: {
        weeks: Number,
        days: Number
    },
    riskFactors: [{
        category: {
            type: String,
            enum: ['maternal', 'fetal', 'obstetric', 'medical', 'social']
        },
        factor: String,
        severity: {
            type: String,
            enum: ['low', 'medium', 'high']
        },
        notes: String
    }],
    overallRiskLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
    },
    recommendedActions: [{
        action: String,
        urgency: {
            type: String,
            enum: ['routine', 'prompt', 'urgent', 'emergency']
        },
        completed: {
            status: {
                type: Boolean,
                default: false
            },
            date: Date
        }
    }],
    alerts: [{
        message: String,
        type: {
            type: String,
            enum: ['info', 'warning', 'critical']
        },
        acknowledged: {
            status: {
                type: Boolean,
                default: false
            },
            date: Date,
            by: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    }],
    previousAssessmentId: {
        type: Schema.Types.ObjectId,
        ref: 'RiskAssessment'
    },
    recordedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: String
});

const RiskAssessment = mongoose.model('RiskAssessment', RiskAssessmentSchema);
export default RiskAssessment;

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MaternalHealthSchema = new Schema({
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
    vitalSigns: {
        bloodPressure: {
            systolic: Number,  // in mmHg
            diastolic: Number  // in mmHg
        },
        heartRate: Number,     // in bpm
        temperature: Number,   // in Celsius
        respiratoryRate: Number // breaths per minute
    },
    labTests: {
        hemoglobinLevel: Number, // in g/dL
        bloodGlucose: Number,    // in mg/dL
        urineProtein: {
            type: String,
            enum: ['negative', 'trace', '1+', '2+', '3+', '4+']
        },
        urineGlucose: {
            type: String,
            enum: ['negative', 'trace', '1+', '2+', '3+', '4+']
        }
    },
    bodyMetrics: {
        weight: Number,    // in kg
        height: Number,    // in cm
        bmi: Number
    },
    symptoms: [{
        type: String,
        enum: ['swelling', 'dizziness', 'headache', 'vision_changes', 'pain', 'bleeding', 'nausea', 'vomiting', 'other']
    }],
    otherSymptoms: String,
    medicalHistory: {
        previousComplications: [String],
        previousCsections: Number,
        chronicConditions: [String],
        allergies: [String]
    },
    riskFactors: [{
        factor: String,
        severity: {
            type: String,
            enum: ['low', 'medium', 'high']
        }
    }],
    dateRecorded: {
        type: Date,
        default: Date.now
    },
    recordedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: String
});

// Calculate BMI before saving
MaternalHealthSchema.pre('save', function(next) {
    if (this.bodyMetrics.weight && this.bodyMetrics.height) {
        // BMI = weight(kg) / (height(m))²
        const heightInMeters = this.bodyMetrics.height / 100;
        this.bodyMetrics.bmi = (this.bodyMetrics.weight / (heightInMeters * heightInMeters)).toFixed(2);
    }
    next();
});

const MaternalHealth = mongoose.model('MaternalHealth', MaternalHealthSchema);
export default MaternalHealth;

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PregnancySchema = new Schema({
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'Patient', required: true
    },
    gestationalAge: {
        type: Number, required: true
    },
    expectedDeliveryDate: {
        type: Date, required: true
    },
    prenatalCare: {
        numberOfVisits: Number, adherence: Boolean
    },
    fetalMovements: String,
    complications: [String],
    ultrasoundFindings: String,
    laboratoryResults: [String],
    vitalSigns: {
        bloodPressure: String,
        temperature: Number,
        pulse: Number,
        respiratoryRate: Number
    },
    weight: Number,
    height: Number,
    immunizationStatus: String,
    socialDeterminantsOfHealth: {
        educationLevel: String,
        occupation: String,
        income: String
    },
    consentForm: Boolean,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Pregnancy = mongoose.model('Pregnancy', PregnancySchema);
export default Pregnancy;

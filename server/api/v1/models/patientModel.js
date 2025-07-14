import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PatientSchema = new Schema({
    facility: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, // Reference to the facility (healthProvider)
    name: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    address: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    weekOfPregnancy: {
        type: Number
    },
    expectedDeliveryDate: {
        type: Date
    },
    pregnancies: [{
        type: Schema.Types.ObjectId,
        ref: 'Pregnancy'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp before saving
PatientSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Patient = mongoose.model('Patient', PatientSchema);
export default Patient;


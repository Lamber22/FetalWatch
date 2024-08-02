import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PatientSchema = new Schema({
    uniqueIdentifier: {
        type: String, required: true, unique: true
    },
    firstName: {
        type: String, required: true
    },
    lastName: {
        type: String, required: true
    },
    dateOfBirth: { type: Date, required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String, required: true
    },
    address: { type: String, required: true
    },
    contactInformation: {
        phone: { type: String, required: true },
        email: { type: String }
    },
    emergencyContact: {
        name: { type: String, required: true },
        phone: { type: String, required: true }
    },
    medicalHistory: {
        chronicIllnesses: [String],
        allergies: [String],
        previousPregnancies: {
        number: Number,
        outcomes: [String],
        complications: [String]
        },
        obstetricHistory: {
        gravida: Number,
        para: Number,
        abortions: Number
        },
        contraceptionHistory: String,
        surgicalHistory: [String],
        currentMedications: [String]
    },
    createdAt: { type: Date, default: Date.now
    },
    updatedAt: { type: Date, default: Date.now
    }
});

const Patient = mongoose.model('Patient', PatientSchema);
export default Patient;

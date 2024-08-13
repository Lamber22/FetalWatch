import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const FetalWatchSchema = new Schema({
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'Patient', required: true
    },
    pregnancyId: {
        type: Schema.Types.ObjectId,
        ref: 'Pregnancy', required: true
    },
    fetalData: {
        fetalHeartbeat: Number,
        measurements: {
        CRL: Number,
        BPD: Number,
        FL: Number,
        HC: Number,
        AC: Number
        },
        growthAndDevelopment: String,
        position: String
    },
    placentalData: {
        location: String,
        health: String,
        function: String
    },
    amnioticFluidData: {
        volume: Number
    },
    uterineAndCervicalData: {
        uterineHealth: String,
        cervicalLength: Number
    },
    dopplerFlowData: {
        umbilicalCordFlow: String,
        fetalVesselsFlow: String
    },
    structuralData: String,
    gestationalAgeEstimation: Number,
    multiplePregnanciesData: {
        numberOfFetuses: Number,
        chorionicityAndAmnionicity: String
    },
    image: {
        type: String,
        required: false // Optional: Only required if an image is part of the finding
    },
    aiResults: [{
        type: Schema.Types.ObjectId,
        ref: 'AIResult' // Reference to an AIResult schema
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

const FetalWatch = mongoose.model('FetalWatch', FetalWatchSchema);
export default FetalWatch;

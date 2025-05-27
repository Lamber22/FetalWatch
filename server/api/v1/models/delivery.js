import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
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
    deliveryDate: {
        type: Date,
        required: true
    },
    gestationalAge: {
        weeks: Number,
        days: Number
    },
    deliveryMethod: {
        type: String,
        enum: ['vaginal', 'cesarean', 'instrumental'],
        required: true
    },
    deliveryLocation: {
        type: String,
        enum: ['hospital', 'health_center', 'home', 'other'],
        required: true
    },
    attendants: [{
        type: String,
        enum: ['doctor', 'midwife', 'nurse', 'traditional_birth_attendant', 'other']
    }],
    laborDuration: {
        firstStage: Number, // in hours
        secondStage: Number, // in minutes
        thirdStage: Number // in minutes
    },
    complications: [{
        type: String,
        enum: ['none', 'hemorrhage', 'obstructed_labor', 'eclampsia', 'infection', 'other']
    }],
    otherComplications: String,
    maternalOutcome: {
        type: String,
        enum: ['healthy', 'complications', 'referred', 'deceased'],
        required: true
    },
    newborns: [{
        birthWeight: Number, // in grams
        length: Number, // in cm
        headCircumference: Number, // in cm
        apgarScores: {
            oneMinute: Number,
            fiveMinutes: Number,
            tenMinutes: Number
        },
        sex: {
            type: String,
            enum: ['male', 'female', 'undetermined']
        },
        outcome: {
            type: String,
            enum: ['healthy', 'complications', 'referred', 'stillborn', 'deceased']
        },
        complications: [String]
    }],
    notes: String,
    recordedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    dateRecorded: {
        type: Date,
        default: Date.now
    }
});

const Delivery = mongoose.model('Delivery', DeliverySchema);
export default Delivery;

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PostnatalSchema = new Schema({
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
    deliveryId: {
        type: Schema.Types.ObjectId,
        ref: 'Delivery',
        required: true
    },
    followupDate: {
        type: Date,
        required: true
    },
    timeSinceDelivery: {
        days: Number
    },
    maternalAssessment: {
        vitalSigns: {
            bloodPressure: {
                systolic: Number,
                diastolic: Number
            },
            heartRate: Number,
            temperature: Number
        },
        uterusInvolution: {
            type: String,
            enum: ['normal', 'subinvolution', 'other']
        },
        lochia: {
            type: String,
            enum: ['normal', 'excessive', 'offensive', 'other']
        },
        breastfeeding: {
            status: {
                type: String,
                enum: ['exclusive', 'partial', 'none']
            },
            issues: [{
                type: String,
                enum: ['none', 'pain', 'engorgement', 'mastitis', 'low_supply', 'other']
            }]
        },
        perineum: {
            type: String,
            enum: ['intact', 'healing', 'infected', 'other']
        },
        complications: [{
            type: String,
            enum: ['none', 'hemorrhage', 'infection', 'eclampsia', 'depression', 'other']
        }],
        otherComplications: String,
        emotionalWellbeing: {
            type: String,
            enum: ['good', 'concerning', 'requires_referral']
        }
    },
    newbornAssessments: [{
        newbornId: String, // Identifier for multiple births
        weight: Number,
        temperature: Number,
        feeding: {
            type: String,
            enum: ['breastfeeding_well', 'breastfeeding_issues', 'formula', 'mixed', 'other']
        },
        jaundice: {
            type: String,
            enum: ['none', 'mild', 'moderate', 'severe']
        },
        umbilicalCord: {
            type: String,
            enum: ['normal', 'signs_of_infection', 'other']
        },
        skinColor: String,
        activity: {
            type: String,
            enum: ['normal', 'lethargic', 'hyperactive', 'other']
        },
        complications: [{
            type: String,
            enum: ['none', 'respiratory', 'feeding_difficulties', 'infection', 'congenital_abnormality', 'other']
        }],
        otherComplications: String
    }],
    recommendations: {
        maternal: String,
        newborn: String
    },
    followupNeeded: {
        type: Boolean,
        default: false
    },
    nextAppointment: Date,
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

const Postnatal = mongoose.model('Postnatal', PostnatalSchema);
export default Postnatal;

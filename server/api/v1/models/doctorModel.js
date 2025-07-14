import mongoose from "mongoose";

const Schema = mongoose.Schema;

const DoctorSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Please enter a valid email address'
        }
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\+?[\d\s\-\(\)]+$/.test(v);
            },
            message: 'Please enter a valid phone number'
        }
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    specialization: {
        type: String,
        required: true,
        enum: [
            'Obstetrician',
            'Gynecologist',
            'Obstetrician-Gynecologist',
            'Maternal-Fetal Medicine',
            'Perinatologist',
            'Reproductive Endocrinology',
            'Neonatologist',
            'General Practitioner',
            'Family Medicine',
            'Midwife',
            'Other'
        ]
    },
    yearsOfExperience: {
        type: Number,
        required: true,
        min: 0
    },
    qualifications: [{
        degree: {
            type: String,
            required: true
        },
        institution: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            required: true
        }
    }],
    hospital: {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        department: {
            type: String
        }
    },
    consultationFee: {
        type: Number,
        min: 0
    },
    availableHours: {
        monday: {
            start: String,
            end: String,
            available: { type: Boolean, default: true }
        },
        tuesday: {
            start: String,
            end: String,
            available: { type: Boolean, default: true }
        },
        wednesday: {
            start: String,
            end: String,
            available: { type: Boolean, default: true }
        },
        thursday: {
            start: String,
            end: String,
            available: { type: Boolean, default: true }
        },
        friday: {
            start: String,
            end: String,
            available: { type: Boolean, default: true }
        },
        saturday: {
            start: String,
            end: String,
            available: { type: Boolean, default: false }
        },
        sunday: {
            start: String,
            end: String,
            available: { type: Boolean, default: false }
        }
    },
    bio: {
        type: String,
        maxlength: 2000
    },
    languages: [{
        type: String,
        trim: true
    }],
    profileImage: {
        type: String, // URL to profile image
        default: null
    },
    appointments: [{
        type: Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    patients: [{
        type: Schema.Types.ObjectId,
        ref: 'Patient'
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

// Indexes for efficient querying
DoctorSchema.index({ specialization: 1 });
DoctorSchema.index({ 'hospital.name': 1 });

// Update timestamp before saving
DoctorSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Virtual for full name
DoctorSchema.virtual('fullName').get(function() {
    return `Dr. ${this.firstName} ${this.lastName}`;
});

// Virtual for total patients count
DoctorSchema.virtual('totalPatients').get(function() {
    return this.patients ? this.patients.length : 0;
});

// Virtual for total appointments count
DoctorSchema.virtual('totalAppointments').get(function() {
    return this.appointments ? this.appointments.length : 0;
});

// Ensure virtual fields are serialized
DoctorSchema.set('toJSON', { virtuals: true });

const Doctor = mongoose.model('Doctor', DoctorSchema);
export default Doctor;
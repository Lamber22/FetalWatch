import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PatientSchema = new Schema({
  facility: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
    enum: ['Male', 'Female',]
  },
  address: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  emergencyContact: {
    name: {
      type: String,
      required: false
    },
    contactNumber: {
      type: String,
      required: false
    },
    location: {
      type: String,
      required: false
    }
  },
  socialHistory: {
    maritalStatus: {
      type: String,
      enum: ["Married", "Single"],
    },
    occupation: String,
    student: Boolean,
    educationLevel: String,
    title: String,
  },
  habits: {
    smokes: Boolean,
    drinksAlcohol: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-update timestamp
PatientSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for linked medical records
PatientSchema.virtual('medicalRecords', {
  ref: 'MedicalRecord',
  localField: '_id',
  foreignField: 'patient',
});

// Include virtuals when converting to JSON or Object
PatientSchema.set('toObject', { virtuals: true });
PatientSchema.set('toJSON', { virtuals: true });

const Patient = mongoose.model('Patient', PatientSchema);
export default Patient;

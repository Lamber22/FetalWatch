import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
    patientName: {
        type: String,
        required: true
    },
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Validate time format (HH:MM)
                return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: 'Time must be in HH:MM format'
        }
    },
    appointmentType: {
        type: String,
        required: true,
        enum: [
            'Routine Checkup',
            'Ultrasound',
            'Blood Test',
            'Consultation',
            'Follow-up',
            'Emergency',
            'Prenatal Care',
            'Postnatal Care',
            'Vaccination',
            'Other'
        ]
    },
    notes: {
        type: String,
        maxlength: 1000
    },
    status: {
        type: String,
        default: 'Scheduled',
        enum: ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show']
    },
    duration: {
        type: Number, // Duration in minutes
        default: 30
    },
    doctor: {
        type: String,
        required: true
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

// Index for efficient querying
AppointmentSchema.index({ date: 1, time: 1 });
AppointmentSchema.index({ patientId: 1 });

// Update timestamp before saving
AppointmentSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Virtual for formatted date and time
AppointmentSchema.virtual('dateTime').get(function() {
    const date = this.date.toISOString().split('T')[0];
    return `${date} ${this.time}`;
});

// Ensure virtual fields are serialized
AppointmentSchema.set('toJSON', { virtuals: true });

const Appointment = mongoose.model('Appointment', AppointmentSchema);
export default Appointment;
import Appointment from '../models/appointmentModel.js';
import Patient from '../models/patientModel.js';
import Doctor from '../models/doctorModel.js';
import { getFacilityPatientIds } from '../../../middleware/facilityMiddleware.js';

// Get all appointments (with facility filtering)
export const getAllAppointments = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            status, 
            appointmentType,
            patientId,
            doctorId,
            date,
            startDate,
            endDate
        } = req.query;

        // Role-based filtering
        const user = req.user; // Assumes user is attached to req by auth middleware
        let filter = {};

        if (user.role === 'admin') {
            // Admin: no filter, see all appointments
            filter = {};
        } else if (user.role === 'healthProvider') {
            // HealthProvider: see all appointments for their facility
            const facilityPatientIds = await getFacilityPatientIds(req);
            filter.patientId = { $in: facilityPatientIds };
        } else if (user.role === 'doctor' || user.role === 'nurse' || user.role === 'midwife') {
            // Doctor/Nurse/Midwife: only see appointments scheduled for them
            // Assuming 'doctor' field in Appointment is the doctor's name or ID
            // If using name, match by full name; if using ID, match by user._id
            filter.doctor = user.fullName || `${user.firstName} ${user.lastName}` || user._id;
        } else {
            // Default: restrict access
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        if (status) {
            filter.status = status;
        }
        if (appointmentType) {
            filter.appointmentType = appointmentType;
        }
        if (patientId) {
            if (filter.patientId && Array.isArray(filter.patientId.$in)) {
                // Ensure the requested patient is accessible to this facility
                if (filter.patientId.$in.map(id => id.toString()).includes(patientId)) {
                    filter.patientId = patientId;
                } else {
                    return res.status(403).json({
                        status: "failed",
                        message: "Access denied to this patient's appointments"
                    });
                }
            } else {
                filter.patientId = patientId;
            }
        }
        if (doctorId) {
            filter.doctor = doctorId;
        }
        if (date) {
            filter.date = new Date(date);
        }
        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const appointments = await Appointment.find(filter)
            .populate('patientId', 'name contact weekOfPregnancy')
            .populate('facility', 'facilityName')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ date: 1, time: 1 });

        const total = await Appointment.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: appointments,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalAppointments: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
            error: error.message
        });
    }
};

// Get single appointment by ID
export const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patientId', 'name contact dateOfBirth address weekOfPregnancy expectedDeliveryDate');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching appointment',
            error: error.message
        });
    }
};

// Create new appointment
export const createAppointment = async (req, res) => {
    try {
        const { patientId, patientName, date, time, doctor } = req.body;

        // Verify patient exists
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        // Check for conflicting appointments
        const conflictingAppointment = await Appointment.findOne({
            date: new Date(date),
            time: time,
            doctor: doctor,
            status: { $in: ['Scheduled', 'Confirmed', 'In Progress'] }
        });

        if (conflictingAppointment) {
            return res.status(400).json({
                success: false,
                message: 'Doctor is not available at this time slot'
            });
        }

        const appointment = new Appointment(req.body);
        const savedAppointment = await appointment.save();

        // Add appointment to patient's appointments
        await Patient.findByIdAndUpdate(
            patientId,
            { $push: { appointments: savedAppointment._id } }
        );

        // Add appointment to doctor's appointments
        await Doctor.findOneAndUpdate(
            { $or: [{ fullName: doctor }, { firstName: doctor.split(' ')[1], lastName: doctor.split(' ')[2] }] },
            { $push: { appointments: savedAppointment._id } }
        );

        const populatedAppointment = await Appointment.findById(savedAppointment._id)
            .populate('patientId', 'name contact');

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            data: populatedAppointment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating appointment',
            error: error.message
        });
    }
};

// Update appointment
export const updateAppointment = async (req, res) => {
    try {
        const { date, time, doctor } = req.body;

        // If updating date/time/doctor, check for conflicts
        if (date || time || doctor) {
            const currentAppointment = await Appointment.findById(req.params.id);
            if (!currentAppointment) {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment not found'
                });
            }

            const checkDate = date ? new Date(date) : currentAppointment.date;
            const checkTime = time || currentAppointment.time;
            const checkDoctor = doctor || currentAppointment.doctor;

            const conflictingAppointment = await Appointment.findOne({
                _id: { $ne: req.params.id },
                date: checkDate,
                time: checkTime,
                doctor: checkDoctor,
                status: { $in: ['Scheduled', 'Confirmed', 'In Progress'] }
            });

            if (conflictingAppointment) {
                return res.status(400).json({
                    success: false,
                    message: 'Doctor is not available at this time slot'
                });
            }
        }

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('patientId', 'name contact');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Appointment updated successfully',
            data: appointment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating appointment',
            error: error.message
        });
    }
};

// Cancel appointment
export const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status: 'Cancelled' },
            { new: true }
        ).populate('patientId', 'name contact');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Appointment cancelled successfully',
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error cancelling appointment',
            error: error.message
        });
    }
};

// Delete appointment
export const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Remove appointment from patient's appointments
        await Patient.findByIdAndUpdate(
            appointment.patientId,
            { $pull: { appointments: appointment._id } }
        );

        // Remove appointment from doctor's appointments
        await Doctor.findOneAndUpdate(
            { $or: [{ fullName: appointment.doctor }, { firstName: appointment.doctor.split(' ')[1], lastName: appointment.doctor.split(' ')[2] }] },
            { $pull: { appointments: appointment._id } }
        );

        res.status(200).json({
            success: true,
            message: 'Appointment deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting appointment',
            error: error.message
        });
    }
};

// Get appointments by patient
export const getAppointmentsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        
        const appointments = await Appointment.find({ patientId })
            .populate('patientId', 'name contact')
            .sort({ date: 1, time: 1 });

        res.status(200).json({
            success: true,
            data: appointments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching patient appointments',
            error: error.message
        });
    }
};

// Get appointments by doctor
export const getAppointmentsByDoctor = async (req, res) => {
    try {
        const { doctor } = req.params;
        
        const appointments = await Appointment.find({ doctor })
            .populate('patientId', 'name contact weekOfPregnancy')
            .sort({ date: 1, time: 1 });

        res.status(200).json({
            success: true,
            data: appointments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching doctor appointments',
            error: error.message
        });
    }
};

// Get today's appointments
export const getTodaysAppointments = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const appointments = await Appointment.find({
            date: {
                $gte: today,
                $lt: tomorrow
            }
        })
        .populate('patientId', 'name contact weekOfPregnancy')
        .sort({ time: 1 });

        res.status(200).json({
            success: true,
            data: appointments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching today\'s appointments',
            error: error.message
        });
    }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate('patientId', 'name contact');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Appointment status updated successfully',
            data: appointment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating appointment status',
            error: error.message
        });
    }
};
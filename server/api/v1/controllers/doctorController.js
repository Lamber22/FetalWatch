import Doctor from '../models/doctorModel.js';

// Get all doctors
export const getAllDoctors = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            specialization, 
            hospital
        } = req.query;

        const filter = {};
        
        if (specialization) {
            filter.specialization = specialization;
        }
        
        if (hospital) {
            filter['hospital.name'] = { $regex: hospital, $options: 'i' };
        }

        const doctors = await Doctor.find(filter)
            .populate('appointments', 'date time appointmentType status')
            .populate('patients', 'name contact')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Doctor.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: doctors,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalDoctors: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching doctors',
            error: error.message
        });
    }
};

// Get single doctor by ID
export const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id)
            .populate('appointments', 'date time appointmentType status patientName')
            .populate('patients', 'name contact weekOfPregnancy');

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching doctor',
            error: error.message
        });
    }
};

// Create new doctor
export const createDoctor = async (req, res) => {
    try {
        const doctor = new Doctor(req.body);
        const savedDoctor = await doctor.save();

        res.status(201).json({
            success: true,
            message: 'Doctor created successfully',
            data: savedDoctor
        });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `Doctor with this ${field} already exists`
            });
        }

        res.status(400).json({
            success: false,
            message: 'Error creating doctor',
            error: error.message
        });
    }
};

// Update doctor
export const updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Doctor updated successfully',
            data: doctor
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating doctor',
            error: error.message
        });
    }
};

// Delete doctor
export const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Doctor deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting doctor',
            error: error.message
        });
    }
};

// Get doctors by specialization
export const getDoctorsBySpecialization = async (req, res) => {
    try {
        const { specialization } = req.params;
        
        const doctors = await Doctor.find({ 
            specialization
        }).select('firstName lastName email phone hospital consultationFee availableHours');

        res.status(200).json({
            success: true,
            data: doctors
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching doctors by specialization',
            error: error.message
        });
    }
};

// Get doctor's availability
export const getDoctorAvailability = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).select('availableHours');

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: doctor.availableHours
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching doctor availability',
            error: error.message
        });
    }
};
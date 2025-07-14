import User from '../api/v1/models/userModel.js';

/**
 * Middleware to get facility admin ID for the current user
 * Adds facilityAdminId to req.user for facility-based filtering
 */
export const getFacilityContext = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                status: "fail",
                message: "User not authenticated"
            });
        }

        const currentUser = await User.findById(req.user.id);
        if (!currentUser) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }

        // Get facility admin ID based on user role
        let facilityAdminId;
        if (currentUser.role === 'healthProvider') {
            facilityAdminId = currentUser._id;
        } else if (['doctor', 'nurse', 'midwife'].includes(currentUser.role)) {
            facilityAdminId = currentUser.facility;
            if (!facilityAdminId) {
                return res.status(400).json({
                    status: "fail",
                    message: "Healthcare worker not associated with any facility"
                });
            }
        } else if (currentUser.role === 'admin') {
            // System admins can see all data - no facility restriction
            facilityAdminId = null;
        } else {
            return res.status(403).json({
                status: "fail",
                message: "Invalid user role for facility access"
            });
        }

        // Add facility context to request
        req.user.facilityAdminId = facilityAdminId;
        req.user.role = currentUser.role;
        req.user.currentUser = currentUser;

        next();
    } catch (error) {
        console.error('Facility context middleware error:', error);
        res.status(500).json({
            status: "error",
            message: "Failed to get facility context",
            error: error.message
        });
    }
};

/**
 * Creates a facility-based query filter for database operations
 * @param {Object} req - Express request object (must have req.user.facilityAdminId)
 * @param {Object} baseQuery - Base query object to extend
 * @returns {Object} Query object with facility filtering
 */
export const createFacilityFilter = (req, baseQuery = {}) => {
    // System admins can see all data
    if (req.user.role === 'admin' || !req.user.facilityAdminId) {
        return baseQuery;
    }

    // Add facility filter for healthcare providers and workers
    return {
        ...baseQuery,
        facility: req.user.facilityAdminId
    };
};

/**
 * Middleware to ensure facility-based access control for specific roles
 */
export const requireFacilityAccess = (allowedRoles = ['healthProvider', 'doctor', 'nurse', 'midwife', 'admin']) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: "fail",
                message: "Access denied. Insufficient permissions."
            });
        }
        next();
    };
};

/**
 * Get facility-filtered patient IDs for complex queries (e.g., appointments, pregnancies)
 * @param {Object} req - Express request object
 * @returns {Promise<Array>} Array of patient IDs accessible to the user
 */
export const getFacilityPatientIds = async (req) => {
    const Patient = (await import('../api/v1/models/patientModel.js')).default;
    
    // System admins can see all patients
    if (req.user.role === 'admin' || !req.user.facilityAdminId) {
        const allPatients = await Patient.find({}, '_id');
        return allPatients.map(p => p._id);
    }

    // Get patients from user's facility
    const facilityPatients = await Patient.find({ facility: req.user.facilityAdminId }, '_id');
    return facilityPatients.map(p => p._id);
};

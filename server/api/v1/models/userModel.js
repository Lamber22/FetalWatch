import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    facilityName: {
        type: String,
        trim: true
    },
    facilityAddress: {
        street: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        state: {
            type: String,
            trim: true
        },
        zipCode: {
            type: String,
            trim: true
        },
        country: {
            type: String,
            trim: true,
            default: 'Liberia'
        }
    },
    facilityPhone: {
        type: String,
        validate: {
            validator: function(v) {
                if (!v) return true; // Allow empty values
                return /^\+?[\d\s\-\(\)]+$/.test(v);
            },
            message: 'Please enter a valid phone number'
        }
    },
    facilityType: {
            type: String,
            enum: [
                'Hospital',
                'Clinic',
                'Health Center',
                'Maternity Home',
                'Private Practice',
                'Birthing Center',
                'Other'
            ],
            trim: true
    },
    facilityLicenseNumber: {
        type: String,
        unique: true,
        sparse: true,
        uppercase: true
    },
    // Individual user information (for doctor, nurse, midwife)
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    // Reference to the facility admin (for healthcare workers)
    facility: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    email: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, required: true
    },
    role: {
        type: String, 
        enum: ["admin", "healthProvider", "doctor", "nurse", "midwife"],
        default: "healthProvider", 
        required: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: function() {
            return ['admin', 'doctor', 'nurse', 'midwife'].includes(this.role);
        }
    },
    activatedBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }, // Reference to the admin who activated the account
    activatedAt: {
        type: Date
    },
    lastLogin: {
        type: Date
    },
    passwordResetAt: {
        type: Date
    },
    createdAt: {
        type: Date, default: Date.now
    },
    updatedAt: {
        type: Date, default: Date.now
    },
    createdBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    } // Reference to the admin/healthProvider who created the user
});

// Update timestamps on save
UserSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    
    // Set activation timestamp when account is activated
    if (this.isModified('isActive') && this.isActive && !this.activatedAt) {
        this.activatedAt = new Date();
    }
    
    next();
});

// Encrypt password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next(); // Ensure the next function is called if password is not modified
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt); // Await the bcrypt.hash function
        next(); // Proceed with the save operation
    } catch (error) {
        next(error); // Pass any errors to the next middleware
    }
});

//`matchPassword` instance method for signIn
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Get facility information for the user
UserSchema.methods.getFacilityInfo = function() {
    if (this.role === 'healthProvider') {
        return {
            id: this._id,
            facilityName: this.facilityName || 'Unnamed Facility',
            address: this.getFullAddress(),
            phone: this.facilityPhone || '',
            facilityType: this.facilityType || '',
            licenseNumber: this.facilityLicenseNumber || ''
        };
    }
    return null;
};

// Get full address string
UserSchema.methods.getFullAddress = function() {
    if (!this.facilityAddress) return 'Address not available';
    
    const address = this.facilityAddress;
    const parts = [
        address.street,
        address.city,
        address.state,
        address.zipCode,
        address.country
    ].filter(part => part && part.trim() !== '');
    
    return parts.length > 0 ? parts.join(', ') : 'Address not available';
};

// Get facility admin ID for healthcare workers
UserSchema.methods.getFacilityAdminId = function() {
    if (this.role === 'healthProvider') {
        return this._id;
    }
    return this.facility;
};

// Static method to get facility admin ID for any user
UserSchema.statics.getFacilityAdminIdForUser = async function(userId) {
    const user = await this.findById(userId);
    if (!user) return null;
    
    if (user.role === 'healthProvider') {
        return user._id;
    }
    return user.facility;
};

const User = mongoose.model("User", UserSchema);
export default User;

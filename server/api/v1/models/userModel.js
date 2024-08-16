import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String, require: true
    },
    lastName: {
        type: String, require: true
    },
    email: {
        type: String, require: true, unique: true
    },
    password: {
        type: String, require: true
    },
    role: {
        type: String, enum: ["admin", "healthProvider", "doctor", "nurse", "midwife"],
        default: "healthProvider", require: true
    },
    createdAt: {
        type: Date, default: Date.now
    },
    updatedAt: {
        type: Date, default: Date.now
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to the admin who created the user
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

const User = mongoose.model("User", UserSchema);
export default User;

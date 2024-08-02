import mongoose from "mongoose";

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
        type: String, enum: ["admin", "healthProvider", "doctor", "midwife"],
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

const User = mongoose.model("User", UserSchema);
export default User;

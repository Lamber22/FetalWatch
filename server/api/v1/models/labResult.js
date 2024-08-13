import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const LabResultSchema = new Schema({
    fetalWatchId: {
        type: Schema.Types.ObjectId,
        ref: 'FetalWatch',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['finding', 'result'] // Defines whether it's a finding or a result
    },
    description: String, // For findings
    result: String, // For results
    image: String, // Optional: for findings that may include images
    date: {
        type: Date,
        default: Date.now
    },
});

const LabResult = mongoose.model('LabResult', LabResultSchema);
export default LabResult;

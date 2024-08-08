import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const AIResultSchema = new Schema({
    fetalWatchId: { type: Schema.Types.ObjectId, ref: 'FetalWatch', required: true },
    resultType: String, // e.g., 'fetal_growth', 'abnormality_detection'
    details: Object, // Detailed results from AI
    createdAt: { type: Date, default: Date.now }
});

const AIResult = mongoose.model('AIResult', AIResultSchema);
export default AIResult;

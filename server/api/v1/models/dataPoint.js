import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DataPointSchema = new Schema({
    pregnancyId: { type: Schema.Types.ObjectId, ref: 'Pregnancy', required: true },
    type: { type: String, required: true, enum: ['finding', 'result'] },
    description: String, // For findings
    result: String, // For results
    date: Date,
    image: String // For findings
});

const DataPoint = mongoose.model('DataPoint', DataPointSchema);
export default DataPoint;

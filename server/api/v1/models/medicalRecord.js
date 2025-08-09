import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MedicalRecordSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  date: Date,
  timeIn: String,
  timeOut: String,

  gravida: Number,
  para: Number,
  abortion: Number,
  delivery: Number,
  lastMenstrualPeriod: Date,
  expectedDueDate: Date,
  ageAtMenarche: Number,
  antenatalVisitNumber: {
    type: Number,
    enum: [1, 2, 3],
  },

  nvd: Boolean,
  nvdNumber: Number,
  complications: [String],
  cesareanSection: Boolean,
  cesareanCount: Number,
  cesareanIndication: String,
  cesareanComplication: String,

  chiefComplaint: String,
  historyPresentIllness: String,

  medicalHistory: {
    hypertension: Boolean,
    diabetes: Boolean,
    asthma: Boolean,
    epilepsy: Boolean,
    heartDisease: Boolean,
    spotting: Boolean,
    tuberculosis: Boolean,
  },

  familyPlanning: {
    uses: Boolean,
    method: String,
  },

  immunizations: [String],

  physicalExam: {
    generalAppearance: [String],
    weight: Number,
    height: Number,
    bloodPressure: String,
    pulse: Number,
    respiratoryRate: Number,
    temperature: Number,
    edemaLevel: String,
    anasarca: Boolean,
  },

  sheet: {
    fundusHeight: Number,
    anyScars: String,
    fetalHeartTone: String,
    lie: String,
    presentingPart: String,
    shotNote: String,
  },

  labs: [
    {
      visitNumber: Number,
      hgb: String,
      m_s: String,
      u_a: String,
      fbsRbs: String,
      rpr: String,
      spot: String,
      others: String,
    },
  ],

  medication: {
    prenatal: [String],
    antibiotic: String,
    analgesics: String,
    others: String,
  },

  followUp: {
    nextVisitDate: Date,
    screenerName: String,
    qualification: String,
    signedBy: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

MedicalRecordSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const MedicalRecord = mongoose.model("MedicalRecord", MedicalRecordSchema);
export default MedicalRecord;

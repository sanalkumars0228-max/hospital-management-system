const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    phone: { type: String, required: true },
    address: { type: String },
    bloodGroup: { type: String },
    status: { type: String, enum: ['Admitted', 'Outpatient', 'Discharged'], default: 'Outpatient' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);

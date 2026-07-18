const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    experienceYears: { type: Number, default: 0 },
    availability: { type: String, enum: ['Available', 'On Leave', 'In Surgery'], default: 'Available' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);

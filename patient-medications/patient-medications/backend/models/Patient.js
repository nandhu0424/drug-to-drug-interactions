const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  allergies: [{ type: String }],
  diseases: [{ type: String }],
  medications: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  lastAnalyzed: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);

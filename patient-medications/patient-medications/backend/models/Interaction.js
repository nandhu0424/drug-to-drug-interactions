const mongoose = require('mongoose');

const InteractionSchema = new mongoose.Schema({
  drug1: { type: String, required: true },
  drug2: { type: String, required: true },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true
  },
  interactionType: { type: String },
  description: { type: String, required: true },
  mechanism: { type: String },
  recommendation: { type: String },
  evidenceLevel: { type: String, enum: ['Theoretical', 'Case Reports', 'Study', 'Established'] }
}, { timestamps: true });

// Ensure each drug pair is stored once (regardless of order)
InteractionSchema.index({ drug1: 1, drug2: 1 }, { unique: false });

module.exports = mongoose.model('Interaction', InteractionSchema);

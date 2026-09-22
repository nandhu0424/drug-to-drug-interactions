const mongoose = require('mongoose');

const DrugSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  genericName: { type: String },
  category: { type: String, required: true },
  description: { type: String },
  sideEffects: [{ type: String }],
  contraindications: [{ type: String }],
  interactions: [{ type: String }],
  dosageForm: { type: String }
}, { timestamps: true });

DrugSchema.index({ name: 'text', genericName: 'text', category: 'text' });

module.exports = mongoose.model('Drug', DrugSchema);

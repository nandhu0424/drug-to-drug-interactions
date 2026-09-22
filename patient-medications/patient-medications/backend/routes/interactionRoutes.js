const express = require('express');
const router = express.Router();
const axios = require('axios');
const Interaction = require('../models/Interaction');
const Patient = require('../models/Patient');

// Analyze drug interactions for a patient's medication list
router.post('/analyze', async (req, res) => {
  try {
    const { medications, age, gender, diseases, allergies, patientId } = req.body;

    if (!medications || medications.length < 1) {
      return res.status(400).json({ success: false, error: 'Please provide at least one medication' });
    }

    // 1. Fetch known interactions from DB
    const knownInteractions = [];
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const drug1 = medications[i].toLowerCase();
        const drug2 = medications[j].toLowerCase();

        const interaction = await Interaction.findOne({
          $or: [
            { drug1: { $regex: drug1, $options: 'i' }, drug2: { $regex: drug2, $options: 'i' } },
            { drug1: { $regex: drug2, $options: 'i' }, drug2: { $regex: drug1, $options: 'i' } }
          ]
        });

        if (interaction) {
          knownInteractions.push(interaction);
        }
      }
    }

    // 2. Call Python ML service for personalized risk prediction
    let mlPrediction = null;
    try {
      const mlResponse = await axios.post(
        `${process.env.ML_SERVICE_URL}/predict`,
        { medications, age, gender, diseases: diseases || [], allergies: allergies || [] },
        { timeout: 10000 }
      );
      mlPrediction = mlResponse.data;
    } catch (mlErr) {
      console.warn('⚠️ ML service unavailable, using rule-based fallback:', mlErr.message);
      // Fallback: derive risk from known interactions
      const severityOrder = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 };
      let maxSeverity = 'Low';
      for (const interaction of knownInteractions) {
        if (severityOrder[interaction.severity] > severityOrder[maxSeverity]) {
          maxSeverity = interaction.severity;
        }
      }
      mlPrediction = {
        overallRisk: maxSeverity,
        riskScore: severityOrder[maxSeverity] * 25,
        confidence: 0.7,
        source: 'rule-based-fallback',
        recommendations: [
          'Consult with a clinical pharmacist',
          'Monitor patient vitals closely',
          'Review medication timing and dosage'
        ]
      };
    }

    // 3. Update patient's lastAnalyzed field
    if (patientId) {
      await Patient.findByIdAndUpdate(patientId, { lastAnalyzed: new Date() });
    }

    res.json({
      success: true,
      data: {
        medications,
        patient: { age, gender, diseases, allergies },
        knownInteractions,
        mlPrediction,
        analyzedAt: new Date()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all known interactions
router.get('/', async (req, res) => {
  try {
    const interactions = await Interaction.find().sort({ severity: -1 });
    res.json({ success: true, count: interactions.length, data: interactions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get interaction rules from ML service
router.get('/rules', async (req, res) => {
  try {
    const mlResponse = await axios.get(`${process.env.ML_SERVICE_URL}/rules`, { timeout: 8000 });
    res.json({ success: true, data: mlResponse.data });
  } catch (err) {
    res.status(503).json({ success: false, error: 'ML service unavailable', details: err.message });
  }
});

module.exports = router;

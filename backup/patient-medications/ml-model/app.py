from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import json
import numpy as np
import os

app = Flask(__name__)
CORS(app)

MODEL_DIR = 'model'

# ── Load model artifacts ──────────────────────────────────────────────────────
def load_artifacts():
    global rf_model, scaler, le_severity, le_age, le_gender, le_type, assoc_rules, model_info
    try:
        rf_model    = joblib.load(f'{MODEL_DIR}/drug_risk_model.pkl')
        scaler      = joblib.load(f'{MODEL_DIR}/scaler.pkl')
        le_severity = joblib.load(f'{MODEL_DIR}/label_encoder.pkl')
        le_age      = joblib.load(f'{MODEL_DIR}/age_encoder.pkl')
        le_gender   = joblib.load(f'{MODEL_DIR}/gender_encoder.pkl')
        le_type     = joblib.load(f'{MODEL_DIR}/type_encoder.pkl')
        with open(f'{MODEL_DIR}/association_rules.json') as f:
            assoc_rules = json.load(f)
        with open(f'{MODEL_DIR}/model_info.json') as f:
            model_info = json.load(f)
        print("✅ ML model artifacts loaded successfully")
        return True
    except FileNotFoundError:
        print("⚠️  Model not found. Run 'python train_model.py' first.")
        return False

MODEL_LOADED = load_artifacts()

# ── Helper: map age to group ──────────────────────────────────────────────────
def age_to_group(age):
    if age < 18:
        return 'child'
    elif age < 65:
        return 'adult'
    else:
        return 'elderly'

# ── Helper: encode age group safely ───────────────────────────────────────────
def safe_encode(encoder, value, default=1):
    try:
        return int(encoder.transform([value])[0])
    except ValueError:
        return default

# ── Routes ─────────────────────────────────────────────────────────────────────

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'OK',
        'model_loaded': MODEL_LOADED,
        'model_info': model_info if MODEL_LOADED else None
    })

@app.route('/predict', methods=['POST'])
def predict():
    if not MODEL_LOADED:
        return jsonify({'error': 'Model not loaded. Run train_model.py first.'}), 503

    data = request.json
    medications = data.get('medications', [])
    age         = data.get('age', 40)
    gender      = data.get('gender', 'Male')
    diseases    = [d.lower() for d in data.get('diseases', [])]
    allergies   = data.get('allergies', [])

    if len(medications) < 1:
        return jsonify({'error': 'At least one medication required'}), 400

    # ── Feature engineering ───────────────────────────────────────────────────
    age_group = age_to_group(age)
    num_meds  = len(medications)
    has_renal   = int(any(d in diseases for d in ['renal disease', 'kidney disease', 'chronic kidney disease', 'ckd']))
    has_liver   = int(any(d in diseases for d in ['liver disease', 'hepatic disease', 'cirrhosis', 'hepatitis']))
    has_cardiac = int(any(d in diseases for d in ['heart disease', 'cardiac disease', 'heart failure', 'coronary artery disease', 'atrial fibrillation']))
    has_diabetes = int(any(d in diseases for d in ['diabetes', 'type 2 diabetes', 'type 1 diabetes', 'diabetes mellitus']))

    age_enc    = safe_encode(le_age, age_group, 1)
    gender_enc = safe_encode(le_gender, gender, 0)
    type_enc   = 1  # default Pharmacokinetic

    features = np.array([[age_enc, gender_enc, num_meds,
                           has_renal, has_liver, has_cardiac,
                           has_diabetes, type_enc]])
    features_scaled = scaler.transform(features)

    # ── Predict risk ──────────────────────────────────────────────────────────
    predicted_class = rf_model.predict(features_scaled)[0]
    probabilities   = rf_model.predict_proba(features_scaled)[0]
    severity        = le_severity.inverse_transform([predicted_class])[0]

    # Risk score (0-100)
    severity_weights = {'Low': 15, 'Medium': 40, 'High': 70, 'Critical': 95}
    risk_score = severity_weights.get(severity, 50)

    # Confidence of predicted class
    confidence = float(max(probabilities))

    # Class probabilities
    class_probs = {cls: round(float(prob), 3)
                   for cls, prob in zip(le_severity.classes_, probabilities)}

    # ── Recommendations ───────────────────────────────────────────────────────
    recommendations = {
        'Low':      ['Continue current medication regime', 'Schedule routine follow-up in 3 months', 'Educate patient on warning signs'],
        'Medium':   ['Monitor patient closely for 2-4 weeks', 'Consult clinical pharmacist for dose adjustment', 'Review medication timing and administration', 'Alert patient to report any unusual symptoms'],
        'High':     ['Consider alternative medications', 'Urgent clinical pharmacist consultation required', 'Increase monitoring frequency', 'Review all medications for necessity', 'Monitor renal/hepatic function if applicable'],
        'Critical': ['⚠️ IMMEDIATE clinical review required', 'Discontinue or substitute one of the conflicting drugs', 'Emergency monitoring protocol activated', 'Document interaction in patient record', 'Consider hospital admission if symptomatic', 'Contact prescribing physician immediately']
    }

    return jsonify({
        'overallRisk': severity,
        'riskScore': risk_score,
        'confidence': round(confidence, 3),
        'classProbabilities': class_probs,
        'patientFactors': {
            'ageGroup': age_group,
            'numMedications': num_meds,
            'hasRenalDisease': bool(has_renal),
            'hasLiverDisease': bool(has_liver),
            'hasCardiacDisease': bool(has_cardiac),
            'hasDiabetes': bool(has_diabetes)
        },
        'recommendations': recommendations.get(severity, []),
        'source': 'ml-model'
    })

@app.route('/rules', methods=['GET'])
def get_rules():
    if not MODEL_LOADED:
        return jsonify({'error': 'Model not loaded'}), 503
    limit = int(request.args.get('limit', 20))
    return jsonify({
        'total': len(assoc_rules),
        'rules': assoc_rules[:limit],
        'modelInfo': model_info
    })

if __name__ == '__main__':
    print("🚀 Drug Interaction ML Service starting on port 5001...")
    app.run(debug=True, host='0.0.0.0', port=5001)

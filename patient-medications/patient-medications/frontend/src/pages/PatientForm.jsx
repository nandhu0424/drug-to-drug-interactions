import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import DrugSearch from '../components/DrugSearch'
import './PatientForm.css'

const COMMON_DISEASES = ['Hypertension','Type 2 Diabetes','Heart Failure','Cardiac Disease','Renal Disease','Liver Disease','Atrial Fibrillation','Asthma / COPD','Thyroid Disease','Peptic Ulcer','Epilepsy / Seizures','Osteoporosis','Depression / Anxiety','Bipolar Disorder','Cancer','Chronic Kidney Disease']
const COMMON_ALLERGIES = ['Penicillin','Sulfa Drugs','Aspirin / NSAIDs','Codeine','Latex','Contrast Dye','Iodine']

export default function PatientForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '', age: '', gender: 'Male',
    allergies: [], diseases: [], medications: []
  })
  const [allergyInput, setAllergyInput] = useState('')
  const [step, setStep] = useState(1)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggle = (key, val) =>
    set(key, form[key].includes(val) ? form[key].filter(x => x !== val) : [...form[key], val])
  const addTag = (key, val) => { if (val.trim() && !form[key].includes(val.trim())) set(key, [...form[key], val.trim()]) }
  const removeTag = (key, val) => set(key, form[key].filter(x => x !== val))

  async function handleSubmit() {
    if (form.medications.length === 0) { setError('Please add at least one medication'); return }
    if (!form.age) { setError('Please enter patient age'); return }
    setLoading(true); setError('')
    try {
      // Save patient
      let patientId
      if (form.name) {
        const pRes = await api.createPatient(form)
        patientId = pRes.data.data._id
      }

      // Analyze interactions
      const res = await api.analyzeInteractions({
        medications: form.medications,
        age: parseInt(form.age),
        gender: form.gender,
        diseases: form.diseases,
        allergies: form.allergies,
        patientId
      })

      // Increment local analysis counter
      const count = parseInt(localStorage.getItem('analyses') || 0) + 1
      localStorage.setItem('analyses', count)

      navigate('/results', { state: { result: res.data.data, patient: form } })
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Make sure backend is running.')
    } finally { setLoading(false) }
  }

  return (
    <div className="page">
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <h1 className="page-title">⚗ Drug Interaction Analysis</h1>
        <p className="page-subtitle">Enter patient details to analyze personalized drug interaction risks</p>

        {/* Step Indicator */}
        <div className="step-indicator">
          {['Patient Info','Medical History','Medications'].map((s, i) => (
            <div key={s} className={`step-item ${step === i+1 ? 'active' : ''} ${step > i+1 ? 'done' : ''}`} onClick={() => setStep(i+1)}>
              <div className="step-circle">{step > i+1 ? '✓' : i+1}</div>
              <div className="step-label">{s}</div>
            </div>
          ))}
          <div className="step-line" />
        </div>

        {/* Step 1 – Patient Info */}
        {step === 1 && (
          <div className="card" style={{ padding: 32 }}>
            <div className="section-header"><div className="section-icon">👤</div>Patient Information</div>
            <div className="grid-2" style={{ gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Full Name (optional)</label>
                <input className="form-input" placeholder="e.g. John Doe" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Age *</label>
                <input className="form-input" type="number" placeholder="e.g. 65" min={1} max={120} value={form.age} onChange={e => set('age', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select className="form-select" value={form.gender} onChange={e => set('gender', e.target.value)}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => setStep(2)}>Next: Medical History →</button>
            </div>
          </div>
        )}

        {/* Step 2 – Medical History */}
        {step === 2 && (
          <div className="card" style={{ padding: 32 }}>
            <div className="section-header"><div className="section-icon">🏥</div>Medical History</div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">Existing Conditions (select all that apply)</label>
              <div className="checkbox-grid">
                {COMMON_DISEASES.map(d => (
                  <label key={d} className={`checkbox-pill ${form.diseases.includes(d) ? 'checked' : ''}`}>
                    <input type="checkbox" style={{ display: 'none' }} checked={form.diseases.includes(d)} onChange={() => toggle('diseases', d)} />
                    {d}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Known Allergies</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {COMMON_ALLERGIES.map(a => (
                  <label key={a} className={`checkbox-pill ${form.allergies.includes(a) ? 'checked' : ''}`}>
                    <input type="checkbox" style={{ display: 'none' }} checked={form.allergies.includes(a)} onChange={() => toggle('allergies', a)} />
                    {a}
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="form-input" placeholder="Add custom allergy..." value={allergyInput} onChange={e => setAllergyInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { addTag('allergies', allergyInput); setAllergyInput('') }}} />
                <button className="btn btn-outline" onClick={() => { addTag('allergies', allergyInput); setAllergyInput('') }}>+ Add</button>
              </div>
              {form.allergies.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                  {form.allergies.map(a => (
                    <span key={a} className="tag">🚫 {a}<span className="tag-remove" onClick={() => removeTag('allergies', a)}>×</span></span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'space-between' }}>
              <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>Next: Medications →</button>
            </div>
          </div>
        )}

        {/* Step 3 – Medications */}
        {step === 3 && (
          <div className="card" style={{ padding: 32 }}>
            <div className="section-header"><div className="section-icon">💊</div>Current Medications</div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Search and Add Medications</label>
              <DrugSearch onAdd={name => addTag('medications', name)} selected={form.medications} />
            </div>

            {form.medications.length > 0 ? (
              <div className="med-list">
                {form.medications.map((med, i) => (
                  <div key={med} className="med-item">
                    <span className="med-num">{i + 1}</span>
                    <span className="med-icon">💊</span>
                    <span className="med-name">{med}</span>
                    <button className="med-remove" onClick={() => removeTag('medications', med)}>×</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-meds">
                <div style={{ fontSize: 40, marginBottom: 8 }}>💊</div>
                <p>No medications added yet. Search above to add.</p>
              </div>
            )}

            {error && <div className="error-box">⚠️ {error}</div>}

            <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'space-between' }}>
              <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ padding: '12px 32px', fontSize: 15 }}>
                {loading ? '⏳ Analyzing...' : '🔍 Analyze Interactions'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

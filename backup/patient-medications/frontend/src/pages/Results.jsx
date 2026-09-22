import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import RiskBadge from '../components/RiskBadge'
import './Results.css'

const SEV_ORDER = { Critical: 4, High: 3, Medium: 2, Low: 1 }

export default function Results() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [animScore, setAnimScore] = useState(0)

  const result  = state?.result
  const patient = state?.patient

  useEffect(() => {
    if (!result) return
    const target = result.mlPrediction?.riskScore || 0
    let v = 0
    const interval = setInterval(() => {
      v = Math.min(v + 2, target)
      setAnimScore(v)
      if (v >= target) clearInterval(interval)
    }, 20)
    return () => clearInterval(interval)
  }, [result])

  if (!result) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔬</div>
        <h2 style={{ marginBottom: 12 }}>No analysis results yet</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>Start a new analysis to see drug interaction results</p>
        <Link to="/analyze" className="btn btn-primary">⚗ Start Analysis</Link>
      </div>
    )
  }

  const ml = result.mlPrediction
  const interactions = result.knownInteractions || []
  const risk = ml?.overallRisk || 'Low'
  const sortedInteractions = [...interactions].sort((a, b) => (SEV_ORDER[b.severity] || 0) - (SEV_ORDER[a.severity] || 0))

  const riskColor = {
    Low: 'var(--risk-low)', Medium: 'var(--risk-medium)',
    High: 'var(--risk-high)', Critical: 'var(--risk-critical)'
  }[risk] || 'var(--risk-low)'

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">Analysis Results</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>
            {patient?.name ? `Patient: ${patient.name} · ` : ''}
            {patient?.age} yrs · {patient?.gender} · {result.medications?.length || 0} medication(s)
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-outline" onClick={() => window.print()}>🖨️ Print</button>
          <Link to="/analyze" className="btn btn-primary">⚗ New Analysis</Link>
        </div>
      </div>

      {/* Risk Summary Hero */}
      <div className="results-hero card" style={{ borderColor: riskColor, background: `linear-gradient(135deg, var(--color-surface), ${riskColor}10)` }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Overall Risk Level</div>
            <RiskBadge risk={risk} size="lg" />
            <div style={{ marginTop: 16, fontSize: 13, color: 'var(--color-text-muted)' }}>
              AI Confidence: <strong style={{ color: 'var(--color-text)' }}>{Math.round((ml?.confidence || 0.7) * 100)}%</strong>
              {ml?.source === 'rule-based-fallback' && <span style={{ marginLeft: 8, opacity: 0.7 }}>(rule-based)</span>}
            </div>
          </div>

          {/* Risk Score Gauge */}
          <div className="risk-gauge">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="60" fill="none" stroke="var(--color-border)" strokeWidth="10" />
              <circle cx="70" cy="70" r="60" fill="none" stroke={riskColor} strokeWidth="10"
                strokeDasharray={`${(animScore / 100) * 2 * Math.PI * 60} ${2 * Math.PI * 60}`}
                strokeDashoffset={2 * Math.PI * 60 * 0.25}
                strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.05s' }}
              />
              <text x="70" y="66" textAnchor="middle" fontSize="28" fontWeight="800" fill={riskColor}>{animScore}</text>
              <text x="70" y="84" textAnchor="middle" fontSize="11" fill="var(--color-text-muted)">Risk Score</text>
            </svg>
          </div>

          {/* Class probabilities */}
          {ml?.classProbabilities && (
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Risk Probabilities</div>
              {Object.entries(ml.classProbabilities)
                .sort((a, b) => b[1] - a[1])
                .map(([cls, prob]) => (
                  <div key={cls} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                      <span>{cls}</span>
                      <span style={{ fontWeight: 700, color: riskColor }}>{(prob * 100).toFixed(1)}%</span>
                    </div>
                    <div className="progress-bar" style={{ height: 5 }}>
                      <div className="progress-fill" style={{ width: `${prob * 100}%`, background: riskColor }} />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Medications list */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-header"><div className="section-icon">💊</div>Analyzed Medications ({result.medications?.length || 0})</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(result.medications || []).map(m => (
            <span key={m} className="tag" style={{ fontSize: 14, padding: '6px 14px' }}>💊 {m}</span>
          ))}
        </div>
      </div>

      {/* Interactions Found */}
      {sortedInteractions.length > 0 ? (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="section-header">
            <div className="section-icon">⚠️</div>
            Drug Interactions Found ({sortedInteractions.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sortedInteractions.map((inter, i) => (
              <div key={i} className={`interaction-card sev-${inter.severity.toLowerCase()}`}>
                <div className="interaction-drugs">
                  <span className="drug-pill">{inter.drug1}</span>
                  <span className="interaction-arrow">⇄</span>
                  <span className="drug-pill">{inter.drug2}</span>
                  <div style={{ marginLeft: 'auto' }}>
                    <RiskBadge risk={inter.severity} size="sm" />
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--color-text-light)', margin: '8px 0 4px' }}>{inter.description}</p>
                {inter.recommendation && (
                  <div style={{ fontSize: 12, padding: '10px 14px', background: 'var(--color-primary-dim)', borderRadius: 8, borderLeft: '3px solid var(--color-primary)', color: 'var(--color-text)' }}>
                    💡 <strong>Recommendation:</strong> {inter.recommendation}
                  </div>
                )}
                {inter.evidenceLevel && (
                  <div style={{ marginTop: 6, fontSize: 11, color: 'var(--color-text-muted)' }}>
                    Evidence: {inter.evidenceLevel} · Type: {inter.interactionType || 'N/A'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: 40, marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>✅</div>
          <h3 style={{ marginBottom: 8 }}>No Known Interactions Found</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>No direct drug interactions were found in our database for this combination.</p>
        </div>
      )}

      {/* Recommendations */}
      {ml?.recommendations?.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="section-header"><div className="section-icon">📋</div>Clinical Recommendations</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ml.recommendations.map((rec, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 14px', background: 'var(--color-surface-2)', borderRadius: 8 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{i === 0 && risk === 'Critical' ? '🚨' : '💡'}</span>
                <span style={{ fontSize: 14 }}>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patient Factors */}
      {ml?.patientFactors && (
        <div className="card">
          <div className="section-header"><div className="section-icon">👤</div>Risk Factors Analyzed</div>
          <div className="grid-4">
            {[
              { label: 'Age Group', value: ml.patientFactors.ageGroup || '—', icon: '🎂' },
              { label: 'Medications', value: ml.patientFactors.numMedications, icon: '💊' },
              { label: 'Renal Disease', value: ml.patientFactors.hasRenalDisease ? 'Yes ⚠️' : 'No', icon: '🫘' },
              { label: 'Cardiac Disease', value: ml.patientFactors.hasCardiacDisease ? 'Yes ⚠️' : 'No', icon: '❤️' },
            ].map(f => (
              <div key={f.label} style={{ textAlign: 'center', padding: '16px 8px', background: 'var(--color-surface-2)', borderRadius: 10 }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{f.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{String(f.value)}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

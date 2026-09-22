import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import './Dashboard.css'

const STAT_CARDS = [
  { icon: '👥', label: 'Total Patients', key: 'patients', color: '#00d4ff' },
  { icon: '💊', label: 'Drugs in DB',    key: 'drugs',    color: '#7c3aed' },
  { icon: '⚠️',  label: 'Interactions',  key: 'interactions', color: '#f59e0b' },
  { icon: '🤖', label: 'AI Analyses',   key: 'analyses',  color: '#10b981' },
]

const RISK_BREAKDOWN = [
  { label: 'Low Risk',      color: 'var(--risk-low)',      pct: 35 },
  { label: 'Medium Risk',   color: 'var(--risk-medium)',   pct: 28 },
  { label: 'High Risk',     color: 'var(--risk-high)',     pct: 22 },
  { label: 'Critical Risk', color: 'var(--risk-critical)', pct: 15 },
]

export default function Dashboard() {
  const [stats, setStats] = useState({ patients:0, drugs:0, interactions:0, analyses:0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let analyses = parseInt(localStorage.getItem('analyses') || 0)
    Promise.allSettled([
      api.getPatients(),
      api.getDrugs(),
      api.getInteractions()
    ]).then(([p, d, i]) => {
      setStats({
        patients:     p.status === 'fulfilled' ? p.value.data.count : '—',
        drugs:        d.status === 'fulfilled' ? d.value.data.count : '—',
        interactions: i.status === 'fulfilled' ? i.value.data.count : '—',
        analyses
      })
      setLoading(false)
    })
  }, [])

  return (
    <div className="page">
      {/* Hero */}
      <div className="dashboard-hero">
        <div className="hero-badge">🤖 AI-Powered Analysis</div>
        <h1 className="page-title">
          Drug Interaction <span className="gradient-text">Risk Analyzer</span>
        </h1>
        <p className="page-subtitle" style={{ maxWidth: 560 }}>
          Personalized AI-powered drug interaction detection for doctors and pharmacists.
          Identify critical interactions before they reach your patient.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/analyze" className="btn btn-primary" style={{ fontSize: 15, padding: '12px 28px' }}>
            ⚗ Start New Analysis
          </Link>
          <Link to="/patients" className="btn btn-outline" style={{ fontSize: 15, padding: '12px 28px' }}>
            👥 View Patients
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {STAT_CARDS.map(card => (
          <div key={card.key} className="card stat-card">
            <div className="stat-icon" style={{ '--c': card.color }}>{card.icon}</div>
            <div className="stat-value" style={{ color: card.color }}>
              {loading ? <span className="stat-loading">…</span> : stats[card.key]}
            </div>
            <div className="stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Risk Breakdown + CTA grid */}
      <div className="grid-2" style={{ marginBottom: 32 }}>
        {/* Risk chart */}
        <div className="card">
          <div className="section-header">
            <div className="section-icon">📊</div>
            Analysis Risk Distribution
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {RISK_BREAKDOWN.map(r => (
              <div key={r.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{r.label}</span>
                  <span style={{ fontSize: 13, color: r.color, fontWeight: 700 }}>{r.pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${r.pct}%`, background: r.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="card">
          <div className="section-header">
            <div className="section-icon">⚡</div>
            How It Works
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { step: '01', title: 'Enter Patient Profile', desc: 'Age, gender, diseases, allergies & medications' },
              { step: '02', title: 'AI Analysis',           desc: 'ML model + association rules analyze interactions' },
              { step: '03', title: 'Risk Classification',   desc: 'Results classified as Low, Medium, High or Critical' },
              { step: '04', title: 'Recommendations',        desc: 'Clinical recommendations for each risk level' },
            ].map(step => (
              <div key={step.step} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ background: 'var(--color-primary-dim)', color: 'var(--color-primary)', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{step.step}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{step.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Supported drug classes */}
      <div className="card">
        <div className="section-header">
          <div className="section-icon">💊</div>
          Supported Drug Categories (30+ Drug Classes)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['Anticoagulants','NSAIDs','Beta Blockers','ACE Inhibitors','Statins','Antiarrhythmics','Antidiabetics','SSRIs','Calcium Channel Blockers','Loop Diuretics','Antifungals','Antibiotics','Mood Stabilizers','Anticonvulsants','Immunosuppressants','Cardiac Glycosides','Fibrates','Opioid Analgesics','Thyroid Hormones','Bronchodilators'].map(c => (
            <span key={c} className="tag" style={{ background: 'var(--color-primary-dim)', borderColor: 'rgba(0,212,255,0.2)' }}>{c}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

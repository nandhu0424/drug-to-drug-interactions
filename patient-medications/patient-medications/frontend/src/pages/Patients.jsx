import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import RiskBadge from '../components/RiskBadge'

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.getPatients()
      .then(res => { setPatients(res.data.data || []); setLoading(false) })
      .catch(() => { setPatients([]); setLoading(false) })
  }, [])

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.medications?.some(m => m.toLowerCase().includes(search.toLowerCase()))
  )

  async function deletePatient(id) {
    if (!confirm('Delete this patient?')) return
    await api.deletePatient(id)
    setPatients(ps => ps.filter(p => p._id !== id))
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">👥 Patients</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Manage patient profiles and medication histories</p>
        </div>
        <Link to="/analyze" className="btn btn-primary">+ New Patient Analysis</Link>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
        <input
          className="form-input"
          style={{ paddingLeft: 42, maxWidth: 400 }}
          placeholder="Search by name or medication..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="spinner" />
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>👤</div>
          <h3 style={{ marginBottom: 8 }}>{search ? 'No patients match your search' : 'No patients yet'}</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 24, fontSize: 14 }}>
            {search ? 'Try a different search term' : 'Start an analysis to automatically save patient data'}
          </p>
          <Link to="/analyze" className="btn btn-primary">⚗ Start First Analysis</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(patient => (
            <div key={patient._id} className="card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {patient.gender === 'Female' ? '👩‍⚕️' : '👨‍⚕️'}
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{patient.name || 'Anonymous Patient'}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                    {patient.age} yrs · {patient.gender}
                    {patient.diseases?.length > 0 && ` · ${patient.diseases.slice(0,2).join(', ')}${patient.diseases.length > 2 ? '...' : ''}`}
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, flex: 1 }}>
                  {(patient.medications || []).slice(0, 4).map(m => (
                    <span key={m} className="tag" style={{ fontSize: 12 }}>💊 {m}</span>
                  ))}
                  {patient.medications?.length > 4 && (
                    <span className="tag" style={{ fontSize: 12 }}>+{patient.medications.length - 4} more</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'right', flexShrink: 0 }}>
                  <div>{new Date(patient.createdAt).toLocaleDateString()}</div>
                  {patient.lastAnalyzed && <div style={{ color: 'var(--risk-low)' }}>✓ Analyzed</div>}
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <Link to="/analyze" className="btn btn-outline" style={{ fontSize: 12, padding: '6px 12px' }}>⚗ Re-analyze</Link>
                  <button className="btn btn-outline" style={{ fontSize: 12, padding: '6px 12px', color: 'var(--risk-high)', borderColor: 'rgba(239,68,68,0.3)' }} onClick={() => deletePatient(patient._id)}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

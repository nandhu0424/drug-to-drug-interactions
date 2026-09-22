import React, { useState, useEffect, useRef } from 'react'
import { api } from '../services/api'

export default function DrugSearch({ onAdd, selected = [] }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await api.searchDrugs(query)
        setResults(res.data.data || [])
        setOpen(true)
      } catch {
        // If backend unavailable, show common drugs matching query
        const common = ['Warfarin','Aspirin','Ibuprofen','Metformin','Lisinopril','Atorvastatin','Amiodarone','Digoxin','Metoprolol','Simvastatin','Amlodipine','Clopidogrel','Omeprazole','Fluoxetine','Tramadol','Carbamazepine','Clarithromycin','Furosemide','Lithium','Tacrolimus','Levothyroxine','Heparin','Verapamil','Rifampin','Fluconazole']
        setResults(common.filter(d => d.toLowerCase().includes(query.toLowerCase())).map(d => ({ name: d, category: 'Drug' })))
        setOpen(true)
      } finally { setLoading(false) }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  function handleSelect(drug) {
    if (!selected.includes(drug.name)) onAdd(drug.name)
    setQuery('')
    setResults([])
    setOpen(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && query.trim()) {
      if (results.length > 0) handleSelect(results[0])
      else { onAdd(query.trim()); setQuery(''); setOpen(false) }
    }
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
        <input
          className="form-input"
          style={{ paddingLeft: 38 }}
          placeholder="Search drug name (e.g. Warfarin)..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
        />
        {loading && (
          <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--color-text-muted)' }}>...</span>
        )}
      </div>

      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '110%', left: 0, right: 0, zIndex: 50,
          background: '#ffffff',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          maxHeight: 260, overflowY: 'auto',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {results.map((drug, i) => (
            <div
              key={i}
              onClick={() => handleSelect(drug)}
              style={{
                padding: '12px 16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
                borderBottom: '1px solid var(--color-border)',
                transition: 'background 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-dim)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 20 }}>💊</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)' }}>{drug.name}</div>
                {drug.category && <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{drug.category}</div>}
              </div>
              {selected.includes(drug.name) && (
                <span style={{ color: 'var(--color-primary)', fontSize: 12, fontWeight: 600 }}>✓ Added</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

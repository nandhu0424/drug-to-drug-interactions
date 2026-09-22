import React from 'react'

const RISK_CONFIG = {
  Low:      { icon: '🟢', label: 'Low Risk',      class: 'risk-low' },
  Medium:   { icon: '🟡', label: 'Medium Risk',   class: 'risk-medium' },
  High:     { icon: '🔴', label: 'High Risk',      class: 'risk-high' },
  Critical: { icon: '⚫', label: 'Critical Risk',  class: 'risk-critical' },
}

export default function RiskBadge({ risk, size = 'md', showScore, score }) {
  const config = RISK_CONFIG[risk] || RISK_CONFIG['Low']

  const styles = {
    sm: { padding: '3px 10px', fontSize: '12px', gap: '5px' },
    md: { padding: '6px 14px', fontSize: '14px', gap: '6px' },
    lg: { padding: '10px 20px', fontSize: '18px', gap: '8px', fontWeight: 700 },
  }

  return (
    <span className={`tag ${config.class}`} style={{ ...styles[size], display: 'inline-flex', alignItems: 'center', borderRadius: '999px', border: '1px solid', fontWeight: 600 }}>
      <span style={{ fontSize: size === 'lg' ? 22 : 16 }}>{config.icon}</span>
      {config.label}
      {showScore && score !== undefined && (
        <span style={{ opacity: 0.7, fontSize: '12px', marginLeft: 4 }}>({score}%)</span>
      )}
    </span>
  )
}

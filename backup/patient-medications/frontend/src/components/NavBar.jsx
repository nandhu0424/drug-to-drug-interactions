import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './NavBar.css'

export default function NavBar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { to: '/', label: 'Dashboard', icon: '⬡' },
    { to: '/analyze', label: 'Analyze', icon: '⚗' },
    { to: '/patients', label: 'Patients', icon: '👤' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">💊</span>
          <span className="brand-name">DrugSafe <span className="brand-ai">AI</span></span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link ${location.pathname === l.to ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-icon">{l.icon}</span>
              {l.label}
            </Link>
          ))}
          <Link to="/analyze" className="btn btn-primary nav-cta">
            + New Analysis
          </Link>
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}

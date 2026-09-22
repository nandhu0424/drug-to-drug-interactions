import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import PatientForm from './pages/PatientForm'
import Results from './pages/Results'
import Patients from './pages/Patients'

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analyze" element={<PatientForm />} />
        <Route path="/results" element={<Results />} />
        <Route path="/patients" element={<Patients />} />
      </Routes>
    </BrowserRouter>
  )
}

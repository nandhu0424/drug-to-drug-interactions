import axios from 'axios'

const BASE = '/api'  // proxied through Vite to localhost:5000

export const api = {
  // Patients
  getPatients: ()          => axios.get(`${BASE}/patients`),
  getPatient:  (id)        => axios.get(`${BASE}/patients/${id}`),
  createPatient: (data)    => axios.post(`${BASE}/patients`, data),
  deletePatient: (id)      => axios.delete(`${BASE}/patients/${id}`),

  // Drugs
  getDrugs:      ()        => axios.get(`${BASE}/drugs`),
  searchDrugs:   (q)       => axios.get(`${BASE}/drugs/search?q=${encodeURIComponent(q)}`),

  // Interactions
  analyzeInteractions: (data) => axios.post(`${BASE}/interactions/analyze`, data),
  getInteractions:     ()    => axios.get(`${BASE}/interactions`),
  getAssociationRules: ()    => axios.get(`${BASE}/interactions/rules`),
}

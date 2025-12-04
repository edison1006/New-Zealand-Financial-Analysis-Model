import { useState, useEffect } from 'react'
import { companyApi } from '../services/api'
import { Company } from '../types'
import './Settings.css'

const REGIONS = [
  'Auckland',
  'Wellington',
  'Christchurch',
  'Hamilton',
  'Tauranga',
  'Dunedin',
  'Palmerston North',
  'Napier',
  'Other',
]

const INDUSTRIES = [
  'Retail',
  'Hospitality',
  'IT',
  'Manufacturing',
  'Construction',
  'Healthcare',
  'Education',
  'Finance',
  'Real Estate',
  'Agriculture',
  'Transport',
  'Other',
]

const Settings = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    region: 'Auckland',
    industry: 'Retail',
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      const data = await companyApi.getAll()
      setCompanies(data)
    } catch (error) {
      console.error('Failed to load companies:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      await companyApi.create(formData)
      setMessage({ type: 'success', text: 'Company created successfully!' })
      setFormData({ name: '', region: 'Auckland', industry: 'Retail' })
      setShowForm(false)
      loadCompanies()
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to create company',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return

    try {
      await companyApi.delete(id)
      setMessage({ type: 'success', text: 'Company deleted successfully!' })
      loadCompanies()
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to delete company',
      })
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Company Settings</h1>
        <button onClick={() => setShowForm(!showForm)} className="add-button">
          {showForm ? 'Cancel' : '+ Add Company'}
        </button>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="settings-card">
          <h2>Create New Company</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Company Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="region">Region</label>
              <select
                id="region"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                required
                disabled={loading}
              >
                {REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="industry">Industry</label>
              <select
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                required
                disabled={loading}
              >
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Creating...' : 'Create Company'}
            </button>
          </form>
        </div>
      )}

      <div className="companies-list">
        <h2>Your Companies</h2>
        {companies.length === 0 ? (
          <p className="empty-message">No companies yet. Create one to get started!</p>
        ) : (
          <div className="companies-grid">
            {companies.map((company) => (
              <div key={company.id} className="company-card">
                <h3>{company.name}</h3>
                <p className="company-info">
                  <span className="label">Region:</span> {company.region}
                </p>
                <p className="company-info">
                  <span className="label">Industry:</span> {company.industry}
                </p>
                <button
                  onClick={() => handleDelete(company.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings


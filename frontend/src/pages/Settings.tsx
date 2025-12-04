import { useState, useEffect } from 'react'
import { companyApi } from '../services/api'
import { Company } from '../types'
import { useLanguage, Language } from '../contexts/LanguageContext'
import { useTheme, Theme } from '../contexts/ThemeContext'
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
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()
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
        <h1>{t('settings.title')}</h1>
        <button onClick={() => setShowForm(!showForm)} className="add-button">
          {showForm ? t('settings.create.button') : t('settings.add.company')}
        </button>
      </div>

      {/* Theme Settings */}
      <div className="settings-card">
        <h2>Theme</h2>
        <div className="theme-selector">
          <button
            className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => setTheme('dark')}
          >
            <div className="theme-preview dark-preview"></div>
            <span>Dark Theme</span>
          </button>
          <button
            className={`theme-option ${theme === 'light' ? 'active' : ''}`}
            onClick={() => setTheme('light')}
          >
            <div className="theme-preview light-preview"></div>
            <span>Light Theme</span>
          </button>
        </div>
      </div>

      {/* Language Settings */}
      <div className="settings-card">
        <h2>{t('settings.language')}</h2>
        <div className="language-selector">
          <button
            className={`language-option ${language === 'en' ? 'active' : ''}`}
            onClick={() => setLanguage('en')}
          >
            {t('settings.language.en')}
          </button>
          <button
            className={`language-option ${language === 'mi' ? 'active' : ''}`}
            onClick={() => setLanguage('mi')}
          >
            {t('settings.language.mi')}
          </button>
          <button
            className={`language-option ${language === 'zh' ? 'active' : ''}`}
            onClick={() => setLanguage('zh')}
          >
            {t('settings.language.zh')}
          </button>
        </div>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="settings-card">
          <h2>{t('settings.create.title')}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">{t('settings.create.name')}</label>
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
              <label htmlFor="region">{t('settings.create.region')}</label>
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
              <label htmlFor="industry">{t('settings.create.industry')}</label>
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
              {loading ? t('settings.create.creating') : t('settings.create.button')}
            </button>
          </form>
        </div>
      )}

      <div className="companies-list">
        <h2>{t('settings.companies.title')}</h2>
        {companies.length === 0 ? (
          <p className="empty-message">{t('settings.companies.empty')}</p>
        ) : (
          <div className="companies-grid">
            {companies.map((company) => (
              <div key={company.id} className="company-card">
                <h3>{company.name}</h3>
                <p className="company-info">
                  <span className="label">{t('settings.create.region')}:</span> {company.region}
                </p>
                <p className="company-info">
                  <span className="label">{t('settings.create.industry')}:</span> {company.industry}
                </p>
                <button
                  onClick={() => handleDelete(company.id)}
                  className="delete-button"
                >
                  {t('settings.delete')}
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


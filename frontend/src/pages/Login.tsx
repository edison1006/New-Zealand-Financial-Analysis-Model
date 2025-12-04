import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import './Auth.css'

const Login = () => {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{t('auth.login')}</h1>
        <p className="subtitle">New Zealand Financial Analytics Platform</p>
        <div style={{ 
          background: 'rgba(123, 47, 247, 0.1)', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem',
          border: '1px solid rgba(123, 47, 247, 0.2)',
          fontSize: '0.85rem',
          color: 'var(--aws-text-secondary)'
        }}>
          <strong>{t('auth.demo.account')}</strong><br />
          {t('auth.email')}: <code style={{ color: 'var(--aws-purple-light)' }}>{t('auth.demo.email')}</code><br />
          {t('auth.password')}: <code style={{ color: 'var(--aws-purple-light)' }}>{t('auth.demo.password')}</code>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{t('auth.email')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? t('auth.logging') : t('auth.login.button')}
          </button>
        </form>
        <p className="auth-link">
          {t('auth.link.register')} <Link to="/register">{t('auth.register')}</Link>
        </p>
      </div>
    </div>
  )
}

export default Login


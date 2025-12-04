import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import './Layout.css'

const Layout = () => {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/dashboard" className="nav-brand">
            NZ Financial Analytics
          </Link>
          <div className="nav-links">
            <Link to="/dashboard">{t('nav.dashboard')}</Link>
            <Link to="/upload">{t('nav.upload')}</Link>
            <Link to="/reports">{t('nav.reports')}</Link>
            <Link to="/settings">{t('nav.settings')}</Link>
            <div className="user-menu">
              <span>{user?.email}</span>
              <button onClick={handleLogout}>{t('nav.logout')}</button>
            </div>
          </div>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout


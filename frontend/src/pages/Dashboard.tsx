import { useState, useEffect } from 'react'
import { companyApi, financialApi } from '../services/api'
import { Company, FinancialAnalysisResponse } from '../types'
import KPICard from '../components/KPICard'
import TrendChart from '../components/TrendChart'
import './Dashboard.css'

const Dashboard = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null)
  const [analysis, setAnalysis] = useState<FinancialAnalysisResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    loadCompanies()
  }, [])

  useEffect(() => {
    if (companies.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0].id)
    }
  }, [companies])

  useEffect(() => {
    if (selectedCompany) {
      loadAnalysis()
    }
  }, [selectedCompany, dateRange])

  const loadCompanies = async () => {
    try {
      const data = await companyApi.getAll()
      setCompanies(data)
    } catch (error) {
      console.error('Failed to load companies:', error)
    }
  }

  const loadAnalysis = async () => {
    if (!selectedCompany) return

    setLoading(true)
    try {
      const data = await financialApi.getAnalysis({
        company_id: selectedCompany,
        start_date: dateRange.start,
        end_date: dateRange.end,
        aggregation: 'monthly',
      })
      setAnalysis(data)
    } catch (error) {
      console.error('Failed to load analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !analysis) {
    return <div className="dashboard-loading">Loading dashboard...</div>
  }

  if (companies.length === 0) {
    return (
      <div className="dashboard-empty">
        <h2>Welcome to NZ Financial Analytics</h2>
        <p>Get started by creating a company in Settings.</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Financial Dashboard</h1>
        <div className="dashboard-controls">
          <select
            value={selectedCompany || ''}
            onChange={(e) => setSelectedCompany(Number(e.target.value))}
            className="company-select"
          >
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name} ({company.region}, {company.industry})
              </option>
            ))}
          </select>
          <div className="date-range">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
        </div>
      </div>

      {analysis && (
        <>
          <div className="kpi-grid">
            <KPICard
              title="Total Revenue"
              value={`$${analysis.summary.total_revenue?.toLocaleString() || 0}`}
              trend={analysis.summary.profitability_trend}
            />
            <KPICard
              title="Net Income"
              value={`$${analysis.profitability_metrics.total_net_income?.toLocaleString() || 0}`}
              trend={analysis.summary.profitability_trend}
            />
            <KPICard
              title="Gross Margin"
              value={`${analysis.ratios.gross_margin?.toFixed(1) || 0}%`}
            />
            <KPICard
              title="Net Margin"
              value={`${analysis.ratios.net_margin?.toFixed(1) || 0}%`}
            />
          </div>

          <div className="charts-section">
            <TrendChart data={analysis.trend_data} title="Financial Trends" />
          </div>

          <div className="ratios-section">
            <h2>Financial Ratios</h2>
            <div className="ratios-grid">
              {analysis.ratios.current_ratio && (
                <div className="ratio-card">
                  <h3>Current Ratio</h3>
                  <p className="ratio-value">{analysis.ratios.current_ratio.toFixed(2)}</p>
                </div>
              )}
              {analysis.ratios.quick_ratio && (
                <div className="ratio-card">
                  <h3>Quick Ratio</h3>
                  <p className="ratio-value">{analysis.ratios.quick_ratio.toFixed(2)}</p>
                </div>
              )}
              {analysis.ratios.debt_to_equity && (
                <div className="ratio-card">
                  <h3>Debt-to-Equity</h3>
                  <p className="ratio-value">{analysis.ratios.debt_to_equity.toFixed(2)}</p>
                </div>
              )}
              {analysis.ratios.roe && (
                <div className="ratio-card">
                  <h3>ROE</h3>
                  <p className="ratio-value">{analysis.ratios.roe.toFixed(2)}%</p>
                </div>
              )}
              {analysis.ratios.roa && (
                <div className="ratio-card">
                  <h3>ROA</h3>
                  <p className="ratio-value">{analysis.ratios.roa.toFixed(2)}%</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard


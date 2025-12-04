import { useState, useEffect } from 'react'
import { companyApi, financialApi } from '../services/api'
import { Company, FinancialAnalysisResponse } from '../types'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import './Reports.css'

const COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c']

const Reports = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string>('')
  const [selectedIndustry, setSelectedIndustry] = useState<string>('')
  const [analysis, setAnalysis] = useState<FinancialAnalysisResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  })
  const [aggregation, setAggregation] = useState<'monthly' | 'quarterly' | 'annual'>('monthly')

  useEffect(() => {
    loadCompanies()
  }, [])

  useEffect(() => {
    if (companies.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0].id)
    }
  }, [companies])

  useEffect(() => {
    loadAnalysis()
  }, [selectedCompany, selectedRegion, selectedIndustry, dateRange, aggregation])

  const loadCompanies = async () => {
    try {
      const data = await companyApi.getAll()
      setCompanies(data)
    } catch (error) {
      console.error('Failed to load companies:', error)
    }
  }

  const loadAnalysis = async () => {
    setLoading(true)
    try {
      const data = await financialApi.getAnalysis({
        company_id: selectedCompany || undefined,
        region: selectedRegion || undefined,
        industry: selectedIndustry || undefined,
        start_date: dateRange.start,
        end_date: dateRange.end,
        aggregation,
      })
      setAnalysis(data)
    } catch (error) {
      console.error('Failed to load analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  const uniqueRegions = Array.from(new Set(companies.map((c) => c.region)))
  const uniqueIndustries = Array.from(new Set(companies.map((c) => c.industry)))

  return (
    <div className="reports-page">
      <h1>Financial Reports & Analytics</h1>

      <div className="reports-filters">
        <div className="filter-group">
          <label>Company</label>
          <select
            value={selectedCompany || ''}
            onChange={(e) => setSelectedCompany(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">All Companies</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Region</label>
          <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
            <option value="">All Regions</option>
            {uniqueRegions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Industry</label>
          <select value={selectedIndustry} onChange={(e) => setSelectedIndustry(e.target.value)}>
            <option value="">All Industries</option>
            {uniqueIndustries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Date Range</label>
          <div className="date-inputs">
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

        <div className="filter-group">
          <label>Aggregation</label>
          <select value={aggregation} onChange={(e) => setAggregation(e.target.value as any)}>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annual">Annual</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="reports-loading">Loading reports...</div>
      ) : analysis ? (
        <div className="reports-content">
          <div className="chart-section">
            <h2>Trend Analysis</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={analysis.trend_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3498db" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#e74c3c" strokeWidth={2} />
                <Line type="monotone" dataKey="net_income" stroke="#2ecc71" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="charts-grid">
            <div className="chart-section">
              <h2>Cost Structure</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analysis.cost_structure}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {analysis.cost_structure.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-section">
              <h2>Expense Structure</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analysis.expense_structure}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="amount" fill="#e74c3c" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-section">
            <h2>Cash Flow Analysis</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Operating', value: analysis.cash_flow_analysis.operating_cash_flow },
                { name: 'Investing', value: analysis.cash_flow_analysis.investing_cash_flow },
                { name: 'Financing', value: analysis.cash_flow_analysis.financing_cash_flow },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Bar dataKey="value" fill="#f39c12" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="reports-empty">No data available for the selected filters.</div>
      )}
    </div>
  )
}

export default Reports


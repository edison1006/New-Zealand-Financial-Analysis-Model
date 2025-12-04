import { useState, useEffect } from 'react'
import { companyApi, financialApi } from '../services/api'
import { Company, FinancialAnalysisResponse } from '../types'
import { useLanguage } from '../contexts/LanguageContext'
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
  Area,
  AreaChart,
} from 'recharts'
import './Reports.css'

const COLORS = ['#7B2FF7', '#9333EA', '#A855F7', '#C084FC', '#E9D5FF', '#F3E8FF']

const Reports = () => {
  const { t } = useLanguage()
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

  const getSelectedCompanyName = () => {
    if (selectedCompany) {
      const company = companies.find(c => c.id === selectedCompany)
      return company?.name || 'Selected Company'
    }
    return 'All Companies'
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getTrendInsight = () => {
    if (!analysis || analysis.trend_data.length < 2) return ''
    const first = analysis.trend_data[0]
    const last = analysis.trend_data[analysis.trend_data.length - 1]
    const revenueGrowth = ((last.revenue - first.revenue) / first.revenue) * 100
    const profitGrowth = ((last.net_income - first.net_income) / Math.abs(first.net_income || 1)) * 100
    
    if (revenueGrowth > 10 && profitGrowth > 10) {
      return 'The company demonstrates strong growth momentum with both revenue and profitability expanding significantly over the analysis period.'
    } else if (revenueGrowth > 0 && profitGrowth < 0) {
      return 'While revenue is growing, profitability has declined, suggesting margin compression or increased operating costs that require attention.'
    } else if (revenueGrowth < 0) {
      return 'Revenue decline indicates challenging market conditions or competitive pressures. Cost management and strategic repositioning may be necessary.'
    }
    return 'The company shows stable performance with moderate growth trends.'
  }

  const getProfitabilityInsight = () => {
    if (!analysis) return ''
    const grossMargin = analysis.ratios.gross_margin || 0
    const netMargin = analysis.ratios.net_margin || 0
    
    if (grossMargin > 50 && netMargin > 20) {
      return 'Excellent profitability metrics indicate strong pricing power and efficient cost management. The company maintains healthy margins across both gross and net levels.'
    } else if (grossMargin > 30 && netMargin > 10) {
      return 'Solid profitability with room for improvement in operating efficiency. Focus on reducing operating expenses could enhance net margins.'
    } else {
      return 'Profitability metrics suggest the need for strategic review of pricing strategy and cost structure to improve margins.'
    }
  }

  const getCashFlowInsight = () => {
    if (!analysis) return ''
    const operatingCF = analysis.cash_flow_analysis.operating_cash_flow
    const netCF = analysis.cash_flow_analysis.net_cash_flow
    
    if (operatingCF > 0 && netCF > 0) {
      return 'Strong positive cash flow from operations indicates healthy business fundamentals. The company generates sufficient cash to fund operations and growth initiatives.'
    } else if (operatingCF > 0 && netCF < 0) {
      return 'Positive operating cash flow is offset by significant investing or financing activities. Monitor capital allocation decisions and debt servicing requirements.'
    } else {
      return 'Negative operating cash flow raises concerns about the company\'s ability to sustain operations. Immediate attention to working capital management and cost reduction is recommended.'
    }
  }

  const getRatioInsight = () => {
    if (!analysis) return ''
    const currentRatio = analysis.ratios.current_ratio || 0
    const debtToEquity = analysis.ratios.debt_to_equity || 0
    const roe = analysis.ratios.roe || 0
    
    let insights = []
    
    if (currentRatio >= 2) {
      insights.push('Strong liquidity position with current ratio above 2.0 indicates excellent short-term financial flexibility.')
    } else if (currentRatio >= 1) {
      insights.push('Adequate liquidity, though monitoring working capital efficiency could optimize cash management.')
    } else {
      insights.push('Low current ratio suggests potential liquidity constraints. Review short-term obligations and cash flow management.')
    }
    
    if (debtToEquity < 0.5) {
      insights.push('Conservative capital structure with low debt-to-equity ratio provides financial stability and flexibility.')
    } else if (debtToEquity < 1) {
      insights.push('Moderate leverage levels are manageable, but continued monitoring of debt service capacity is prudent.')
    } else {
      insights.push('Elevated debt levels require careful management of cash flows and debt covenants.')
    }
    
    if (roe > 15) {
      insights.push('Strong return on equity demonstrates effective use of shareholder capital and value creation.')
    }
    
    return insights.join(' ')
  }

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1>Financial Analysis Report</h1>
        <p className="report-subtitle">Comprehensive Financial Performance Analysis</p>
      </div>

      <div className="reports-filters">
        <div className="filters-row">
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
        </div>

        <div className="filters-row filters-row-secondary">
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
      </div>

      {loading ? (
        <div className="reports-loading">Generating financial report...</div>
      ) : analysis ? (
        <div className="reports-content">
          {/* Executive Summary */}
          <div className="report-section">
            <div className="section-header">
              <h2>Executive Summary</h2>
              <div className="report-date">
                Report Period: {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
              </div>
            </div>
            <div className="summary-grid">
              <div className="summary-card">
                <div className="summary-label">Total Revenue</div>
                <div className="summary-value">{formatCurrency(analysis.summary.total_revenue || 0)}</div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Net Income</div>
                <div className="summary-value">{formatCurrency(analysis.profitability_metrics.total_net_income || 0)}</div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Gross Margin</div>
                <div className="summary-value">{analysis.ratios.gross_margin?.toFixed(1) || 0}%</div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Net Margin</div>
                <div className="summary-value">{analysis.ratios.net_margin?.toFixed(1) || 0}%</div>
              </div>
            </div>
            <div className="summary-insight">
              <h3>Key Findings</h3>
              <p>{getTrendInsight()}</p>
              <p>{getProfitabilityInsight()}</p>
            </div>
          </div>

          {/* Financial Trends */}
          <div className="report-section">
            <div className="section-header">
              <h2>Financial Performance Trends</h2>
            </div>
            <div className="section-content">
              <div className="analysis-text">
                <p>
                  The following analysis examines revenue, expenses, and profitability trends over the selected period. 
                  Understanding these patterns is crucial for strategic planning and identifying areas for operational improvement.
                </p>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={450}>
                  <AreaChart data={analysis.trend_data}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7B2FF7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#7B2FF7" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#e74c3c" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorNetIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2ecc71" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="period" stroke="#b4bcd0" />
                    <YAxis stroke="#b4bcd0" tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ 
                        backgroundColor: 'rgba(26, 31, 46, 0.95)',
                        border: '1px solid var(--aws-border)',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stroke="#7B2FF7" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="expenses" stroke="#e74c3c" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" />
                    <Area type="monotone" dataKey="net_income" stroke="#2ecc71" strokeWidth={3} fillOpacity={1} fill="url(#colorNetIncome)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="analysis-text">
                <h4>Trend Analysis</h4>
                <p>{getTrendInsight()}</p>
              </div>
            </div>
          </div>

          {/* Profitability Analysis */}
          <div className="report-section">
            <div className="section-header">
              <h2>Profitability Analysis</h2>
            </div>
            <div className="section-content">
              <div className="analysis-text">
                <p>
                  Profitability analysis evaluates the company's ability to generate earnings relative to revenue, 
                  assets, and equity. Gross margin reflects pricing power and production efficiency, while net margin 
                  indicates overall operational effectiveness after all expenses.
                </p>
              </div>
              <div className="charts-grid">
                <div className="chart-container">
                  <h3>Cost Structure Breakdown</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={analysis.cost_structure}
                        dataKey="amount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                        labelLine={false}
                      >
                        {analysis.cost_structure.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-container">
                  <h3>Expense Structure</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={analysis.expense_structure} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis type="number" stroke="#b4bcd0" tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                      <YAxis dataKey="category" type="category" stroke="#b4bcd0" width={120} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="amount" fill="#9333EA" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="analysis-text">
                <h4>Profitability Assessment</h4>
                <p>{getProfitabilityInsight()}</p>
                <div className="metrics-grid">
                  <div className="metric-item">
                    <span className="metric-label">Gross Margin:</span>
                    <span className="metric-value">{analysis.ratios.gross_margin?.toFixed(1) || 0}%</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Net Margin:</span>
                    <span className="metric-value">{analysis.ratios.net_margin?.toFixed(1) || 0}%</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">ROE:</span>
                    <span className="metric-value">{analysis.ratios.roe?.toFixed(1) || 'N/A'}%</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">ROA:</span>
                    <span className="metric-value">{analysis.ratios.roa?.toFixed(1) || 'N/A'}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cash Flow Analysis */}
          <div className="report-section">
            <div className="section-header">
              <h2>Cash Flow Analysis</h2>
            </div>
            <div className="section-content">
              <div className="analysis-text">
                <p>
                  Cash flow analysis provides insights into the company's liquidity and ability to generate cash 
                  from operations. Positive operating cash flow is essential for sustainable business operations, 
                  while investing and financing activities reflect strategic capital allocation decisions.
                </p>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={[
                    { 
                      category: 'Operating', 
                      value: analysis.cash_flow_analysis.operating_cash_flow,
                      label: 'Operating Cash Flow'
                    },
                    { 
                      category: 'Investing', 
                      value: analysis.cash_flow_analysis.investing_cash_flow,
                      label: 'Investing Cash Flow'
                    },
                    { 
                      category: 'Financing', 
                      value: analysis.cash_flow_analysis.financing_cash_flow,
                      label: 'Financing Cash Flow'
                    },
                    { 
                      category: 'Net', 
                      value: analysis.cash_flow_analysis.net_cash_flow,
                      label: 'Net Cash Flow'
                    },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="category" stroke="#b4bcd0" />
                    <YAxis stroke="#b4bcd0" tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label, payload) => payload?.[0]?.payload?.label || label}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#A855F7"
                      radius={[8, 8, 0, 0]}
                    >
                      {[
                        analysis.cash_flow_analysis.operating_cash_flow,
                        analysis.cash_flow_analysis.investing_cash_flow,
                        analysis.cash_flow_analysis.financing_cash_flow,
                        analysis.cash_flow_analysis.net_cash_flow,
                      ].map((value, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={value >= 0 ? '#2ecc71' : '#e74c3c'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="analysis-text">
                <h4>Cash Flow Assessment</h4>
                <p>{getCashFlowInsight()}</p>
              </div>
            </div>
          </div>

          {/* Financial Ratios */}
          <div className="report-section">
            <div className="section-header">
              <h2>Financial Ratios & Solvency</h2>
            </div>
            <div className="section-content">
              <div className="analysis-text">
                <p>
                  Financial ratios provide a comprehensive view of the company's financial health, including 
                  liquidity, leverage, and efficiency metrics. These ratios are benchmarked against industry 
                  standards to assess relative performance.
                </p>
              </div>
              <div className="ratios-display">
                <div className="ratio-category">
                  <h3>Liquidity Ratios</h3>
                  <div className="ratio-items">
                    {analysis.ratios.current_ratio && (
                      <div className="ratio-item">
                        <span className="ratio-name">Current Ratio</span>
                        <span className="ratio-value">{analysis.ratios.current_ratio.toFixed(2)}</span>
                        <span className="ratio-assessment">
                          {analysis.ratios.current_ratio >= 2 ? 'Strong' : analysis.ratios.current_ratio >= 1 ? 'Adequate' : 'Weak'}
                        </span>
                      </div>
                    )}
                    {analysis.ratios.quick_ratio && (
                      <div className="ratio-item">
                        <span className="ratio-name">Quick Ratio</span>
                        <span className="ratio-value">{analysis.ratios.quick_ratio.toFixed(2)}</span>
                        <span className="ratio-assessment">
                          {analysis.ratios.quick_ratio >= 1 ? 'Strong' : 'Moderate'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="ratio-category">
                  <h3>Leverage Ratios</h3>
                  <div className="ratio-items">
                    {analysis.ratios.debt_to_equity !== undefined && (
                      <div className="ratio-item">
                        <span className="ratio-name">Debt-to-Equity</span>
                        <span className="ratio-value">{analysis.ratios.debt_to_equity.toFixed(2)}</span>
                        <span className="ratio-assessment">
                          {analysis.ratios.debt_to_equity < 0.5 ? 'Conservative' : analysis.ratios.debt_to_equity < 1 ? 'Moderate' : 'High'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="ratio-category">
                  <h3>Profitability Ratios</h3>
                  <div className="ratio-items">
                    {analysis.ratios.roe !== undefined && (
                      <div className="ratio-item">
                        <span className="ratio-name">Return on Equity (ROE)</span>
                        <span className="ratio-value">{analysis.ratios.roe.toFixed(2)}%</span>
                        <span className="ratio-assessment">
                          {analysis.ratios.roe > 15 ? 'Excellent' : analysis.ratios.roe > 10 ? 'Good' : 'Needs Improvement'}
                        </span>
                      </div>
                    )}
                    {analysis.ratios.roa !== undefined && (
                      <div className="ratio-item">
                        <span className="ratio-name">Return on Assets (ROA)</span>
                        <span className="ratio-value">{analysis.ratios.roa.toFixed(2)}%</span>
                        <span className="ratio-assessment">
                          {analysis.ratios.roa > 10 ? 'Strong' : analysis.ratios.roa > 5 ? 'Moderate' : 'Weak'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="analysis-text">
                <h4>Ratio Analysis</h4>
                <p>{getRatioInsight()}</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="report-section">
            <div className="section-header">
              <h2>Strategic Recommendations</h2>
            </div>
            <div className="section-content">
              <div className="recommendations">
                <div className="recommendation-item">
                  <div className="rec-icon">📊</div>
                  <div className="rec-content">
                    <h4>Revenue Optimization</h4>
                    <p>Focus on high-margin products and services to improve overall profitability. Consider pricing strategy adjustments based on market analysis.</p>
                  </div>
                </div>
                <div className="recommendation-item">
                  <div className="rec-icon">💰</div>
                  <div className="rec-content">
                    <h4>Cost Management</h4>
                    <p>Review operating expenses and identify opportunities for efficiency improvements. Implement cost control measures where appropriate.</p>
                  </div>
                </div>
                <div className="recommendation-item">
                  <div className="rec-icon">📈</div>
                  <div className="rec-content">
                    <h4>Cash Flow Enhancement</h4>
                    <p>Optimize working capital management through improved accounts receivable and inventory turnover. Consider cash flow forecasting.</p>
                  </div>
                </div>
                <div className="recommendation-item">
                  <div className="rec-icon">⚖️</div>
                  <div className="rec-content">
                    <h4>Capital Structure</h4>
                    <p>Evaluate debt levels and consider optimal capital structure. Maintain adequate liquidity buffers for operational flexibility.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="reports-empty">No data available for the selected filters.</div>
      )}
    </div>
  )
}

export default Reports

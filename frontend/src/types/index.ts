export interface User {
  id: number
  email: string
  full_name?: string
  is_active: boolean
  created_at: string
}

export interface Company {
  id: number
  name: string
  region: string
  industry: string
  owner_id: number
  created_at: string
  updated_at?: string
}

export interface FinancialStatement {
  id: number
  company_id: number
  statement_type: 'income' | 'balance_sheet' | 'cash_flow'
  period_start: string
  period_end: string
  created_at: string
}

export interface TrendDataPoint {
  period: string
  revenue: number
  expenses: number
  net_income: number
  cash_flow: number
}

export interface StructureData {
  category: string
  amount: number
  percentage: number
}

export interface RatioData {
  current_ratio?: number
  quick_ratio?: number
  debt_to_equity?: number
  roe?: number
  roa?: number
  gross_margin?: number
  net_margin?: number
}

export interface FinancialAnalysisResponse {
  trend_data: TrendDataPoint[]
  cost_structure: StructureData[]
  expense_structure: StructureData[]
  profitability_metrics: Record<string, number>
  cash_flow_analysis: Record<string, number>
  ratios: RatioData
  summary: Record<string, any>
}

export interface FinancialAnalysisRequest {
  company_id?: number
  region?: string
  industry?: string
  start_date: string
  end_date: string
  aggregation: 'monthly' | 'quarterly' | 'annual'
}


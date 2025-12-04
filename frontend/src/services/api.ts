import axios from 'axios'
import { User, Company, FinancialAnalysisRequest, FinancialAnalysisResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false' // Default to mock mode

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Mock user storage
const MOCK_USERS_KEY = 'mock_users'
const getMockUsers = (): Array<{ email: string; password: string; user: User }> => {
  const stored = localStorage.getItem(MOCK_USERS_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  // Default demo user
  const defaultUsers = [{
    email: 'demo@example.com',
    password: 'demo123',
    user: {
      id: 1,
      email: 'demo@example.com',
      full_name: 'Demo User',
      is_active: true,
      created_at: new Date().toISOString(),
    }
  }]
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(defaultUsers))
  return defaultUsers
}

export const authApi = {
  login: async (email: string, password: string) => {
    if (USE_MOCK) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const users = getMockUsers()
      const user = users.find(u => u.email === email && u.password === password)
      
      if (!user) {
        throw new Error('Invalid email or password')
      }
      
      // Generate mock token
      const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('token', mockToken)
      localStorage.setItem('mock_user', JSON.stringify(user.user))
      
      return {
        access_token: mockToken,
        token_type: 'bearer'
      }
    }
    
    const response = await api.post('/api/v1/auth/login', { email, password })
    return response.data
  },
  register: async (email: string, password: string, fullName?: string) => {
    if (USE_MOCK) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const users = getMockUsers()
      if (users.find(u => u.email === email)) {
        throw new Error('Email already registered')
      }
      
      const newUser: User = {
        id: Date.now(),
        email,
        full_name: fullName,
        is_active: true,
        created_at: new Date().toISOString(),
      }
      
      users.push({ email, password, user: newUser })
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
      
      return newUser
    }
    
    const response = await api.post('/api/v1/auth/register', {
      email,
      password,
      full_name: fullName,
    })
    return response.data
  },
  getCurrentUser: async (token: string): Promise<User> => {
    if (USE_MOCK) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const stored = localStorage.getItem('mock_user')
      if (stored) {
        return JSON.parse(stored)
      }
      
      // Fallback to demo user
      const users = getMockUsers()
      return users[0].user
    }
    
    const response = await api.get('/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  },
}

const MOCK_COMPANIES_KEY = 'mock_companies'
const getMockCompanies = (): Company[] => {
  const stored = localStorage.getItem(MOCK_COMPANIES_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return []
}

export const companyApi = {
  getAll: async (): Promise<Company[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return getMockCompanies()
    }
    const response = await api.get('/api/v1/companies')
    return response.data
  },
  getById: async (id: number): Promise<Company> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const companies = getMockCompanies()
      const company = companies.find(c => c.id === id)
      if (!company) throw new Error('Company not found')
      return company
    }
    const response = await api.get(`/api/v1/companies/${id}`)
    return response.data
  },
  create: async (data: { name: string; region: string; industry: string }): Promise<Company> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const companies = getMockCompanies()
      const userStr = localStorage.getItem('mock_user')
      const user = userStr ? JSON.parse(userStr) : { id: 1 }
      
      const newCompany: Company = {
        id: Date.now(),
        ...data,
        owner_id: user.id,
        created_at: new Date().toISOString(),
      }
      companies.push(newCompany)
      localStorage.setItem(MOCK_COMPANIES_KEY, JSON.stringify(companies))
      return newCompany
    }
    const response = await api.post('/api/v1/companies', data)
    return response.data
  },
  delete: async (id: number): Promise<void> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const companies = getMockCompanies()
      const filtered = companies.filter(c => c.id !== id)
      localStorage.setItem(MOCK_COMPANIES_KEY, JSON.stringify(filtered))
      return
    }
    await api.delete(`/api/v1/companies/${id}`)
  },
}

const generateMockAnalysis = (): FinancialAnalysisResponse => {
  const periods = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06']
  const trendData = periods.map(period => ({
    period,
    revenue: Math.random() * 100000 + 50000,
    expenses: Math.random() * 60000 + 30000,
    net_income: 0,
    cash_flow: Math.random() * 20000 + 10000,
  }))
  
  trendData.forEach(d => {
    d.net_income = d.revenue - d.expenses
  })
  
  return {
    trend_data: trendData,
    cost_structure: [
      { category: 'COGS', amount: 40000, percentage: 40 },
      { category: 'Materials', amount: 20000, percentage: 20 },
      { category: 'Labor', amount: 40000, percentage: 40 },
    ],
    expense_structure: [
      { category: 'Salaries', amount: 30000, percentage: 50 },
      { category: 'Rent', amount: 15000, percentage: 25 },
      { category: 'Utilities', amount: 5000, percentage: 8.3 },
      { category: 'Marketing', amount: 10000, percentage: 16.7 },
    ],
    profitability_metrics: {
      total_revenue: 350000,
      total_expenses: 210000,
      total_net_income: 140000,
      gross_margin_percentage: 60,
      net_margin_percentage: 40,
    },
    cash_flow_analysis: {
      operating_cash_flow: 120000,
      investing_cash_flow: -30000,
      financing_cash_flow: 50000,
      net_cash_flow: 140000,
    },
    ratios: {
      current_ratio: 2.5,
      quick_ratio: 1.8,
      debt_to_equity: 0.6,
      roe: 15.5,
      roa: 12.3,
      gross_margin: 60,
      net_margin: 40,
    },
    summary: {
      total_companies: 1,
      analysis_period: '2024-01-01 to 2024-06-30',
      aggregation: 'monthly',
      total_revenue: 350000,
      total_net_income: 140000,
      average_monthly_revenue: 58333,
      profitability_trend: 'improving',
    },
  }
}

export const financialApi = {
  getAnalysis: async (request: FinancialAnalysisRequest): Promise<FinancialAnalysisResponse> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800))
      return generateMockAnalysis()
    }
    const response = await api.post('/api/v1/analysis/financial-analysis', request)
    return response.data
  },
  uploadFile: async (file: File, companyId: number): Promise<any> => {
    const isPDF = file.type === 'application/pdf' || file.name.endsWith('.pdf')
    
    if (USE_MOCK) {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, isPDF ? 2000 : 1000))
      
      if (isPDF) {
        // For PDF files, simulate AWS OCR processing
        return {
          message: `Successfully uploaded ${file.name}`,
          file_type: 'pdf',
          ocr_processing: true,
          statements_created: 0, // Will be created after OCR processing
          company_id: companyId,
          note: 'PDF file will be processed using AWS Textract/OCR for text extraction. This may take a few minutes.',
        }
      }
      
      return {
        message: `Successfully uploaded ${file.name}`,
        statements_created: 1,
        company_id: companyId,
      }
    }
    
    const formData = new FormData()
    formData.append('file', file)
    
    // Use different endpoint for PDF files with OCR
    const endpoint = isPDF ? '/api/v1/upload/pdf-ocr' : '/api/v1/upload/csv-excel'
    
    const response = await api.post(endpoint, formData, {
      params: { company_id: companyId },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}

export default api


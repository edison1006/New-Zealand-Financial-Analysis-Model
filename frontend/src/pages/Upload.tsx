import { useState, useEffect } from 'react'
import { companyApi, financialApi } from '../services/api'
import { Company } from '../types'
import './Upload.css'

const Upload = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadCompanies()
  }, [])

  useEffect(() => {
    if (companies.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0].id)
    }
  }, [companies])

  const loadCompanies = async () => {
    try {
      const data = await companyApi.getAll()
      setCompanies(data)
    } catch (error) {
      console.error('Failed to load companies:', error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setMessage(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !selectedCompany) {
      setMessage({ type: 'error', text: 'Please select a company and file' })
      return
    }

    setUploading(true)
    setMessage(null)

    try {
      const result = await financialApi.uploadFile(file, selectedCompany)
      setMessage({
        type: 'success',
        text: `Successfully uploaded! ${result.statements_created} statement(s) created.`,
      })
      setFile(null)
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Upload failed',
      })
    } finally {
      setUploading(false)
    }
  }

  if (companies.length === 0) {
    return (
      <div className="upload-empty">
        <h2>No Companies Found</h2>
        <p>Please create a company in Settings before uploading financial data.</p>
      </div>
    )
  }

  return (
    <div className="upload-page">
      <h1>Upload Financial Data</h1>
      <div className="upload-card">
        <p className="upload-info">
          Upload CSV or Excel files exported from Xero, MYOB, or other accounting software.
          The file should contain columns: period_start, period_end, category, subcategory, amount, statement_type.
        </p>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="company">Company</label>
            <select
              id="company"
              value={selectedCompany || ''}
              onChange={(e) => setSelectedCompany(Number(e.target.value))}
              required
              disabled={uploading}
            >
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name} ({company.region}, {company.industry})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="file-input">Financial Data File (CSV/Excel)</label>
            <input
              id="file-input"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              required
              disabled={uploading}
            />
            {file && <p className="file-name">Selected: {file.name}</p>}
          </div>

          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button type="submit" disabled={uploading || !file} className="upload-button">
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Upload


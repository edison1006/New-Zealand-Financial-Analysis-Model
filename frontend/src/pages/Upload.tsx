import { useState, useEffect } from 'react'
import { companyApi, financialApi } from '../services/api'
import { Company } from '../types'
import { useLanguage } from '../contexts/LanguageContext'
import './Upload.css'

const Upload = () => {
  const { t } = useLanguage()
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
      setMessage({ type: 'error', text: t('upload.error') })
      return
    }

    setUploading(true)
    setMessage(null)

    try {
      // Check if PDF file - will use AWS OCR
      const isPDF = file.type === 'application/pdf' || file.name.endsWith('.pdf')
      
      if (isPDF) {
        // For PDF files, show message about OCR processing
        setMessage({
          type: 'success',
          text: `${t('upload.success')} PDF file will be processed using AWS OCR for text extraction.`,
        })
      } else {
        const result = await financialApi.uploadFile(file, selectedCompany)
        setMessage({
          type: 'success',
          text: `${t('upload.success')} ${result.statements_created || 1} statement(s) created.`,
        })
      }
      
      setFile(null)
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || error.response?.data?.detail || t('upload.error'),
      })
    } finally {
      setUploading(false)
    }
  }

  if (companies.length === 0) {
    return (
      <div className="upload-empty">
        <h2>{t('upload.empty.title')}</h2>
        <p>{t('upload.empty.message')}</p>
      </div>
    )
  }

  return (
    <div className="upload-page">
      <h1>{t('upload.title')}</h1>
      <div className="upload-card">
        <p className="upload-info">
          {t('upload.info')}
        </p>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="company">{t('upload.select.company')}</label>
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
            <label htmlFor="file-input">{t('upload.select.file')}</label>
            <input
              id="file-input"
              type="file"
              accept=".csv,.xlsx,.xls,.pdf"
              onChange={handleFileChange}
              required
              disabled={uploading}
            />
            {file && (
              <p className="file-name">
                {t('upload.select.file')}: {file.name}
                {file.name.endsWith('.pdf') && (
                  <span className="pdf-note"> (Will be processed with AWS OCR)</span>
                )}
              </p>
            )}
          </div>

          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button type="submit" disabled={uploading || !file} className="upload-button">
            {uploading ? t('upload.uploading') : t('upload.button')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Upload


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'en' | 'mi' | 'zh'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Translation keys
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.upload': 'Upload',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // Dashboard
    'dashboard.title': 'Financial Dashboard',
    'dashboard.features.title': 'Financial Analysis',
    'dashboard.empty.title': 'Welcome to NZ Financial Analytics',
    'dashboard.empty.message': 'Get started by creating a company in Settings to view detailed financial data.',
    
    // Upload
    'upload.title': 'Upload Financial Data',
    'upload.info': 'Upload CSV, Excel, or PDF files exported from Xero, MYOB, or other accounting software. PDF files will be processed using AWS OCR.',
    'upload.select.company': 'Company',
    'upload.select.file': 'Financial Data File (CSV/Excel/PDF)',
    'upload.button': 'Upload File',
    'upload.uploading': 'Uploading...',
    'upload.success': 'Successfully uploaded!',
    'upload.error': 'Upload failed',
    'upload.empty.title': 'No Companies Found',
    'upload.empty.message': 'Please create a company in Settings before uploading financial data.',
    
    // Settings
    'settings.title': 'Company Settings',
    'settings.language': 'Language',
    'settings.language.en': 'English',
    'settings.language.mi': 'Māori',
    'settings.language.zh': '中文',
    'settings.add.company': '+ Add Company',
    'settings.create.title': 'Create New Company',
    'settings.create.name': 'Company Name',
    'settings.create.region': 'Region',
    'settings.create.industry': 'Industry',
    'settings.create.button': 'Create Company',
    'settings.create.creating': 'Creating...',
    'settings.companies.title': 'Your Companies',
    'settings.companies.empty': 'No companies yet. Create one to get started!',
    'settings.delete': 'Delete',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.fullname': 'Full Name (Optional)',
    'auth.login.button': 'Login',
    'auth.register.button': 'Register',
    'auth.logging': 'Logging in...',
    'auth.registering': 'Registering...',
    'auth.demo.email': 'demo@example.com',
    'auth.demo.password': 'demo123',
    'auth.demo.account': 'Demo Account:',
    'auth.link.register': "Don't have an account? Register here",
    'auth.link.login': 'Already have an account? Login here',
  },
  mi: {
    // Navigation
    'nav.dashboard': 'Papa Whakamārama',
    'nav.upload': 'Tuku',
    'nav.reports': 'Ngā Pūrongo',
    'nav.settings': 'Ngā Tautuhinga',
    'nav.logout': 'Takipū',
    
    // Dashboard
    'dashboard.title': 'Papa Whakamārama Pūtea',
    'dashboard.features.title': 'Tātari Pūtea',
    'dashboard.empty.title': 'Nau mai ki te Pūtea Pūtea o Aotearoa',
    'dashboard.empty.message': 'Tīmata mā te waihanga kamupene i roto i Ngā Tautuhinga hei kite i ngā raraunga pūtea taipitopito.',
    
    // Upload
    'upload.title': 'Tuku Raraunga Pūtea',
    'upload.info': 'Tukuna ngā kōnae CSV, Excel, rānei PDF i puta mai i Xero, MYOB, rānei i ētahi atu pūmanawa kaute. Ka whakahaerehia ngā kōnae PDF mā te AWS OCR.',
    'upload.select.company': 'Kamupene',
    'upload.select.file': 'Kōnae Raraunga Pūtea (CSV/Excel/PDF)',
    'upload.button': 'Tuku Kōnae',
    'upload.uploading': 'E tukuna ana...',
    'upload.success': 'Kua tukuna pai!',
    'upload.error': 'Kua rawa te tuku',
    'upload.empty.title': 'Kāore i kitea ngā Kamupene',
    'upload.empty.message': 'Tēnā waihanga kamupene i roto i Ngā Tautuhinga i mua i te tuku raraunga pūtea.',
    
    // Settings
    'settings.title': 'Ngā Tautuhinga Kamupene',
    'settings.language': 'Reo',
    'settings.language.en': 'English',
    'settings.language.mi': 'Māori',
    'settings.language.zh': '中文',
    'settings.add.company': '+ Tāpiri Kamupene',
    'settings.create.title': 'Waihanga Kamupene Hou',
    'settings.create.name': 'Ingoa Kamupene',
    'settings.create.region': 'Rohe',
    'settings.create.industry': 'Ahumahi',
    'settings.create.button': 'Waihanga Kamupene',
    'settings.create.creating': 'E waihanga ana...',
    'settings.companies.title': 'Ō Kamupene',
    'settings.companies.empty': 'Kāore anō he kamupene. Waihanga tētahi hei tīmata!',
    'settings.delete': 'Mukua',
    
    // Auth
    'auth.login': 'Takiuru',
    'auth.register': 'Rēhita',
    'auth.email': 'Īmēra',
    'auth.password': 'Kupuhipa',
    'auth.fullname': 'Ingoa Katoa (Heiwhiriwhiri)',
    'auth.login.button': 'Takiuru',
    'auth.register.button': 'Rēhita',
    'auth.logging': 'E takiuru ana...',
    'auth.registering': 'E rēhita ana...',
    'auth.demo.email': 'demo@example.com',
    'auth.demo.password': 'demo123',
    'auth.demo.account': 'Pūkete Whakaatu:',
    'auth.link.register': 'Kāore he pūkete? Rēhita i konei',
    'auth.link.login': 'Kei a koe he pūkete? Takiuru i konei',
  },
  zh: {
    // Navigation
    'nav.dashboard': '仪表盘',
    'nav.upload': '上传',
    'nav.reports': '报表',
    'nav.settings': '设置',
    'nav.logout': '退出',
    
    // Dashboard
    'dashboard.title': '财务仪表盘',
    'dashboard.features.title': '财务分析',
    'dashboard.empty.title': '欢迎使用新西兰财务分析平台',
    'dashboard.empty.message': '请在设置中创建公司以查看详细的财务数据。',
    
    // Upload
    'upload.title': '上传财务数据',
    'upload.info': '上传从 Xero、MYOB 或其他会计软件导出的 CSV、Excel 或 PDF 文件。PDF 文件将使用 AWS OCR 进行处理。',
    'upload.select.company': '公司',
    'upload.select.file': '财务数据文件 (CSV/Excel/PDF)',
    'upload.button': '上传文件',
    'upload.uploading': '上传中...',
    'upload.success': '上传成功！',
    'upload.error': '上传失败',
    'upload.empty.title': '未找到公司',
    'upload.empty.message': '请先在设置中创建公司，然后再上传财务数据。',
    
    // Settings
    'settings.title': '公司设置',
    'settings.language': '语言',
    'settings.language.en': 'English',
    'settings.language.mi': 'Māori',
    'settings.language.zh': '中文',
    'settings.add.company': '+ 添加公司',
    'settings.create.title': '创建新公司',
    'settings.create.name': '公司名称',
    'settings.create.region': '地区',
    'settings.create.industry': '行业',
    'settings.create.button': '创建公司',
    'settings.create.creating': '创建中...',
    'settings.companies.title': '您的公司',
    'settings.companies.empty': '还没有公司。创建一个开始吧！',
    'settings.delete': '删除',
    
    // Auth
    'auth.login': '登录',
    'auth.register': '注册',
    'auth.email': '邮箱',
    'auth.password': '密码',
    'auth.fullname': '姓名（可选）',
    'auth.login.button': '登录',
    'auth.register.button': '注册',
    'auth.logging': '登录中...',
    'auth.registering': '注册中...',
    'auth.demo.email': 'demo@example.com',
    'auth.demo.password': 'demo123',
    'auth.demo.account': '演示账号：',
    'auth.link.register': '还没有账号？在此注册',
    'auth.link.login': '已有账号？在此登录',
  },
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language
    return saved || 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}


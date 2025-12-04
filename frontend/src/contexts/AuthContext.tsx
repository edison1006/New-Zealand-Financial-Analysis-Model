import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '../services/api'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName?: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    if (token) {
      authApi.getCurrentUser(token)
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('token')
          setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password)
    setToken(response.access_token)
    localStorage.setItem('token', response.access_token)
    const userData = await authApi.getCurrentUser(response.access_token)
    setUser(userData)
  }

  const register = async (email: string, password: string, fullName?: string) => {
    await authApi.register(email, password, fullName)
    // Auto-login after registration
    await login(email, password)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}



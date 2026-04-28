import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('moonlight_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('moonlight_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    setUser(data.user)
    localStorage.setItem('moonlight_user', JSON.stringify(data.user))
    localStorage.setItem('moonlight_token', data.token)
    return data
  }

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password)
    setUser(data.user)
    localStorage.setItem('moonlight_user', JSON.stringify(data.user))
    localStorage.setItem('moonlight_token', data.token)
    return data
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('moonlight_user')
    localStorage.removeItem('moonlight_token')
  }

  const value = { user, loading, login, register, logout, isAuthenticated: !!user }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
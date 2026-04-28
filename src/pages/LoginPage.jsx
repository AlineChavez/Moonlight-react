import React from 'react'
import { Navigate } from 'react-router-dom'
import AuthForm from '../components/Auth/AuthForm'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/" replace />
  return <AuthForm mode="login" />
}
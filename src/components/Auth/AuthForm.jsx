import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { isValidEmail, isValidPassword } from '../../utils/formatters'
import styles from './AuthForm.module.css'

export default function AuthForm({ mode = 'login' }) {
  const [tab, setTab] = useState(mode)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const validate = () => {
    const errs = {}
    if (tab === 'register' && !formData.name.trim()) {
      errs.name = 'El nombre es requerido'
    }
    if (!isValidEmail(formData.email)) {
      errs.email = 'Email inválido'
    }
    if (!isValidPassword(formData.password)) {
      errs.password = 'Mínimo 8 caracteres'
    }
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      if (tab === 'login') {
        await login(formData.email, formData.password)
      } else {
        await register(formData.name, formData.email, formData.password)
      }
      navigate(redirect)
    } catch (err) {
      const msg = err.response?.data?.message
      setServerError(msg || 'Ocurrió un error, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <span className={styles.logoIcon}>🌙</span>
          <span className={styles.logoText}>Moonlight</span>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'login' ? styles.tabActive : ''}`}
            onClick={() => { setTab('login'); setErrors({}); setServerError('') }}
          >
            Iniciar Sesión
          </button>
          <button
            className={`${styles.tab} ${tab === 'register' ? styles.tabActive : ''}`}
            onClick={() => { setTab('register'); setErrors({}); setServerError('') }}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          {serverError && (
            <div className={styles.serverError}>{serverError}</div>
          )}

          {tab === 'register' && (
            <Field
              label="Nombre completo"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              autoComplete="name"
            />
          )}

          <Field
            label="Correo electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />

          <Field
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
          />

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading
              ? 'Procesando...'
              : tab === 'login' ? 'Ingresar' : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, name, type, value, onChange, error, autoComplete }) {
  const id = `field-${name}`
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}
import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { getInitials } from '../../utils/formatters'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { totalItems, setIsOpen } = useCart()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>

        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🌙</span>
          <span className={styles.logoText}>Moonlight</span>
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <Link to="/" className={styles.navLink}>Inicio</Link>
          <Link to="/catalog" className={styles.navLink}>Menú</Link>
          {user && <Link to="/orders" className={styles.navLink}>Mis Pedidos</Link>}
        </nav>

        <div className={styles.actions}>
          <button className={styles.cartBtn} onClick={() => setIsOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
          </button>

          {user ? (
            <div className={styles.userMenu}>
              <button className={styles.avatar}>{getInitials(user.name)}</button>
              <div className={styles.dropdown}>
                <span className={styles.dropdownName}>{user.name}</span>
                <Link to="/orders" className={styles.dropdownItem}>Mis Pedidos</Link>
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className={styles.loginBtn}>Ingresar</Link>
          )}

          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(o => !o)}
          >
            <span /><span /><span />
          </button>
        </div>

      </div>
    </header>
  )
}
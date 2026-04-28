import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>🌙 Moonlight</span>
          <p className={styles.tagline}>Café de especialidad, cada noche.</p>
        </div>
        <nav className={styles.links}>
          <Link to="/catalog">Menú</Link>
          <Link to="/login">Mi Cuenta</Link>
          <a href="mailto:moonlight@gmail.com.pe">Contacto</a>
        </nav>
        <p className={styles.copy}>© {year} Moonlight Café. Hecho en Arequipa.</p>
      </div>
    </footer>
  )
}
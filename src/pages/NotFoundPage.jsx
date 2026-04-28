import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  return (
    <main className={styles.page}>
      <span className={styles.icon}>🌙</span>
      <h1 className={styles.title}>Página no encontrada</h1>
      <p className={styles.subtitle}>Esta ruta no existe o está en construcción.</p>
      <div className={styles.actions}>
        <Link to="/" className={styles.btn}>Ir al inicio</Link>
        <Link to="/catalog" className={styles.btnSecondary}>Ver Menú</Link>
      </div>
    </main>
  )
}

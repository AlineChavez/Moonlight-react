import { Link } from 'react-router-dom'
import { MoonIcon } from '../components/icons/Icons'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  return (
    <main className={styles.page}>
      <MoonIcon size={48} className={styles.icon} />
      <h1 className={styles.title}>Página no encontrada</h1>
      <p className={styles.subtitle}>Esta ruta no existe o está en construcción.</p>
      <div className={styles.actions}>
        <Link to="/" className={styles.btn}>Ir al inicio</Link>
        <Link to="/catalog" className={styles.btnSecondary}>Ver Menú</Link>
      </div>
    </main>
  )
}

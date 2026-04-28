import { Link } from 'react-router-dom'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <div className={styles.grain} />
        <div className={styles.gradient} />
        <div className={styles.circles}>
          <div className={`${styles.circle} ${styles.c1}`} />
          <div className={`${styles.circle} ${styles.c2}`} />
          <div className={`${styles.circle} ${styles.c3}`} />
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.eyebrow}>🌙 Moonlight Café · Arequipa</p>
        <h1 className={styles.title}>
          Café bajo<br />
          <em>la luna</em>
        </h1>
        <p className={styles.subtitle}>
          Granos seleccionados, tostión artesanal y preparación cuidadosa.<br />
          Cada sorbo cuenta una historia.
        </p>
        <div className={styles.ctas}>
          <Link to="/catalog" className={styles.btnPrimary}>
            Explorar Menú
          </Link>
          <a href="#featured" className={styles.btnSecondary}>
            Ver Destacados
          </a>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <span />
      </div>
    </section>
  )
}
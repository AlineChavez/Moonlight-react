import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero/Hero'
import ProductCard from '../components/Catalog/ProductCard'
import { useProducts } from '../hooks/useProducts'
import styles from './HomePage.module.css'

export default function HomePage() {
  const { products, loading } = useProducts('all')
  const featured = products.filter(p => p.featured).slice(0, 4)

  return (
    <main>
      <Hero />

      <section id="featured" className={styles.featured}>
        <div className={styles.inner}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Selección del día</p>
            <h2 className={styles.sectionTitle}>Nuestros Favoritos</h2>
          </div>

          {loading ? (
            <div className={styles.skeletonGrid}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className={styles.skeleton} />
              ))}
            </div>
          ) : (
            <div className={styles.grid}>
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          <div className={styles.ctaWrap}>
            <Link to="/catalog" className={styles.cta}>Ver menú completo →</Link>
          </div>
        </div>
      </section>

      <section className={styles.values}>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitleLight}>Por qué Moonlight</h2>
          <div className={styles.valuesGrid}>
            {VALUES.map(v => (
              <div key={v.title} className={styles.valueCard}>
                <span className={styles.valueIcon}>{v.icon}</span>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueText}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

const VALUES = [
  { icon: '🌱', title: 'Origen Directo', text: 'Granos seleccionados directamente de productores en Perú, Colombia y Etiopía.' },
  { icon: '🔥', title: 'Tostión Artesanal', text: 'Tostamos en pequeños lotes cada semana para garantizar frescura máxima.' },
  { icon: '✋', title: 'Preparación Manual', text: 'Cada taza preparada a mano por baristas certificados con pasión por el café.' },
  { icon: '🌍', title: 'Comercio Justo', text: 'Pagamos precios justos que apoyan la vida digna de los caficultores.' },
]
import { useState } from 'react'
import ProductCard from '../components/Catalog/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { CATEGORIES } from '../services/productService'
import styles from './CatalogPage.module.css'

export default function CatalogPage() {
  const { products, loading, category, setCategory } = useProducts()
  const [search, setSearch] = useState('')

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}>Moonlight Café</p>
        <h1 className={styles.title}>Nuestro Menú</h1>
        <p className={styles.subtitle}>
          Cada bebida, una experiencia. Elige tu momento.
        </p>
      </div>

      <div className={styles.container}>
        <div className={styles.controls}>
          <div className={styles.categories}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`${styles.catBtn} ${category === cat.id ? styles.catBtnActive : ''}`}
                onClick={() => setCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <label className={styles.searchWrap}>
            <span className={styles.searchIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              type="search"
              placeholder="Buscar bebida..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </label>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <span>🔍</span>
            <p>No encontramos resultados para &quot;{search}&quot;</p>
          </div>
        ) : (
          <>
            <p className={styles.count}>
              {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
            </p>
            <div className={styles.grid}>
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
import React, { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatters'
import styles from './ProductCard.module.css'

const SIZES = [
  { id: 'small', label: 'S', multiplier: 0.85 },
  { id: 'medium', label: 'M', multiplier: 1 },
  { id: 'large', label: 'L', multiplier: 1.2 },
]

const CATEGORY_ICONS = {
  espresso: '☕',
  filtrado: '🫗',
  frio: '🧊',
  especial: '✨',
}

export default function ProductCard({ product }) {
  const [selectedSize, setSelectedSize] = useState('medium')
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const size = SIZES.find(s => s.id === selectedSize)
  const finalPrice = product.price * size.multiplier

  const handleAdd = () => {
    addItem({ ...product, price: finalPrice }, 1, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <div className={styles.imagePlaceholder}>
          <span className={styles.categoryIcon}>
            {CATEGORY_ICONS[product.category] || '☕'}
          </span>
        </div>
        {product.featured && (
          <span className={styles.featuredBadge}>Destacado</span>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.header}>
          <h3 className={styles.name}>{product.name}</h3>
          <span className={styles.price}>{formatPrice(finalPrice)}</span>
        </div>

        <p className={styles.description}>{product.description}</p>

        <fieldset className={styles.sizes}>
          <legend className={styles.sizesLabel}>Tamaño</legend>
          <div className={styles.sizeOptions}>
            {SIZES.map(s => (
              <label key={s.id} className={styles.sizeLabel}>
                <input
                  type="radio"
                  name={`size-${product.id}`}
                  value={s.id}
                  checked={selectedSize === s.id}
                  onChange={() => setSelectedSize(s.id)}
                  className={styles.sizeInput}
                />
                <span className={`${styles.sizeBtn} ${selectedSize === s.id ? styles.sizeBtnActive : ''}`}>
                  {s.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <button
          className={`${styles.addBtn} ${added ? styles.addBtnAdded : ''}`}
          onClick={handleAdd}
          disabled={!product.available}
        >
          {!product.available ? 'No disponible' : added ? '¡Agregado! ✓' : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  )
}
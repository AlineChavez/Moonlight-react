import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatters'
import { CoffeeIcon, DropletIcon, SnowflakeIcon, SparkleIcon, CheckIcon } from '../icons/Icons'
import styles from './ProductCard.module.css'

const SIZES = [
  { id: 'small', label: 'S', multiplier: 0.85 },
  { id: 'medium', label: 'M', multiplier: 1 },
  { id: 'large', label: 'L', multiplier: 1.2 },
]

const PRODUCT_IMAGES = {
  1: '/imag1.png',
  2: '/imag2.png',
  3: '/imag3.png',
  4: '/imag4.png',
  5: '/imag5.png',
  6: '/imag6.png',
  7: '/imag7.png',
  8: '/imag8.png',
}

const CATEGORY_ICONS = {
  espresso: CoffeeIcon,
  filtrado: DropletIcon,
  frio: SnowflakeIcon,
  especial: SparkleIcon,
}

export default function ProductCard({ product }) {
  const [selectedSize, setSelectedSize] = useState('medium')
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const size = SIZES.find(s => s.id === selectedSize)
  const finalPrice = product.price * size.multiplier
  const imageUrl = PRODUCT_IMAGES[product.id]
  const CategoryIcon = CATEGORY_ICONS[product.category] || CoffeeIcon

  const handleAdd = () => {
    addItem({ ...product, price: finalPrice }, 1, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span className={styles.categoryIcon}>
              <CategoryIcon size={32} />
            </span>
          </div>
        )}
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
          {!product.available ? 'No disponible' : added ? (
            <>
              <CheckIcon size={15} /> Agregado
            </>
          ) : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  )
}
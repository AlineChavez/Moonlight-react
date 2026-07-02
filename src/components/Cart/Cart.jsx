import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '../../utils/formatters'
import { orderService } from '../../services/orderService'
import { MoonIcon, CheckIcon, XIcon } from '../icons/Icons'
import styles from './Cart.module.css'

export default function Cart() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, clearCart, showNotification } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setIsOpen(false)
      navigate('/login?redirect=checkout')
      return
    }
    setPlacing(true)
    try {
      await orderService.create({ items })
      setIsOpen(false)
      clearCart()
      showNotification('¡Pedido en camino!', 'success', {
        icon: <CheckIcon size={16} />,
        subtitle: 'Lo estamos preparando para ti',
      })
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo crear el pedido'
      showNotification(msg, 'error', { icon: <XIcon size={16} /> })
    } finally {
      setPlacing(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      <aside className={styles.cart}>
        <div className={styles.header}>
          <h2 className={styles.title}>Tu Pedido</h2>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            <XIcon size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <MoonIcon size={40} className={styles.emptyIcon} />
            <p>Tu carrito está vacío</p>
            <button
              className={styles.browseBtn}
              onClick={() => { setIsOpen(false); navigate('/catalog') }}
            >
              Ver Menú
            </button>
          </div>
        ) : (
          <>
            <ul className={styles.items}>
              {items.map(item => (
                <CartItem
                  key={item.key}
                  item={item}
                  onRemove={() => removeItem(item.key)}
                  onQuantity={(q) => updateQuantity(item.key, q)}
                />
              ))}
            </ul>

            <div className={styles.footer}>
              <div className={styles.subtotal}>
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <p className={styles.note}>Delivery calculado al confirmar</p>
              <button className={styles.checkoutBtn} onClick={handleCheckout} disabled={placing}>
                {placing ? 'Procesando...' : isAuthenticated ? 'Confirmar Pedido' : 'Iniciar Sesión para Pedir'}
              </button>
              <button className={styles.clearBtn} onClick={clearCart}>
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

function CartItem({ item, onRemove, onQuantity }) {
  const SIZE_LABELS = { small: 'S', medium: 'M', large: 'L' }
  return (
    <li className={styles.item}>
      <div className={styles.itemInfo}>
        <span className={styles.itemName}>{item.name}</span>
        <span className={styles.itemSize}>{SIZE_LABELS[item.size]}</span>
      </div>
      <div className={styles.itemControls}>
        <button className={styles.qtyBtn} onClick={() => onQuantity(item.quantity - 1)}>−</button>
        <span className={styles.qty}>{item.quantity}</span>
        <button className={styles.qtyBtn} onClick={() => onQuantity(item.quantity + 1)}>+</button>
      </div>
      <span className={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</span>
      <button className={styles.removeBtn} onClick={onRemove} aria-label="Quitar producto">
        <XIcon size={14} />
      </button>
    </li>
  )
}
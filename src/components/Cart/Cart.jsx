import React from 'react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '../../utils/formatters'
import { orderService } from '../../services/orderService'
import styles from './Cart.module.css'

export default function Cart() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = async () => {
    setIsOpen(false)
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout')
      return
    }

    try {
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price
        }))
      }
      await orderService.create(orderData)
      clearCart()
      navigate('/orders')
    } catch (err) {
      alert('Error al confirmar el pedido. Intenta de nuevo.')
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      <aside className={styles.cart}>
        <div className={styles.header}>
          <h2 className={styles.title}>Tu Pedido</h2>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>✕</button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🌙</span>
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
              <button className={styles.checkoutBtn} onClick={handleCheckout}>
                {isAuthenticated ? 'Confirmar Pedido' : 'Iniciar Sesión para Pedir'}
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
      <button className={styles.removeBtn} onClick={onRemove}>✕</button>
    </li>
  )
}
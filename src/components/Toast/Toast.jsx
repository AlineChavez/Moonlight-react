import { useEffect, useState } from 'react'
import { useCart } from '../../context/CartContext'
import styles from './Toast.module.css'

export default function Toast() {
  const { notification, clearNotification } = useCart()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (notification) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [notification])

  if (!notification) return null

  return (
    <div
      className={`${styles.toast} ${visible ? styles.toastVisible : ''} ${styles[notification.type]}`}
      role="status"
      aria-live="polite"
    >
      <span className={styles.message}>{notification.message}</span>
      <button className={styles.close} onClick={clearNotification} aria-label="Cerrar">✕</button>
    </div>
  )
}

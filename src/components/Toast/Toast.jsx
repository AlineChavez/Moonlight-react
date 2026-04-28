import { useEffect, useState } from 'react'
import { useCart } from '../../context/CartContext'
import styles from './Toast.module.css'

export default function Toast() {
  const { notification, clearNotification } = useCart()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(!!notification)
  }, [notification])

  if (!notification) return null

  return (
    <div
      className={`${styles.toast} ${visible ? styles.toastVisible : ''} ${styles[notification.type]}`}
      role="status"
      aria-live="polite"
    >
      {notification.icon && (
        <span className={styles.icon} aria-hidden="true">{notification.icon}</span>
      )}

      <div className={styles.body}>
        {notification.subtitle ? (
          <>
            <span className={styles.title}>{notification.message}</span>
            <span className={styles.subtitle}>{notification.subtitle}</span>
          </>
        ) : (
          <span className={styles.message}>{notification.message}</span>
        )}
      </div>

      <button className={styles.close} onClick={clearNotification} aria-label="Cerrar">✕</button>
    </div>
  )
}

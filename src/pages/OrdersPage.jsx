import { useEffect, useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../services/orderService'
import { formatPrice } from '../utils/formatters'
import styles from './OrdersPage.module.css'

const STATUS_LABELS = {
  PENDING:   { text: 'Pendiente',  color: '#c07d3a' },
  PREPARING: { text: 'Preparando', color: '#5a6e4e' },
  READY:     { text: 'Listo',      color: '#27ae60' },
  DELIVERED: { text: 'Entregado',  color: '#7f8c8d' },
  CANCELLED: { text: 'Cancelado',  color: '#c0392b' },
}

export default function OrdersPage() {
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) return
    orderService.getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Mis Pedidos</h1>
      </div>

      <div className={styles.container}>
        {loading ? (
          <p className={styles.loading}>Cargando pedidos...</p>
        ) : orders.length === 0 ? (
          <div className={styles.empty}>
            <span>🌙</span>
            <p>Aún no tienes pedidos</p>
            <Link to="/catalog" className={styles.catalogLink}>Ir al Menú</Link>
          </div>
        ) : (
          <ul className={styles.list}>
            {orders.map(order => <OrderCard key={order.id} order={order} />)}
          </ul>
        )}
      </div>
    </main>
  )
}

function OrderCard({ order }) {
  const status = STATUS_LABELS[order.status] || { text: order.status, color: '#7f8c8d' }
  return (
    <li className={styles.orderCard}>
      <div className={styles.orderHead}>
        <span className={styles.orderId}>Pedido #{order.id}</span>
        <span className={styles.orderStatus} style={{ color: status.color }}>
          {status.text}
        </span>
      </div>
      <ul className={styles.orderItems}>
        {order.items?.map((item, i) => (
          <li key={i} className={styles.orderItem}>
            <span>{item.productName} ({item.size?.toUpperCase()})</span>
            <span>x{item.quantity}</span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className={styles.orderFooter}>
        <span className={styles.orderDate}>
          {new Date(order.createdAt).toLocaleDateString('es-PE', {
            day: 'numeric', month: 'long', year: 'numeric'
          })}
        </span>
        <span className={styles.orderTotal}>{formatPrice(order.total)}</span>
      </div>
    </li>
  )
}
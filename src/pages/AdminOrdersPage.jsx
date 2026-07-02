import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { orderService } from '../services/orderService'
import { formatPrice } from '../utils/formatters'
import { MoonIcon, CheckIcon, XIcon } from '../components/icons/Icons'
import styles from './AdminOrdersPage.module.css'

const STATUSES = ['PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED']

const STATUS_LABELS = {
  PENDING:   { text: 'Pendiente',  color: '#c07d3a' },
  PREPARING: { text: 'Preparando', color: '#5a6e4e' },
  READY:     { text: 'Listo',      color: '#27ae60' },
  DELIVERED: { text: 'Entregado',  color: '#7f8c8d' },
  CANCELLED: { text: 'Cancelado',  color: '#c0392b' },
}

export default function AdminOrdersPage() {
  const { user, isAuthenticated } = useAuth()
  const { showNotification } = useCart()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    if (user?.role !== 'ADMIN') return
    orderService.getAll()
      .then(data => setOrders([...data].sort((a, b) => b.id - a.id)))
      .catch(() => showNotification('No se pudieron cargar los pedidos', 'error', { icon: <XIcon size={16} /> }))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'ADMIN') return <Navigate to="/" replace />

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id)
    try {
      const updated = await orderService.updateStatus(id, status)
      setOrders(prev => prev.map(o => o.id === id ? updated : o))
      showNotification('Estado actualizado', 'success', { icon: <CheckIcon size={16} /> })
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo actualizar el estado'
      showNotification(msg, 'error', { icon: <XIcon size={16} /> })
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Panel de Pedidos</h1>
      </div>

      <div className={styles.container}>
        {loading ? (
          <p className={styles.loading}>Cargando pedidos...</p>
        ) : orders.length === 0 ? (
          <div className={styles.empty}>
            <MoonIcon size={40} />
            <p>No hay pedidos todavía</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Usuario</th>
                  <th>Fecha</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>Usuario #{order.userId}</td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString('es-PE', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className={styles.itemsCell}>
                      {order.items?.map(i => `${i.productName} x${i.quantity}`).join(', ')}
                    </td>
                    <td>{formatPrice(order.total)}</td>
                    <td>
                      <select
                        className={styles.statusSelect}
                        style={{ color: STATUS_LABELS[order.status]?.color }}
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s}>{STATUS_LABELS[s]?.text || s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}

import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { productService } from '../services/productService'
import { formatPrice } from '../utils/formatters'
import { CheckIcon, XIcon } from '../components/icons/Icons'
import styles from './AdminProductsPage.module.css'

const EMPTY_FORM = {
  name: '', description: '', price: '', category: '', featured: false, available: true,
}

export default function AdminProductsPage() {
  const { user, isAuthenticated } = useAuth()
  const { showNotification } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const loadProducts = () => {
    setLoading(true)
    return productService.getAll()
      .then(setProducts)
      .catch(() => showNotification('No se pudieron cargar los productos', 'error', { icon: <XIcon size={16} /> }))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (user?.role !== 'ADMIN') return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'ADMIN') return <Navigate to="/" replace />

  const startCreate = () => {
    setEditingId('new')
    setForm(EMPTY_FORM)
    setErrors({})
  }

  const startEdit = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      category: product.category,
      featured: product.featured,
      available: product.available,
    })
    setErrors({})
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setErrors({})
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'El nombre es requerido'
    if (!form.category.trim()) errs.category = 'La categoría es requerida'
    const price = Number(form.price)
    if (!form.price || Number.isNaN(price) || price <= 0) errs.price = 'Precio inválido'
    else if (price > 10000) errs.price = 'El precio no puede superar 10000'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      featured: form.featured,
      available: form.available,
    }

    setSaving(true)
    try {
      if (editingId === 'new') {
        const created = await productService.create(payload)
        setProducts(prev => [...prev, created])
        showNotification('Producto creado', 'success', { icon: <CheckIcon size={16} /> })
      } else {
        const updated = await productService.update(editingId, payload)
        setProducts(prev => prev.map(p => p.id === editingId ? updated : p))
        showNotification('Producto actualizado', 'success', { icon: <CheckIcon size={16} /> })
      }
      cancelEdit()
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo guardar el producto'
      showNotification(msg, 'error', { icon: <XIcon size={16} /> })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await productService.remove(id)
      setProducts(prev => prev.filter(p => p.id !== id))
      showNotification('Producto eliminado', 'success', { icon: <CheckIcon size={16} /> })
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo eliminar el producto'
      showNotification(msg, 'error', { icon: <XIcon size={16} /> })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Panel de Productos</h1>
      </div>

      <div className={styles.container}>
        {editingId ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.formTitle}>
              {editingId === 'new' ? 'Nuevo producto' : 'Editar producto'}
            </h2>

            <div className={styles.formGrid}>
              <Field label="Nombre" name="name" value={form.name} onChange={handleChange} error={errors.name} />
              <Field label="Categoría" name="category" value={form.category} onChange={handleChange} error={errors.category} />
              <Field label="Precio" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} error={errors.price} />
              <label className={styles.checkboxField}>
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
                Destacado
              </label>
              <label className={styles.checkboxField}>
                <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
                Disponible
              </label>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="description">Descripción</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                className={styles.textarea}
                rows={3}
              />
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.saveBtn} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button type="button" className={styles.cancelFormBtn} onClick={cancelEdit}>
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <button className={styles.newBtn} onClick={startCreate}>+ Nuevo producto</button>
        )}

        {loading ? (
          <p className={styles.loading}>Cargando productos...</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Destacado</th>
                  <th>Disponible</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>{product.featured ? 'Sí' : 'No'}</td>
                    <td>{product.available ? 'Sí' : 'No'}</td>
                    <td className={styles.actionsCell}>
                      <button className={styles.editBtn} onClick={() => startEdit(product)}>Editar</button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                      >
                        {deletingId === product.id ? '...' : 'Eliminar'}
                      </button>
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

function Field({ label, name, value, onChange, error, type = 'text', step }) {
  const id = `admin-product-${name}`
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        step={step}
        value={value}
        onChange={onChange}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}

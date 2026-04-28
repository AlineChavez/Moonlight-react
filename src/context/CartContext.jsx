import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem('moonlight_cart')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)
  const [notification, setNotification] = useState(null)
  const toastTimer = useRef(null)

  useEffect(() => {
    localStorage.setItem('moonlight_cart', JSON.stringify(items))
  }, [items])

  const showNotification = useCallback((message, type = 'info') => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setNotification({ message, type, id: Date.now() })
    toastTimer.current = setTimeout(() => setNotification(null), 3200)
  }, [])

  const clearNotification = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setNotification(null)
  }, [])

  const addItem = (product, quantity = 1, size = 'medium') => {
    const key = `${product.id}-${size}`
    const alreadyInCart = items.some(i => i.key === key)

    setItems(prev => {
      const existing = prev.find(i => i.key === key)
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, 20)
        return prev.map(i =>
          i.key === key ? { ...i, quantity: newQty } : i
        )
      }
      return [...prev, { ...product, key, size, quantity }]
    })

    if (alreadyInCart) {
      showNotification('¡Ya lo tenías! Sumamos +1 a tu pedido ☕', 'info')
    }
    setIsOpen(true)
  }

  const removeItem = (key) => {
    setItems(prev => prev.filter(i => i.key !== key))
  }

  const updateQuantity = (key, quantity) => {
    if (quantity <= 0) { removeItem(key); return }
    const limited = Math.min(quantity, 20)
    setItems(prev => prev.map(i => i.key === key ? { ...i, quantity: limited } : i))
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, isOpen, setIsOpen,
      addItem, removeItem, updateQuantity, clearCart,
      totalItems, totalPrice,
      notification, clearNotification
    }}>
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
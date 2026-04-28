import { useState, useEffect, useCallback } from 'react'
import { productService } from '../services/productService'

export function useProducts(initialCategory = 'all') {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState(initialCategory)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = category !== 'all' ? { category } : {}
      const data = await productService.getAll(params)
      const list = Array.isArray(data) ? data : data.content ?? []
      setProducts(list)
    } catch (err) {
      setError('No se pudo conectar al servidor. Asegúrate que el backend está corriendo.')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  return { products, loading, error, category, setCategory, refetch: fetchProducts }
}
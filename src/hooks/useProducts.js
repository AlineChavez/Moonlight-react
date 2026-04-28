import { useState, useEffect, useCallback } from 'react'
import { productService, MOCK_PRODUCTS } from '../services/productService'

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
    } catch {
      const filtered = category === 'all'
        ? MOCK_PRODUCTS
        : MOCK_PRODUCTS.filter(p => p.category === category)
      setProducts(filtered)
      setError(null)
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  return { products, loading, error, category, setCategory, refetch: fetchProducts }
}
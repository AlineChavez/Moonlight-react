import api from './api'

export const productService = {
  async getAll(params = {}) {
    const { data } = await api.get('/products', { params })
    return data
  },

  async getById(id) {
    const { data } = await api.get(`/products/${id}`)
    return data
  },

  async getCategories() {
    const { data } = await api.get('/products/categories')
    return data
  },

  async getFeatured() {
    const { data } = await api.get('/products/featured')
    return data
  },

  // Admin-only endpoints
  async create(product) {
    const { data } = await api.post('/products', product)
    return data
  },

  async update(id, product) {
    const { data } = await api.put(`/products/${id}`, product)
    return data
  },

  async remove(id) {
    await api.delete(`/products/${id}`)
  }
}
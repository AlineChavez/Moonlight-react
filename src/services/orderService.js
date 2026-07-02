import api from './api'

export const orderService = {
  async create(orderData) {
    const { data } = await api.post('/orders', orderData)
    return data
  },

  async getMyOrders() {
    const { data } = await api.get('/orders/my')
    return data
  },

  async getById(id) {
    const { data } = await api.get(`/orders/${id}`)
    return data
  },

  async cancel(id) {
    const { data } = await api.patch(`/orders/${id}/cancel`)
    return data
  },

  // Admin-only endpoints
  async getAll() {
    const { data } = await api.get('/orders')
    return data
  },

  async updateStatus(id, status) {
    const { data } = await api.patch(`/orders/${id}/status`, { status })
    return data
  }
}
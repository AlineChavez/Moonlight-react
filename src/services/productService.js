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
  }
}

export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Espresso Clásico',
    description: 'Concentrado puro con crema dorada y notas de chocolate oscuro',
    price: 12.00,
    category: 'espresso',
    featured: true,
    available: true,
  },
  {
    id: 2,
    name: 'Cappuccino Artesanal',
    description: 'Espresso, leche vaporizada y espuma sedosa en perfecta armonía',
    price: 16.00,
    category: 'espresso',
    featured: true,
    available: true,
  },
  {
    id: 3,
    name: 'Cold Brew Reserve',
    description: 'Infusión fría por 18 horas, suave y con notas frutales',
    price: 18.00,
    category: 'frio',
    featured: true,
    available: true,
  },
  {
    id: 4,
    name: 'Latte de Vainilla',
    description: 'Espresso suave con leche cremosa y sirope de vainilla artesanal',
    price: 17.00,
    category: 'espresso',
    featured: false,
    available: true,
  },
  {
    id: 5,
    name: 'Matcha Latte',
    description: 'Matcha ceremonial japonés con leche de avena y miel de abeja',
    price: 19.00,
    category: 'especial',
    featured: false,
    available: true,
  },
  {
    id: 6,
    name: 'Café de Altura',
    description: 'Granos seleccionados de 1800 msnm, filtrado por goteo lento',
    price: 14.00,
    category: 'filtrado',
    featured: false,
    available: true,
  },
  {
    id: 7,
    name: 'Mocha Oscuro',
    description: 'Espresso doble con chocolate amargo belga y leche vaporizada',
    price: 18.00,
    category: 'espresso',
    featured: false,
    available: true,
  },
  {
    id: 8,
    name: 'Frappé Caramelo',
    description: 'Base de espresso, hielo, crema y caramelo artesanal',
    price: 20.00,
    category: 'frio',
    featured: true,
    available: true,
  },
]

export const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'espresso', label: 'Espresso' },
  { id: 'filtrado', label: 'Filtrado' },
  { id: 'frio', label: 'Frío' },
  { id: 'especial', label: 'Especial' },
]
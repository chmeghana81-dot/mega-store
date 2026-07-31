import api from './api'

export const productService = {
  // Fetch all products with optional pagination
  getProducts: async (limit = 30, skip = 0) => {
    const { data } = await api.get(`/products?limit=${limit}&skip=${skip}`)
    return data
  },

  // Fetch single product by id
  getProductById: async (id) => {
    const { data } = await api.get(`/products/${id}`)
    return data
  },

  // Fetch all categories
  getCategories: async () => {
    const { data } = await api.get('/products/categories')
    return data
  },

  // Fetch products by category
  getProductsByCategory: async (category, limit = 30, skip = 0) => {
    const { data } = await api.get(
      `/products/category/${category}?limit=${limit}&skip=${skip}`
    )
    return data
  },

  // Search products
  searchProducts: async (query, limit = 30, skip = 0) => {
    const { data } = await api.get(
      `/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
    )
    return data
  },

  // Fetch all carts
  getCarts: async () => {
    const { data } = await api.get('/carts')
    return data
  },

  // Fetch all users
  getUsers: async () => {
    const { data } = await api.get('/users')
    return data
  },
}

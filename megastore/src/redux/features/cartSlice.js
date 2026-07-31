import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'megastore_cart'

const loadCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveCart = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCart(),
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload
      const existing = state.items.find((i) => i.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...product, quantity: 1 })
      }
      saveCart(state.items)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload)
      saveCart(state.items)
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload)
      if (item) item.quantity += 1
      saveCart(state.items)
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload)
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1
        } else {
          state.items = state.items.filter((i) => i.id !== action.payload)
        }
      }
      saveCart(state.items)
    },
    clearCart: (state) => {
      state.items = []
      saveCart([])
    },
  },
})

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } =
  cartSlice.actions
export default cartSlice.reducer

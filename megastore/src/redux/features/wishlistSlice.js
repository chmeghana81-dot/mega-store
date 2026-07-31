import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'megastore_wishlist'

const loadWishlist = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveWishlist = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: loadWishlist(),
  },
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.items.find((i) => i.id === action.payload.id)
      if (!exists) {
        state.items.push(action.payload)
        saveWishlist(state.items)
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload)
      saveWishlist(state.items)
    },
    clearWishlist: (state) => {
      state.items = []
      saveWishlist([])
    },
  },
})

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer

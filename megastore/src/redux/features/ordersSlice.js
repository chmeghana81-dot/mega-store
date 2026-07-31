import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'megastore_orders'

const loadOrders = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveOrders = (orders) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: loadOrders(),
    lastOrder: null,
  },
  reducers: {
    placeOrder: (state, action) => {
      const order = {
        id: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        status: 'confirmed',
        ...action.payload,
      }
      state.orders.unshift(order)
      state.lastOrder = order
      saveOrders(state.orders)
    },
    clearLastOrder: (state) => {
      state.lastOrder = null
    },
  },
})

export const { placeOrder, clearLastOrder } = ordersSlice.actions
export default ordersSlice.reducer

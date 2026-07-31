import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/authSlice'
import cartReducer from './features/cartSlice'
import wishlistReducer from './features/wishlistSlice'
import productsReducer from './features/productsSlice'
import categoriesReducer from './features/categoriesSlice'
import searchReducer from './features/searchSlice'
import ordersReducer from './features/ordersSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    products: productsReducer,
    categories: categoriesReducer,
    search: searchReducer,
    orders: ordersReducer,
  },
})

export default store

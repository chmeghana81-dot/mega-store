import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productService } from '../../services/productService'

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async ({ limit = 30, skip = 0 } = {}, { rejectWithValue }) => {
    try {
      return await productService.getProducts(limit, skip)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await productService.getProductById(id)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async ({ category, limit = 30, skip = 0 }, { rejectWithValue }) => {
    try {
      return await productService.getProductsByCategory(category, limit, skip)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const RECENTLY_VIEWED_KEY = 'megastore_recently_viewed'
const loadRecentlyViewed = () => {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    total: 0,
    currentProduct: null,
    loading: false,
    error: null,
    recentlyViewed: loadRecentlyViewed(),
  },
  reducers: {
    addRecentlyViewed: (state, action) => {
      const product = action.payload
      state.recentlyViewed = [
        product,
        ...state.recentlyViewed.filter((p) => p.id !== product.id),
      ].slice(0, 10)
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(state.recentlyViewed))
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.products
        state.total = action.payload.total
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.error = null
        state.currentProduct = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.currentProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // fetchProductsByCategory
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.products
        state.total = action.payload.total
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { addRecentlyViewed, clearCurrentProduct } = productsSlice.actions
export default productsSlice.reducer

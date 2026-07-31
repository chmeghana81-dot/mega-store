import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productService } from '../../services/productService'

export const searchProducts = createAsyncThunk(
  'search/searchProducts',
  async ({ query, limit = 30, skip = 0 }, { rejectWithValue }) => {
    try {
      return await productService.searchProducts(query, limit, skip)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    query: '',
    results: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload
    },
    clearSearch: (state) => {
      state.query = ''
      state.results = []
      state.total = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.results = action.payload.products
        state.total = action.payload.total
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setQuery, clearSearch } = searchSlice.actions
export default searchSlice.reducer

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../../services/authService'

const STORAGE_KEY = 'megastore_user'
const TOKEN_KEY = 'megastore_token'

const loadUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = await authService.login(username, password)
      return data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: loadUser(),
    token: localStorage.getItem(TOKEN_KEY) || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(TOKEN_KEY)
    },
    clearAuthError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.token = action.payload.accessToken
        localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload))
        localStorage.setItem(TOKEN_KEY, action.payload.accessToken)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer

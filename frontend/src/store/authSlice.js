import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// 异步登录操作
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/auth/login', credentials)
    localStorage.setItem('token', response.data.token)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || '登录失败')
  }
})

// 异步注册操作
export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/auth/register', userData)
    localStorage.setItem('token', response.data.token)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || '注册失败')
  }
})

// 异步获取当前用户信息
export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      return rejectWithValue('未登录')
    }
    
    const response = await axios.get('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    localStorage.removeItem('token')
    return rejectWithValue(error.response?.data?.error || '获取用户信息失败')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token')
      state.user = null
      state.isAuthenticated = false
      state.token = null
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // 登录
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // 注册
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // 获取当前用户
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.error = null
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.error = action.payload
      })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
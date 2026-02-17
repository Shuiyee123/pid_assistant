import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// 异步获取用户配置
export const getUserConfig = createAsyncThunk('config/getUserConfig', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('/api/config', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || '获取用户配置失败')
  }
})

// 异步更新用户配置
export const updateUserConfig = createAsyncThunk('config/updateUserConfig', async (configData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.put('/api/config', configData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || '更新用户配置失败')
  }
})

const configSlice = createSlice({
  name: 'config',
  initialState: {
    userConfig: null,
    loading: false,
    error: null
  },
  reducers: {
    clearConfig: (state) => {
      state.userConfig = null
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取用户配置
      .addCase(getUserConfig.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserConfig.fulfilled, (state, action) => {
        state.loading = false
        state.userConfig = action.payload.data
        state.error = null
      })
      .addCase(getUserConfig.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // 更新用户配置
      .addCase(updateUserConfig.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserConfig.fulfilled, (state, action) => {
        state.loading = false
        state.userConfig = action.payload.data
        state.error = null
      })
      .addCase(updateUserConfig.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearConfig, clearError } = configSlice.actions
export default configSlice.reducer
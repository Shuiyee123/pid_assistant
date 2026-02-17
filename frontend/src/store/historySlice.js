import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// 异步获取历史调优记录
export const getHistoryRecords = createAsyncThunk('history/getHistory', async (params, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('/api/history', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    })
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || '获取历史记录失败')
  }
})

const historySlice = createSlice({
  name: 'history',
  initialState: {
    records: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    },
    loading: false,
    error: null
  },
  reducers: {
    clearHistory: (state) => {
      state.records = []
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      }
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取历史记录
      .addCase(getHistoryRecords.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getHistoryRecords.fulfilled, (state, action) => {
        state.loading = false
        state.records = action.payload.data.records
        state.pagination = action.payload.data.pagination
        state.error = null
      })
      .addCase(getHistoryRecords.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearHistory, clearError } = historySlice.actions
export default historySlice.reducer
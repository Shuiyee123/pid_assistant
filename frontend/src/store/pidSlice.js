import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// 异步调优PID参数
export const tunePidParameters = createAsyncThunk('pid/tuneParameters', async (pidData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.post('/api/pid/tune', pidData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || '调优失败')
  }
})

// 异步获取单个调优记录详情
export const getPidRecordDetail = createAsyncThunk('pid/getRecordDetail', async (recordId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`/api/pid/record/${recordId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || '获取记录详情失败')
  }
})

const pidSlice = createSlice({
  name: 'pid',
  initialState: {
    currentTuning: null,
    recordDetail: null,
    loading: false,
    error: null
  },
  reducers: {
    clearCurrentTuning: (state) => {
      state.currentTuning = null
    },
    clearRecordDetail: (state) => {
      state.recordDetail = null
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // 调优PID参数
      .addCase(tunePidParameters.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(tunePidParameters.fulfilled, (state, action) => {
        state.loading = false
        state.currentTuning = action.payload.data
        state.error = null
      })
      .addCase(tunePidParameters.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // 获取记录详情
      .addCase(getPidRecordDetail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getPidRecordDetail.fulfilled, (state, action) => {
        state.loading = false
        state.recordDetail = action.payload.data
        state.error = null
      })
      .addCase(getPidRecordDetail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearCurrentTuning, clearRecordDetail, clearError } = pidSlice.actions
export default pidSlice.reducer
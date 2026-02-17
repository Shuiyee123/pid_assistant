import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// 异步提交反馈记录
export const submitFeedback = createAsyncThunk('feedback/submit', async (feedbackData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.post('/api/feedback', feedbackData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || '提交反馈失败')
  }
})

// 异步获取指定调优记录的反馈
export const getFeedback = createAsyncThunk('feedback/get', async (pidRecordId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`/api/feedback/${pidRecordId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || '获取反馈失败')
  }
})

// 异步获取用户的所有反馈记录
export const getUserFeedback = createAsyncThunk('feedback/getUserFeedback', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('/api/feedback', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || '获取用户反馈失败')
  }
})

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    currentFeedback: null,
    userFeedback: [],
    loading: false,
    error: null
  },
  reducers: {
    clearCurrentFeedback: (state) => {
      state.currentFeedback = null
    },
    clearUserFeedback: (state) => {
      state.userFeedback = []
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // 提交反馈
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.loading = false
        state.currentFeedback = action.payload.data
        state.error = null
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // 获取指定记录的反馈
      .addCase(getFeedback.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getFeedback.fulfilled, (state, action) => {
        state.loading = false
        state.currentFeedback = action.payload.data
        state.error = null
      })
      .addCase(getFeedback.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // 获取用户的所有反馈
      .addCase(getUserFeedback.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserFeedback.fulfilled, (state, action) => {
        state.loading = false
        state.userFeedback = action.payload.data
        state.error = null
      })
      .addCase(getUserFeedback.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearCurrentFeedback, clearUserFeedback, clearError } = feedbackSlice.actions
export default feedbackSlice.reducer
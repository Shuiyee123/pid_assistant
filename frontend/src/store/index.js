import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import pidReducer from './pidSlice'
import historyReducer from './historySlice'
import feedbackReducer from './feedbackSlice'
import configReducer from './configSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    pid: pidReducer,
    history: historyReducer,
    feedback: feedbackReducer,
    config: configReducer
  }
})

export default store
import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUser } from '../store/authSlice'

function AuthGuard({ children }) {
  const dispatch = useDispatch()
  const location = useLocation()
  const { isAuthenticated, loading, token } = useSelector((state) => state.auth)

  // 检查用户认证状态
  useEffect(() => {
    if (token && !isAuthenticated) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, token, isAuthenticated])

  // 加载中，显示空白或加载指示器
  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>加载中...</div>
  }

  // 未认证，重定向到登录页面
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    )
  }

  // 已认证，渲染子组件
  return children
}

export default AuthGuard
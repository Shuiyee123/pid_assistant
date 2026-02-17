import React, { useState, useEffect } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { Form, Input, Button, Card, Alert, Typography } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearError } from '../../store/authSlice'

const { Title, Text } = Typography

function Login() {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const location = useLocation()
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth)

  // 从URL获取重定向路径
  const from = location.state?.from?.pathname || '/'

  // 清除错误
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  // 如果已登录，重定向到目标页面
  if (isAuthenticated) {
    return <Navigate to={from} />
  }

  const handleSubmit = async (values) => {
    dispatch(login(values))
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <Card style={{ width: '100%', maxWidth: 400, borderRadius: 8, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ marginBottom: 8 }}>PID参数智能调优系统</Title>
          <Text type="secondary">用户登录</Text>
        </div>

        {error && (
          <Alert
            message="登录失败"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            closable
            onClose={() => dispatch(clearError())}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ email: '', password: '' }}
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度至少为6位' }
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%', height: 40, fontSize: 16 }}
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Text>还没有账号？</Text>
            <Link to="/register" style={{ marginLeft: 4 }}>立即注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Login
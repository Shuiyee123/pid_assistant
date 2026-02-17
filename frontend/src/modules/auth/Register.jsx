import React, { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Form, Input, Button, Card, Alert, Typography } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { register, clearError } from '../../store/authSlice'

const { Title, Text } = Typography

function Register() {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth)

  // 清除错误
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  // 如果已登录，重定向到首页
  if (isAuthenticated) {
    return <Navigate to="/" />
  }

  const handleSubmit = async (values) => {
    dispatch(register(values))
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <Card style={{ width: '100%', maxWidth: 400, borderRadius: 8, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ marginBottom: 8 }}>PID参数智能调优系统</Title>
          <Text type="secondary">用户注册</Text>
        </div>

        {error && (
          <Alert
            message="注册失败"
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
          initialValues={{ username: '', email: '', password: '' }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名长度至少为3位' },
              { max: 50, message: '用户名长度不能超过50位' }
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

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

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                }
              })
            ]}
          >
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%', height: 40, fontSize: 16 }}
              loading={loading}
            >
              注册
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Text>已有账号？</Text>
            <Link to="/login" style={{ marginLeft: 4 }}>立即登录</Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Register
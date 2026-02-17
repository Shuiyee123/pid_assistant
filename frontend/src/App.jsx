import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout, Menu, Button, Drawer } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from './store/authSlice'
import Login from './modules/auth/Login'
import Register from './modules/auth/Register'
import PidTuning from './modules/pid-tuning/PidTuning'
import History from './modules/history/History'
import Feedback from './modules/feedback/Feedback'
import Config from './modules/config/Config'
import AuthGuard from './components/AuthGuard'
import ResponsiveLayout, { useResponsive } from './components/ResponsiveLayout'

const { Header, Content, Footer, Sider } = Layout

function App() {
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { isMobile } = useResponsive()
  const [menuOpen, setMenuOpen] = React.useState(false)

  const handleLogout = () => {
    dispatch(logout())
  }

  const LayoutWrapper = ({ children }) => {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header className="header">
          <div className="logo" style={{ color: 'white', fontSize: isMobile ? '16px' : '20px', fontWeight: 'bold' }}>
            PID参数智能调优系统
          </div>
          <div className="user-info">
            {isMobile ? (
              <>
                <Button type="primary" onClick={() => setMenuOpen(true)} style={{ marginRight: 8 }}>
                  菜单
                </Button>
                <Button type="primary" danger onClick={handleLogout}>
                  退出
                </Button>
              </>
            ) : (
              <>
                <span>欢迎，{user?.username}</span>
                <Button type="primary" danger onClick={handleLogout}>
                  退出登录
                </Button>
              </>
            )}
          </div>
        </Header>
        {isMobile ? (
          <>
            {/* 移动设备使用Drawer显示菜单 */}
            <Drawer
              title="菜单"
              placement="left"
              onClose={() => setMenuOpen(false)}
              open={menuOpen}
              width={200}
            >
              <Menu
                mode="inline"
                style={{ height: '100%', borderRight: 0 }}
                defaultSelectedKeys={['pid-tuning']}
                onClick={() => setMenuOpen(false)}
              >
                <Menu.Item key="pid-tuning">
                  <a href="/pid-tuning">参数调优</a>
                </Menu.Item>
                <Menu.Item key="history">
                  <a href="/history">历史记录</a>
                </Menu.Item>
                <Menu.Item key="feedback">
                  <a href="/feedback">反馈管理</a>
                </Menu.Item>
                <Menu.Item key="config">
                  <a href="/config">系统配置</a>
                </Menu.Item>
              </Menu>
            </Drawer>
            <Layout style={{ padding: '0 16px 16px' }}>
              <Content
                style={{
                  background: '#fff',
                  padding: 16,
                  margin: 16,
                  minHeight: 280,
                  borderRadius: 4,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                {children}
              </Content>
            </Layout>
          </>
        ) : (
          /* 桌面设备使用固定Sider */
          <Layout>
            <Sider width={200} style={{ background: '#fff' }}>
              <Menu
                mode="inline"
                style={{ height: '100%', borderRight: 0 }}
                defaultSelectedKeys={['pid-tuning']}
              >
                <Menu.Item key="pid-tuning">
                  <a href="/pid-tuning">参数调优</a>
                </Menu.Item>
                <Menu.Item key="history">
                  <a href="/history">历史记录</a>
                </Menu.Item>
                <Menu.Item key="feedback">
                  <a href="/feedback">反馈管理</a>
                </Menu.Item>
                <Menu.Item key="config">
                  <a href="/config">系统配置</a>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
              <Content
                style={{
                  background: '#fff',
                  padding: 24,
                  margin: 24,
                  minHeight: 280,
                  borderRadius: 4,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                {children}
              </Content>
            </Layout>
          </Layout>
        )}
        <Footer style={{ textAlign: 'center' }}>
          PID参数智能调优系统 ©2024 Created by Team
        </Footer>
      </Layout>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/pid-tuning" 
        element={
          <AuthGuard>
            <LayoutWrapper>
              <PidTuning />
            </LayoutWrapper>
          </AuthGuard>
        } 
      />
      <Route 
        path="/history" 
        element={
          <AuthGuard>
            <LayoutWrapper>
              <History />
            </LayoutWrapper>
          </AuthGuard>
        } 
      />
      <Route 
        path="/feedback" 
        element={
          <AuthGuard>
            <LayoutWrapper>
              <Feedback />
            </LayoutWrapper>
          </AuthGuard>
        } 
      />
      <Route 
        path="/config" 
        element={
          <AuthGuard>
            <LayoutWrapper>
              <Config />
            </LayoutWrapper>
          </AuthGuard>
        } 
      />
      <Route path="/" element={<Navigate to={isAuthenticated ? "/pid-tuning" : "/login"} />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/pid-tuning" : "/login"} />} />
    </Routes>
  )
}

export default App
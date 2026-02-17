import React, { useState, useEffect } from 'react'

function ResponsiveLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // 检测屏幕尺寸
  const checkScreenSize = () => {
    const width = window.innerWidth
    setIsMobile(width < 768)
    setIsTablet(width >= 768 && width < 1024)
    setIsDesktop(width >= 1024)
  }

  // 初始检测和窗口大小变化时重新检测
  useEffect(() => {
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  // 提供响应式上下文给子组件
  const responsiveContext = {
    isMobile,
    isTablet,
    isDesktop,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight
  }

  return (
    <div>
      {typeof children === 'function' ? children(responsiveContext) : children}
    </div>
  )
}

// 响应式布局的辅助Hook
export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setIsDesktop(width >= 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight
  }
}

export default ResponsiveLayout
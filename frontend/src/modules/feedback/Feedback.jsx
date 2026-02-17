import React, { useEffect } from 'react'
import { Table, Tag, Button, Card, Typography, Spin, Alert } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { getUserFeedback, clearUserFeedback, clearError } from '../../store/feedbackSlice'

const { Title, Text, Paragraph } = Typography

function Feedback() {
  const dispatch = useDispatch()
  const { userFeedback, loading, error } = useSelector((state) => state.feedback)

  // 初始加载用户反馈
  useEffect(() => {
    dispatch(getUserFeedback())

    return () => {
      dispatch(clearUserFeedback())
    }
  }, [dispatch])

  // 清除错误
  const handleClearError = () => {
    dispatch(clearError())
  }

  // 表格列配置
  const columns = [
    {
      title: '序号',
      key: 'index',
      render: (_, __, index) => index + 1
    },
    {
      title: 'PID类型',
      dataIndex: ['pidRecordId', 'pidType'],
      key: 'pidType',
      render: (pidType) => {
        const typeMap = {
          'standard': '标准PID',
          'parallel': '并联PID',
          'integral-separated': '积分分离PID',
          'anti-windup': '抗积分饱和PID',
          'other': '其他类型'
        }
        return <Tag color="blue">{typeMap[pidType] || pidType}</Tag>
      }
    },
    {
      title: '优化参数',
      dataIndex: ['pidRecordId', 'optimizedKp', 'optimizedKi', 'optimizedKd'],
      key: 'optimizedParams',
      render: (_, record) => (
        <div>
          <Text>Kp: {record.pidRecordId?.optimizedKp || 'N/A'}</Text><br />
          <Text>Ki: {record.pidRecordId?.optimizedKi || 'N/A'}</Text><br />
          <Text>Kd: {record.pidRecordId?.optimizedKd || 'N/A'}</Text>
        </div>
      )
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => {
        const colorMap = {
          5: 'green',
          4: 'lime',
          3: 'orange',
          2: 'volcano',
          1: 'red'
        }
        return <Tag color={colorMap[rating]}>{rating}分</Tag>
      }
    },
    {
      title: '评价内容',
      dataIndex: 'comment',
      key: 'comment',
      render: (comment) => comment || '无'
    },
    {
      title: '调优时间',
      dataIndex: ['pidRecordId', 'createdAt'],
      key: 'createdAt',
      render: (createdAt) => createdAt ? new Date(createdAt).toLocaleString() : 'N/A'
    },
    {
      title: '反馈时间',
      dataIndex: 'createdAt',
      key: 'feedbackCreatedAt',
      render: (createdAt) => new Date(createdAt).toLocaleString()
    }
  ]

  return (
    <div>
      <Title level={2}>反馈管理</Title>
      <Text type="secondary">查看和管理您的PID参数调优反馈记录</Text>

      {error && (
        <Alert
          message="获取反馈记录失败"
          description={error}
          type="error"
          showIcon
          style={{ margin: '24px 0' }}
          closable
          onClose={handleClearError}
        />
      )}

      <Card style={{ marginTop: 24 }}>
        <Table
          columns={columns}
          dataSource={userFeedback}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50']
          }}
          scroll={{ x: 1000 }}
          locale={{
            emptyText: '暂无反馈记录'
          }}
        />
      </Card>

      {loading && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <Spin size="large" tip="加载中..." />
        </div>
      )}
    </div>
  )
}

export default Feedback
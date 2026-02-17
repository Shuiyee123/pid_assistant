import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Select, Input, DatePicker, Card, Typography, Spin, Alert } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { getHistoryRecords, clearHistory, clearError } from '../../store/historySlice'
import { getPidRecordDetail } from '../../store/pidSlice'
import { submitFeedback } from '../../store/feedbackSlice'

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

function History() {
  const dispatch = useDispatch()
  const { records, pagination, loading, error } = useSelector((state) => state.history)
  const { recordDetail } = useSelector((state) => state.pid)
  const [filters, setFilters] = useState({
    pidType: '',
    page: 1,
    limit: 10
  })

  // 初始加载历史记录
  useEffect(() => {
    dispatch(getHistoryRecords(filters))

    return () => {
      dispatch(clearHistory())
    }
  }, [dispatch])

  // 当筛选条件变化时重新加载数据
  useEffect(() => {
    dispatch(getHistoryRecords(filters))
  }, [dispatch, filters])

  // 处理分页变化
  const handlePageChange = (page, pageSize) => {
    setFilters(prev => ({
      ...prev,
      page,
      limit: pageSize
    }))
  }

  // 处理PID类型筛选
  const handlePidTypeChange = (value) => {
    setFilters(prev => ({
      ...prev,
      pidType: value,
      page: 1
    }))
  }

  // 查看详情
  const handleViewDetail = (record) => {
    dispatch(getPidRecordDetail(record._id))
  }

  // 清除错误
  const handleClearError = () => {
    dispatch(clearError())
  }

  // 表格列配置
  const columns = [
    {
      title: '序号',
      key: 'index',
      render: (_, __, index) => (filters.page - 1) * filters.limit + index + 1
    },
    {
      title: 'PID类型',
      dataIndex: 'pidType',
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
      },
      filters: [
        { text: '标准PID', value: 'standard' },
        { text: '并联PID', value: 'parallel' },
        { text: '积分分离PID', value: 'integral-separated' },
        { text: '抗积分饱和PID', value: 'anti-windup' },
        { text: '其他类型', value: 'other' }
      ],
      onFilter: (value, record) => record.pidType === value
    },
    {
      title: '当前参数',
      dataIndex: ['currentKp', 'currentKi', 'currentKd'],
      key: 'currentParams',
      render: (_, record) => (
        <div>
          <Text>Kp: {record.currentKp}</Text><br />
          <Text>Ki: {record.currentKi}</Text><br />
          <Text>Kd: {record.currentKd}</Text>
        </div>
      )
    },
    {
      title: '优化参数',
      dataIndex: ['optimizedKp', 'optimizedKi', 'optimizedKd'],
      key: 'optimizedParams',
      render: (_, record) => (
        <div>
          <Text strong style={{ color: '#1890ff' }}>Kp: {record.optimizedKp}</Text><br />
          <Text strong style={{ color: '#1890ff' }}>Ki: {record.optimizedKi}</Text><br />
          <Text strong style={{ color: '#1890ff' }}>Kd: {record.optimizedKd}</Text>
        </div>
      )
    },
    {
      title: '误差值',
      dataIndex: 'errorValue',
      key: 'errorValue'
    },
    {
      title: '目标值',
      dataIndex: 'targetValue',
      key: 'targetValue'
    },
    {
      title: '调优时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => new Date(createdAt).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" size="small" onClick={() => handleViewDetail(record)}>
          查看详情
        </Button>
      )
    }
  ]

  return (
    <div>
      <Title level={2}>历史调优记录</Title>
      <Text type="secondary">查看和管理您的PID参数调优历史记录</Text>

      <div style={{ margin: '24px 0', display: 'flex', gap: 16, alignItems: 'center' }}>
        <Text>PID类型筛选：</Text>
        <Select
          placeholder="请选择PID类型"
          style={{ width: 200 }}
          value={filters.pidType}
          onChange={handlePidTypeChange}
          allowClear
        >
          <Option value="standard">标准PID</Option>
          <Option value="parallel">并联PID</Option>
          <Option value="integral-separated">积分分离PID</Option>
          <Option value="anti-windup">抗积分饱和PID</Option>
          <Option value="other">其他类型</Option>
        </Select>
      </div>

      {error && (
        <Alert
          message="获取历史记录失败"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          closable
          onClose={handleClearError}
        />
      )}

      <Card>
        <Table
          columns={columns}
          dataSource={records}
          rowKey="_id"
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            onChange: handlePageChange,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50']
          }}
          loading={loading}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* 详情模态框 */}
      {recordDetail && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', borderRadius: 8, padding: 24, maxWidth: 800, maxHeight: '80vh', overflow: 'auto', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Title level={3}>调优详情</Title>
              <Button type="default" onClick={() => dispatch(getPidRecordDetail(null))}>
                关闭
              </Button>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Text strong>PID类型：</Text>
              <Tag color="blue">
                {{
                  'standard': '标准PID',
                  'parallel': '并联PID',
                  'integral-separated': '积分分离PID',
                  'anti-windup': '抗积分饱和PID',
                  'other': '其他类型'
                }[recordDetail.pidType] || recordDetail.pidType}
              </Tag>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
              <div>
                <Text strong>当前参数：</Text>
                <div style={{ marginTop: 8 }}>
                  <Text>Kp: {recordDetail.currentKp}</Text><br />
                  <Text>Ki: {recordDetail.currentKi}</Text><br />
                  <Text>Kd: {recordDetail.currentKd}</Text>
                </div>
              </div>
              <div>
                <Text strong>优化参数：</Text>
                <div style={{ marginTop: 8 }}>
                  <Text strong style={{ color: '#1890ff' }}>Kp: {recordDetail.optimizedKp}</Text><br />
                  <Text strong style={{ color: '#1890ff' }}>Ki: {recordDetail.optimizedKi}</Text><br />
                  <Text strong style={{ color: '#1890ff' }}>Kd: {recordDetail.optimizedKd}</Text>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Text strong>误差值：</Text>
              <Text>{recordDetail.errorValue}</Text>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Text strong>目标值：</Text>
              <Text>{recordDetail.targetValue}</Text>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Text strong>备注：</Text>
              <Text>{recordDetail.notes || '无'}</Text>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Text strong>调优思考过程：</Text>
              <Paragraph style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>
                {recordDetail.thoughtProcess}
              </Paragraph>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Text strong>调优时间：</Text>
              <Text>{new Date(recordDetail.createdAt).toLocaleString()}</Text>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9998 }}>
          <Spin size="large" tip="加载中..." />
        </div>
      )}
    </div>
  )
}

export default History
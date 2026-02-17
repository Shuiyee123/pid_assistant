import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Button, Card, Alert, Typography, Divider, Spin, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { tunePidParameters, clearCurrentTuning, clearError } from '../../store/pidSlice'
import { submitFeedback } from '../../store/feedbackSlice'
import PidChart from '../../components/PidChart'

const { Title, Text, Paragraph } = Typography
const { Option } = Select

function PidTuning() {
  const [form] = Form.useForm()
  const [feedbackForm] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()
  const { currentTuning, loading, error } = useSelector((state) => state.pid)

  // 清除错误
  useEffect(() => {
    return () => {
      dispatch(clearError())
      dispatch(clearCurrentTuning())
    }
  }, [dispatch])

  // 处理调优请求
  const handleTune = async (values) => {
    setIsSubmitting(true)
    try {
      dispatch(tunePidParameters(values))
    } finally {
      setIsSubmitting(false)
    }
  }

  // 处理反馈提交
  const handleSubmitFeedback = async (values) => {
    if (!currentTuning) return

    setIsSubmitting(true)
    try {
      await dispatch(submitFeedback({
        pidRecordId: currentTuning.recordId,
        rating: values.rating,
        comment: values.comment
      })).unwrap()
      message.success('反馈提交成功')
      feedbackForm.resetFields()
    } catch (error) {
      message.error('反馈提交失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 重置表单
  const handleReset = () => {
    form.resetFields()
    dispatch(clearCurrentTuning())
    feedbackForm.resetFields()
  }

  return (
    <div>
      <Title level={2}>PID参数调优</Title>
      <Text type="secondary">提交PID参数调优请求，系统将使用大模型分析并优化参数</Text>

      <Divider />

      {/* 调优表单 */}
      <Card title="调优参数" style={{ marginBottom: 24 }}>
        {error && (
          <Alert
            message="调优失败"
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
          onFinish={handleTune}
          initialValues={{
            pidType: 'standard',
            currentKp: 1.0,
            currentKi: 0.1,
            currentKd: 0.01,
            errorValue: 10.0,
            targetValue: 0.0,
            notes: ''
          }}
        >
          <Form.Item
            name="pidType"
            label="PID类型"
            rules={[{ required: true, message: '请选择PID类型' }]}
          >
            <Select placeholder="请选择PID类型">
              <Option value="standard">标准PID</Option>
              <Option value="parallel">并联PID</Option>
              <Option value="integral-separated">积分分离PID</Option>
              <Option value="anti-windup">抗积分饱和PID</Option>
              <Option value="other">其他类型</Option>
            </Select>
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
            <Form.Item
              name="currentKp"
              label="当前KP值"
              rules={[{ required: true, message: '请输入当前KP值' }, { type: 'number', message: '请输入数字' }]}
            >
              <Input type="number" placeholder="请输入当前KP值" step="0.01" />
            </Form.Item>

            <Form.Item
              name="currentKi"
              label="当前KI值"
              rules={[{ required: true, message: '请输入当前KI值' }, { type: 'number', message: '请输入数字' }]}
            >
              <Input type="number" placeholder="请输入当前KI值" step="0.01" />
            </Form.Item>

            <Form.Item
              name="currentKd"
              label="当前KD值"
              rules={[{ required: true, message: '请输入当前KD值' }, { type: 'number', message: '请输入数字' }]}
            >
              <Input type="number" placeholder="请输入当前KD值" step="0.01" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 16 }}>
            <Form.Item
              name="errorValue"
              label="误差值"
              rules={[{ required: true, message: '请输入误差值' }, { type: 'number', message: '请输入数字' }]}
            >
              <Input type="number" placeholder="请输入误差值" step="0.1" />
            </Form.Item>

            <Form.Item
              name="targetValue"
              label="目标值"
              rules={[{ required: true, message: '请输入目标值' }, { type: 'number', message: '请输入数字' }]}
            >
              <Input type="number" placeholder="请输入目标值" step="0.1" />
            </Form.Item>
          </div>

          <Form.Item
            name="notes"
            label="备注"
          >
            <Input.TextArea rows={3} placeholder="请输入备注信息（可选）" />
          </Form.Item>

          <div className="btn-group">
            <Button type="primary" htmlType="submit" loading={loading || isSubmitting}>
              开始调优
            </Button>
            <Button onClick={handleReset}>
              重置
            </Button>
          </div>
        </Form>
      </Card>

      {/* 调优结果 */}
      {currentTuning && (
        <>
          <Divider orientation="left">调优结果</Divider>
          <Card title="优化参数" style={{ marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              <div style={{ textAlign: 'center' }}>
                <Text strong>优化后KP值</Text>
                <div style={{ fontSize: 24, marginTop: 8, color: '#1890ff' }}>
                  {currentTuning.optimizedKp}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Text strong>优化后KI值</Text>
                <div style={{ fontSize: 24, marginTop: 8, color: '#1890ff' }}>
                  {currentTuning.optimizedKi}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Text strong>优化后KD值</Text>
                <div style={{ fontSize: 24, marginTop: 8, color: '#1890ff' }}>
                  {currentTuning.optimizedKd}
                </div>
              </div>
            </div>

            {/* 数据可视化图表 */}
            <div style={{ marginBottom: 24 }}>
              <PidChart
                currentParams={{
                  kp: currentTuning.currentKp,
                  ki: currentTuning.currentKi,
                  kd: currentTuning.currentKd
                }}
                optimizedParams={{
                  kp: currentTuning.optimizedKp,
                  ki: currentTuning.optimizedKi,
                  kd: currentTuning.optimizedKd
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>调优思考过程：</Text>
              <Paragraph style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>
                {currentTuning.thoughtProcess}
              </Paragraph>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>调优时间：</Text>
              <Text>{new Date(currentTuning.createdAt).toLocaleString()}</Text>
            </div>
          </Card>

          {/* 反馈表单 */}
          <Card title="反馈评价" style={{ marginBottom: 24 }}>
            <Form
              form={feedbackForm}
              layout="vertical"
              onFinish={handleSubmitFeedback}
              initialValues={{ rating: 5, comment: '' }}
            >
              <Form.Item
                name="rating"
                label="评分"
                rules={[{ required: true, message: '请选择评分' }]}
              >
                <Select placeholder="请选择评分">
                  <Option value={5}>5分（非常满意）</Option>
                  <Option value={4}>4分（满意）</Option>
                  <Option value={3}>3分（一般）</Option>
                  <Option value={2}>2分（不满意）</Option>
                  <Option value={1}>1分（非常不满意）</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="comment"
                label="评价内容"
              >
                <Input.TextArea rows={3} placeholder="请输入您的评价（可选）" />
              </Form.Item>

              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                提交反馈
              </Button>
            </Form>
          </Card>
        </>
      )}

      {/* 加载中状态 */}
      {loading && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <Spin size="large" tip="正在调优参数..." />
        </div>
      )}
    </div>
  )
}

export default PidTuning
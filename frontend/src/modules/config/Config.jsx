import React, { useEffect, useState } from 'react'
import { Form, Input, Select, Button, Card, Alert, Typography, Spin, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { getUserConfig, updateUserConfig, clearError } from '../../store/configSlice'

const { Title, Text, Paragraph } = Typography
const { Option } = Select

function Config() {
  const [form] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()
  const { userConfig, loading, error } = useSelector((state) => state.config)

  // 初始加载用户配置
  useEffect(() => {
    dispatch(getUserConfig())
  }, [dispatch])

  // 当用户配置加载完成后，更新表单值
  useEffect(() => {
    if (userConfig) {
      form.setFieldsValue({
        modelName: userConfig.modelName
      })
    }
  }, [form, userConfig])

  // 处理配置更新
  const handleUpdateConfig = async (values) => {
    setIsSubmitting(true)
    try {
      await dispatch(updateUserConfig(values)).unwrap()
      message.success('配置更新成功')
    } catch (error) {
      message.error('配置更新失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 清除错误
  const handleClearError = () => {
    dispatch(clearError())
  }

  return (
    <div>
      <Title level={2}>系统配置</Title>
      <Text type="secondary">配置大模型API密钥和模型选择</Text>

      <Card style={{ margin: '24px 0' }}>
        {error && (
          <Alert
            message="配置操作失败"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            closable
            onClose={handleClearError}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateConfig}
          initialValues={{
            modelName: 'gpt-3.5-turbo'
          }}
        >
          <Form.Item
            name="apiKey"
            label="大模型API密钥"
            tooltip="请输入OpenAI API密钥，用于调用大模型进行PID参数调优"
          >
            <Input.Password placeholder="请输入API密钥（可选，不输入则使用模拟调优）" />
          </Form.Item>

          <Form.Item
            name="modelName"
            label="大模型选择"
            rules={[{ required: true, message: '请选择大模型' }]}
          >
            <Select placeholder="请选择大模型">
              <Option value="gpt-3.5-turbo">GPT-3.5 Turbo</Option>
              <Option value="gpt-4">GPT-4</Option>
              <Option value="gpt-4-turbo">GPT-4 Turbo</Option>
            </Select>
          </Form.Item>

          <div className="btn-group">
            <Button type="primary" htmlType="submit" loading={loading || isSubmitting}>
              保存配置
            </Button>
          </div>
        </Form>

        <div style={{ marginTop: 24, padding: 16, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 4 }}>
          <Text strong>配置说明：</Text>
          <Paragraph style={{ marginTop: 8 }}>
            1. API密钥：用于调用OpenAI的大模型API进行PID参数调优。如果不输入，系统将使用模拟调优功能。<br />
            2. 模型选择：选择要使用的大模型，不同模型的性能和价格不同。<br />
            3. 安全提示：API密钥将被加密存储，不会被共享或泄露。<br />
            4. 调优效果：使用真实大模型调优的效果通常优于模拟调优。
          </Paragraph>
        </div>
      </Card>

      {loading && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <Spin size="large" tip="加载中..." />
        </div>
      )}
    </div>
  )
}

export default Config
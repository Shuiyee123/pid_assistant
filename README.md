# PID参数智能调优系统

## 项目概述

PID参数智能调优系统是一个基于前后端分离架构的智能控制系统，旨在帮助工程师和研究人员快速、高效地优化PID控制器参数。系统集成了先进的大语言模型技术，能够分析控制系统特性并提供专业的参数调优建议。

### 核心价值

- **智能化调优**：利用大语言模型分析PID参数，提供专业的调优建议
- **可视化反馈**：通过图表直观展示参数优化效果
- **历史记录管理**：完整记录调优历史，支持查询和分析
- **多用户支持**：支持多账户独立操作，确保数据隔离
- **响应式设计**：适配桌面、平板和移动设备，提供良好的用户体验

## 技术栈

| 分类 | 技术 | 版本 | 用途 |
| :--- | :--- | :--- | :--- |
| 后端框架 | Express | ^4.18.2 | 构建RESTful API |
| 前端框架 | React | ^18.2.0 | 构建用户界面 |
| 数据库 | MongoDB | ^6.0.0 | 数据存储 |
| 认证 | JWT | ^9.0.2 | 用户认证 |
| 状态管理 | Redux Toolkit | ^1.9.7 | 前端状态管理 |
| UI组件库 | Ant Design | ^5.11.0 | 构建用户界面 |
| 数据可视化 | ECharts | ^5.4.3 | 图表展示 |
| 构建工具 | Vite | ^5.0.0 | 前端构建 |

## 安装说明

### 前置条件

- Node.js 16.0 或更高版本
- npm 7.0 或更高版本
- MongoDB 4.0 或更高版本（可选，用于完整功能）

### 后端安装

1. 克隆项目代码

```bash
git clone git@github.com:Shuiyee123/pid_assistant.git
cd pid_assistant
```

2. 安装后端依赖

```bash
cd backend
npm install
```

3. 配置环境变量

复制 `.env.example` 文件并重命名为 `.env`，然后根据您的环境配置相应的变量。

```bash
# 服务器配置
PORT=3001

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/pid-assistant

# JWT配置
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# 大模型API配置
MODEL_API_BASE_URL=https://api.openai.com/v1
MODEL_NAME=gpt-3.5-turbo

# 日志配置
NODE_ENV=development
```

4. 启动后端服务

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

### 前端安装

1. 安装前端依赖

```bash
cd ../frontend
npm install
```

2. 启动前端开发服务器

```bash
npm run dev
```

3. 构建生产版本

```bash
npm run build
```

## 使用指南

### 访问系统

- **前端界面**：打开浏览器访问 `http://localhost:3000`
- **后端API**：API接口地址为 `http://localhost:3001/api`

### 基本使用流程

1. **注册/登录**：创建账户并登录系统
2. **配置系统**：在系统配置页面设置大模型API密钥和模型选择
3. **提交调优请求**：在PID参数调优页面填写当前参数和目标值，提交调优请求
4. **查看调优结果**：系统返回优化后的参数和调优思考过程，同时展示参数对比图表
5. **提交反馈**：对调优结果进行评分和评价
6. **查看历史记录**：在历史记录页面查看过去的调优记录和详情

### API调用示例

#### 用户注册

```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "user1",
  "email": "user1@example.com",
  "password": "password123"
}
```

#### PID参数调优

```bash
POST /api/pid/tune
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "pidType": "standard",
  "currentKp": 1.0,
  "currentKi": 0.1,
  "currentKd": 0.01,
  "errorValue": 10.0,
  "targetValue": 0.0,
  "notes": "温度控制系统"
}
```

## 主要功能

### 1. 用户认证系统

- 用户注册和登录
- JWT令牌认证
- 权限管理
- 多账户支持

### 2. PID参数调优功能

- 支持多种PID类型（标准PID、并联PID、积分分离PID、抗积分饱和PID等）
- 大模型API集成（需要配置API密钥）
- 模拟调优功能（无API密钥时使用）
- 详细的调优思考过程展示
- 数据可视化图表（参数对比）

### 3. 历史记录系统

- 调优历史记录查询
- 支持分页和PID类型筛选
- 调优记录详情查看
- 完整的参数和结果记录

### 4. 反馈管理系统

- 对调优结果进行评分（1-5分）
- 文字评价功能
- 反馈记录管理和查询

### 5. 系统配置

- 大模型API密钥配置
- 模型选择功能（GPT-3.5 Turbo、GPT-4等）
- 配置安全存储

### 6. 响应式设计

- 适配桌面、平板和移动设备
- 移动设备专用菜单和布局
- 流畅的用户体验

## 配置选项

### 后端配置

| 配置项 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `PORT` | 后端服务端口 | 3001 |
| `MONGODB_URI` | MongoDB连接字符串 | mongodb://localhost:27017/pid-assistant |
| `JWT_SECRET` | JWT签名密钥 | your-secret-key-here |
| `JWT_EXPIRES_IN` | JWT过期时间 | 7d |
| `MODEL_API_BASE_URL` | 大模型API基础URL | https://api.openai.com/v1 |
| `MODEL_NAME` | 大模型名称 | gpt-3.5-turbo |
| `NODE_ENV` | 运行环境 | development |

### 前端配置

前端配置主要通过环境变量和Vite配置文件进行管理，位于 `frontend/vite.config.js`：

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

## 贡献指南

我们欢迎社区贡献，无论是bug修复、功能添加还是文档改进。

### 贡献流程

1. **Fork 项目**：在GitHub上fork本项目到您的账户
2. **创建分支**：从master分支创建一个新的功能分支
3. **提交更改**：在您的分支上进行更改并提交
4. **创建PR**：提交Pull Request到主仓库的master分支
5. **代码审查**：等待维护者的代码审查和反馈
6. **合并**：一旦通过审查，您的更改将被合并到主分支

### 代码规范

- 后端代码：使用ESLint进行代码检查，遵循Node.js最佳实践
- 前端代码：使用ESLint和Prettier进行代码检查和格式化
- 提交信息：使用清晰、简洁的提交信息，描述更改的内容和原因
- 文档：确保所有更改都有相应的文档更新

## 许可证信息

本项目采用MIT许可证，详情请参阅LICENSE文件。

```
MIT License

Copyright (c) 2024 PID参数智能调优系统

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 联系详情

如果您有任何问题、建议或反馈，请通过以下方式联系我们：

- **项目地址**：[https://github.com/Shuiyee123/pid_assistant](https://github.com/Shuiyee123/pid_assistant)
- **Issue跟踪**：[https://github.com/Shuiyee123/pid_assistant/issues](https://github.com/Shuiyee123/pid_assistant/issues)
- **邮件**：[contact@pid-assistant.com](mailto:contact@pid-assistant.com)

## 常见问题

### 1. 系统启动后无法注册账户

**原因**：可能是MongoDB数据库未运行或连接失败。

**解决方案**：
- 确保MongoDB服务正在运行
- 检查.env文件中的MONGODB_URI配置是否正确
- 查看后端服务日志，确认数据库连接状态

### 2. 调优功能无法使用

**原因**：可能是大模型API密钥未配置或配置错误。

**解决方案**：
- 在系统配置页面设置有效的OpenAI API密钥
- 确保API密钥有足够的额度
- 检查网络连接，确保能够访问OpenAI API

### 3. 前端页面无法加载

**原因**：可能是前端开发服务器未启动或端口冲突。

**解决方案**：
- 确保前端开发服务器正在运行（npm run dev）
- 检查端口3000是否被其他应用占用
- 清除浏览器缓存，重新加载页面

## 致谢

感谢以下技术和工具对本项目的支持：

- [Node.js](https://nodejs.org/) - JavaScript运行时
- [Express](https://expressjs.com/) - Web应用框架
- [React](https://reactjs.org/) - 前端UI库
- [MongoDB](https://www.mongodb.com/) - NoSQL数据库
- [Ant Design](https://ant.design/) - UI组件库
- [ECharts](https://echarts.apache.org/) - 数据可视化库
- [OpenAI API](https://openai.com/) - 大语言模型API

---

**PID参数智能调优系统** - 让PID参数调优变得简单、智能、高效！

---

[English Version](README_en.md)
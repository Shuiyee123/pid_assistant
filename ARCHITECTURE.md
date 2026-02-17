# PID参数智能调优系统架构设计

## 1. 系统概述

本系统是一个完整的PID参数智能调优系统，采用前后端分离架构，后端基于Node.js技术栈，前端基于React框架，数据库使用MongoDB。系统旨在为用户提供智能的PID参数调优服务，通过大模型分析和优化PID参数，提高控制系统的性能。

## 2. 技术选型

| 分类 | 技术 | 版本 | 选型理由 |
| :--- | :--- | :--- | :--- |
| 后端框架 | Express | ^4.18.0 | 轻量级、高性能、生态丰富，适合快速开发RESTful API |
| 前端框架 | React | ^18.2.0 | 组件化开发、虚拟DOM、生态系统完善，适合构建复杂单页应用 |
| 数据库 | MongoDB | ^6.0.0 | 文档型数据库，适合存储结构化和半结构化数据，易于扩展 |
| 认证 | JWT | ^9.0.0 | 无状态认证，便于水平扩展，适合前后端分离架构 |
| ORM | Mongoose | ^7.0.0 | MongoDB的对象建模工具，提供模式验证和中间件功能 |
| 前端状态管理 | Redux Toolkit | ^1.9.0 | 集中式状态管理，便于管理复杂应用状态 |
| 前端UI库 | Ant Design | ^5.0.0 | 丰富的UI组件，支持响应式设计，提供良好的用户体验 |
| 数据可视化 | ECharts | ^5.4.0 | 功能强大的交互式图表库，支持多种图表类型 |
| 构建工具 | Vite | ^4.0.0 | 快速的前端构建工具，提供热模块替换和优化的构建输出 |

## 3. 系统架构图

```
+-------------------+       +-------------------+       +-------------------+
|                   |       |                   |       |                   |
|   前端应用        | <---> |   后端API服务     | <---> |   数据库          |
|   React + AntD    |       |   Express        |       |   MongoDB         |
|                   |       |                   |       |                   |
+-------------------+       +-------------------+       +-------------------+
        ^                           ^
        |                           |
        v                           v
+-------------------+       +-------------------+
|                   |       |                   |
|   大模型API       | <---> |   调优逻辑        |
|   (外部服务)      |       |   (核心算法)      |
|                   |       |                   |
+-------------------+       +-------------------+
```

## 4. 模块划分

### 4.1 后端模块

| 模块 | 职责 | 文件路径 |
| :--- | :--- | :--- |
| `user` | 用户认证和管理 | `backend/src/modules/user/` |
| `pid` | PID参数调优核心逻辑 | `backend/src/modules/pid/` |
| `history` | 历史记录管理 | `backend/src/modules/history/` |
| `feedback` | 反馈记录管理 | `backend/src/modules/feedback/` |
| `config` | 用户配置管理 | `backend/src/modules/config/` |
| `middleware` | 中间件（认证、限流等） | `backend/src/middleware/` |
| `utils` | 工具函数 | `backend/src/utils/` |
| `config` | 系统配置 | `backend/src/config/` |

### 4.2 前端模块

| 模块 | 职责 | 文件路径 |
| :--- | :--- | :--- |
| `auth` | 用户认证相关组件 | `frontend/src/modules/auth/` |
| `pid-tuning` | PID参数调优相关组件 | `frontend/src/modules/pid-tuning/` |
| `history` | 历史记录展示组件 | `frontend/src/modules/history/` |
| `feedback` | 反馈记录组件 | `frontend/src/modules/feedback/` |
| `config` | 用户配置组件 | `frontend/src/modules/config/` |
| `common` | 通用组件 | `frontend/src/components/` |
| `hooks` | 自定义React hooks | `frontend/src/hooks/` |
| `utils` | 工具函数 | `frontend/src/utils/` |
| `services` | API服务 | `frontend/src/services/` |
| `store` | Redux状态管理 | `frontend/src/store/` |

## 5. 核心流程

### 5.1 用户认证流程

1. 用户注册：提交用户名、邮箱、密码等信息
2. 系统验证信息并创建用户账户
3. 用户登录：提交邮箱和密码
4. 系统验证凭据并生成JWT token
5. 前端存储token并在后续请求中携带
6. 后端验证token有效性

### 5.2 PID参数调优流程

1. 用户提交PID调优请求（PID类型、当前参数、误差值、目标值等）
2. 后端接收请求并验证用户权限
3. 后端调用大模型API进行参数分析和优化
4. 大模型返回优化后的参数和调优思考过程
5. 后端存储调优记录到数据库
6. 后端返回优化结果给前端
7. 前端展示调优结果和思考过程
8. 用户对调优结果进行评分和评价
9. 后端存储反馈记录

### 5.3 历史记录查询流程

1. 用户请求查看历史调优记录
2. 后端验证用户权限
3. 后端从数据库查询该用户的历史记录
4. 后端返回历史记录数据给前端
5. 前端展示历史记录

## 6. 数据库设计

### 6.1 用户表 (`users`)

| 字段名 | 数据类型 | 描述 | 约束 |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | 用户ID | 主键 |
| `username` | `String` | 用户名 | 唯一，必填 |
| `email` | `String` | 邮箱 | 唯一，必填 |
| `password` | `String` | 密码哈希 | 必填 |
| `createdAt` | `Date` | 创建时间 | 默认当前时间 |
| `updatedAt` | `Date` | 更新时间 | 默认当前时间 |

### 6.2 用户配置表 (`userConfigs`)

| 字段名 | 数据类型 | 描述 | 约束 |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | 配置ID | 主键 |
| `userId` | `ObjectId` | 用户ID | 外键，唯一 |
| `apiKey` | `String` | 大模型API密钥 | 加密存储 |
| `modelName` | `String` | 大模型名称 | 默认值 |
| `createdAt` | `Date` | 创建时间 | 默认当前时间 |
| `updatedAt` | `Date` | 更新时间 | 默认当前时间 |

### 6.3 PID调优记录表 (`pidRecords`)

| 字段名 | 数据类型 | 描述 | 约束 |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | 记录ID | 主键 |
| `userId` | `ObjectId` | 用户ID | 外键 |
| `pidType` | `String` | PID类型 | 必填 |
| `currentKp` | `Number` | 当前KP值 | 必填 |
| `currentKi` | `Number` | 当前KI值 | 必填 |
| `currentKd` | `Number` | 当前KD值 | 必填 |
| `errorValue` | `Number` | 误差值 | 必填 |
| `targetValue` | `Number` | 目标值 | 必填 |
| `notes` | `String` | 备注信息 | 可选 |
| `optimizedKp` | `Number` | 优化后KP值 | 必填 |
| `optimizedKi` | `Number` | 优化后KI值 | 必填 |
| `optimizedKd` | `Number` | 优化后KD值 | 必填 |
| `thoughtProcess` | `String` | 调优思考过程 | 必填 |
| `createdAt` | `Date` | 创建时间 | 默认当前时间 |

### 6.4 反馈记录表 (`feedback`)

| 字段名 | 数据类型 | 描述 | 约束 |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | 反馈ID | 主键 |
| `userId` | `ObjectId` | 用户ID | 外键 |
| `pidRecordId` | `ObjectId` | PID调优记录ID | 外键 |
| `rating` | `Number` | 评分（1-5） | 必填 |
| `comment` | `String` | 评价内容 | 可选 |
| `createdAt` | `Date` | 创建时间 | 默认当前时间 |

## 7. API设计

### 7.1 用户认证API

| API路径 | 方法 | 模块/文件 | 类型 | 功能描述 |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | `user/controller.js` | `Router` | 用户注册 |
| `/api/auth/login` | `POST` | `user/controller.js` | `Router` | 用户登录 |
| `/api/auth/me` | `GET` | `user/controller.js` | `Router` | 获取当前用户信息 |

### 7.2 PID调优API

| API路径 | 方法 | 模块/文件 | 类型 | 功能描述 |
| :--- | :--- | :--- | :--- | :--- |
| `/api/pid/tune` | `POST` | `pid/controller.js` | `Router` | PID参数调优请求 |
| `/api/pid/history` | `GET` | `history/controller.js` | `Router` | 获取历史调优记录 |
| `/api/pid/history/:id` | `GET` | `history/controller.js` | `Router` | 获取单个调优记录详情 |

### 7.3 反馈API

| API路径 | 方法 | 模块/文件 | 类型 | 功能描述 |
| :--- | :--- | :--- | :--- | :--- |
| `/api/feedback` | `POST` | `feedback/controller.js` | `Router` | 提交反馈记录 |
| `/api/feedback/:pidRecordId` | `GET` | `feedback/controller.js` | `Router` | 获取指定调优记录的反馈 |

### 7.4 配置API

| API路径 | 方法 | 模块/文件 | 类型 | 功能描述 |
| :--- | :--- | :--- | :--- | :--- |
| `/api/config` | `GET` | `config/controller.js` | `Router` | 获取用户配置 |
| `/api/config` | `PUT` | `config/controller.js` | `Router` | 更新用户配置 |

## 8. 系统部署与扩展性

### 8.1 部署方案

- **开发环境**：本地开发，使用Docker容器化部署MongoDB
- **测试环境**：云服务器部署，模拟生产环境
- **生产环境**：云服务器部署，使用负载均衡和自动扩展

### 8.2 扩展性考虑

- **模块化设计**：系统采用模块化设计，便于添加新功能
- **插件机制**：支持通过插件扩展大模型集成
- **API版本控制**：采用API版本控制，确保向后兼容性
- **水平扩展**：支持通过负载均衡实现水平扩展

### 8.3 安全性考虑

- **HTTPS**：使用HTTPS加密传输
- **输入验证**：对所有输入进行严格验证
- **密码加密**：使用bcrypt加密存储密码
- **API限流**：实现API请求限流，防止DoS攻击
- **CORS配置**：合理配置CORS，防止跨站请求伪造

## 9. 总结

本架构设计文档详细描述了PID参数智能调优系统的技术选型、模块划分、核心流程、数据库设计和API设计。系统采用前后端分离架构，后端基于Node.js和Express框架，前端基于React和Ant Design，数据库使用MongoDB。系统具有良好的可维护性、可扩展性和安全性，能够满足用户的PID参数调优需求。
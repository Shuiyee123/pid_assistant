# PID Parameter Intelligent Tuning System

## Project Overview

The PID Parameter Intelligent Tuning System is an intelligent control system based on a front-end and back-end separation architecture, designed to help engineers and researchers quickly and efficiently optimize PID controller parameters. The system integrates advanced large language model technology, enabling it to analyze control system characteristics and provide professional parameter tuning recommendations.

### Core Value

- **Intelligent Tuning**: Uses large language models to analyze PID parameters and provide professional tuning recommendations
- **Visual Feedback**: Intuitively displays parameter optimization effects through charts
- **History Management**: Complete recording of tuning history, supporting query and analysis
- **Multi-user Support**: Supports independent operation of multiple accounts, ensuring data isolation
- **Responsive Design**: Adapts to desktop, tablet, and mobile devices, providing a good user experience

## Technology Stack

| Category | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| Backend Framework | Express | ^4.18.2 | Building RESTful APIs |
| Frontend Framework | React | ^18.2.0 | Building user interface |
| Database | MongoDB | ^6.0.0 | Data storage |
| Authentication | JWT | ^9.0.2 | User authentication |
| State Management | Redux Toolkit | ^1.9.7 | Frontend state management |
| UI Component Library | Ant Design | ^5.11.0 | Building user interface |
| Data Visualization | ECharts | ^5.4.3 | Chart display |
| Build Tool | Vite | ^5.0.0 | Frontend build |

## Installation Instructions

### Prerequisites

- Node.js 16.0 or higher
- npm 7.0 or higher
- MongoDB 4.0 or higher (optional, for full functionality)

### Backend Installation

1. Clone the project code

```bash
git clone git@github.com:Shuiyee123/pid_assistant.git
cd pid_assistant
```

2. Install backend dependencies

```bash
cd backend
npm install
```

3. Configure environment variables

Copy the `.env.example` file and rename it to `.env`, then configure the corresponding variables according to your environment.

```bash
# Server configuration
PORT=3001

# Database configuration
MONGODB_URI=mongodb://localhost:27017/pid-assistant

# JWT configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Model API configuration
MODEL_API_BASE_URL=https://api.openai.com/v1
MODEL_NAME=gpt-3.5-turbo

# Log configuration
NODE_ENV=development
```

4. Start the backend service

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Frontend Installation

1. Install frontend dependencies

```bash
cd ../frontend
npm install
```

2. Start the frontend development server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

## Usage Guidelines

### Accessing the System

- **Frontend Interface**: Open a browser and access `http://localhost:3000`
- **Backend API**: API interface address is `http://localhost:3001/api`

### Basic Usage Flow

1. **Register/Login**: Create an account and log in to the system
2. **Configure System**: Set up the large language model API key and model selection in the system configuration page
3. **Submit Tuning Request**: Fill in current parameters and target values on the PID parameter tuning page, then submit the tuning request
4. **View Tuning Results**: The system returns optimized parameters and tuning thinking process, while displaying parameter comparison charts
5. **Submit Feedback**: Rate and evaluate the tuning results
6. **View History Records**: View past tuning records and details on the history records page

### API Call Examples

#### User Registration

```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "user1",
  "email": "user1@example.com",
  "password": "password123"
}
```

#### PID Parameter Tuning

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
  "notes": "Temperature control system"
}
```

## Key Features

### 1. User Authentication System

- User registration and login
- JWT token authentication
- Permission management
- Multi-account support

### 2. PID Parameter Tuning Functionality

- Supports multiple PID types (standard PID, parallel PID, integral separation PID, anti-integral windup PID, etc.)
- Large model API integration (requires API key configuration)
- Simulated tuning functionality (used when no API key is available)
- Detailed tuning thinking process display
- Data visualization charts (parameter comparison)

### 3. History Records System

- Tuning history record query
- Supports pagination and PID type filtering
- Tuning record details viewing
- Complete parameter and result recording

### 4. Feedback Management System

- Rate tuning results (1-5 points)
- Text evaluation functionality
- Feedback record management and query

### 5. System Configuration

- Large model API key configuration
- Model selection functionality (GPT-3.5 Turbo, GPT-4, etc.)
- Secure configuration storage

### 6. Responsive Design

- Adapts to desktop, tablet, and mobile devices
- Mobile device-specific menu and layout
- Smooth user experience

## Configuration Options

### Backend Configuration

| Configuration Item | Description | Default Value |
| :--- | :--- | :--- |
| `PORT` | Backend service port | 3001 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/pid-assistant |
| `JWT_SECRET` | JWT signing secret | your-secret-key-here |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `MODEL_API_BASE_URL` | Large model API base URL | https://api.openai.com/v1 |
| `MODEL_NAME` | Large model name | gpt-3.5-turbo |
| `NODE_ENV` | Running environment | development |

### Frontend Configuration

Frontend configuration is mainly managed through environment variables and Vite configuration files, located at `frontend/vite.config.js`:

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

## Contribution Guidelines

We welcome community contributions, whether it's bug fixes, feature additions, or documentation improvements.

### Contribution Process

1. **Fork the Project**: Fork this project to your account on GitHub
2. **Create a Branch**: Create a new feature branch from the master branch
3. **Submit Changes**: Make changes on your branch and commit them
4. **Create a PR**: Submit a Pull Request to the master branch of the main repository
5. **Code Review**: Wait for maintainer's code review and feedback
6. **Merge**: Once approved, your changes will be merged into the main branch

### Code Standards

- Backend code: Use ESLint for code checking, follow Node.js best practices
- Frontend code: Use ESLint and Prettier for code checking and formatting
- Commit messages: Use clear, concise commit messages describing the content and reason for changes
- Documentation: Ensure all changes have corresponding documentation updates

## License Information

This project uses the MIT license, please refer to the LICENSE file for details.

```
MIT License

Copyright (c) 2024 PID Parameter Intelligent Tuning System

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

## Contact Details

If you have any questions, suggestions, or feedback, please contact us through the following methods:

- **Project Address**: [https://github.com/Shuiyee123/pid_assistant](https://github.com/Shuiyee123/pid_assistant)
- **Issue Tracking**: [https://github.com/Shuiyee123/pid_assistant/issues](https://github.com/Shuiyee123/pid_assistant/issues)
- **Email**: [contact@pid-assistant.com](mailto:contact@pid-assistant.com)

## Frequently Asked Questions

### 1. Cannot register account after system startup

**Reason**: MongoDB database may not be running or connection failed.

**Solution**:
- Ensure MongoDB service is running
- Check if MONGODB_URI configuration in .env file is correct
- Check backend service logs to confirm database connection status

### 2. Tuning functionality cannot be used

**Reason**: Large model API key may not be configured or configured incorrectly.

**Solution**:
- Set valid OpenAI API key in system configuration page
- Ensure API key has sufficient quota
- Check network connection to ensure access to OpenAI API

### 3. Frontend page cannot load

**Reason**: Frontend development server may not be started or port conflict.

**Solution**:
- Ensure frontend development server is running (npm run dev)
- Check if port 3000 is occupied by other applications
- Clear browser cache and reload the page

## Acknowledgments

Thanks to the following technologies and tools for supporting this project:

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express](https://expressjs.com/) - Web application framework
- [React](https://reactjs.org/) - Frontend UI library
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Ant Design](https://ant.design/) - UI component library
- [ECharts](https://echarts.apache.org/) - Data visualization library
- [OpenAI API](https://openai.com/) - Large language model API

---

**PID Parameter Intelligent Tuning System** - Making PID parameter tuning simple, intelligent, and efficient!

---

[Chinese Version](README.md)
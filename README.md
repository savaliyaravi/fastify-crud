# Fastify REST API with TypeScript

A production-ready Fastify REST API built with TypeScript, featuring JWT authentication, MongoDB integration, and comprehensive error handling.

## ✨ Features

- **🚀 Fastify Framework** - High-performance web framework
- **🔒 JWT Authentication** - Secure token-based authentication
- **📊 MongoDB Integration** - Mongoose ODM for data modeling
- **🛡️ Input Validation** - Zod schema validation with user-friendly error messages
- **📚 API Documentation** - Swagger/OpenAPI documentation
- **🔧 TypeScript** - Full type safety and modern JavaScript
- **🎯 Error Handling** - Comprehensive error handling with user-friendly messages
- **📝 Logging** - Structured logging with Pino
- **🔒 Security** - Helmet.js for security headers
- **🌐 CORS** - Cross-origin resource sharing support
- **⚡ Development** - Hot reload with ts-node-dev

## 🏗️ Project Structure

```
src/
├── config/           # Configuration management
├── controllers/      # Request handlers
├── models/          # Mongoose models
├── plugins/         # Fastify plugins
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
└── index.ts         # Application entry point
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fastify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the API**
   - API: http://localhost:3000/api
   - Documentation: http://localhost:3000/docs
   - Health Check: http://localhost:3000/health

## 📖 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### User Management Endpoints

#### Get All Users
```http
GET /api/users
Authorization: Bearer <jwt-token>
```

#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <jwt-token>
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <jwt-token>
```

## 🎯 Error Handling

The API provides comprehensive, user-friendly error handling:

### Validation Errors
When request validation fails, you'll receive clear, actionable error messages:

**Single Error:**
```json
{
  "success": false,
  "message": "password is required"
}
```

**Multiple Errors:**
```json
{
  "success": false,
  "message": "Validation failed: name must be at least 2 characters, email must be a valid email address",
  "details": [
    "name must be at least 2 characters",
    "email must be a valid email address"
  ]
}
```

### Error Types Handled
- **400 Bad Request** - Invalid input data
- **401 Unauthorized** - Missing or invalid JWT token
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server-side errors

### Error Response Format
All error responses follow a consistent format:
```json
{
  "success": false,
  "message": "Human-readable error message",
  "details": ["Optional", "array", "of", "specific", "errors"]
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRY` | JWT token expiry | `1h` |
| `API_PREFIX` | API route prefix | `/api` |
| `SWAGGER_TITLE` | Swagger title | `Fastify REST API` |
| `SWAGGER_DESCRIPTION` | Swagger description | `Fastify REST API with TypeScript` |
| `SWAGGER_VERSION` | API version | `1.0.0` |

## 🏃‍♂️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

### Development Workflow

1. **Start MongoDB** (if running locally)
2. **Start development server**: `npm run dev`
3. **Access Swagger docs**: http://localhost:3000/docs
4. **Test endpoints** using the interactive documentation

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **Input Validation** - Zod schema validation
- **Security Headers** - Helmet.js integration
- **CORS Protection** - Configurable CORS settings
- **Environment Variables** - Secure configuration management

## 📊 Architecture

### Layers
1. **Routes** - API endpoint definitions
2. **Controllers** - Request/response handling
3. **Services** - Business logic
4. **Models** - Data persistence
5. **Plugins** - Fastify extensions

### Key Components
- **Authentication Plugin** - JWT verification middleware
- **Database Plugin** - MongoDB connection management
- **Validation Utils** - Zod schema validation with user-friendly errors
- **Error Handler** - Global error handling middleware

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

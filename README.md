# Raso Minang - Padang Restaurant Web Application

A full-stack web application for a Padang (Minangkabau) restaurant featuring menu management, ordering system, real-time chat support, and comprehensive admin dashboard.

## 🍽️ Features

### Customer Features
- Browse menu with category filtering
- Add items to cart
- Place orders
- Real-time chat support with admin
- View order history

### Super Admin Features
- Dashboard with statistics
- Menu management (CRUD)
- Category management (CRUD)
- Order management and status tracking
- User management
- Real-time chat with customers

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS 4** - Styling
- **React Router 7** - Routing
- **Socket.io-client** - Real-time communication
- **Vitest** - Testing framework

### Backend
- **Express 5** - Web framework
- **Sequelize 6** - ORM
- **PostgreSQL** - Database
- **Socket.io** - WebSocket server
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Jest** - Testing framework

## 📋 Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 15
- Docker & Docker Compose (for containerized deployment)

## 🚀 Quick Start

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd raso-minang
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Docker Deployment

1. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```

2. **Build and run containers**
   ```bash
   docker-compose up -d --build
   ```

3. **Run database migrations**
   ```bash
   docker-compose exec backend npx sequelize-cli db:migrate
   docker-compose exec backend npx sequelize-cli db:seed:all
   ```

4. **Access the application**
   - Frontend: http://localhost (port 80)
   - Backend API: http://localhost:3000

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                 # Run tests with coverage
npm run test:watch       # Run tests in watch mode
```

### Frontend Tests
```bash
cd frontend
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
```

## 📁 Project Structure

```
raso-minang/
├── backend/
│   ├── __tests__/           # Unit tests
│   ├── config/              # Database configuration
│   ├── controllers/         # Route controllers
│   ├── helpers/             # Utility functions
│   ├── middlewares/         # Express middlewares
│   ├── migrations/          # Database migrations
│   ├── models/              # Sequelize models
│   ├── routers/             # API routes
│   ├── seeders/             # Database seeders
│   └── index.js             # Entry point
├── frontend/
│   ├── src/
│   │   ├── __tests__/       # Unit tests
│   │   ├── components/      # React components
│   │   ├── helpers/         # Utility functions
│   │   ├── pages/           # Page components
│   │   └── types.ts         # TypeScript types
│   └── index.html           # Entry point
├── docker-compose.yml       # Docker orchestration
└── .env.example             # Environment template
```

## 🔐 Default Credentials

After seeding the database, you can login with:

- **Super Admin**
  - Email: superadmin@rasominang.id
  - Password: superadmin123

## 📡 API Endpoints

### Public Routes
- `POST /register` - User registration
- `POST /login` - User login
- `GET /menus` - Get all menu items
- `GET /menus/:id` - Get menu by ID
- `GET /categories` - Get all categories

### Protected Routes (Requires Authentication)
- `GET /carts` - Get user's cart
- `POST /carts` - Add item to cart
- `POST /orders` - Create order
- `GET /orders` - Get user's orders

### Super Admin Routes
- `GET /superadmin/users` - Get all users
- `POST /superadmin/menus` - Create menu item
- `PUT /superadmin/menus/:id` - Update menu item
- `DELETE /superadmin/menus/:id` - Delete menu item

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Backend server port | `3000` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `DB_NAME` | Database name | `rasominang` |
| `JWT_SECRET` | JWT signing secret | - |
| `KEY_CLOUDINARY` | Cloudinary API key | - |
| `SECRET_CLOUDINARY` | Cloudinary API secret | - |
| `CLOUD_CLOUDINARY` | Cloudinary cloud name | - |

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

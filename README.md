# Budget Formula - Full Stack Personal Budget Tracker

A production-grade personal budget management application built with **Node.js + React (Vite)** and **MongoDB**, featuring PIN-based authentication and comprehensive budget tracking.

## 🎯 Features

- ✅ **PIN-Based Authentication** - Secure single-user access
- ✅ **Income Tracking** - Add and track income with sources
- ✅ **Expense Management** - Track daily expenses with remarks
- ✅ **Fixed Payments** - Manage recurring payments (rent, bills, etc.)
- ✅ **Balance Calculation** - Real-time balance updates
- ✅ **Month/Year Navigation** - View budgets across any month/year
- ✅ **Responsive Design** - Works seamlessly on desktop and mobile
- ✅ **Minimal UI** - Clean white, gray, and black theme
- ✅ **Production Ready** - Optimized for Vercel deployment

## 📋 Project Structure

```
budgetformula/
├── server/                    # Node.js + Express backend
│   ├── src/
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # Auth & error handling
│   │   ├── utils/            # Helpers & config
│   │   └── index.ts          # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── client/                    # React + Vite frontend
    ├── src/
    │   ├── pages/           # Page components
    │   ├── components/      # Reusable UI components
    │   ├── services/        # API client
    │   ├── store/          # Zustand state management
    │   ├── types/          # TypeScript interfaces
    │   ├── utils/          # Helper functions
    │   ├── App.tsx         # Root component
    │   └── main.tsx        # Entry point
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### 1. Backend Setup

```bash
cd server

# Create .env file
cp .env.example .env

# Edit .env with your values
# MONGODB_URI=your_mongodb_connection_string
# PIN=1234
# USER_NAME=Kartik Upadhyay
# PORT=3000

# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build
npm start
```

### 2. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Development (runs on http://localhost:5173)
npm run dev

# Production build
npm run build
```

## 🔐 Authentication

The app uses PIN-based authentication suitable for single-user access:

**Login Credentials:**
- PIN: `1234` (configure in `.env`)
- Name: `Kartik Upadhyay` (configure in `.env`)

The authentication token is stored in localStorage and passed as `Authorization: Bearer {token}` header.

## 📊 API Endpoints

### Auth Routes (No Authentication Required)
```
POST   /api/auth/login          - Login with PIN and name
POST   /api/auth/verify         - Verify token validity
GET    /api/auth/me             - Get current user info
```

### Budget Routes (Requires Authentication)
```
GET    /api/budget/entries?month=2&year=2026     - Get entries for month/year
POST   /api/budget/entries                        - Create new entry
PUT    /api/budget/entries/:id                    - Update entry
DELETE /api/budget/entries/:id                    - Delete entry
GET    /api/budget/available-dates                - Get available months/years
```

## 💾 Database Schema

### BudgetEntry Model
```typescript
{
  date: Date,                    // Entry date
  income: Number,               // Income amount
  incomeSource: String,         // Where income came from
  expenses: Number,             // Expense amount
  expenseRemarks: String,       // What was spent on
  fixedPays: Number,           // Fixed payment (rent, bills, etc.)
  fixedPaysRemarks: String,    // Fixed payment description
  month: Number,               // 1-12
  year: Number,                // YYYY
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Technology Stack

### Backend
- **Express.js** - HTTP server framework
- **MongoDB + Mongoose** - Database & ODM
- **TypeScript** - Type safety
- **CORS** - Cross-origin requests
- **Dotenv** - Environment variables

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **date-fns** - Date utilities

## 📱 Responsive Design

The app is fully responsive with breakpoints for:
- **Mobile**: < 640px (single column layouts)
- **Tablet**: 640px - 1024px (2 column layouts)
- **Desktop**: > 1024px (full layouts)

## 🎨 Design System

### Color Palette
- **Background**: White (`#ffffff`)
- **Text**: Black (`#1f2937`) / Gray
- **Accent**: Black buttons with gray hover states
- **Status**: Green (income), Red (expenses), Orange (fixed pays)

### Component Library
Custom components built without external UI library (following shadcn approach):
- Button (with variants: primary, secondary, danger)
- Input (with validation)
- Select (dropdown)
- Card (containers)

## 🚀 Deployment (Vercel)

### Frontend Deployment

```bash
# Vercel automatically detects Vite projects
vercel deploy --prod
```

### Backend Deployment

Deploy to any Node.js hosting (Heroku, Render, Railway):

```bash
# Build
npm run build

# Ensure Procfile for Heroku:
# web: node dist/index.js
```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/budget-formula
PIN=1234
USER_NAME=Kartik Upadhyay
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-vercel-domain.vercel.app
```

### Frontend (.env.local)
```env
VITE_API_URL=https://your-backend-url.com/api
```

## 📈 Production Checklist

- [x] PIN-based authentication
- [x] Environment variable configuration
- [x] Error handling & validation
- [x] MongoDB indexing
- [x] CORS configuration
- [x] TypeScript strict mode
- [x] Responsive design
- [x] Production builds
- [x] Code splitting (Vite)
- [x] Security headers ready

## 🤝 Contributing

This is a personal project. Modifications should be made directly.

## 📄 License

MIT

## 👨‍💻 Author

Kartik Upadhyay

---

**Note**: This app is designed for single-user personal use with PIN authentication. The minimal design focuses on functionality and clarity.

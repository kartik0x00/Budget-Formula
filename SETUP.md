# Budget Formula - Setup & Installation Guide

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Database Setup](#database-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running the Application](#running-the-application)
6. [Configuration](#configuration)
7. [Troubleshooting](#troubleshooting)

## 🖥️ System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Git**: Latest version
- **MongoDB**: Atlas account (free tier works)
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Sign Up" and create a free account
3. Verify your email

### Step 2: Create a Cluster

1. Click "Create" under "Deploy a Cloud Database"
2. Choose **Free** tier (M0)
3. Select your preferred region (closest to you)
4. Click "Create"
5. Wait 1-2 minutes for cluster to be created

### Step 3: Create Database User

1. Navigate to "Database Access" section
2. Click "Add New Database User"
3. Create username and password
4. Save the credentials securely

### Step 4: Configure Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Add Current IP" or "Allow Access from Anywhere"
4. Confirm

### Step 5: Get Connection String

1. Go to "Database" section
2. Click "Connect" button
3. Select "Drivers"
4. Copy the connection string
5. Replace `<password>` with your database user password

**Example:**
```
mongodb+srv://username:password@cluster0.abcd1.mongodb.net/budget-formula?retryWrites=true&w=majority
```

## 🚀 Backend Setup

### Step 1: Navigate to Server Directory

```bash
cd /path/to/budgetformula/server
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create .env File

Create a `.env` file in the server directory:

```bash
cp .env.example .env
```

### Step 4: Configure Environment Variables

Edit `.env`:

```env
# MongoDB Connection String (from Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster0.abcd1.mongodb.net/budget-formula?retryWrites=true&w=majority

# Authentication PIN (4 digits recommended)
PIN=1234

# User Name (Your name)
USER_NAME=Kartik Upadhyay

# Server Port
PORT=3000

# Environment
NODE_ENV=development

# CORS Origin (frontend URL)
CORS_ORIGIN=http://localhost:5173
```

### Step 5: Run Backend Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Expected Output:**
```
✓ MongoDB connected
✓ Server running on http://localhost:3000
✓ Environment: development
```

### Step 6: Test Backend API

```bash
# Open another terminal and test the health endpoint
curl http://localhost:3000/health

# Should return: { "status": "ok" }
```

## 🎨 Frontend Setup

### Step 1: Navigate to Client Directory

```bash
cd /path/to/budgetformula/client
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create .env.local File

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

### Step 4: Configure Environment Variables

Edit `.env.local`:

```env
# Backend API URL
VITE_API_URL=http://localhost:3000/api
```

### Step 5: Run Frontend Development Server

```bash
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 6: Open Application

Open your browser and navigate to `http://localhost:5173`

## ▶️ Running the Application

### Terminal Setup

You'll need **3 terminal windows**:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

**Terminal 3 - For git/npm commands:**
```bash
cd /path/to/budgetformula
```

### Login to Application

1. Open `http://localhost:5173` in your browser
2. Enter PIN: `1234`
3. Enter Name: `Kartik Upadhyay`
4. Click "Login"

### Using the Application

1. **Add Budget Entry:**
   - Select date
   - Enter income (if any)
   - Enter income source (e.g., "Salary")
   - Enter expenses
   - Enter expense remarks (e.g., "Groceries")
   - Enter fixed pays (rent, bills, etc.)
   - Enter fixed pays remarks
   - Click "Add Entry"

2. **View Summary:**
   - Check the summary card at the top showing:
     - Total Income (green)
     - Expenses (red)
     - Fixed Pays (orange)
     - Money Left (balance)

3. **Change Month/Year:**
   - Use the dropdown selectors to view different months
   - All data is saved to MongoDB

4. **Edit Entry:**
   - Click "Edit" on any entry
   - Modify the fields
   - Click "Save"

5. **Delete Entry:**
   - Click "Delete" on any entry
   - Confirm the deletion

## ⚙️ Configuration

### Change PIN

Edit `server/.env`:
```env
PIN=9999  # Change to your preferred PIN
```

Restart the server.

### Change Login Username

Edit `server/.env`:
```env
USER_NAME=Your Name  # Change to your actual name
```

Restart the server.

### Change Backend Port

Edit `server/.env`:
```env
PORT=4000  # Use a different port if 3000 is occupied
```

Restart the server and update CORS_ORIGIN if needed.

### Change Frontend Port

Edit `client/vite.config.ts`:
```typescript
server: {
  port: 3000,  // Change frontend port
  // ...
}
```

Restart the frontend.

## 🔍 Troubleshooting

### Backend Issues

**Port 3000 is already in use:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change PORT in .env
PORT=3001
```

**MongoDB Connection Failed:**
1. Check if MONGODB_URI is correct in `.env`
2. Verify database user credentials
3. Check IP whitelist in MongoDB Atlas
4. Ensure internet connection

**Module not found errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

**API calls failing (CORS error):**
1. Check backend is running on correct port
2. Verify VITE_API_URL in `.env.local`
3. Check CORS_ORIGIN in backend `.env` matches frontend URL
4. Open browser DevTools → Network tab to see actual requests

**Page showing blank:**
1. Check browser console for errors (F12)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh (Ctrl+Shift+R)

**Login not working:**
1. Verify PIN is correct in backend `.env`
2. Verify username matches USER_NAME in backend `.env`
3. Check browser console for error messages
4. Ensure backend is running

### Database Issues

**No data showing after login:**
1. Verify MongoDB connection is successful
2. Check that data is being sent to API
3. Open MongoDB Atlas → Collections to see data

**Getting "Invalid token" error:**
1. Clear localStorage: Open DevTools → Application → Clear Storage
2. Refresh page and login again

## 📱 Testing on Mobile

### Local Network Testing

1. Find your computer's local IP:
```bash
# macOS/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

2. Update frontend configuration to use your IP
3. Access from mobile on same network: `http://YOUR_IP:5173`

## 📚 Next Steps

- [Deployment Guide](./DEPLOYMENT.md) - Deploy to Vercel
- [Production Guide](./PRODUCTION.md) - Production best practices
- [Main README](./README.md) - Full documentation

## ❓ Help & Support

If you encounter issues:

1. Check this guide thoroughly
2. Review error messages in terminal/console
3. Check MongoDB Atlas dashboard status
4. Review network tab in browser DevTools

---

**Happy Budget Tracking! 🎉**

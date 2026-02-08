#!/bin/bash

# Budget Formula - Quick Setup Script
# This script automates the initial setup process

set -e

echo "🚀 Budget Formula - Setup Script"
echo "================================="
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js $(node -v) detected"
echo "✓ npm $(npm -v) detected"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd server

if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit server/.env with your MongoDB URI and PIN"
fi

echo "Installing backend dependencies..."
npm install

cd ..
echo "✓ Backend setup complete"
echo ""

# Setup Frontend
echo "🎨 Setting up Frontend..."
cd client

if [ ! -f .env.local ]; then
    echo "Creating .env.local file from .env.example..."
    cp .env.example .env.local
fi

echo "Installing frontend dependencies..."
npm install

cd ..
echo "✓ Frontend setup complete"
echo ""

echo "================================="
echo "✅ Setup Complete!"
echo "================================="
echo ""
echo "Next Steps:"
echo "1. Edit server/.env with your MongoDB URI"
echo "2. Open 3 terminals and run:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   $ cd server && npm run dev"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   $ cd client && npm run dev"
echo ""
echo "   Terminal 3 (Additional commands):"
echo "   $ cd /path/to/budgetformula"
echo ""
echo "3. Open http://localhost:5173 in your browser"
echo "4. Login with:"
echo "   PIN: 1234"
echo "   Name: Kartik Upadhyay"
echo ""
echo "📚 See SETUP.md for detailed configuration instructions"
echo ""

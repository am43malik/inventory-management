#!/bin/bash

# Retail Shop Inventory Management System - Quick Start Script

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Retail Shop Inventory Management System - Quick Start     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
MONGODB_URI=mongodb://localhost:27017/inventory_shop
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-super-secret-nextauth-key-change-this
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
EOF
    echo "✅ .env.local created"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

echo "🏗️  Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║              Setup Complete! Next Steps:                   ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║                                                            ║"
echo "║  1. Start MongoDB:                                         ║"
echo "║     mongod                                                 ║"
echo "║                                                            ║"
echo "║  2. Run development server:                                ║"
echo "║     npm run dev                                            ║"
echo "║                                                            ║"
echo "║  3. Open http://localhost:3000 in your browser             ║"
echo "║                                                            ║"
echo "║  4. Register an account                                    ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📚 Documentation:"
echo "   - Setup Guide: SETUP_GUIDE.md"
echo "   - API Docs: API_DOCUMENTATION.md"
echo "   - Project Summary: PROJECT_SUMMARY.md"
echo ""

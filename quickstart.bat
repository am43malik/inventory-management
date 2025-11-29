@echo off
REM Retail Shop Inventory Management System - Quick Start Script (Windows)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  Retail Shop Inventory Management System - Quick Start     ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js version:
node -v
echo ✅ npm version:
npm -v
echo.

REM Check if .env.local exists
if not exist ".env.local" (
    echo 📝 Creating .env.local file...
    (
        echo MONGODB_URI=mongodb://localhost:27017/inventory_shop
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo NEXTAUTH_SECRET=your-super-secret-nextauth-key-change-this
        echo NEXTAUTH_URL=http://localhost:3000
        echo NODE_ENV=development
        echo NEXT_PUBLIC_API_URL=http://localhost:3000/api
    ) > .env.local
    echo ✅ .env.local created
) else (
    echo ✅ .env.local already exists
)

echo.
echo 📦 Installing dependencies...
call npm install --legacy-peer-deps

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

echo 🏗️  Building application...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build successful
echo.

echo ╔════════════════════════════════════════════════════════════╗
echo ║              Setup Complete! Next Steps:                   ║
echo ╠════════════════════════════════════════════════════════════╣
echo ║                                                            ║
echo ║  1. Start MongoDB:                                         ║
echo ║     mongod                                                 ║
echo ║                                                            ║
echo ║  2. Run development server:                                ║
echo ║     npm run dev                                            ║
echo ║                                                            ║
echo ║  3. Open http://localhost:3000 in your browser             ║
echo ║                                                            ║
echo ║  4. Register an account                                    ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📚 Documentation:
echo    - Setup Guide: SETUP_GUIDE.md
echo    - API Docs: API_DOCUMENTATION.md
echo    - Project Summary: PROJECT_SUMMARY.md
echo.
pause

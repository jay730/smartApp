@echo off
echo 🐳 Starting SmartApp with Docker Compose...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    echo Download from: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo ✅ Docker is running!

REM Try to start services with docker-compose
echo 🚀 Starting services...
docker-compose -f docker-compose.yml up -d

if errorlevel 1 (
    echo ⚠️  docker-compose failed, trying 'docker compose'...
    docker compose -f docker-compose.yml up -d
)

echo.
echo ✅ Services started!
echo 🌐 Backend API: http://localhost:5000
echo 🗄️  PostgreSQL: localhost:5432
echo.
echo 📋 Useful commands:
echo    View logs: docker-compose -f docker-compose.yml logs -f
echo    Stop services: docker-compose -f docker-compose.yml down
echo    Check status: docker-compose -f docker-compose.yml ps
echo.
pause

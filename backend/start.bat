@echo off
echo Starting SmartApp with Podman Compose...

REM Check if podman-compose is installed
podman-compose --version >nul 2>&1
if errorlevel 1 (
    echo Installing podman-compose...
    pip3 install podman-compose
)

REM Start the services
echo Starting services...
podman-compose -f podman-compose.yml up -d

echo.
echo Services started! Check status with: podman-compose -f podman-compose.yml ps
echo View logs with: podman-compose -f podman-compose.yml logs -f
echo.
pause

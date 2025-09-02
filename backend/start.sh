#!/bin/bash

echo "🚀 Starting SmartApp with Podman Compose..."

# Detect operating system
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
    COMPOSE_FILE="podman-compose-mac.yml"
    echo "🍎 Detected macOS - using macOS-optimized configuration"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    COMPOSE_FILE="podman-compose.yml"
    echo "🐧 Detected Linux - using standard configuration"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
    COMPOSE_FILE="podman-compose.yml"
    echo "🪟 Detected Windows - using standard configuration"
else
    OS="unknown"
    COMPOSE_FILE="podman-compose.yml"
    echo "❓ Unknown OS - using standard configuration"
fi

# Check if podman-compose is installed
if ! command -v podman-compose &> /dev/null; then
    echo "📦 Installing podman-compose..."
    pip3 install podman-compose
fi

# macOS-specific setup
if [[ "$OS" == "macos" ]]; then
    # Check if Podman machine is running
    if ! podman machine list | grep -q "Running"; then
        echo "🔧 Starting Podman machine..."
        podman machine start smartapp 2>/dev/null || podman machine start
    fi
    
    # Wait for machine to be ready
    echo "⏳ Waiting for Podman machine to be ready..."
    sleep 5
fi

# Start the services
echo "🚀 Starting services with $COMPOSE_FILE..."
podman-compose -f $COMPOSE_FILE up -d

# Wait a moment for services to start
sleep 3

# Check service status
echo "📊 Service Status:"
podman-compose -f $COMPOSE_FILE ps

echo ""
echo "✅ Services started successfully!"
echo "🌐 Backend API: http://localhost:5000"
echo "🗄️  PostgreSQL: localhost:5432"
echo ""
echo "📋 Useful commands:"
echo "   View logs: podman-compose -f $COMPOSE_FILE logs -f"
echo "   Stop services: podman-compose -f $COMPOSE_FILE down"
echo "   Check status: podman-compose -f $COMPOSE_FILE ps"

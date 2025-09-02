#!/bin/bash

echo "🚀 Starting SmartApp with Podman Compose on macOS..."

# Check if Podman is installed
if ! command -v podman &> /dev/null; then
    echo "❌ Podman is not installed. Installing with Homebrew..."
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew is not installed. Please install Homebrew first:"
        echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    brew install podman
fi

# Check if podman-compose is installed
if ! command -v podman-compose &> /dev/null; then
    echo "📦 Installing podman-compose..."
    pip3 install podman-compose
fi

# Initialize Podman machine if not running (macOS requirement)
if ! podman machine list | grep -q "Running"; then
    echo "🔧 Initializing Podman machine..."
    podman machine init
    podman machine start
fi

# Wait for machine to be ready
echo "⏳ Waiting for Podman machine to be ready..."
sleep 5

# Check if ports are available
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 5000 is already in use. Stopping existing service..."
    podman-compose -f podman-compose-mac.yml down 2>/dev/null || true
fi

if lsof -Pi :5432 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 5432 is already in use. Stopping existing service..."
    podman-compose -f podman-compose-mac.yml down 2>/dev/null || true
fi

# Start the services
echo "🚀 Starting services..."
podman-compose -f podman-compose-mac.yml up -d

# Wait a moment for services to start
sleep 3

# Check service status
echo "📊 Service Status:"
podman-compose -f podman-compose-mac.yml ps

echo ""
echo "✅ Services started successfully!"
echo "🌐 Backend API: http://localhost:5000"
echo "🗄️  PostgreSQL: localhost:5432"
echo ""
echo "📋 Useful commands:"
echo "   View logs: podman-compose -f podman-compose-mac.yml logs -f"
echo "   Stop services: podman-compose -f podman-compose-mac.yml down"
echo "   Check status: podman-compose -f podman-compose-mac.yml ps"

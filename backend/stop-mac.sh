#!/bin/bash

echo "🛑 Stopping SmartApp services on macOS..."

# Stop the services
echo "📦 Stopping containers..."
podman-compose -f podman-compose-mac.yml down

# Check if we should stop the Podman machine
read -p "🤔 Do you want to stop the Podman machine as well? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🖥️  Stopping Podman machine..."
    podman machine stop
    echo "✅ Podman machine stopped"
else
    echo "ℹ️  Podman machine kept running for future use"
fi

echo ""
echo "✅ Services stopped successfully!"
echo ""
echo "📋 Cleanup options:"
echo "   Remove all containers and volumes: podman-compose -f podman-compose-mac.yml down -v"
echo "   Clean up images: podman system prune -a"
echo "   Stop Podman machine: podman machine stop"

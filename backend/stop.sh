#!/bin/bash

echo "🛑 Stopping SmartApp services..."

# Detect operating system and compose file
if [[ "$OSTYPE" == "darwin"* ]]; then
    COMPOSE_FILE="podman-compose-mac.yml"
    echo "🍎 Using macOS configuration"
else
    COMPOSE_FILE="podman-compose.yml"
    echo "🪟 Using standard configuration"
fi

# Stop the services
echo "📦 Stopping containers..."
podman-compose -f $COMPOSE_FILE down

echo "✅ Services stopped!"
echo "To remove all containers and volumes, run: podman-compose -f $COMPOSE_FILE down -v"

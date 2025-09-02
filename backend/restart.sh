#!/bin/bash

echo "Restarting SmartApp services..."

# Stop services
podman-compose -f podman-compose.yml down

# Start services
podman-compose -f podman-compose.yml up -d

echo "Services restarted!"
echo "Check status with: podman-compose -f podman-compose.yml ps"

Write-Host "Starting SmartApp with Podman Compose..." -ForegroundColor Green

# Check if podman-compose is installed
try {
    $null = Get-Command podman-compose -ErrorAction Stop
    Write-Host "podman-compose found!" -ForegroundColor Green
} catch {
    Write-Host "podman-compose is not installed. Installing..." -ForegroundColor Yellow
    pip3 install podman-compose
}

# Start the services
podman-compose -f podman-compose.yml up -d

Write-Host "Services started! Check status with: podman-compose -f podman-compose.yml ps" -ForegroundColor Green
Write-Host "View logs with: podman-compose -f podman-compose.yml logs -f" -ForegroundColor Green

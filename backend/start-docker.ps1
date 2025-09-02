Write-Host "🐳 Starting SmartApp with Docker Compose..." -ForegroundColor Green

# Check if Docker is installed
try {
    $null = Get-Command docker -ErrorAction Stop
    Write-Host "✅ Docker found!" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first:" -ForegroundColor Red
    Write-Host "   https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running!" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if docker-compose is available
try {
    $null = Get-Command docker-compose -ErrorAction Stop
    Write-Host "✅ Docker Compose found!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Docker Compose not found, trying 'docker compose'..." -ForegroundColor Yellow
    try {
        docker compose version | Out-Null
        Write-Host "✅ Docker Compose (v2) found!" -ForegroundColor Green
        $DOCKER_COMPOSE_CMD = "docker compose"
    } catch {
        Write-Host "❌ Neither docker-compose nor 'docker compose' found." -ForegroundColor Red
        exit 1
    }
} catch {
    $DOCKER_COMPOSE_CMD = "docker-compose"
}

# Start the services
Write-Host "🚀 Starting services..." -ForegroundColor Blue
if ($DOCKER_COMPOSE_CMD -eq "docker compose") {
    docker compose -f docker-compose.yml up -d
} else {
    docker-compose -f docker-compose.yml up -d
}

# Wait a moment for services to start
Start-Sleep -Seconds 3

# Check service status
Write-Host "📊 Service Status:" -ForegroundColor Blue
if ($DOCKER_COMPOSE_CMD -eq "docker compose") {
    docker compose -f docker-compose.yml ps
} else {
    docker-compose -f docker-compose.yml ps
}

Write-Host ""
Write-Host "✅ Services started successfully!" -ForegroundColor Green
Write-Host "🌐 Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🗄️  PostgreSQL: localhost:5432" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Useful commands:" -ForegroundColor Yellow
if ($DOCKER_COMPOSE_CMD -eq "docker compose") {
    Write-Host "   View logs: docker compose -f docker-compose.yml logs -f" -ForegroundColor White
    Write-Host "   Stop services: docker compose -f docker-compose.yml down" -ForegroundColor White
    Write-Host "   Check status: docker compose -f docker-compose.yml ps" -ForegroundColor White
} else {
    Write-Host "   View logs: docker-compose -f docker-compose.yml logs -f" -ForegroundColor White
    Write-Host "   Stop services: docker-compose -f docker-compose.yml down" -ForegroundColor White
    Write-Host "   Check status: docker-compose -f docker-compose.yml ps" -ForegroundColor White
}

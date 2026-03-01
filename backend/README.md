# SmartApp Backend with Podman

This backend is containerized using Podman instead of Docker for better security and compatibility across all platforms.

## 🚀 Quick Start

### Windows (PowerShell)
```powershell
.\start.ps1
```

### macOS
```bash
chmod +x setup-mac.sh
./setup-mac.sh
./start-mac.sh
```

### Linux
```bash
chmod +x start.sh
./start.sh
```

## 📋 Prerequisites

### All Platforms
- **Podman** - Container runtime
- **podman-compose** - Container orchestration

### Platform-Specific Installation

#### Windows
1. Download Podman from [https://podman.io/getting-started/installation#windows](https://podman.io/getting-started/installation#windows)
2. Install podman-compose: `pip3 install podman-compose`

#### macOS
1. Install Homebrew: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
2. Install Podman: `brew install podman`
3. Install podman-compose: `pip3 install podman-compose`
4. Run setup: `./setup-mac.sh`

#### Linux
1. Install Podman using your distribution's package manager
2. Install podman-compose: `pip3 install podman-compose`

## 🏗️ Architecture

### Services
- **PostgreSQL 15** - Database (port 5432)
- **Node.js Backend** - API server (port 5000)

### Configuration Files
- `podman-compose.yml` - Standard configuration (Windows/Linux)
- `podman-compose-mac.yml` - macOS-optimized configuration
- `Dockerfile` - Container image definition

## 🎯 Usage

### Start Services
```bash
# Cross-platform (auto-detects OS)
./start.sh

# Platform-specific
./start-mac.sh      # macOS
./start.ps1         # Windows PowerShell
```

### Stop Services
```bash
# Cross-platform
./stop.sh

# Platform-specific
./stop-mac.sh       # macOS
```

### Check Status
```bash
# All platforms
podman-compose -f podman-compose.yml ps
podman-compose -f podman-compose-mac.yml ps  # macOS
```

### View Logs
```bash
# All services
podman-compose -f podman-compose.yml logs -f

# Specific service
podman-compose -f podman-compose.yml logs backend
podman-compose -f podman-compose.yml logs postgres
```

## 🔧 Development

### Live Code Reload
Source code is mounted as volumes, so changes are reflected immediately without rebuilding containers.

### Database Access
```bash
# Connect to PostgreSQL
podman exec -it smartapp_postgres psql -U postgres -d toDoList

# Create tables (manual schema)
podman exec -i smartapp_postgres psql -U postgres -d toDoList < schema.sql
```

### Container Shell Access
```bash
# Backend container
podman exec -it smartapp_backend sh

# PostgreSQL container
podman exec -it smartapp_postgres sh
```

## 🌍 Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `DB_HOST` | `postgres` | Database hostname |
| `DB_PORT` | `5432` | Database port |
| `DB_USER` | `postgres` | Database username |
| `DB_PASS` | `postgres123` | Database password |
| `DB_NAME` | `toDoList` | Database name |
| `NODE_ENV` | `development` | Node.js environment |
| `PORT` | `5000` | Backend API port |

## 📁 Volumes

- **`postgres_data`** - Persistent PostgreSQL data
- **`./uploads`** - File uploads directory
- **`./src`** - Source code (development)
- **`./schema.sql`** - Database schema
- **`./package.json`** - Dependencies
- **`node_modules`** - Node.js modules (macOS only)

## 🚨 Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check what's using the ports
lsof -i :5000
lsof -i :5432

# Stop conflicting services or change ports in compose files
```

#### Permission Issues
- **Windows**: Run PowerShell as Administrator
- **macOS**: Ensure proper file permissions
- **Linux**: Use `:Z` suffix in volume mounts (already configured)

#### Container Won't Start
```bash
# Check logs
podman-compose logs backend
podman-compose logs postgres

# Rebuild containers
podman-compose up -d --build
```

#### Database Connection Issues
```bash
# Check PostgreSQL health
podman exec smartapp_postgres pg_isready -U postgres

# Restart services
./restart.sh
```

### macOS-Specific

#### Podman Machine Issues
```bash
# List machines
podman machine list

# Start machine
podman machine start smartapp

# Reset machine (if needed)
podman machine rm smartapp
podman machine init smartapp
```

## 🧹 Cleanup

### Remove Everything
```bash
# Stop and remove containers/volumes
podman-compose -f podman-compose.yml down -v
podman-compose -f podman-compose-mac.yml down -v  # macOS

# Clean up images
podman system prune -a

# Stop Podman machine (macOS)
podman machine stop smartapp
```

## 🔄 Migration from Docker

1. Stop Docker services: `docker-compose down`
2. Install Podman and podman-compose
3. Use the provided scripts or podman-compose commands
4. Compose files are compatible with both Docker and Podman

## 📚 Additional Resources

- [Podman Documentation](https://docs.podman.io/)
- [Podman Compose](https://github.com/containers/podman-compose)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Node.js Docker Hub](https://hub.docker.com/_/node)

## 🤝 Contributing

When making changes:
1. Test on your target platform
2. Update relevant scripts and documentation
3. Ensure cross-platform compatibility
4. Test with both compose files if making volume or network changes

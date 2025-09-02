# SmartApp Backend with Podman

This backend is containerized using Podman instead of Docker for better security and compatibility.

## Prerequisites

1. **Podman** - Install Podman on your system
   - Windows: Download from https://podman.io/getting-started/installation#windows
   - macOS: `brew install podman`
   - Linux: Follow distribution-specific instructions

2. **Podman Compose** - Install podman-compose
   ```bash
   pip3 install podman-compose
   ```

## Quick Start

### Using Scripts (Recommended)

**Windows (PowerShell):**
```powershell
.\start.ps1
```

**Linux/macOS:**
```bash
chmod +x start.sh
./start.sh
```

### Manual Commands

1. **Start services:**
   ```bash
   podman-compose -f podman-compose.yml up -d
   ```

2. **Check status:**
   ```bash
   podman-compose -f podman-compose.yml ps
   ```

3. **View logs:**
   ```bash
   podman-compose -f podman-compose.yml logs -f
   ```

4. **Stop services:**
   ```bash
   podman-compose -f podman-compose.yml down
   ```

## Services

### PostgreSQL Database
- **Port:** 5432
- **Database:** toDoList
- **User:** postgres
- **Password:** postgres123
- **Container:** smartapp_postgres

### Backend API
- **Port:** 5000
- **Container:** smartapp_backend
- **Depends on:** PostgreSQL

## Environment Variables

The backend uses these environment variables (configured in podman-compose.yml):
- `DB_HOST`: postgres (container name)
- `DB_PORT`: 5432
- `DB_USER`: postgres
- `DB_PASS`: postgres123
- `DB_NAME`: toDoList
- `NODE_ENV`: development
- `PORT`: 5000

## Volumes

- **postgres_data:** Persistent PostgreSQL data
- **./uploads:** File uploads directory
- **./src:** Source code for development
- **./knexfile.ts:** Database configuration
- **./package.json:** Dependencies

## Development

For development, the source code is mounted as a volume, so changes are reflected immediately without rebuilding the container.

## Troubleshooting

1. **Port conflicts:** Ensure ports 5000 and 5432 are available
2. **Permission issues:** The `:Z` suffix on volumes handles SELinux contexts
3. **Container won't start:** Check logs with `podman-compose logs backend`
4. **Database connection issues:** Ensure PostgreSQL container is healthy

## Useful Commands

```bash
# Rebuild and restart
podman-compose -f podman-compose.yml up -d --build

# View specific service logs
podman-compose -f podman-compose.yml logs backend
podman-compose -f podman-compose.yml logs postgres

# Execute commands in running container
podman exec -it smartapp_backend sh
podman exec -it smartapp_postgres psql -U postgres -d toDoList

# Clean up everything
podman-compose -f podman-compose.yml down -v
podman system prune -a
```

## Migration from Docker

If you were previously using Docker:
1. Stop Docker services: `docker-compose down`
2. Use the provided scripts or podman-compose commands
3. The compose files are compatible with both Docker and Podman

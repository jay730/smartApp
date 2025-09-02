#!/bin/bash

echo "🍎 Setting up SmartApp Backend for macOS..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Homebrew is installed
print_status "Checking Homebrew installation..."
if ! command -v brew &> /dev/null; then
    print_warning "Homebrew not found. Installing..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for current session
    eval "$(/opt/homebrew/bin/brew shellenv)"
    
    if ! command -v brew &> /dev/null; then
        print_error "Failed to install Homebrew. Please install manually and try again."
        exit 1
    fi
    print_success "Homebrew installed successfully!"
else
    print_success "Homebrew found!"
fi

# Update Homebrew
print_status "Updating Homebrew packages..."
brew update

# Install Podman
print_status "Installing Podman..."
if ! command -v podman &> /dev/null; then
    brew install podman
    print_success "Podman installed successfully!"
else
    print_success "Podman already installed!"
fi

# Install Python3 and pip if not present
print_status "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    print_warning "Python3 not found. Installing..."
    brew install python
    print_success "Python3 installed successfully!"
else
    print_success "Python3 found!"
fi

# Install podman-compose
print_status "Installing podman-compose..."
if ! command -v podman-compose &> /dev/null; then
    pip3 install podman-compose
    print_success "podman-compose installed successfully!"
else
    print_success "podman-compose already installed!"
fi

# Initialize Podman machine
print_status "Setting up Podman machine..."
if ! podman machine list | grep -q "Running"; then
    if ! podman machine list | grep -q "smartapp"; then
        print_status "Creating Podman machine..."
        podman machine init smartapp --cpus 2 --memory 4096 --disk-size 20
    fi
    
    print_status "Starting Podman machine..."
    podman machine start smartapp
    
    # Wait for machine to be ready
    print_status "Waiting for machine to be ready..."
    sleep 10
else
    print_success "Podman machine already running!"
fi

# Check if ports are available
print_status "Checking port availability..."
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Port 5000 is in use. Please free up this port before continuing."
fi

if lsof -Pi :5432 -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Port 5432 is in use. Please free up this port before continuing."
fi

# Make scripts executable
print_status "Setting up scripts..."
chmod +x start-mac.sh
chmod +x stop-mac.sh
chmod +x start.sh
chmod +x stop.sh
chmod +x restart.sh

print_success "Setup completed successfully!"
echo ""
echo "🚀 To start your services, run:"
echo "   ./start-mac.sh"
echo ""
echo "🛑 To stop your services, run:"
echo "   ./stop-mac.sh"
echo ""
echo "📋 Additional commands:"
echo "   Check Podman machine status: podman machine list"
echo "   View machine info: podman machine inspect smartapp"
echo "   Stop machine: podman machine stop smartapp"
echo "   Start machine: podman machine start smartapp"

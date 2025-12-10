#!/bin/bash
# =================================================================
# RealPro Suite - Deployment Script
# =================================================================
# Usage:
#   ./scripts/deploy.sh [command]
#
# Commands:
#   build      - Build the application for production
#   docker     - Build and run Docker container
#   preview    - Preview production build locally
#   check      - Run all quality checks
#   help       - Show this help message
# =================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored message
print_msg() {
    echo -e "${2}${1}${NC}"
}

# Check if .env file exists
check_env() {
    if [ ! -f .env ]; then
        print_msg "Warning: .env file not found!" "$YELLOW"
        print_msg "Copy .env.example to .env and fill in your values:" "$YELLOW"
        print_msg "  cp .env.example .env" "$BLUE"
        echo ""
    fi
}

# Build the application
build() {
    print_msg "Building RealPro Suite..." "$BLUE"
    check_env
    npm ci
    npm run build
    print_msg "Build completed! Output in ./dist/" "$GREEN"
}

# Run quality checks
check() {
    print_msg "Running quality checks..." "$BLUE"

    print_msg "Running ESLint..." "$YELLOW"
    npm run lint

    print_msg "Running TypeScript check..." "$YELLOW"
    npm run typecheck

    print_msg "All checks passed!" "$GREEN"
}

# Build and run Docker container
docker_run() {
    print_msg "Building Docker image..." "$BLUE"
    check_env

    if [ -f .env ]; then
        source .env
        docker build \
            --build-arg VITE_SUPABASE_URL="${VITE_SUPABASE_URL}" \
            --build-arg VITE_SUPABASE_ANON_KEY="${VITE_SUPABASE_ANON_KEY}" \
            --build-arg VITE_APP_ENV="${VITE_APP_ENV:-production}" \
            -t realpro-frontend .
    else
        print_msg "Error: .env file required for Docker build" "$RED"
        exit 1
    fi

    print_msg "Starting container..." "$BLUE"
    docker run -d -p 3000:80 --name realpro-app realpro-frontend

    print_msg "Application running at http://localhost:3000" "$GREEN"
}

# Preview production build
preview() {
    print_msg "Starting preview server..." "$BLUE"
    check_env

    if [ ! -d "dist" ]; then
        print_msg "Building application first..." "$YELLOW"
        build
    fi

    npm run preview
}

# Docker compose up
compose_up() {
    print_msg "Starting with Docker Compose..." "$BLUE"
    check_env
    docker-compose up -d --build
    print_msg "Application running at http://localhost:3000" "$GREEN"
}

# Docker compose down
compose_down() {
    print_msg "Stopping Docker Compose..." "$BLUE"
    docker-compose down
    print_msg "Containers stopped" "$GREEN"
}

# Show help
show_help() {
    echo ""
    print_msg "RealPro Suite - Deployment Script" "$BLUE"
    echo ""
    echo "Usage: ./scripts/deploy.sh [command]"
    echo ""
    echo "Commands:"
    echo "  build        Build the application for production"
    echo "  check        Run lint and type checks"
    echo "  preview      Preview production build locally"
    echo "  docker       Build and run Docker container"
    echo "  up           Start with Docker Compose"
    echo "  down         Stop Docker Compose"
    echo "  help         Show this help message"
    echo ""
    echo "Environment Setup:"
    echo "  1. Copy .env.example to .env"
    echo "  2. Fill in your Supabase credentials"
    echo ""
    echo "Quick Start:"
    echo "  ./scripts/deploy.sh build    # Build for production"
    echo "  ./scripts/deploy.sh up       # Start with Docker"
    echo ""
}

# Main entry point
case "${1:-help}" in
    build)
        build
        ;;
    check)
        check
        ;;
    preview)
        preview
        ;;
    docker)
        docker_run
        ;;
    up)
        compose_up
        ;;
    down)
        compose_down
        ;;
    help|*)
        show_help
        ;;
esac

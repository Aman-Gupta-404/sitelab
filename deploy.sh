#!/bin/bash

set -euo pipefail

PROJECT_DIR="/var/www/sitelab"

log() {
    echo
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "Loading Node.js environment..."

export NVM_DIR="$HOME/.nvm"

if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
else
    echo "ERROR: nvm not found at $NVM_DIR"
    exit 1
fi

log "Using:"
echo "Node : $(node -v)"
echo "PNPM : $(pnpm -v)"
echo "PM2  : $(pm2 -v)"

log "Changing directory"

cd "$PROJECT_DIR"

log "Pulling latest code"

git pull origin main

log "Installing dependencies"

pnpm install --frozen-lockfile

log "Building Turborepo"

pnpm turbo build

log "Reloading PM2"

pm2 reload ecosystem.config.cjs --update-env

log "Deployment completed successfully 🚀"
#!/bin/bash

set -e

echo "===== Loading Node ====="

export NVM_DIR="$HOME/.nvm"

if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
fi

echo "Node: $(node -v)"
echo "PNPM: $(pnpm -v)"

echo "===== Pulling latest code ====="

cd /var/www/sitelab

git pull origin main

echo "===== Installing dependencies ====="

pnpm install --frozen-lockfile

echo "===== Building project ====="

pnpm turbo build

echo "===== Reloading PM2 ====="

pm2 reload ecosystem.config.cjs

echo "===== Deployment Complete ====="
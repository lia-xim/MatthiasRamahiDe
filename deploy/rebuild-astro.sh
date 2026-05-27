#!/usr/bin/env sh
set -eu

APP_DIR="${APP_DIR:-/srv/matthias-ramahi}"
SERVICE_NAME="${SERVICE_NAME:-matthias-ramahi-web}"

cd "$APP_DIR"
git fetch --all --prune
git pull --ff-only
corepack pnpm install --frozen-lockfile
corepack pnpm --filter @matthias-ramahi/web build
systemctl restart "$SERVICE_NAME"

echo "Astro rebuild complete"

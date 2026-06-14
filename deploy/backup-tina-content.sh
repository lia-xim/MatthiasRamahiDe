#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/home/contextter/matthias-ramahi-tina-staging}"
BACKUP_DIR="${BACKUP_DIR:-$APP_DIR/backups/tina-content}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
STAMP="$(date -u +%Y%m%d-%H%M%S)"
ARCHIVE="$BACKUP_DIR/tina-content-$STAMP.tar.gz"

mkdir -p "$BACKUP_DIR"

tar -czf "$ARCHIVE" -C "$APP_DIR" \
  apps/web/content \
  apps/web/public/admin \
  apps/web/public/uploads \
  apps/web/src/data \
  apps/web/tina \
  deploy/compose.tina-staging.yml \
  deploy/publish-tina-to-git.sh \
  deploy/publish-tina-vercel.sh \
  deploy/publish-tina-production.sh \
  deploy/nginx-tina-cms-public.conf

if [[ "$RETENTION_DAYS" =~ ^[0-9]+$ ]] && [[ "$RETENTION_DAYS" -gt 0 ]]; then
  find "$BACKUP_DIR" -type f -name 'tina-content-*.tar.gz' -mtime "+$RETENTION_DAYS" -delete
fi

printf 'Tina content backup created: %s\n' "$ARCHIVE"

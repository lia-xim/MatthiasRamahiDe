#!/usr/bin/env sh
set -eu

BACKUP_ROOT="${BACKUP_ROOT:-/srv/backups/matthias-ramahi}"
STAMP="$(date -u +%Y%m%d-%H%M%S)"
TARGET="$BACKUP_ROOT/$STAMP"

mkdir -p "$TARGET"

if [ -z "${DATABASE_URI:-}" ]; then
  echo "DATABASE_URI is required" >&2
  exit 1
fi

pg_dump "$DATABASE_URI" | gzip > "$TARGET/payload.sql.gz"

if [ -d "${PAYLOAD_MEDIA_DIR:-/srv/matthias-ramahi/apps/cms/media}" ]; then
  tar -C "$(dirname "$PAYLOAD_MEDIA_DIR")" -czf "$TARGET/media.tar.gz" "$(basename "$PAYLOAD_MEDIA_DIR")"
fi

find "$BACKUP_ROOT" -mindepth 1 -maxdepth 1 -type d -mtime +"${BACKUP_RETENTION_DAYS:-14}" -exec rm -rf {} +

echo "Backup written to $TARGET"

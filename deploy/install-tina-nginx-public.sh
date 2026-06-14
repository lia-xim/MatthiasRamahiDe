#!/bin/sh
set -eu

host_root="${HOST_ROOT:-/host}"
source_conf="$host_root/home/contextter/matthias-ramahi-tina-staging/deploy/nginx-tina-cms-public.conf"
target_conf="$host_root/etc/nginx/sites-available/matthias-ramahi-cms.conf"
htpasswd_file="$host_root/etc/nginx/.htpasswd-tina-cms"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"

if [ -z "${HTPASSWD_HASH:-}" ]; then
  echo "HTPASSWD_HASH is required" >&2
  exit 1
fi

if [ ! -f "$source_conf" ]; then
  echo "Missing source config: $source_conf" >&2
  exit 1
fi

cp "$target_conf" "$target_conf.payload-backup-$timestamp"
cp "$source_conf" "$target_conf"
printf 'matthias:%s\n' "$HTPASSWD_HASH" > "$htpasswd_file"

chown root:root "$target_conf"
chown root:33 "$htpasswd_file"
chmod 644 "$target_conf"
chmod 640 "$htpasswd_file"

ls -la "$target_conf" "$htpasswd_file"
echo "backup=${target_conf#$host_root}.payload-backup-$timestamp"

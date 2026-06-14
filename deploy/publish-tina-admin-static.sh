#!/bin/sh
set -eu

host_root="${HOST_ROOT:-/host}"
archive="$host_root/home/contextter/matthias-ramahi-tina-staging/.tmp/tina-admin-static.tar.gz"
target_root="$host_root/var/www/matthias-ramahi-tina"
tmp_root="$host_root/var/www/matthias-ramahi-tina.tmp"
backup_root="$host_root/var/www/matthias-ramahi-tina.prev"

if [ ! -f "$archive" ]; then
  echo "Missing admin archive: $archive" >&2
  exit 1
fi

case "$tmp_root" in
  "$host_root"/var/www/matthias-ramahi-tina.tmp) ;;
  *) echo "Refusing unexpected tmp path: $tmp_root" >&2; exit 1 ;;
esac

rm -rf "$tmp_root"
mkdir -p "$tmp_root"
tar -xzf "$archive" -C "$tmp_root"

chown -R root:33 "$tmp_root"
find "$tmp_root" -type d -exec chmod 755 {} \;
find "$tmp_root" -type f -exec chmod 644 {} \;

rm -rf "$backup_root"
if [ -d "$target_root" ]; then
  mv "$target_root" "$backup_root"
fi
mv "$tmp_root" "$target_root"

find "$target_root/admin" -maxdepth 2 -type f | sort | sed -n '1,20p'

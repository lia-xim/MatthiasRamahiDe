#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-/home/contextter/matthias-ramahi}"
SITE_NAME="matthias-ramahi-cms.conf"
DOMAIN="cms.matthiasramahi.de"

cd "$PROJECT_DIR"

sudo cp deploy/nginx-payload-cms.conf "/etc/nginx/sites-available/$SITE_NAME"
if [ ! -e "/etc/nginx/sites-enabled/$SITE_NAME" ]; then
  sudo ln -s "/etc/nginx/sites-available/$SITE_NAME" "/etc/nginx/sites-enabled/$SITE_NAME"
fi

sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d "$DOMAIN"

if grep -q '^PAYLOAD_BIND_ADDRESS=' deploy/production.env; then
  sed -i 's#^PAYLOAD_BIND_ADDRESS=.*#PAYLOAD_BIND_ADDRESS=127.0.0.1#' deploy/production.env
else
  printf '\nPAYLOAD_BIND_ADDRESS=127.0.0.1\n' >> deploy/production.env
fi

if grep -q '^PAYLOAD_PUBLIC_SERVER_URL=' deploy/production.env; then
  sed -i 's#^PAYLOAD_PUBLIC_SERVER_URL=.*#PAYLOAD_PUBLIC_SERVER_URL=https://cms.matthiasramahi.de#' deploy/production.env
else
  printf 'PAYLOAD_PUBLIC_SERVER_URL=https://cms.matthiasramahi.de\n' >> deploy/production.env
fi

docker compose -f deploy/compose.hetzner.yml --env-file deploy/production.env up -d cms

curl -I "https://$DOMAIN/admin/login"

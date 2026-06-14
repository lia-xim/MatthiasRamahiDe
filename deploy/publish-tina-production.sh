#!/bin/sh
set -eu

APP_DIR="${APP_DIR:-/home/contextter/matthias-ramahi-tina-staging}"
COMPOSE_FILE="${COMPOSE_FILE:-deploy/compose.tina-staging.yml}"
SITE_PORT="${TINA_SITE_PORT:-4335}"
SKIP_PREFLIGHT="${SKIP_PREFLIGHT:-0}"
PUBLISH_TO_GIT="${PUBLISH_TO_GIT:-0}"

cd "$APP_DIR"

if [ -x deploy/backup-tina-content.sh ]; then
  deploy/backup-tina-content.sh
fi

docker compose -f "$COMPOSE_FILE" build tina-web
docker compose -f "$COMPOSE_FILE" up -d tina-web tina-site

attempt=1
while [ "$attempt" -le 60 ]; do
  if curl -fsS "http://127.0.0.1:$SITE_PORT/" >/dev/null 2>&1; then
    break
  fi
  attempt=$((attempt + 1))
  sleep 1
done

if [ "$attempt" -gt 60 ]; then
  echo "Production site did not become ready on 127.0.0.1:$SITE_PORT" >&2
  docker compose -f "$COMPOSE_FILE" ps
  docker compose -f "$COMPOSE_FILE" logs --tail=120 tina-site
  exit 1
fi

if [ "$SKIP_PREFLIGHT" != "1" ]; then
  docker compose -f "$COMPOSE_FILE" exec -T tina-site sh -lc \
    'node tools/tina-preflight.mjs --base-url=http://127.0.0.1:4321 --skip-build'
fi

if [ "$PUBLISH_TO_GIT" = "1" ]; then
  deploy/publish-tina-to-git.sh
fi

docker compose -f "$COMPOSE_FILE" ps
echo "Tina production site published on 127.0.0.1:$SITE_PORT"

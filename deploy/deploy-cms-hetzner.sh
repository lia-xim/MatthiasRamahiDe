#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/home/contextter/matthias-ramahi}"
GIT_REMOTE="${GIT_REMOTE:-origin}"
GIT_BRANCH="${GIT_BRANCH:-main}"
COMPOSE_FILE="${COMPOSE_FILE:-deploy/compose.hetzner.yml}"
ENV_FILE="${ENV_FILE:-deploy/production.env}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3300/admin/login}"
LOCK_DIR="${LOCK_DIR:-/tmp/matthias-ramahi-cms-deploy.lock}"
SKIP_MIGRATIONS="${SKIP_MIGRATIONS:-false}"
ENSURE_ADMIN="${ENSURE_ADMIN:-false}"
PRUNE_DOCKER_IMAGES="${PRUNE_DOCKER_IMAGES:-false}"

log() {
  printf '\n[%s] %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*"
}

fail() {
  printf '\nDeploy failed: %s\n' "$*" >&2
  exit 1
}

cleanup() {
  rmdir "$LOCK_DIR" 2>/dev/null || true
}

if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  fail "another CMS deploy is already running ($LOCK_DIR)"
fi
trap cleanup EXIT

cd "$APP_DIR" || fail "APP_DIR does not exist: $APP_DIR"

command -v git >/dev/null 2>&1 || fail "git is not installed"
command -v docker >/dev/null 2>&1 || fail "docker is not installed"

if [[ ! -f "$COMPOSE_FILE" ]]; then
  fail "compose file missing: $COMPOSE_FILE"
fi

if [[ ! -f "$ENV_FILE" ]]; then
  fail "production env missing: $ENV_FILE"
fi

if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
  git status --short --untracked-files=no
  fail "tracked working tree changes on server would be overwritten"
fi

compose() {
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" "$@"
}

log "Fetching $GIT_REMOTE/$GIT_BRANCH"
git fetch --prune "$GIT_REMOTE" "$GIT_BRANCH"

current_branch="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$current_branch" != "$GIT_BRANCH" ]]; then
  log "Switching from $current_branch to $GIT_BRANCH"
  git checkout "$GIT_BRANCH"
fi

git pull --ff-only "$GIT_REMOTE" "$GIT_BRANCH"

log "Building Payload CMS image"
compose build cms

log "Starting Postgres"
compose up -d postgres

log "Waiting for Postgres"
for attempt in {1..30}; do
  if compose exec -T postgres pg_isready -U payload -d payload >/dev/null 2>&1; then
    break
  fi

  if [[ "$attempt" == "30" ]]; then
    fail "Postgres did not become ready"
  fi

  sleep 2
done

if [[ "$SKIP_MIGRATIONS" != "true" ]]; then
  log "Running Payload migrations"
  compose run --rm cms pnpm --filter @matthias-ramahi/cms migrate
else
  log "Skipping Payload migrations"
fi

if [[ "$ENSURE_ADMIN" == "true" ]]; then
  log "Ensuring Payload admin user"
  compose run --rm cms pnpm --filter @matthias-ramahi/cms ensure:admin
fi

log "Starting Payload CMS"
compose up -d cms

log "Checking CMS health: $HEALTH_URL"
for attempt in {1..30}; do
  status="$(curl -sS -o /dev/null -w '%{http_code}' "$HEALTH_URL" || true)"
  if [[ "$status" =~ ^(2|3)[0-9][0-9]$ ]]; then
    log "CMS deploy complete with HTTP $status"
    break
  fi

  if [[ "$attempt" == "30" ]]; then
    compose ps
    compose logs --tail=120 cms
    fail "CMS health check failed, last HTTP status: ${status:-none}"
  fi

  sleep 2
done

if [[ "$PRUNE_DOCKER_IMAGES" == "true" ]]; then
  log "Pruning dangling Docker images"
  docker image prune -f
fi

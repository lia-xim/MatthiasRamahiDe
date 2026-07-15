#!/bin/sh
set -eu

SOURCE_DIR="${SOURCE_DIR:-/home/contextter/matthias-ramahi-tina-staging}"
GIT_WORKTREE="${TINA_GIT_WORKTREE:-/home/contextter/matthias-ramahi-tina-git}"
GIT_REMOTE_URL="${TINA_GIT_REMOTE_URL:-git@github.com:lia-xim/MatthiasRamahiDe.git}"
GIT_BRANCH="${TINA_GIT_BRANCH:-main}"
GIT_PUSH="${TINA_GIT_PUSH:-1}"
GIT_COMMIT_NAME="${TINA_GIT_COMMIT_NAME:-Tina Publisher}"
GIT_COMMIT_EMAIL="${TINA_GIT_COMMIT_EMAIL:-tina-publisher@matthiasramahi.de}"
GIT_SSH_KEY="${TINA_GIT_SSH_KEY:-$HOME/.ssh/tina_publish_github_ed25519}"
GIT_KNOWN_HOSTS="${TINA_GIT_KNOWN_HOSTS:-$HOME/.ssh/known_hosts}"
LOCK_DIR="${TINA_GIT_LOCK_DIR:-/tmp/matthias-ramahi-tina-publish.lock}"
LIVE_VERIFY_URL="${TINA_GIT_VERIFY_URL:-https://matthiasramahi.de/}"
LIVE_VERIFY_TIMEOUT="${TINA_GIT_VERIFY_TIMEOUT_SECONDS:-600}"
LIVE_VERIFY_INTERVAL="${TINA_GIT_VERIFY_INTERVAL_SECONDS:-5}"

SYNC_PATHS="${TINA_GIT_SYNC_PATHS:-apps/web/content apps/web/src/data/tinaMediaManifest.json apps/web/src/data/tinaGeneratedMediaManifest.json}"

if [ ! -d "$SOURCE_DIR" ]; then
  echo "Source directory does not exist: $SOURCE_DIR" >&2
  exit 1
fi

if [ -f "$GIT_SSH_KEY" ]; then
  if [ -z "${GIT_SSH_COMMAND:-}" ]; then
    GIT_SSH_COMMAND="ssh -i $GIT_SSH_KEY -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile=$GIT_KNOWN_HOSTS"
    export GIT_SSH_COMMAND
  fi
fi

source_real="$(cd "$SOURCE_DIR" && pwd -P)"
worktree_parent="$(dirname "$GIT_WORKTREE")"
mkdir -p "$worktree_parent"
worktree_parent_real="$(cd "$worktree_parent" && pwd -P)"
worktree_real="$worktree_parent_real/$(basename "$GIT_WORKTREE")"

case "$worktree_real" in
  "$source_real"|"$source_real"/*)
    echo "Refusing to use a Git worktree inside the live Tina source: $worktree_real" >&2
    exit 1
    ;;
esac

if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  echo "Another Tina Git publish appears to be running: $LOCK_DIR" >&2
  exit 1
fi
trap 'rmdir "$LOCK_DIR" 2>/dev/null || true' EXIT INT TERM

if [ ! -d "$GIT_WORKTREE/.git" ]; then
  rm -rf "$GIT_WORKTREE"
  git clone --branch "$GIT_BRANCH" "$GIT_REMOTE_URL" "$GIT_WORKTREE"
fi

cd "$GIT_WORKTREE"
git remote set-url origin "$GIT_REMOTE_URL"
git fetch origin "$GIT_BRANCH"
git checkout "$GIT_BRANCH"
git reset --hard "origin/$GIT_BRANCH"
git clean -fd -- apps/web/content apps/web/src/data

for rel in $SYNC_PATHS; do
  src="$SOURCE_DIR/$rel"
  dst="$GIT_WORKTREE/$rel"

  if [ -d "$src" ]; then
    mkdir -p "$dst"
    rsync -a --delete "$src/" "$dst/"
  elif [ -f "$src" ]; then
    mkdir -p "$(dirname "$dst")"
    cp -p "$src" "$dst"
  else
    echo "Expected Tina publish path is missing and will be removed if tracked: $rel" >&2
    rm -rf "$dst"
  fi
done

git add -- $SYNC_PATHS

if git diff --cached --quiet -- $SYNC_PATHS; then
  echo "No Tina content changes to publish."
  exit 0
fi

git config user.name "$GIT_COMMIT_NAME"
git config user.email "$GIT_COMMIT_EMAIL"

timestamp="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
git commit -m "${TINA_GIT_COMMIT_MESSAGE:-Update Tina content ($timestamp)}"

if [ "$GIT_PUSH" = "0" ]; then
  echo "Tina Git commit created but not pushed because TINA_GIT_PUSH=0."
  git status --short
  exit 0
fi

git push origin "$GIT_BRANCH"
echo "Tina content pushed to $GIT_REMOTE_URL ($GIT_BRANCH)."

commit_sha="$(git rev-parse HEAD)"
echo "Waiting for the public website to serve Tina commit $commit_sha."

if [ -n "$LIVE_VERIFY_URL" ]; then
  node - "$LIVE_VERIFY_URL" "$commit_sha" "$LIVE_VERIFY_TIMEOUT" "$LIVE_VERIFY_INTERVAL" <<'NODE'
const [url, commitSha, timeoutRaw, intervalRaw] = process.argv.slice(2)
const timeoutMs = Math.max(1, Number(timeoutRaw) || 600) * 1000
const intervalMs = Math.max(1, Number(intervalRaw) || 5) * 1000
const deadline = Date.now() + timeoutMs
let attempt = 0

while (Date.now() < deadline) {
  attempt += 1
  try {
    const checkUrl = new URL(url)
    checkUrl.searchParams.set('_tina_publish_check', String(Date.now()))
    const response = await fetch(checkUrl, {
      headers: { 'cache-control': 'no-cache' },
      redirect: 'follow',
    })
    const html = await response.text()
    if (response.ok && html.includes(commitSha)) {
      console.log(`Public website is live with Tina commit ${commitSha}.`)
      process.exit(0)
    }
    if (attempt === 1 || attempt % 6 === 0) {
      console.log(`Public website is still deploying (attempt ${attempt}, HTTP ${response.status}).`)
    }
  } catch (error) {
    if (attempt === 1 || attempt % 6 === 0) {
      console.log(`Public website check is still waiting: ${error.message}`)
    }
  }

  await new Promise((resolve) => setTimeout(resolve, intervalMs))
}

console.error(`Public website did not expose Tina commit ${commitSha} within ${Math.round(timeoutMs / 1000)} seconds.`)
process.exit(1)
NODE
fi

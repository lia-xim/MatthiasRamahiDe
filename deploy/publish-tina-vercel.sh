#!/bin/sh
set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
PUBLISH_TO_GIT=1 exec "$SCRIPT_DIR/publish-tina-production.sh"

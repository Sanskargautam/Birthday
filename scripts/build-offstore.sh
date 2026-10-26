#!/usr/bin/env bash
# ponytail: agent store FS may not support npm renames; build on a normal disk.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="${BIRTHDAY_SITE_BUILD_DIR:-/tmp/birthday-site-build}"
rm -rf "$WORK"
mkdir -p "$WORK"
mkdir -p "$WORK"
tar -C "$ROOT" --exclude node_modules --exclude dist -cf - . | tar -C "$WORK" -xf -
cd "$WORK"
npm install
export MEDIA_DIR="$(cd "$ROOT/../../media" && pwd)"
npm run sync-media
npm run build
rm -rf "$ROOT/dist"
cp -r dist "$ROOT/dist"
echo "Build output copied to $ROOT/dist"

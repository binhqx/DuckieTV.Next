#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DB_PATH="${ROOT_DIR}/database/e2e.sqlite"
APP_URL="${APP_URL:-http://127.0.0.1:8010}"

export APP_ENV=testing
export APP_URL
export DB_CONNECTION=sqlite
export DB_DATABASE="$DB_PATH"
export CACHE_STORE=file
export SESSION_DRIVER=file
export QUEUE_CONNECTION=sync

cd "$ROOT_DIR"

rm -f "$DB_PATH" "${DB_PATH}-wal" "${DB_PATH}-shm"
touch "$DB_PATH"

php artisan optimize:clear
php artisan migrate:fresh --force
php artisan duckietv:e2e:prepare
php artisan serve --host=127.0.0.1 --port=8010

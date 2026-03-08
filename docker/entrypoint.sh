#!/usr/bin/env sh
set -eu

cd /app

if [ ! -f .env ]; then
  cp .env.example .env
fi

# Keep a stable DB path in Docker to avoid drift between /data and /app/database.
CONTAINER_DB_PATH="/data/database.sqlite"

if grep -q '^DB_DATABASE=' .env; then
  sed -i "s|^DB_DATABASE=.*|DB_DATABASE=${CONTAINER_DB_PATH}|" .env
else
  printf '\nDB_DATABASE=%s\n' "${CONTAINER_DB_PATH}" >> .env
fi

export DB_DATABASE="${CONTAINER_DB_PATH}"
mkdir -p "$(dirname "${DB_DATABASE}")"
touch "${DB_DATABASE}"

if grep -q '^APP_KEY=$' .env || ! grep -q '^APP_KEY=' .env; then
  php artisan key:generate --force --no-interaction
fi

php artisan migrate --force --no-interaction

exec "$@"

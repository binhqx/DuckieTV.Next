# Docker Development Guide

This branch is optimized for fast Docker-based onboarding and continuous development.

## Quick Start

```bash
git clone https://github.com/<your-user>/DuckieTV.Next.git
cd DuckieTV.Next
docker compose up -d --build
open http://127.0.0.1:8000
```

## Daily Commands

```bash
# Start/stop
docker compose up -d
docker compose down

# Rebuild services
docker compose build --pull app queue
docker compose up -d

# Logs
docker compose logs -f app
docker compose logs -f queue
```

## DB Consistency Guardrail

The Docker runtime should use a single SQLite path:

- `DB_DATABASE=/data/database.sqlite`

`docker/entrypoint.sh` enforces this in container `.env`.

Verify runtime path:

```bash
docker compose exec -T app php artisan tinker --execute="echo config('database.connections.sqlite.database').PHP_EOL;"
```

If you ever suspect drift between DB files, sync and restart:

```bash
docker compose exec -T app sh -lc 'cp /data/database.sqlite /app/database/database.sqlite'
docker compose restart app
```

## Transmission Baseline

Known-good settings for this workspace:

- `torrenting.client=Transmission`
- `transmission.server=http://192.168.50.137`
- `transmission.port=80`
- `transmission.path=/transmission/rpc`
- `transmission.use_auth=true`
- `transmission.username=transmission`
- `transmission.password=transmission`

Health check:

```bash
curl -sS http://127.0.0.1:8000/torrents/status
```

## Verify Favorites Quickly

```bash
curl -sS http://127.0.0.1:8000/favorites | rg -n "Star Trek: Strange New Worlds|Star Trek: Starfleet Academy|You have no series yet"
```

## Fork + Upstream Workflow

Use:

- `origin` = your fork
- `upstream` = `SchizoDuckie/DuckieTV.Next`

```bash
# One-time
git remote rename origin upstream
git remote add origin https://github.com/<your-user>/DuckieTV.Next.git

# Sync from upstream
git fetch upstream
git checkout master
git merge --ff-only upstream/master
git push origin master
```


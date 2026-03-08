# DuckieTV.Next Agent Guide

This file defines required operating rules for agents working in this repository.

## Scope

- Project path: `~/Developer/DuckieTV.Next`
- Default runtime: Docker Compose (`app` + `queue`)
- Goal: reliable local development with consistent SQLite behavior

## Session Preflight (Required)

Run these checks at the start of each session:

1. Confirm containers are running:
   - `cd ~/Developer/DuckieTV.Next && docker compose ps`
2. Confirm HTTP is reachable:
   - `curl -sS -I http://127.0.0.1:8000 | head -n 1`
3. Confirm runtime DB path:
   - `cd ~/Developer/DuckieTV.Next && docker compose exec -T app php artisan tinker --execute="echo config('database.connections.sqlite.database').PHP_EOL;"`
4. Compare counts in both known SQLite files:
   - `cd ~/Developer/DuckieTV.Next && docker compose exec -T app sh -lc "sqlite3 /data/database.sqlite 'select count(*) from series;' && sqlite3 /app/database/database.sqlite 'select count(*) from series;'"`

## DB Drift Guardrail (Critical)

If counts differ, sync and restart immediately:

- `cd ~/Developer/DuckieTV.Next && docker compose exec -T app sh -lc 'cp /data/database.sqlite /app/database/database.sqlite' && docker compose restart app`

Then verify favorites:

- `curl -sS http://127.0.0.1:8000/favorites | rg -n "You have no series yet|<serieheader|Star Trek"`

## Docker Workflow

- Start: `docker compose up -d --build`
- Stop: `docker compose down`
- Rebuild services: `docker compose build --pull app queue`
- Logs: `docker compose logs -f app` and `docker compose logs -f queue`

## Validation Workflow

1. Open `http://127.0.0.1:8000`
2. Open Favorites panel (heart icon)
3. Confirm favorites render
4. Confirm torrent client health:
   - `curl -sS http://127.0.0.1:8000/torrents/status`

## Security and Secrets

- Never commit credentials, tokens, API keys, personal IPs, or local passwords.
- Never hardcode environment-specific secrets into docs or code.
- Keep examples generic (`<your-user>`, `<host>`, `<password>`), and use `.env` for sensitive values.

## Git Rules

- Do not commit unless explicitly asked.
- If asked to commit and last commit is not pushed, prefer `git commit --amend`.
- If already pushed, create a new commit.
- Keep Docker/dev-experience changes documented in `README.md` and `docs/docker-dev.md`.


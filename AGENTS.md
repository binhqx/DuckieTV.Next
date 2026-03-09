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

## Playwright E2E Workflow

- Primary config: `playwright.config.mjs`
- Seed file: `e2e/seed.spec.ts`
- Test plan directory: `specs/`
- Browser tests directory: `e2e/`

For browser-driven E2E work, do not hit real external APIs. Use the isolated local server and the E2E header mode:

1. Start the isolated server:
   - `cd ~/Developer/DuckieTV.Next && bash ./scripts/e2e-server.sh`
2. The E2E server runs at:
   - `http://127.0.0.1:8010`
3. The config injects:
   - `X-DuckieTV-E2E: 1`
4. That header enables Laravel-side HTTP fakes via:
   - `App\Http\Middleware\EnableE2EFakes`
   - `App\Support\E2EHttpFakes`
5. Run browser tests with:
   - `cd ~/Developer/DuckieTV.Next && npm run test:e2e`

Guardrails:

- Do not write plans or tests that rely on live Trakt, TMDB, or Transmission access unless the user explicitly asks for live integration coverage.
- If an E2E page starts failing with empty panels or load errors, check the fake mappings before changing selectors.
- Keep tests isolated and restartable; assume a fresh `database/e2e.sqlite`.

### E2E Test Writing Style

Use `AAA` structure for Playwright tests:

- `Arrange`: explain the user starting state and setup
- `Act`: explain the user action
- `Assert`: explain what the user expects to see

Rules:

- Prefer short comments that describe user intent, not framework mechanics.
- Explain the user goal and expected outcome, not low-level selector details.
- Keep one main user outcome per test where practical.
- Use the same `AAA` shape for both handwritten tests and generated tests.

## Security and Secrets

- Never commit credentials, tokens, API keys, personal IPs, or local passwords.
- Never hardcode environment-specific secrets into docs or code.
- Keep examples generic (`<your-user>`, `<host>`, `<password>`), and use `.env` for sensitive values.

## Git Rules

- Do not commit unless explicitly asked.
- If asked to commit and last commit is not pushed, prefer `git commit --amend`.
- If already pushed, create a new commit.
- Keep Docker/dev-experience changes documented in `README.md` and `docs/docker-dev.md`.

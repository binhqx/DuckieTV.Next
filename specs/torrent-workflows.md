# Torrent Workflows

Seed file: `e2e/seed.spec.ts`

## Scenario 1: Open the torrent client panel

Preconditions:
- Fresh E2E database
- Transmission fake responses are enabled

Arrange:
- The user starts on `/calendar`

Act:
1. Open the Transmission panel from the action bar

Assert:
1. The torrent client panel is visible
2. The torrent count summary is visible

## Scenario 2: Start, stop, and remove a torrent

Preconditions:
- Transmission fake responses include one torrent row

Arrange:
- The user starts on `/calendar`
- The Transmission panel is available

Act:
1. Open the Transmission panel
2. Open the fake torrent details
3. Trigger `Start`
4. Trigger `Stop`
5. Trigger `Remove` and confirm the dialog

Assert:
1. Each action returns visible success feedback
2. No real torrent client is contacted

## Scenario 3: Search for a torrent from an episode and add it to the client

Preconditions:
- Fresh E2E database
- One favorite show exists with an aired episode
- E2E mode provides a fake torrent search result for that episode query

Arrange:
- The user starts on `/calendar`
- The user opens one episode detail view

Act:
1. Choose `Find a torrent`
2. Wait for the torrent search results to load
3. Add the matching release to the torrent client

Assert:
1. The fake result row is visible in the search dialog
2. The add action succeeds
3. A success toast confirms the torrent was added

# DuckieTV Main Features E2E Plan

**Seed:** `e2e/seed.spec.ts`

## Goal

Add Playwright E2E coverage for the main user-facing features without calling live external APIs.

Assumptions:

- Tests run against `http://127.0.0.1:8010`
- `playwright.config.mjs` injects `X-DuckieTV-E2E: 1`
- Laravel-side HTTP fakes are enabled for Trakt, TMDB, and Transmission
- Each test can assume a fresh isolated SQLite database from `scripts/e2e-server.sh`

## Test Style

Each generated or handwritten test should follow `AAA`:

1. `Arrange`: state the user context
2. `Act`: perform the user action
3. `Assert`: verify the visible outcome the user expects

Comments should describe user intent and outcomes. They should not narrate technical selector mechanics unless needed to explain an unavoidable workaround.

## Coverage Strategy

Roll out E2E coverage in four phases:

1. Core navigation and favorites
2. Series and episode workflows
3. Torrent and auto-download workflows
4. Settings, backup/restore, and secondary pages

Each scenario should be independent, restartable, and safe to run in any order.

## Phase 1: Core Navigation And Favorites

### 1.1 Application shell loads
Preconditions:
- Fresh E2E database

Steps:
1. Open `/calendar`
2. Verify the main action bar is visible
3. Verify the Add Show entry point is visible
4. Verify the Favorites entry point is visible
5. Verify the Transmission entry point is visible

Expected outcomes:
- Main UI renders without JS errors
- Side panels can be opened

### 1.2 Add a show from the add panel
Preconditions:
- Fresh E2E database

Steps:
1. Open `/calendar`
2. Open the add-show panel
3. Search for `Strange New Worlds`
4. Add the show from search results
5. Open Favorites

Expected outcomes:
- The show appears in favorites
- No live network calls are required

### 1.3 Add a second show and verify favorites list state
Preconditions:
- Fresh E2E database

Steps:
1. Add `Star Trek: Strange New Worlds`
2. Add `Star Trek: Starfleet Academy`
3. Open Favorites

Expected outcomes:
- Both shows appear
- Favorites are stable after panel reload

### 1.4 Remove a show from favorites
Preconditions:
- Seed data includes at least one favorite

Steps:
1. Open Favorites
2. Remove one show
3. Refresh the favorites panel

Expected outcomes:
- The removed show is gone
- Remaining favorites still render

## Phase 2: Series And Episode Workflows

### 2.1 Open a series details panel from favorites
Preconditions:
- Seed data includes one favorite

Steps:
1. Open Favorites
2. Open a show details panel

Expected outcomes:
- Show metadata renders
- Poster/fanart placeholders render from fake data

### 2.2 View seasons and episodes for a favorite
Preconditions:
- Seed data includes one favorite with fake season/episode data

Steps:
1. Open the show details panel
2. Open seasons
3. Open episodes for a season

Expected outcomes:
- Season list renders
- Episode list renders
- Episode metadata matches fixture data

### 2.3 Open episode details
Preconditions:
- Seed data includes episode records

Steps:
1. Navigate to a season episode list
2. Open an episode details view

Expected outcomes:
- Episode title, air date, and overview render

### 2.4 Mark episode watched and downloaded
Preconditions:
- Seed data includes one unwatched and undownloaded episode

Steps:
1. Open episode details or calendar episode actions
2. Mark watched
3. Mark downloaded
4. Reload the relevant panel

Expected outcomes:
- State toggles persist in the UI
- No duplicate updates occur on reload

### 2.5 Mark calendar day watched/downloaded
Preconditions:
- Seed data includes episodes on the visible calendar day

Steps:
1. Open `/calendar`
2. Use day-level watched action
3. Use day-level downloaded action

Expected outcomes:
- Episode/day state updates in the calendar UI

## Phase 3: Torrent And Auto-Download Workflows

### 3.1 Open torrent client panel
Preconditions:
- Transmission fake responses enabled

Steps:
1. Open `/calendar`
2. Open the Transmission panel

Expected outcomes:
- Torrent panel loads
- Client shows connected state from fake response

### 3.2 Show torrent list from fake client state
Preconditions:
- Transmission fixture contains one or more torrents

Steps:
1. Open torrent panel
2. Verify torrent rows and counters

Expected outcomes:
- Torrent list renders expected fake items
- Status and progress text are visible

### 3.3 Add torrent from search results
Preconditions:
- Fake torrent search engine response exists
- Favorite show is present

Steps:
1. Open a show or episode torrent search dialog
2. Search for releases
3. Add one torrent to the client

Expected outcomes:
- Add action succeeds
- UI reflects the add result without talking to a real client

### 3.4 Torrent actions: start, stop, remove
Preconditions:
- Transmission fixture contains actionable torrents

Steps:
1. Open torrent details or list
2. Start a stopped torrent
3. Stop or pause an active torrent
4. Remove a torrent

Expected outcomes:
- Action buttons call expected routes
- UI updates correctly after each action

### 3.5 Auto-download settings save
Preconditions:
- Fresh E2E database

Steps:
1. Open Settings
2. Open Auto-download section
3. Enable auto-download
4. Change one or more filter fields
5. Save settings
6. Reload the section

Expected outcomes:
- Values persist
- Toggles and numeric inputs reflect saved state

### 3.6 Trigger per-episode auto-download action
Preconditions:
- Seed data includes a favorite episode

Steps:
1. Open episode details
2. Trigger auto-download for the episode

Expected outcomes:
- Request succeeds
- Status feedback is visible
- No real torrent server is used

### 3.7 Auto-download status page renders
Preconditions:
- Seed data or fixtures include auto-download activity rows

Steps:
1. Open `/autodlstatus`

Expected outcomes:
- Table or list renders meaningful state
- Status labels match the saved activity data

## Phase 4: Settings, Backup/Restore, And Secondary Pages

### 4.1 Settings navigation works across sections
Preconditions:
- Fresh E2E database

Steps:
1. Open Settings
2. Visit General, Torrenting, Auto-download, and Backup sections

Expected outcomes:
- Each section loads without panel errors

### 4.2 Torrent client settings save and reflect in status
Preconditions:
- Fresh E2E database

Steps:
1. Open Torrenting settings
2. Save Transmission settings
3. Open the torrent panel

Expected outcomes:
- Settings persist
- Torrent panel still connects using fake responses

### 4.3 Backup/restore workflow smoke test
Preconditions:
- A safe local test backup fixture is available

Steps:
1. Open Settings backup/restore section
2. Start restore using a fixture backup
3. Poll restore progress

Expected outcomes:
- Progress UI updates
- Restore completes or surfaces a controlled failure state

### 4.4 Watchlist page renders
Preconditions:
- Fake watchlist or local seeded content is available

Steps:
1. Open `/watchlist`

Expected outcomes:
- Page renders without crashing
- Empty or populated state is explicit

### 4.5 Subtitle search flow
Preconditions:
- Fake subtitle provider coverage exists, or test is limited to form/display behavior

Steps:
1. Open subtitle search UI for an episode
2. Perform a search

Expected outcomes:
- Search form works
- Results or empty state render correctly

### 4.6 About page smoke test
Preconditions:
- None

Steps:
1. Open `/about`

Expected outcomes:
- About content renders

## Fixture And Infrastructure Work Needed

Before full coverage, add or extend fake data for:

1. Trakt search results for multiple shows
2. Trakt series details, seasons, episodes, and people
3. Transmission torrent lists and action responses
4. Torrent search engine responses
5. Optional subtitle provider responses
6. Optional watchlist page data
7. Backup fixture for restore smoke tests

## Suggested Delivery Order

1. Land Phase 1 completely
2. Add Phase 2 read-only flows
3. Add Phase 2 state-changing flows
4. Add Phase 3 torrent panel and client actions
5. Add Phase 3 auto-download coverage
6. Add Phase 4 settings and backup/restore smoke coverage

## Definition Of Done

The main feature E2E rollout is complete when:

1. Each major page or side panel has at least one smoke test
2. Each major state-changing feature has at least one happy-path E2E test
3. No E2E test depends on live Trakt, TMDB, or Transmission servers
4. The suite is stable when run repeatedly against a fresh isolated database

# 🦆 DuckieTV.Next

[![Tests](https://github.com/SchizoDuckie/DuckieTV.Next/actions/workflows/Tests.yml/badge.svg)](https://github.com/SchizoDuckie/DuckieTV.Next/actions/workflows/Tests.yml)

A faithful port of [DuckieTV](https://github.com/SchizoDuckie/DuckieTV), the beloved AngularJS TV Show Tracker, rebuilt on **Laravel 12 + NativePHP** for a modern desktop experience in 2026.

> **This is not a rewrite.** We are preserving the data model, feature surface, and mental model of the original while replacing the runtime and distribution layer.

## What is DuckieTV?

DuckieTV is a personal TV show tracker and torrent manager that runs as a standalone desktop application. It lets you:

- 📅 **Track TV shows** on an interactive calendar showing upcoming and aired episodes
- 🔍 **Search for shows** via Trakt.tv integration with full metadata, seasons, and episodes
- 🧲 **Search & download torrents** using 17 built-in search engines (ThePirateBay, 1337x, Knaben, Nyaa, etc.)
- 📡 **Control torrent clients** directly — supporting 12 different clients (Transmission, qBittorrent, Deluge, rTorrent, µTorrent, and more)
- ⚙️ **Automate downloads** with configurable quality filters, size limits, and seeder requirements
- 🎨 **Beautiful dark UI** with rotating fanart backgrounds and a faithful recreation of the original interface

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                    NativePHP Shell                    │
│  (Electron wrapper — native menus, system tray)      │
├──────────────────────────────────────────────────────┤
│                    Laravel 12                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────────┐ │
│  │ Controllers │  │  Services  │  │     Models     │ │
│  │ (8 total)   │  │ (11 core)  │  │  (8 Eloquent)  │ │
│  └──────┬──────┘  └──────┬─────┘  └───────┬────────┘ │
│         │                │                │          │
│  ┌──────┴──────┐  ┌──────┴─────┐  ┌───────┴────────┐ │
│  │ Blade Views │  │  Torrent   │  │    SQLite      │ │
│  │ (46 views)  │  │  Layer     │  │   Database     │ │
│  │             │  │ 14 clients │  │                │ │
│  │             │  │ 17 engines │  │                │ │
│  └─────────────┘  └────────────┘  └────────────────┘ │
├──────────────────────────────────────────────────────┤
│              Frontend (No Build Required)             │
│  Vanilla JS modules · Bootstrap 3 · Original CSS     │
│  SidePanel · Calendar · TorrentSearch · Polling      │
└──────────────────────────────────────────────────────┘
```

### Key Design Decisions

- **Server-rendered Blade templates** — not a SPA. Since NativePHP runs locally, page loads are instant (~0ms network). No need for client-side routing.
- **Vanilla JavaScript** — standalone ES6 modules in `public/js/` without a build step. Each module (SidePanel, Calendar, TorrentSearch, etc.) is self-contained.
- **Original CSS preserved** — the `public/css/main.css` is a direct copy from DuckieTV-angular with minimal additions.
- **Polling for real-time updates** — `PollingService.js` polls the torrent client status endpoint and updates gauges/progress in-place via DOM manipulation.

## Project Structure

```
DuckieTV.Next/
├── app/
│   ├── Console/              # Artisan commands (TraktTV update, auto-download)
│   ├── DTOs/                 # Data Transfer Objects
│   │   └── TorrentData/      # Per-client torrent data normalization
│   ├── Http/
│   │   ├── Controllers/      # 8 controllers
│   │   │   ├── CalendarController      # Week/month view, mark watched/downloaded
│   │   │   ├── SeriesController        # Favorites CRUD, seasons, episodes
│   │   │   ├── EpisodeController       # Episode details, mark watched
│   │   │   ├── SearchController        # Trakt.tv show search + add
│   │   │   ├── TorrentController       # Search, add, client control
│   │   │   ├── SettingsController      # All settings tabs, persistence
│   │   │   ├── BackgroundController    # Random fanart rotation
│   │   │   └── Controller              # Base controller
│   │   └── Requests/         # Form request validation
│   ├── Models/               # 8 Eloquent models
│   │   ├── Serie             # TV show (52 fields, relations to Season/Episode)
│   │   ├── Season            # Season metadata + poster
│   │   ├── Episode           # Episode with watched/downloaded state
│   │   ├── Fanart            # TVDB fanart cache
│   │   ├── TMDBFanart        # TMDB fanart cache
│   │   ├── Jackett           # Jackett indexer configuration
│   │   ├── Setting           # Key-value settings store
│   │   └── User              # Laravel user (for future multi-user)
│   ├── Services/
│   │   ├── CalendarService          # Date range queries, event grouping
│   │   ├── FavoritesService         # Add/remove shows, Trakt data mapping
│   │   ├── SettingsService          # 100+ settings with defaults, caching
│   │   ├── TraktService             # Trakt.tv API (search, trending, sync)
│   │   ├── TMDBService              # TMDB poster/fanart fetching
│   │   ├── TorrentSearchService     # Multi-engine search dispatching
│   │   ├── TorrentClientService     # Client factory + connection management
│   │   ├── PosterService            # Poster URL resolution
│   │   ├── TranslationService       # i18n from original locale files
│   │   ├── TorrentClients/          # 14 client implementations
│   │   │   ├── BaseTorrentClient    # Abstract base (connect, auth, execute)
│   │   │   ├── TransmissionClient   # JSON-RPC
│   │   │   ├── QBittorrentClient    # REST API
│   │   │   ├── DelugeClient         # JSON-RPC
│   │   │   ├── RTorrentClient       # XML-RPC
│   │   │   ├── UTorrentClient       # Custom HTTP API
│   │   │   ├── UTorrentWebUIClient  # WebUI HTTP API
│   │   │   ├── Aria2Client          # JSON-RPC
│   │   │   ├── TixatiClient         # HTML scraping
│   │   │   ├── KTorrentClient       # Custom API
│   │   │   ├── TTorrentClient       # Custom API
│   │   │   ├── BiglyBTClient        # Transmission-compatible
│   │   │   └── VuzeClient           # Transmission-compatible
│   │   └── TorrentSearchEngines/    # 17 search engine implementations
│   │       ├── GenericSearchEngine   # Config-driven HTML scraping
│   │       ├── ThePirateBayEngine
│   │       ├── OneThreeThreeSevenXEngine (1337x)
│   │       ├── KnabenEngine
│   │       ├── NyaaEngine
│   │       ├── ShowRSSEngine
│   │       └── ... (12 more)
│   ├── Jobs/                 # Background jobs (TraktTV updates)
│   └── Providers/            # Service providers
├── database/
│   └── migrations/           # 10 migrations (clean schema, not historical)
├── public/
│   ├── css/main.css          # Original DuckieTV CSS (3200+ lines)
│   ├── fonts/                # Bebas Neue font family (bold, light, regular)
│   ├── img/                  # Icons, logos, search engine icons
│   └── js/                   # Standalone ES6 modules
│       ├── SidePanel.js      # Panel show/hide/expand with AJAX loading
│       ├── Calendar.js       # Week navigation, episode interactions
│       ├── TorrentSearch.js  # Multi-engine search dialog
│       ├── TorrentClient.js  # Start/stop/pause/remove torrent actions
│       ├── PollingService.js # Real-time torrent status polling + gauge updates
│       ├── Settings.js       # Dynamic settings forms
│       ├── BackgroundRotator.js  # Fanart cycling with crossfade
│       ├── Toast.js          # Notification toasts
│       └── QueryMonitor.js   # Dev tool: query count display
├── resources/views/          # Blade templates
│   ├── layouts/app.blade.php # Main layout (nav, sidepanel, scripts)
│   ├── calendar/             # Calendar week/month views
│   ├── series/               # Show details, seasons, episodes (6 views)
│   ├── episodes/             # Episode detail view
│   ├── torrents/             # Torrent client panel + details (5 views)
│   ├── settings/             # Settings tabs (23 views!)
│   ├── search/               # Trakt search results
│   └── partials/             # Shared components (gauge, action bar)
├── lang/                     # 20 languages (ported from Angular locales)
├── tests/                    # Pest test suite
│   └── Feature/              # 24 test files covering controllers, services, models
├── DuckieTV-angular/         # .gitignored, local reference only
└── DuckieTV.Next Migration-Plan.md  # Detailed migration blueprint
```

## Port Status

### Phase 1: Foundation ✅

| Component | Original | Laravel | Status |
|---|---|---|---|
| Serie model | `CRUD.entities.js` (52 fields) | `App\Models\Serie` | ✅ Done |
| Season model | `CRUD.entities.js` (8 fields) | `App\Models\Season` | ✅ Done |
| Episode model | `CRUD.entities.js` (23 fields) | `App\Models\Episode` | ✅ Done |
| Fanart model | `CRUD.entities.js` | `App\Models\Fanart` | ✅ Done |
| TMDBFanart model | `CRUD.entities.js` | `App\Models\TMDBFanart` | ✅ Done |
| Jackett model | `CRUD.entities.js` | `App\Models\Jackett` | ✅ Done |
| Settings | `SettingsService.js` (375 lines) | `App\Services\SettingsService` | ✅ Done — 100+ keys |
| Migrations | 21 historical migrations | 10 clean migrations | ✅ Done |

### Phase 2: Core Services ✅

| Component | Original | Laravel | Status |
|---|---|---|---|
| FavoritesService | `FavoritesService.js` (455 lines) | `App\Services\FavoritesService` | ✅ Done |
| TraktTV API | `TraktTVv2.js` (655 lines) | `App\Services\TraktService` | ✅ Done (Robust Rate Limiting) |
| CalendarService | `CalendarEvents.js` (286 lines) | `App\Services\CalendarService` | ✅ Done |
| TMDB Integration | `TMDBService.js` | `App\Services\TMDBService` | ✅ Done |
| AutoDownloadService | `AutoDownloadService.js` (418 lines) | `App\Jobs\AutoDownloadJob` | ✅ Done |
| TraktTV Updates | `TraktTVUpdateService.js` (125 lines) | `App\Jobs\TraktUpdateJob` | ✅ Done |
| SceneNameResolver | `SceneNameResolver.js` | `App\Services\SceneNameResolverService` | ✅ Done |
| WatchlistService | `WatchlistService.js` | `App\Services\WatchlistService` | ✅ Done |
| WatchlistCheckerService | `WatchlistCheckerService.js` | — | ❌ Not ported |
| NotificationService | `NotificationService.js` | — | ❌ Not ported |

### Phase 3: Torrent Layer ✅

| Component | Original | Laravel | Status |
|---|---|---|---|
| Search Registry | `TorrentSearchEngines.js` (369 lines) | `App\Services\TorrentSearchService` | ✅ Done |
| Generic Engine | `GenericTorrentSearchEngine.js` (468 lines) | `GenericSearchEngine.php` | ✅ Done |
| ThePirateBay | config | `ThePirateBayEngine.php` | ✅ Done |
| 1337x | config | `OneThreeThreeSevenXEngine.php` | ✅ Done |
| Knaben | config | `KnabenEngine.php` | ✅ Done |
| Nyaa | config | `NyaaEngine.php` | ✅ Done |
| ShowRSS | config | `ShowRSSEngine.php` | ✅ Done |
| + 11 more engines | configs | all ported | ✅ Done |
| BaseTorrentClient | `BaseTorrentClient.js` (378 lines) | `BaseTorrentClient.php` | ✅ Done |
| Transmission | `Transmission.js` (245 lines) | `TransmissionClient.php` | ✅ Done |
| qBittorrent | `qBittorrent41plus.js` (308 lines) | `QBittorrentClient.php` | ✅ Done |
| + 10 more clients | various | all ported | ✅ Done |
| Jackett integration | `TorrentSearchEngines.js` | — | ❌ Not ported |

### Phase 4: Frontend & Views

| Component | Original | Laravel | Status |
|---|---|---|---|
| **Routing** | `app.routes.js` (476 lines) | `routes/web.php` | ✅ Done — all routes |
| **Layout** | `app.html` | `layouts/app.blade.php` | ✅ Done |
| **Calendar** | `datePicker.js` (373 lines) | `Calendar.js` + Blade | ✅ Done |
| **Side Panel** | `sidePanel.js` (~50 lines) | `SidePanel.js` (8.5KB) | ✅ Done |
| **Background Rotator** | `backgroundRotator.js` (~60 lines) | `BackgroundRotator.js` | ✅ Done |
| **Torrent Search Dialog** | `torrentDialog.js` (567 lines) | `TorrentSearch.js` (22KB) | ✅ Done |
| **Torrent Client Panel** | `torrentRemoteControl.js` (~60 lines) | `PollingService.js` + Blade | ✅ Done |
| **Series Grid/List** | `seriesList.js` / `seriesGrid.js` | Blade views | ✅ Done |
| **Settings tabs** | 10 Angular templates | 23 Blade views | ✅ Done |
| **Episode details** | `episodeDetails.html` | `episodes/show.blade.php` | ✅ Done |
| **Series details** | multiple templates | 6 Blade views | ✅ Done |
| **Torrent details** | `torrentClientDetails.html` | `torrents/show.blade.php` | ✅ Done |
| **Fast Search** | `fastSearch.js` (389 lines) | — | ❌ Not ported |
| **Action Bar** | `actionBar.js` (~80 lines) | Blade partial | ✅ Done |
| **Subtitle Dialog** | `subtitleDialog.js` (137 lines) | `SubtitlesService` + `SubtitlesController` + Views | ✅ Done |
| **Episode watched/downloaded toggles** | directives (~40 lines each) | `EpisodeController` + Blade | ✅ Done |
| **About page** | `about.html` | `about/index.blade.php` | ✅ Done |
| **Auto-download status page** | `autodlstatus.html` | `autodlstatus/index.blade.php` | ✅ Done |
| **Internationalization** | 20 locale JSON files | `lang/` directory | ✅ Done — 20 languages |
| **Toast notifications** | — | `Toast.js` | ✅ Done (new) |
| **Query monitor** | — | `QueryMonitor.js` | ✅ Done (new, dev only) |

### Phase 5: Backup & Restore (Refactored) ✅

| Component | Status | Details |
|---|---|---|
| **Queue Batches** | ✅ Done | Restore is split into per-show jobs to prevent timeouts. |
| **Cancellation** | ✅ Done | Users can cancel the restore process mid-operation. |
| **Transactions** | ✅ Done | Database transactions ensure data integrity per show. |
| **Progress** | ✅ Done | Real-time progress updates via polling. |

### Phase 6: NativePHP Desktop ⚠️

| Component | Status |
|---|---|
| Window configuration | ✅ Done — size, title, icon |
| Application icon | ✅ Done — DuckieTV icon256.png |
| System tray | ❌ Not implemented |
| Native menus | ❌ Not implemented |
| Auto-updater | ❌ Not configured |
| Build & distribution | ❌ Not set up |

### Test Coverage

| Area | Tests | Status |
|---|---|---|
| Controllers | 5 test files | ✅ Passing |
| Services | 10 test files | ✅ Passing |
| Models | 4 test files | ✅ Passing |
| Jobs | 3 test files | ✅ Passing |
| Settings | 1 test file | ✅ Passing |
| HTTP/Requests | 2 test files | ✅ Passing |
| **Integration** | 1 test file | ✅ Passing (Skipped in CI) |

> **Note on Testing**: We use a mix of Unit and Integration tests. Unit tests mock external services (Trakt, TMDB) for speed and reliability. Integration tests (like `BackupServiceIntegrationTest`) hit the real APIs to verify end-to-end functionality but are skipped in CI/GitHub Actions to avoid rate limiting and authentication issues.

## Getting Started

### Docker Quick Start (Recommended)

If your goal is fast local setup and easy iteration, use Docker first.

```bash
# Clone your fork (recommended for ongoing development)
git clone https://github.com/<your-user>/DuckieTV.Next.git
cd DuckieTV.Next

# Start app + queue worker
docker compose up -d --build

# Open app
open http://127.0.0.1:8000
```

Detailed Docker workflow, troubleshooting, and fork/upstream sync:

- [`docs/docker-dev.md`](docs/docker-dev.md)

### Prerequisites

- **PHP 8.4+** with SQLite extension
- **Composer**
- **Node.js 18+** and npm
- A running **torrent client** (Transmission, qBittorrent, etc.) for torrent features

### Installation

```bash
# Clone the repository
git clone https://github.com/SchizoDuckie/DuckieTV.Next.git
cd DuckieTV.Next

# Install dependencies and set up the database
composer setup
```

The `composer setup` script handles everything: composer install, .env creation, key generation, database migration, npm install, and asset build.

### Development

Since this project uses NativePHP and vanilla JavaScript modules, there is no complex build step.

```bash
# Run the application (Development Mode)
php artisan native:run
```

This will launch the desktop application with hot-reloading for PHP files. Front-end changes (JS/CSS) are reflected immediately upon refresh/re-navigation since they are served directly.

### Running Tests

```bash
composer test
```

Or run specific test suites:

```bash
# Run from WSL if on Windows
php artisan test tests/Feature/Controllers/
php artisan test tests/Feature/Services/
php artisan test tests/Feature/Models/
```

## Technology Stack

| Layer | Technology |
|---|---|
| **Runtime** | PHP 8.4, Laravel 12 |
| **Desktop** | NativePHP (Electron) |
| **Database** | SQLite |
| **Frontend** | Blade templates, vanilla JS (ES6 modules) |
| **CSS** | Bootstrap 3 + custom DuckieTV styles |
| **Testing** | Pest PHP |
| **External APIs** | Trakt.tv, TMDB |
| **Build** | None (Native ES Modules) |

## Original Project

DuckieTV.Next is a port of the original [DuckieTV](https://github.com/SchizoDuckie/DuckieTV), which was built as a Chrome extension / standalone NW.js app using AngularJS.

## License

MIT

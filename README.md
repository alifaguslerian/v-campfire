# V Campfire

> The first thing you open when your laptop turns on. The last thing you close before the day ends.

V Campfire is not a task manager, and it's not another Notion or Trello clone. It's a personal digital workspace — one place for building projects, learning, gaming, listening to music, capturing ideas, and watching your own progress unfold over the years. Built to be opened every day, for years, not just tried once and abandoned.

![screenshot placeholder](docs/assets/screenshot-dashboard.png)

## Why it exists

Most productivity software is built for teams and "scalable workflows." V Campfire is built for one person who wants a single, consistent place to live their digital life — coding projects, learning progress, the game currently being played, a daily journal — all under one roof, with the warmth of sitting by a fire rather than the cold feel of a corporate dashboard.

Full philosophy: [docs/VISION.md](docs/VISION.md)

## What it does (MVP scope)

- **Tracked items** — unified project and game tracking: checklist, progress, screenshots, notes
- **Focus** — pomodoro timer, break reminders, session stats
- **Journal** — a short daily entry: what got done, blockers, tomorrow's target
- **Sticky notes** — quick capture for ideas and reminders
- **Music** — local playback and ambient sound that persists across every screen

Full roadmap: [docs/ROADMAP.md](docs/ROADMAP.md)

## Status

Early development. No public release yet.

## Stack

Tauri v2, React, TypeScript, SQLite. Chosen for low idle RAM/CPU on a native webview instead of a bundled Chromium runtime — this app is meant to stay open all day, every day, for years. Full reasoning: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/adr/](docs/adr/).

## Development setup

```bash
git clone https://github.com/<username>/v-campfire.git
cd v-campfire
npm install
npm run tauri dev
```

Setup notes not covered above (icon generation, first-run migration behavior): [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)

## Privacy

No telemetry, no analytics, no tracking, by default. All data stays on your device. Full statement: [docs/PRIVACY.md](docs/PRIVACY.md)

## Documentation

| Doc | Contents |
|---|---|
| [VISION.md](docs/VISION.md) | Why this app exists |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Boundaries and dependency direction |
| [DATABASE.md](docs/DATABASE.md) | Schema and relations |
| [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Visual tokens, components, accessibility |
| [ROADMAP.md](docs/ROADMAP.md) | MVP through v1.0 |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | Repo structure, git workflow, code standards |
| [PRIVACY.md](docs/PRIVACY.md) | Privacy-first principle |

## License

Not yet decided — will be finalized before any public release.
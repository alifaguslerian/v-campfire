# Changelog

Format ikuti [Keep a Changelog](https://keepachangelog.com/), diisi dari Conventional Commits sejak release pertama.

## [Unreleased]

### Added (v0.4)
- Gallery/media for tracked items: image import via native file dialog, auto-generated webp thumbnails (Canvas-based, no Rust image processing), lightbox view, delete
- Stats dashboard: focus time, checklist items done, projects/games archived, journal streak - all aggregate queries, no stored counters
- `tauri-plugin-fs` + `tauri-plugin-dialog` added, with app-data-scoped permissions and asset protocol scope for serving local images

### Added (v0.1-v0.3, previously recorded)
- App shell: sidebar navigation, hash-based routing
- Design system foundation: color/spacing/typography tokens, Button, Card, ProgressBar
- SQLite integration via tauri-plugin-sql, initial schema migration
- Tracked items (unified project/game tracking): create, list with progress, detail view, checklist, archive
- First unit test (`calculateProgress`)

v0.1 scope complete per `docs/ROADMAP.md`.
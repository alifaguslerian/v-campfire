# V Campfire — State

## Stack
Tauri v2 (Rust backend, minimal custom commands) + React + TypeScript + Vite. SQLite via `tauri-plugin-sql`. Zustand for global state (focus timer, audio). CSS Modules + custom-property design tokens (no Tailwind). Vitest for unit tests. `createHashRouter` (react-router-dom) for routing.

## Architecture
- `core/db/` — one query file per domain (`trackedItems.ts`, `checklistItems.ts`, `journal.ts`, `focusSessions.ts`, `stickyNotes.ts`), all going through `getDb()` in `client.ts`. Features never call raw SQL directly.
- `core/focus/` and `core/audio/` — global Zustand store + a "driver" component (`FocusTimerDriver`, `AudioDriver`) mounted once in `app/App.tsx` (the persistent shell), so timer/playback survive route navigation. Reuse this exact pattern for anything else that must persist across pages.
- `design-system/` — `Button`, `Card`, `ProgressBar` (CSS Modules + tokens in `tokens/colors.css`, `spacing.css`, `typography.css`).
- `features/*` — one folder per domain, colocated components.
- Migrations are **not** auto-run from `.sql` files — registered explicitly in `src-tauri/src/lib.rs` via `include_str!` + `add_migrations()`. New migration = new `.sql` file in `src-tauri/migrations/` **and** a new `Migration{}` entry in `lib.rs`.
- Tauri v2 capabilities: `src-tauri/capabilities/default.json` grants sql/log permissions. New plugins need their permission strings added here too, or calls silently fail.

## Done (don't touch without reason)
- App shell: sidebar nav + HashRouter (chosen over BrowserRouter — Tauri's production asset protocol can't resolve arbitrary paths on refresh/deep link).
- Design tokens: "warm ember cabin" theme, dark-only. Colors are WCAG-contrast-verified, not eyeballed (see `docs/DESIGN_SYSTEM.md`) — amber `#E8873A`, sage `#8CA36A` for success, rust `#B24A2C` reserved for badges/tags only (fails AA as a text-on-fill background). Fonts: Fraunces (display) + Work Sans (body), self-hosted woff2 required in `design-system/tokens/fonts/` — not committed, user supplies the actual files.
- Tracked items: unified project+game entity (see `docs/adr/0003`), not two separate features. Full CRUD except hard delete — uses soft `archive` (`archived_at`) instead, matching the product's "archive completed projects" intent. Checklist + auto-computed progress % via SQL aggregate JOIN, not a stored counter.
- Focus timer: pomodoro (25/5 default), global store+driver pattern, auto-transitions focus→break→focus, records completed sessions to `focus_sessions`. Known gap: state is memory-only — closing the app mid-session loses that session (not persisted to disk yet).
- Journal: one entry per **local calendar date** via `getLocalDateString()` — deliberately not `toISOString()`, which is UTC and would misattribute late-night entries to the wrong day. Upsert via `ON CONFLICT(date)`, debounced autosave (500ms).
- Sticky notes: 3 colors only (amber/sage/neutral — rust excluded, same contrast-fail reason as above). Hard delete here, unlike `tracked_items`, since there's no "archive" concept for notes in the product spec.
- Music/ambient: same global store+driver pattern as focus timer. Audio files not included — user supplies mp3s in `public/ambient/` (`rain`/`campfire`/`forest`/`night`/`sea.mp3`).
- Test infra: Vitest set up, 12 passing unit tests on pure logic (progress calc, date formatting, clock formatting) — deliberately not testing UI/db integration yet (see `docs/CONTRIBUTING.md` testing philosophy: unit-test pure logic, integration-test the db layer later, skip heavy E2E for a single-user app).

## In progress
Nothing mid-build. MVP (v0.1–v0.3) just completed and verified end-to-end on the user's machine (Windows, Rust installed via rustup).

## Decisions & gotchas
- `useDebouncedCallback` (`core/utils/`) is reused across sticky notes and journal — 500ms debounce, never save every keystroke (perf commitment in `docs/PERFORMANCE.md`).
- Contrast ratios are computed with the actual WCAG formula, not eyeballed — check `docs/DESIGN_SYSTEM.md`'s table before introducing any new UI color.
- `tauri.conf.json` icon paths need `npm run tauri icon <source.png>` run once — not automatic.
- No telemetry/analytics/crash-reporting anywhere by default (privacy-first principle, `docs/PRIVACY.md`) — don't add without an explicit opt-in discussion first.
- Full engineering standards (git workflow, ADRs, testing philosophy, security posture) are already written in `docs/` — check `docs/adr/` before re-deciding something that's already been decided.

## Next up
v0.4 per `docs/ROADMAP.md`: gallery/media for tracked items (`media_assets` table already exists in schema, unused so far) + first stats dashboard (aggregate queries over `focus_sessions`/`checklist_items`/`habit_logs` — same aggregate-not-counter pattern already established, don't build stored counters).

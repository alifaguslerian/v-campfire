# Architecture

## Design constraints from early critique

Keputusan berikut sengaja dibatasi scope-nya berdasarkan kritik di awal proses desain - lihat `docs/adr/` untuk alasan lengkap:

## 1. Kritik & Reality Check

**Scope-nya kebesaran untuk solo dev jangka panjang.** 9 domain fitur (project, music, focus, journal, habit, gaming, workspace, stats, sticky notes) itu setara scope startup kecil. Ini bukan alasan untuk gak dibangun — tapi alasan kuat untuk **MVP yang ketat** dan resist godaan nambah fitur sebelum yang lama benar-benar dipakai harian.

**Gaming Hub = Project Management dengan skin berbeda.** Progress, screenshot, notes, target — field-nya identik. Dipisah jadi dua fitur berarti dua kali logic checklist, dua kali gallery code, dua kali bug surface. Solusi: satu entity `tracked_items` dengan `type` field. Ini bukan cuma soal DRY — ini soal satu boundary yang harus dijaga konsisten selama bertahun-tahun, bukan dua.

**Workspace dengan widget layout custom itu proyek terpisah.** Drag-drop, resize, persist arbitrary layout per workspace — itu effort setara membangun mini page-builder. Untuk v1: workspace = preset (tema, background, musik default). Widget engine baru dibangun kalau preset kerasa gak cukup setelah dipakai riil.

**Version system untuk project itu redundant dengan git.** Yang lo butuh: catatan bertanggal ("progress hari ini: X"), bukan diffing/branching. Timeline berbasis timestamp catatan sudah cukup.

**Statistik jangan disimpan sebagai counter terpisah.** Kalau "total jam fokus" disimpan sebagai kolom yang di-increment manual, itu gampang drift dari data asli (misal ada sesi yang dihapus tapi counter gak ke-update). Stats harus selalu berupa query agregat (`SUM`, `COUNT`) di atas tabel event asli (`focus_sessions`, `habit_logs`, dst). Single source of truth.

**Musik persistent across pages itu bukan sekadar "fitur", itu constraint arsitektur.** Kalau audio element hidup di dalam komponen halaman, dia bakal ke-unmount tiap pindah halaman dan musik putus. Ini harus didesain dari awal sebagai global singleton di root layout, bukan ditambal belakangan.

---

## Tech stack

## 5. Tech Stack + Alasan

| Layer | Pilihan | Alasan |
|---|---|---|
| Shell | **Tauri v2** | Pakai native webview OS (WebView2/WebKit), bukan bundle Chromium seperti Electron. Baseline RAM ~40-80MB vs Electron ~200-400MB, binary size ~10-20MB vs ~150MB+. Karena app ini dipakai setiap hari selama bertahun-tahun, biaya RAM/startup itu berkomulasi — ini langsung memenuhi requirement "hemat RAM, startup cepat" yang eksplisit lo minta. |
| Backend logic | **Rust (minimal)** | Tauri butuh sedikit Rust untuk command handler, tapi mayoritas fungsi (SQL, filesystem, notification, global shortcut, tray, autostart) sudah tersedia sebagai official plugin — jadi Rust yang perlu ditulis sendiri tipis. Trade-off jujur: lo belum tahu Rust, jadi ada learning curve kecil di awal. Tapi ini one-time cost dibanding cost RAM harian selama bertahun-tahun kalau pakai Electron. |
| Frontend | **React + TypeScript** | Sudah familiar dari BDCAHOOT/TEA, ekosistem matang, official Tauri template support React. |
| State (global, cross-cutting) | **Zustand** | Untuk state yang benar-benar lintas halaman: audio player, active timer, active workspace. Bukan Redux — app solo, gak butuh middleware/devtools overhead itu. |
| Database | **SQLite** (via `tauri-plugin-sql`) | Data relasional jelas (tracked_items → checklist_items → media_assets, habits → habit_logs). JSON file gak cukup untuk query agregat stats dan gampang corrupt saat concurrent write. SQLite embedded, zero-config, dan native ke filesystem app data. |
| Media storage | Filesystem app-data dir, path disimpan di SQLite | Standard pattern — jangan simpan blob gambar di DB, itu bikin file DB bengkak dan lambat di-query. |

**Alternatif yang gue pertimbangkan dan tolak:** Electron — ekosistem lebih besar, tapi RAM/CPU overhead-nya bertentangan langsung dengan requirement performa yang lo tulis eksplisit. Kalau ternyata Rust jadi blocker beneran setelah dicoba, Electron + `better-sqlite3` adalah fallback yang valid — tapi itu keputusan untuk direvisit kalau ada bukti konkret, bukan diasumsikan dari awal.

---

## 6. Arsitektur

Klasifikasi kompleksitas: **Tier 3** — banyak domain (project, music, focus, journal, habit, stats) dengan lifecycle berbeda, dipersist berbeda, akan direvisit bertahun-tahun, dan maintainability adalah requirement eksplisit. Ini menjustifikasi boundary yang jelas — bukan flat structure.

Boundary utama dan alasan keberadaannya:

- **`core/db/`** — satu access layer ke SQLite. Alasan: schema berubah akan mempengaruhi banyak fitur; kalau query logic tersebar di tiap fitur, migrasi schema jadi mimpi buruk.
- **`core/audio/`** — global audio manager singleton, dipasang di root layout, gak pernah ter-unmount saat navigasi. Alasan: musik harus survive perpindahan halaman — ini constraint teknis, bukan preferensi.
- **`design-system/`** — komponen UI shared (Button, Card, Modal, EmptyState). Alasan: 8+ area fitur butuh visual konsistensi; tanpa satu sumber kebenaran, drift visual antar fitur gak terhindarkan dalam setahun.
- **`features/{tracked-items, focus, journal, habits, music, workspace, stats, sticky-notes}/`** — colocate by domain, bukan by technical layer (bukan `controllers/services/models` terpisah). Setiap fitur punya folder sendiri berisi komponen, hook, dan query spesifik fitur itu.

Dependency direction: `features/*` boleh import dari `core/*` dan `design-system/*`, tapi gak boleh saling import antar sesama `features/*` kecuali lewat `core/` (misal: fitur `stats` baca data dari `core/db`, bukan import langsung dari internal `features/focus/`).

---

## 7. Struktur Project

```
v-campfire/
├── src-tauri/                  # Rust backend
│   ├── src/
│   │   ├── commands/           # thin command handlers (mostly delegasi ke plugin)
│   │   └── main.rs
│   ├── migrations/             # SQL migration files
│   └── tauri.conf.json
├── src/                        # React frontend
│   ├── core/
│   │   ├── db/                 # query functions, satu per domain (trackedItems.ts, journal.ts, dst)
│   │   ├── audio/              # AudioProvider + store (Zustand)
│   │   └── router.tsx
│   ├── design-system/
│   │   ├── components/
│   │   └── tokens/              # color, spacing, typography
│   ├── features/
│   │   ├── tracked-items/
│   │   ├── focus/
│   │   ├── journal/
│   │   ├── habits/
│   │   ├── music/
│   │   ├── workspace/
│   │   ├── stats/
│   │   └── sticky-notes/
│   ├── app/                    # root layout, providers
│   └── main.tsx
└── package.json
```

---

## Readiness for future expansion (web/mobile companion, sync, plugins)

## 5. Kesiapan untuk Ekspansi Masa Depan

Ini bagian yang paling perlu direm. Web companion, mobile companion, cloud sync, AI assistant, plugin system — semuanya valid sebagai ide masa depan, tapi mendesain abstraksi konkret untuk fitur yang belum pasti dibangun itu persis pola yang bikin codebase lebih susah dibaca tanpa manfaat nyata sekarang.

Yang **sudah cukup** sebagai persiapan (murah, sudah diputuskan):
- Semua akses data lewat satu boundary (`core/db/`) — kalau nanti butuh sync layer atau REST API buat web companion, cuma satu titik yang berubah.
- Setiap tabel punya `updated_at` — modal dasar buat conflict resolution kalau ada sync nanti.

Yang **sengaja tidak dilakukan sekarang**, dengan alasan:
- **Plugin system**: gak dibangun. Modularitas feature-folder yang udah ada secara natural bikin ini lebih gampang nanti kalau beneran dibutuhkan — tapi dibangun sekarang berarti desain sandboxing/API surface untuk konsumen yang belum ada.
- **Data provider abstraction (interface swappable)**: gak dibangun. Satu implementasi konkret (Tauri SQL) sudah cukup; interface baru masuk akal kalau implementasi kedua benar-benar mau dibuat.
- **Cloud sync**: gak dirancang sekarang di luar `updated_at`. Sync itu keputusan besar (conflict resolution strategy, auth, server) yang gak bisa "disiapkan sedikit" tanpa benar-benar membangunnya.

---

## Logging & error handling

## 7. Logging & Error Handling

- **Logging**: `tauri-plugin-log` (official) — tulis ke file log di app-data dir, plus console saat `tauri dev`. Gak perlu bikin sistem logging custom.
- **Debug vs production**: pakai flag bawaan (`cfg!(debug_assertions)` di Rust, `import.meta.env.DEV` di Vite) — jangan bikin custom debug-mode flag, itu duplikasi mekanisme yang udah ada.
- **Error handling**: command Tauri yang gagal → tampilkan toast user-facing yang ringkas, log detail lengkap ke file. Jangan expose stack trace ke UI.
- **Crash reporting**: skip untuk sekarang. App offline-first berisi data personal (journal, notes) — ngirim crash report ke layanan luar (Sentry dkk) itu keputusan networking yang harus eksplisit dan idealnya opt-in, bukan default diam-diam. Kalau nanti open source dan mau ini, buka sebagai pilihan di settings, bukan hardcoded aktif.

---

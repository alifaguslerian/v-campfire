# Contributing

Project ini masih early development dan dikerjakan solo - dokumen ini disiapkan dari awal supaya siap kalau suatu hari menerima kontribusi luar.

## Repository structure

## 1. Struktur Repository

```
v-campfire/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # lint + typecheck + unit test, jalan tiap PR
│   │   └── release.yml         # trigger dari tag, build binary tiap platform, attach ke GitHub Release
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/
│   ├── VISION.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── DESIGN_SYSTEM.md
│   ├── ROADMAP.md
│   ├── CONTRIBUTING.md
│   ├── DEVELOPMENT.md
│   ├── RELEASE.md
│   ├── PERFORMANCE.md
│   └── assets/                  # screenshot untuk README/dokumentasi
├── e2e/                          # smoke test lintas-feature (minimal, lihat bagian 6)
├── scripts/                       # helper: seed dev db, generate app icon, dsb
├── src/                           # frontend — struktur sudah ditentukan di ARCHITECTURE.md
├── src-tauri/
│   ├── migrations/                # SQL migration, colocated dengan yang makai
│   └── src/
├── .gitignore
├── CHANGELOG.md
├── LICENSE
└── README.md
```

**Kenapa bukan struktur yang lo contohkan persis:**
- `database/` di-root ditolak → migration tetap di `src-tauri/migrations/`, biar gak misah dari kode yang eksekusi migration-nya.
- `releases/` ditolak → GitHub Releases (tag + artifact upload otomatis via `release.yml`) menggantikan ini sepenuhnya. Commit binary ke git bikin repo size membengkak permanen dan gak bisa di-shrink tanpa rewrite history.
- `assets/` di-root ditolak, dipindah jadi `docs/assets/` → asset UI aplikasi (icon, font) hidup di dalam `src/design-system/` atau `src-tauri/icons/` (colocated dengan yang pakai), bukan folder generik terpisah. Yang butuh folder sendiri cuma asset dokumentasi (screenshot README).
- `public/` tetap ada tapi minimal — itu konvensi Vite bawaan untuk static file yang di-serve apa adanya (favicon dsb), bukan tambahan struktur.
- `tests/` di-root ditolak sebagian → unit/integration test colocated per-feature. Cuma e2e yang punya folder sendiri karena sifatnya lintas-boundary.

---

## Git workflow

## 3. Git Workflow

**Branching: trunk-based, bukan GitFlow.** GitFlow (develop/release/hotfix terpisah) itu didesain untuk tim dengan multiple release line berjalan bersamaan — buat solo project dengan satu release line, itu overhead tanpa manfaat. Model yang dipakai:
- `main` — selalu dalam kondisi stabil/deployable
- `feat/<nama-fitur>`, `fix/<nama-bug>`, `chore/<tugas>` — branch pendek umur, merge ke main lewat PR (tetap lewat PR walau solo, karena itu titik CI checks jalan dan self-review discipline)

**Commit: Conventional Commits.** Alasan: (1) memungkinkan `CHANGELOG.md` di-generate otomatis dari commit message (tools: `git-cliff` atau `changesets`), (2) memungkinkan version bump otomatis berdasar tipe commit (`fix:` → patch, `feat:` → minor, `feat!:`/`BREAKING CHANGE:` → major), (3) history ribuan commit tetap scannable karena format konsisten (`feat(focus): add break reminder notification`).

**Versioning: SemVer.** Pre-1.0 pakai `0.MINOR.PATCH` — breaking change bump MINOR, bukan MAJOR (konvensi umum SemVer sebelum 1.0, karena API/schema masih dianggap belum stabil).

**Tagging & release:** tag `vX.Y.Z` di `main` → `release.yml` otomatis build binary per platform (Windows/macOS/Linux sesuai target Tauri) → attach ke GitHub Release → changelog di-generate dari commit sejak tag terakhir.

---

## Code quality standards

## 13. Standar Kualitas Kode

- TypeScript strict mode aktif dari awal.
- **Biome** dipertimbangkan sebagai pengganti ESLint+Prettier — satu tool buat lint+format, lebih cepat, mengurangi permukaan konfigurasi yang harus di-maintain. Kalau lo lebih nyaman ESLint+Prettier karena udah familiar, itu juga valid pilihan — bukan keputusan yang harus dipaksa berubah.
- Rust: `rustfmt` + `clippy` dijalankan di CI (`ci.yml`).
- Naming convention: domain concept jadi nama file/folder (`trackedItems.ts`, bukan `service1.ts`), konsisten dengan boundary yang udah didefinisikan di `ARCHITECTURE.md`.


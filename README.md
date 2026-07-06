# V Campfire

> Tempat pertama yang dibuka saat laptop menyala. Tempat terakhir yang ditutup sebelum hari berakhir.

V Campfire bukan task manager, bukan clone Notion atau Trello. Ini digital workspace pribadi — satu ruang untuk mengerjakan project, belajar, main game, dengar musik, mencatat ide, dan melihat perkembangan diri dari waktu ke waktu. Dibangun untuk dipakai setiap hari, selama bertahun-tahun.

![screenshot placeholder](docs/assets/screenshot-dashboard.png)

---

## Kenapa V Campfire ada

Kebanyakan productivity app dirancang buat tim, buat perusahaan, buat "workflow yang scalable". V Campfire dirancang buat satu orang yang mau satu tempat konsisten untuk hidup digitalnya — project coding, progress belajar, game yang lagi dimainin, jurnal harian, semua di bawah satu atap, dengan nuansa hangat seperti duduk di depan api unggun, bukan dashboard korporat yang dingin.

Filosofi lengkap ada di [`docs/VISION.md`](docs/VISION.md).

## Status

Early development — belum rilis. Roadmap ada di [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Instalasi (development)

```bash
git clone https://github.com/<username>/v-campfire.git
cd v-campfire
npm install
npm run tauri dev
```

Detail setup lengkap, migration database, dan seed data ada di [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md).

## Stack

Tauri v2 + React + TypeScript + SQLite. Alasan tiap pilihan ada di [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) dan [`docs/adr/`](docs/adr/).

## Privacy

Tidak ada telemetry, analytics, atau tracking apa pun secara default. Semua data hidup lokal di device. Detail di [`docs/PRIVACY.md`](docs/PRIVACY.md).

## Dokumentasi

| Dokumen | Isi |
|---|---|
| [VISION.md](docs/VISION.md) | Kenapa app ini ada |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Boundary, dependency direction |
| [DATABASE.md](docs/DATABASE.md) | Schema dan relasi |
| [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Token visual, komponen |
| [ROADMAP.md](docs/ROADMAP.md) | MVP sampai v1.0 |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | Cara kontribusi |
| [PRIVACY.md](docs/PRIVACY.md) | Prinsip privacy-first |

## License

TBD — belum diputuskan sampai app siap dipublikasikan.

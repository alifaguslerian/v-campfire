# ADR-0002: Use SQLite over JSON files

## Status
Accepted

## Context
Data punya relasi jelas (tracked_items -> checklist_items -> media_assets,
habits -> habit_logs) dan butuh query agregat untuk statistik (jam fokus per
minggu, streak habit). JSON file gak punya mekanisme query, rawan corrupt
saat concurrent write, dan agregasi harus dihitung manual di application
layer setiap kali dipanggil.

## Decision
Pakai SQLite embedded via tauri-plugin-sql. Zero-config, native ke
filesystem app-data, mendukung query SQL langsung untuk semua kebutuhan
agregasi stats.

## Consequences
Statistik selalu dihitung sebagai query (SUM/COUNT) di atas tabel event
asli, bukan counter tersimpan - menghindari drift antara counter dan data
sebenarnya. Butuh migration file (`src-tauri/migrations/`) untuk perubahan
schema ke depan, bukan sekadar edit struct.

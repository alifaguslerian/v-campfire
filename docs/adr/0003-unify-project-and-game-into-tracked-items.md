# ADR-0003: Unify project and game tracking into tracked_items

## Status
Accepted

## Context
Project Management dan Gaming Hub awalnya diminta sebagai dua fitur
terpisah, tapi field yang dibutuhkan identik: progress, checklist,
screenshot/gallery, notes, status. Membangun dua fitur paralel berarti dua
kali logic untuk hal yang sama - bug fix di satu tempat gak otomatis
ke-propagate ke tempat lain.

## Decision
Satu entity `tracked_items` dengan kolom `type` (`project` | `game`).
Checklist, media, dan notes semua reference ke `tracked_items`, bukan ke
tabel project/game terpisah.

## Consequences
UI boleh tetap menampilkan dua tab/halaman berbeda (Project vs Gaming Hub)
untuk filtering visual, tapi keduanya query dari tabel yang sama. Kalau
suatu hari project dan game butuh field yang benar-benar gak overlap
(misal: platform game vs tech stack project), field spesifik-tipe ditambah
sebagai kolom nullable atau tabel `tracked_item_metadata` terpisah - bukan
alasan untuk memecah entity utamanya.

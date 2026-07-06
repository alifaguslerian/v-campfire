# ADR-0005: Skip database encryption for v1

## Status
Accepted

## Context
SQLCipher (encrypted SQLite) menambah kompleksitas key management. Threat
model yang relevan cuma "orang lain pegang laptop ini" - dikonfirmasi tidak
berlaku untuk penggunaan saat ini (laptop personal, tidak dipakai orang
lain).

## Decision
Tidak pakai enkripsi database untuk v1. Perlindungan mengandalkan OS
filesystem permission pada app-data directory.

## Consequences
Kalau asumsi ini berubah (laptop shared, atau app dipakai di device lain
yang lebih rawan), ADR ini perlu direvisit dan digantikan ADR baru yang
mengadopsi SQLCipher - bukan diedit ulang di tempat.

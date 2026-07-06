# ADR-0004: Trunk-based development over GitFlow

## Status
Accepted

## Context
GitFlow (branch develop/release/hotfix terpisah) didesain untuk tim dengan
multiple release line berjalan bersamaan. Project ini solo dengan satu
release line.

## Decision
`main` selalu stabil/deployable. Branch pendek umur (`feat/`, `fix/`,
`chore/`) merge ke main lewat PR, walau dikerjakan solo - PR tetap jadi
titik CI checks jalan.

## Consequences
Gak ada branch `develop` terpisah untuk "kerjaan setengah jadi" - kalau
sebuah fitur butuh beberapa PR untuk selesai, fitur itu di-flag belum
stabil di roadmap/issue, bukan disembunyikan di branch lain.

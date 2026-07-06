# Release Guide

Versioning dan tagging convention ada di [`CONTRIBUTING.md`](CONTRIBUTING.md#git-workflow) - satu sumber, gak diduplikasi di sini biar gak drift.

## Cutting a release

1. Pastikan `main` hijau (CI pass).
2. Tag: `git tag vX.Y.Z && git push origin vX.Y.Z`.
3. `.github/workflows/release.yml` otomatis build binary per platform dan attach ke GitHub Release.
4. Changelog di-generate dari commit history sejak tag terakhir (Conventional Commits).

Belum ada release pertama - langkah ini belum pernah dijalankan, revisit setelah v0.1 selesai kalau ada detail yang meleset.

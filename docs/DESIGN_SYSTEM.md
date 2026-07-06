# Design System

Diisi lebih lengkap saat token warna/tipografi konkret sudah dipilih. Bagian di bawah ini adalah arah yang sudah disepakati.

## 4. Identitas Visual

Theme character: **"warm ember cabin at night"** — bukan terminal/cyberpunk (terlalu dingin untuk konsep "cozy"), bukan luxury minimal generik (kurang personal).

- **Base**: charcoal/near-black gelap, bukan pure black — dark mode default (cocok untuk "Late Night workspace" dan sesi malam yang implisit dari gaming/coding session panjang)
- **Accent**: amber/ember hangat sebagai primary accent, terracotta/rust muted sebagai secondary — hindari purple/violet default AI aesthetic sepenuhnya
- **Tipografi**: serif atau slab-serif untuk heading (kesan editorial, personal, bukan dashboard generik), humanist sans untuk body/UI — bukan Inter
- **Bentuk**: rounded corner moderat (bukan pill/uniform), sharp-but-soft — mengarah ke "premium desk" bukan "SaaS dashboard"
- **Glow effect** dari tema "campfire" dipakai sangat selektif (misal indicator sesi fokus aktif), bukan sebagai dekorasi berulang di semua card

Detail token warna/font spesifik baru difinalisasi saat masuk implementasi UI — di tahap ini cukup arah, karena keputusan detail sebelum ada komponen nyata untuk diuji itu prematur.

---

---

## Accessibility

## 11. Accessibility

Prioritas yang murah dan relevan buat app single-user — bukan full WCAG audit yang lebih masuk akal untuk produk dengan user base luas:

- **Contrast**: warna ember/amber di atas dark background wajib dicek rasio kontras (minimal AA, 4.5:1 untuk teks normal) — warna hangat kayak amber gampang jatuh di bawah threshold ini kalau gak sengaja dicek, jadi ini bukan basa-basi, ada risiko nyata di palette yang udah diputuskan.
- **`prefers-reduced-motion`**: semua animasi/micro-interaction harus respect media query ini — matiin atau kurangi drastis transisi kalau user (baca: lo sendiri, kalau lagi capek mata) mengaktifkan setting ini di OS.
- **Keyboard navigation dasar**: tab order logis, focus ring kelihatan jelas (jangan di-`outline: none` tanpa pengganti), shortcut buat aksi yang sering dipakai (start/stop timer, buka command palette kalau nanti ada).
- **Focus management di modal**: fokus ke-trap di dalam modal saat terbuka, balik ke elemen pemicu saat ditutup — standar dasar, gak butuh library tambahan kalau modal dibangun manual dengan benar.

---

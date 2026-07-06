# Development Guide

## Setup

```bash
git clone https://github.com/<username>/v-campfire.git
cd v-campfire
npm install
```

Sebelum `npm run tauri dev` pertama kali:
1. Pastikan Rust toolchain terpasang (rustup) - belum diverifikasi di environment mana pun saat scaffold dibuat.
2. Generate icon: `npm run tauri icon path/to/source-icon.png` (folder `src-tauri/icons/` masih kosong).
3. Migration di `src-tauri/migrations/` dijalankan otomatis oleh `tauri-plugin-sql` saat pertama koneksi ke db dibuka - tidak perlu langkah manual.

## Running

```bash
npm run tauri dev
```

## Testing

## 6. Testing

Gak semua bagian app butuh level testing yang sama — testing effort harus sebanding dengan risiko bug diam-diam, bukan diterapkan merata.

**Unit test (Vitest) — wajib untuk logic murni:**
- Perhitungan progress % checklist
- Perhitungan streak habit (rawan off-by-one dan timezone bug)
- Agregasi stats (SUM/COUNT di atas rentang tanggal — rawan bug boundary tanggal)
- State transition timer pomodoro (focus → break → focus)

**Integration test (Vitest + in-memory/temp SQLite) — wajib untuk `core/db/`:**
Ini yang paling bernilai di app CRUD-heavy kayak gini — kebanyakan bug nyata di app seperti ini adalah mismatch antara query dan schema (join salah, filter kelewat, cascade delete gak jalan), bukan bug UI.

**E2E — minimal, cuma smoke test:** satu test "app start → dashboard render → bisa buka satu tracked item" cukup. Full E2E suite untuk app single-user itu maintenance cost tinggi buat manfaat kecil — pemakaian harian lo sendiri sudah jadi bentuk E2E testing paling realistis.

---

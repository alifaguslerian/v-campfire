# Performance

## 10. Strategi Performa

- Native webview (Tauri) → baseline RAM/CPU sudah rendah tanpa effort tambahan
- Index di kolom yang dipakai untuk agregasi stats (`started_at`, `date`) — tanpa ini, query stats akan full table scan seiring data bertambah tahunan
- Code splitting per feature route — startup hanya load shell + halaman terakhir aktif, bukan semua 8 fitur sekaligus
- Debounce autosave (journal, sticky notes, checklist reorder) — jangan write ke SQLite tiap keystroke
- Gambar: simpan thumbnail terkompresi untuk grid gallery, load full-res on demand saat dibuka
- Hindari polling; pakai Tauri event system untuk update reaktif kalau ada kebutuhan sinkronisasi antar window
- List virtualization (react-virtual) baru ditambahkan kalau checklist/gallery item terbukti banyak secara nyata — jangan preemptive


## Performance budget

## 10. Performance Budget

Angka konkret, dicek manual tiap sebelum release (belum perlu otomatis di CI untuk v1 — profiling otomatis itu sendiri effort tambahan yang baru sepadan kalau udah ada history regresi nyata):

| Metrik | Target | Batas atas sebelum dianggap regresi |
|---|---|---|
| Cold startup → interactive | < 500ms | 1s |
| Idle RAM (app terbuka, gak ada aktivitas) | < 150MB | 200MB |
| Idle CPU (gak ada timer/audio jalan) | ~0% | 2% |
| Navigasi antar halaman | < 100ms | 250ms |
| Installer size | < 25MB | 40MB |

Kalau ambient sound / musik aktif, idle CPU wajar naik sedikit (decoding audio) — budget di atas berlaku untuk kondisi benar-benar idle (gak ada timer/musik jalan).

---

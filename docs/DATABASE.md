# Database

## 8. Database Schema (SQLite)

```sql
-- unified project + game entity
CREATE TABLE tracked_items (
  id INTEGER PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('project', 'game')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- active | completed | archived
  cover_image_path TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  archived_at TEXT
);

CREATE TABLE checklist_items (
  id INTEGER PRIMARY KEY,
  tracked_item_id INTEGER NOT NULL REFERENCES tracked_items(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_done INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE media_assets (
  id INTEGER PRIMARY KEY,
  tracked_item_id INTEGER NOT NULL REFERENCES tracked_items(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('screenshot', 'photo')),
  caption TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- generic note, nullable FK doubles as standalone idea capture
CREATE TABLE notes (
  id INTEGER PRIMARY KEY,
  tracked_item_id INTEGER REFERENCES tracked_items(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE journal_entries (
  id INTEGER PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  done_today TEXT,
  blockers TEXT,
  tomorrow_target TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE habits (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  target_frequency TEXT NOT NULL DEFAULT 'daily',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  archived_at TEXT
);

CREATE TABLE habit_logs (
  id INTEGER PRIMARY KEY,
  habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(habit_id, date)
);

CREATE TABLE focus_sessions (
  id INTEGER PRIMARY KEY,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  duration_seconds INTEGER,
  type TEXT NOT NULL CHECK (type IN ('focus', 'break')),
  tracked_item_id INTEGER REFERENCES tracked_items(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE sticky_notes (
  id INTEGER PRIMARY KEY,
  content TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'amber',
  position_x REAL NOT NULL DEFAULT 0,
  position_y REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE workspaces (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  theme_preset TEXT NOT NULL,
  background_asset TEXT,
  default_ambient TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- index untuk query stats yang sering di-agregat per tanggal
CREATE INDEX idx_focus_sessions_started_at ON focus_sessions(started_at);
CREATE INDEX idx_habit_logs_date ON habit_logs(date);
CREATE INDEX idx_checklist_items_tracked_item ON checklist_items(tracked_item_id);
```

Stats (contoh: total jam fokus minggu ini) selalu dihitung via query, bukan counter:

```sql
SELECT SUM(duration_seconds) FROM focus_sessions
WHERE type = 'focus' AND started_at >= date('now', '-7 days');
```

---

## Security & data integrity

## 8. Security & Data Integrity

- **Parameterized query wajib** — semua akses `tauri-plugin-sql` pakai bind parameter, gak ada string concatenation buat query.
- **Enkripsi database**: **di-skip untuk v1**, dengan asumsi laptop lo gak dipakai orang lain. Kalau asumsi ini salah, kasih tau — itu ngubah keputusan ke arah SQLCipher, yang nambah kompleksitas key management buat threat model yang sebenarnya cuma "orang lain pegang laptop ini".
- **PRAGMA yang wajib diaktifkan** saat koneksi dibuka: `foreign_keys = ON` (SQLite gak enforce FK secara default) dan `journal_mode = WAL` (lebih tahan crash, dan read gak keblok saat write).
- **Import/export**: file backup yang di-import harus divalidasi dulu (cek schema version, checksum) sebelum dipakai menimpa db aktif — treat sebagai untrusted input walau itu file lo sendiri, karena melindungi dari file yang korup saat transfer.
- **Backup strategy**: (1) auto-copy db ke folder `backups/` di app-data dir tiap app start atau harian, simpan N terakhir; (2) tombol manual "export backup" yang zip db + folder media jadi satu file buat disimpan di tempat lain.

---

// Single boundary for all SQLite access. Features import from here, never
// from @tauri-apps/plugin-sql directly - this is what makes future changes
// (schema migration, swapping storage) a one-file change instead of a
// hunt-and-replace across every feature.
//
// Not yet tested against a real Tauri runtime (this repo has no Rust
// toolchain available where it was scaffolded) - verify with `npm run
// tauri dev` before relying on it.

import Database from "@tauri-apps/plugin-sql";

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (!dbInstance) {
    dbInstance = await Database.load("sqlite:v-campfire.db");
  }
  return dbInstance;
}

// Temporary verification helper - not a real feature function. Inserts one
// row and returns the row count. Delete this once tracked-items has its own
// real query functions and has proven the db layer works.
export async function pingDb(): Promise<number> {
  const db = await getDb();
  await db.execute(
    "INSERT INTO tracked_items (type, title) VALUES ($1, $2)",
    ["project", "DB connection test"],
  );
  const result = await db.select<{ count: number }[]>(
    "SELECT COUNT(*) as count FROM tracked_items",
  );
  return result[0].count;
}
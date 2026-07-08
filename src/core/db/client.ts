// Single boundary for all SQLite access. Domain files (trackedItems.ts, and
// journal.ts / habits.ts etc. as they're built) call getDb() and expose
// typed query functions - features import from those, never from
// @tauri-apps/plugin-sql directly.

import Database from "@tauri-apps/plugin-sql";

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (!dbInstance) {
    dbInstance = await Database.load("sqlite:v-campfire.db");
  }
  return dbInstance;
}
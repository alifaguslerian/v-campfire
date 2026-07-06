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

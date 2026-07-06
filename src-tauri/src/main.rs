// Entry point. Command handlers should stay thin - most logic lives in the
// frontend (src/core/db) via tauri-plugin-sql. Add custom #[tauri::command]
// functions in src-tauri/src/commands/ only for things the plugin can't do
// (e.g. filesystem operations outside the sql plugin's scope).

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_log::Builder::new().build())
        .run(tauri::generate_context!())
        .expect("error while running V Campfire");
}

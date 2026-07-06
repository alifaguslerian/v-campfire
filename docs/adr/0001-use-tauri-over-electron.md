# ADR-0001: Use Tauri over Electron

## Status
Accepted

## Context
App dipakai harian selama bertahun-tahun. Requirement eksplisit: hemat RAM/CPU,
startup cepat, offline-first. Electron bundle Chromium penuh per instance,
baseline RAM 200-400MB, installer 150MB+.

## Decision
Pakai Tauri v2. Native webview OS (WebView2/WebKit), baseline RAM 40-80MB,
binary 10-20MB.

## Consequences
Perlu Rust minimal untuk command handler - sebagian besar sudah dicover
official plugin (sql, fs, log, notification). Trade-off: learning curve
kecil di awal untuk Rust, dibayar oleh biaya RAM/CPU harian yang jauh lebih
rendah dalam pemakaian jangka panjang.

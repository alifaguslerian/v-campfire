import { open } from "@tauri-apps/plugin-dialog";
import { readFile, writeFile, mkdir, exists, remove } from "@tauri-apps/plugin-fs";
import { appDataDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/core";

const THUMB_MAX_DIM = 400;
const THUMB_QUALITY = 0.8;

export interface ImportedMedia {
  path: string; // relative to app data dir
  thumbnailPath: string; // relative to app data dir
}

async function ensureMediaDirs(trackedItemId: number) {
  const base = await appDataDir();
  const itemDir = await join(base, "media", String(trackedItemId));
  const thumbDir = await join(itemDir, "thumbs");
  if (!(await exists(itemDir))) await mkdir(itemDir, { recursive: true });
  if (!(await exists(thumbDir))) await mkdir(thumbDir, { recursive: true });
  return { itemDir, thumbDir };
}

async function generateThumbnail(
  bytes: Uint8Array<ArrayBuffer>,
  mimeType: string,
): Promise<Uint8Array> {
  const blob = new Blob([bytes], { type: mimeType });
  const bitmap = await createImageBitmap(blob);

  const scale = Math.min(1, THUMB_MAX_DIM / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const thumbBlob = await canvas.convertToBlob({
    type: "image/webp",
    quality: THUMB_QUALITY,
  });
  return new Uint8Array(await thumbBlob.arrayBuffer());
}

function extOf(path: string): string {
  const dot = path.lastIndexOf(".");
  return dot >= 0 ? path.slice(dot + 1).toLowerCase() : "jpg";
}

function mimeFromExt(ext: string): string {
  switch (ext) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    default:
      return "image/jpeg";
  }
}

export async function pickAndImportImages(
  trackedItemId: number,
): Promise<ImportedMedia[]> {
  const selected = await open({
    multiple: true,
    filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "webp", "gif"] }],
  });
  if (!selected) return [];

  const paths = Array.isArray(selected) ? selected : [selected];
  const { itemDir, thumbDir } = await ensureMediaDirs(trackedItemId);
  const base = await appDataDir();

  const results: ImportedMedia[] = [];
  for (const srcPath of paths) {
    const bytes = await readFile(srcPath);
    const ext = extOf(srcPath);
    const id = crypto.randomUUID();

    const destPath = await join(itemDir, `${id}.${ext}`);
    const thumbPath = await join(thumbDir, `${id}.webp`);

    await writeFile(destPath, bytes);
    const thumbBytes = await generateThumbnail(bytes, mimeFromExt(ext));
    await writeFile(thumbPath, thumbBytes);

    // NOTE: assumes '/' path separators when trimming the base dir prefix -
    // fine for Windows-only, single-device use (this app's current scope),
    // but would need proper path handling if cross-OS sync is ever added.
    results.push({
      path: destPath.slice(base.length + 1),
      thumbnailPath: thumbPath.slice(base.length + 1),
    });
  }
  return results;
}

export async function deleteMediaFiles(
  relPath: string,
  relThumbPath: string | null,
) {
  const base = await appDataDir();
  const fullPath = await join(base, relPath);
  if (await exists(fullPath)) await remove(fullPath);
  if (relThumbPath) {
    const fullThumb = await join(base, relThumbPath);
    if (await exists(fullThumb)) await remove(fullThumb);
  }
}

export async function resolveMediaSrc(relPath: string): Promise<string> {
  const base = await appDataDir();
  const fullPath = await join(base, relPath);
  return convertFileSrc(fullPath);
}

// Domain-specific query functions for media_assets. Row shape mirrors the
// SQL column names directly (snake_case) - same convention as
// trackedItems.ts / checklistItems.ts, not aliased to camelCase.

import { getDb } from "./client";

export type MediaAssetType = "screenshot" | "photo";

export interface MediaAsset {
  id: number;
  tracked_item_id: number;
  path: string;
  thumbnail_path: string | null;
  type: MediaAssetType;
  caption: string | null;
  created_at: string;
}

export async function listMediaAssets(
  trackedItemId: number,
): Promise<MediaAsset[]> {
  const db = await getDb();
  return db.select<MediaAsset[]>(
    "SELECT * FROM media_assets WHERE tracked_item_id = $1 ORDER BY created_at DESC",
    [trackedItemId],
  );
}

export async function addMediaAsset(input: {
  trackedItemId: number;
  path: string;
  thumbnailPath: string;
  type: MediaAssetType;
  caption?: string;
}): Promise<void> {
  const db = await getDb();
  await db.execute(
    "INSERT INTO media_assets (tracked_item_id, path, thumbnail_path, type, caption) VALUES ($1, $2, $3, $4, $5)",
    [
      input.trackedItemId,
      input.path,
      input.thumbnailPath,
      input.type,
      input.caption ?? null,
    ],
  );
}

export async function deleteMediaAsset(id: number): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM media_assets WHERE id = $1", [id]);
}

import { useCallback, useEffect, useState } from "react";
import {
  addMediaAsset,
  deleteMediaAsset,
  listMediaAssets,
  type MediaAsset,
} from "../../core/db/mediaAssets";
import {
  pickAndImportImages,
  deleteMediaFiles,
  resolveMediaSrc,
} from "../../core/media/importImage";
import { Button } from "../../design-system/components/Button/Button";
import styles from "./Gallery.module.css";

interface GalleryProps {
  trackedItemId: number;
}

export function Gallery({ trackedItemId }: GalleryProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [thumbSrcs, setThumbSrcs] = useState<Record<number, string>>({});
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const reload = useCallback(async () => {
    setAssets(await listMediaAssets(trackedItemId));
  }, [trackedItemId]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        assets.map(
          async (a) =>
            [a.id, await resolveMediaSrc(a.thumbnail_path ?? a.path)] as const,
        ),
      );
      if (!cancelled) setThumbSrcs(Object.fromEntries(entries));
    })();
    return () => {
      cancelled = true;
    };
  }, [assets]);

  async function handleAdd() {
    setImporting(true);
    try {
      const imported = await pickAndImportImages(trackedItemId);
      for (const media of imported) {
        await addMediaAsset({
          trackedItemId,
          path: media.path,
          thumbnailPath: media.thumbnailPath,
          type: "photo",
        });
      }
      if (imported.length > 0) await reload();
    } finally {
      setImporting(false);
    }
  }

  async function handleDelete(asset: MediaAsset) {
    await deleteMediaFiles(asset.path, asset.thumbnail_path);
    await deleteMediaAsset(asset.id);
    await reload();
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.header}>
        <h3>Gallery</h3>
        <Button variant="secondary" onClick={handleAdd} disabled={importing}>
          {importing ? "Importing..." : "+ Add photo"}
        </Button>
      </div>

      {assets.length === 0 ? (
        <p className={styles.empty}>No media yet.</p>
      ) : (
        <div className={styles.grid}>
          {assets.map((asset) => (
            <div key={asset.id} className={styles.thumbWrap}>
              <button
                className={styles.thumbButton}
                onClick={async () =>
                  setLightboxSrc(await resolveMediaSrc(asset.path))
                }
                aria-label="Open full image"
              >
                {thumbSrcs[asset.id] && (
                  <img
                    src={thumbSrcs[asset.id]}
                    alt={asset.caption ?? ""}
                    className={styles.thumb}
                  />
                )}
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(asset)}
                aria-label="Delete photo"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {lightboxSrc && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setLightboxSrc(null)}
        >
          <img
            src={lightboxSrc}
            alt=""
            className={styles.lightboxImage}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Button } from "../../design-system/components/Button/Button";
import { PageContainer } from "../../design-system/components/PageContainer/PageContainer";
import { useDebouncedCallback } from "../../core/utils/useDebouncedCallback";
import {
  createStickyNote,
  deleteStickyNote,
  listStickyNotes,
  updateStickyNoteContent,
  type StickyNote,
  type StickyNoteColor,
} from "../../core/db/stickyNotes";
import styles from "./StickyNotesPage.module.css";

const COLOR_OPTIONS: StickyNoteColor[] = ["amber", "sage", "neutral"];

export function StickyNotesPage() {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    setNotes(await listStickyNotes());
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleAdd(color: StickyNoteColor) {
    await createStickyNote(color);
    await refresh();
  }

  async function handleDelete(id: number) {
    await deleteStickyNote(id);
    await refresh();
  }

  return (
    <PageContainer style={{ maxWidth: 1100 }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-3xl)",
          marginBottom: 24,
        }}
      >
        Sticky Notes
      </h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {COLOR_OPTIONS.map((color) => (
          <Button
            key={color}
            variant="secondary"
            onClick={() => handleAdd(color)}
          >
            + {color}
          </Button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : notes.length === 0 ? (
        <p style={{ color: "var(--text-secondary)" }}>
          No sticky notes yet - add one above.
        </p>
      ) : (
        <div className={styles.grid}>
          {notes.map((note) => (
            <StickyNoteCard
              key={note.id}
              note={note}
              onDelete={() => handleDelete(note.id)}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}

function StickyNoteCard({
  note,
  onDelete,
}: {
  note: StickyNote;
  onDelete: () => void;
}) {
  const [content, setContent] = useState(note.content);

  // Debounced, not saved on every keystroke - matches the autosave
  // strategy committed to in docs/PERFORMANCE.md.
  const debouncedSave = useDebouncedCallback((value: string) => {
    updateStickyNoteContent(note.id, value);
  }, 500);

  function handleChange(value: string) {
    setContent(value);
    debouncedSave(value);
  }

  return (
    <div className={`${styles.note} ${styles[note.color]}`}>
      <textarea
        className={styles.textarea}
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Write something..."
      />
      <button
        className={styles.deleteButton}
        onClick={onDelete}
        aria-label="Delete note"
      >
        x
      </button>
    </div>
  );
}
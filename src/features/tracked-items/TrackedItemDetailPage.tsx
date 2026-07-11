import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../design-system/components/Button/Button";
import { Card } from "../../design-system/components/Card/Card";
import { ProgressBar } from "../../design-system/components/ProgressBar/ProgressBar";
import { Gallery } from "./Gallery";
import { calculateProgress } from "../../core/utils/progress";
import {
  archiveTrackedItem,
  getTrackedItem,
  type TrackedItem,
} from "../../core/db/trackedItems";
import {
  createChecklistItem,
  listChecklistItems,
  toggleChecklistItem,
  type ChecklistItem,
} from "../../core/db/checklistItems";

export function TrackedItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const trackedItemId = Number(id);

  const [item, setItem] = useState<TrackedItem | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const [fetchedItem, fetchedChecklist] = await Promise.all([
      getTrackedItem(trackedItemId),
      listChecklistItems(trackedItemId),
    ]);
    setItem(fetchedItem);
    setChecklist(fetchedChecklist);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackedItemId]);

  async function handleAddChecklistItem(e: FormEvent) {
    e.preventDefault();
    if (!newItemTitle.trim()) return;
    await createChecklistItem(trackedItemId, newItemTitle.trim());
    setNewItemTitle("");
    await refresh();
  }

  async function handleToggle(checklistItem: ChecklistItem) {
    await toggleChecklistItem(checklistItem.id, !checklistItem.is_done);
    await refresh();
  }

  async function handleArchive() {
    await archiveTrackedItem(trackedItemId);
    navigate("/tracked-items");
  }

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!item) return <div style={{ padding: 24 }}>Not found.</div>;

  const total = checklist.length;
  const done = checklist.filter((c) => c.is_done).length;
  const progress = calculateProgress(done, total);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontFamily: "var(--font-display)" }}>{item.title}</h1>
      <p style={{ color: "var(--text-secondary)" }}>{item.type}</p>

      <Card style={{ marginBottom: 16 }}>
        <ProgressBar value={progress} />
        <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>
          {done}/{total} checklist done ({progress}%)
        </p>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <form
          onSubmit={handleAddChecklistItem}
          style={{ display: "flex", gap: 8 }}
        >
          <input
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            placeholder="New checklist item"
            style={{ flex: 1 }}
          />
          <Button type="submit" variant="primary">
            Add
          </Button>
        </form>
      </Card>

      {checklist.length === 0 ? (
        <p style={{ color: "var(--text-secondary)" }}>
          No checklist items yet.
        </p>
      ) : (
        checklist.map((c) => (
          <Card
            key={c.id}
            style={{
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <input
              type="checkbox"
              checked={!!c.is_done}
              onChange={() => handleToggle(c)}
            />
            <span
              style={{
                textDecoration: c.is_done ? "line-through" : "none",
                color: c.is_done
                  ? "var(--text-secondary)"
                  : "var(--text-primary)",
              }}
            >
              {c.title}
            </span>
          </Card>
        ))
      )}

      <Gallery trackedItemId={trackedItemId} />

      <Button
        variant="destructive"
        onClick={handleArchive}
        style={{ marginTop: 16 }}
      >
        Archive
      </Button>
    </div>
  );
}
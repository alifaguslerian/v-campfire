import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../design-system/components/Button/Button";
import { Card } from "../../design-system/components/Card/Card";
import { ProgressBar } from "../../design-system/components/ProgressBar/ProgressBar";
import { calculateProgress } from "../../core/utils/progress";
import {
  createTrackedItem,
  listTrackedItems,
  type TrackedItemType,
  type TrackedItemWithProgress,
} from "../../core/db/trackedItems";

export function TrackedItemsPage() {
  const [items, setItems] = useState<TrackedItemWithProgress[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TrackedItemType>("project");
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    setItems(await listTrackedItems());
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await createTrackedItem({ type, title: title.trim() });
    setTitle("");
    await refresh();
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontFamily: "var(--font-display)" }}>Tracked Items</h1>

      <Card style={{ marginBottom: 16 }}>
        <form onSubmit={handleAdd} style={{ display: "flex", gap: 8 }}>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TrackedItemType)}
          >
            <option value="project">Project</option>
            <option value="game">Game</option>
          </select>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            style={{ flex: 1 }}
          />
          <Button type="submit" variant="primary">
            Add
          </Button>
        </form>
      </Card>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p style={{ color: "var(--text-secondary)" }}>
          No tracked items yet.
        </p>
      ) : (
        items.map((item) => {
          const progress = calculateProgress(
            item.checklist_done,
            item.checklist_total,
          );
          return (
            <Card key={item.id} style={{ marginBottom: 8 }}>
              <Link
                to={`/tracked-items/${item.id}`}
                style={{ color: "var(--text-primary)", textDecoration: "none" }}
              >
                <strong>{item.title}</strong>
              </Link>{" "}
              <span style={{ color: "var(--text-secondary)" }}>
                ({item.type})
              </span>
              {item.checklist_total > 0 && (
                <div style={{ marginTop: 8 }}>
                  <ProgressBar value={progress} />
                  <span
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {item.checklist_done}/{item.checklist_total}
                  </span>
                </div>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}
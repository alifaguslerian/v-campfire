import { useEffect, useState, type FormEvent } from "react";
import { Button } from "../../design-system/components/Button/Button";
import { Card } from "../../design-system/components/Card/Card";
import {
  createTrackedItem,
  listTrackedItems,
  type TrackedItem,
  type TrackedItemType,
} from "../../core/db/trackedItems";

export function TrackedItemsPage() {
  const [items, setItems] = useState<TrackedItem[]>([]);
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
        <form
          onSubmit={handleAdd}
          style={{ display: "flex", gap: 8 }}
        >
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
        items.map((item) => (
          <Card key={item.id} style={{ marginBottom: 8 }}>
            <strong>{item.title}</strong>{" "}
            <span style={{ color: "var(--text-secondary)" }}>
              ({item.type})
            </span>
          </Card>
        ))
      )}
    </div>
  );
}

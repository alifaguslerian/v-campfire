/**
 * Shared progress calculation - previously duplicated inline in
 * TrackedItemsPage and TrackedItemDetailPage. Single source of truth now.
 */
export function calculateProgress(done: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((done / total) * 100);
}

/**
 * Local calendar date as YYYY-MM-DD - deliberately NOT date.toISOString()
 * (that converts to UTC first, which can roll over to the wrong calendar
 * day for anyone working past midnight - exactly this app's use case).
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

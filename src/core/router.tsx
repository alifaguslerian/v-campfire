import { createHashRouter, Navigate } from "react-router-dom";
import { App } from "../app/App";
import { TrackedItemsPage } from "../features/tracked-items/TrackedItemsPage";
import { TrackedItemDetailPage } from "../features/tracked-items/TrackedItemDetailPage";
import { StickyNotesPage } from "../features/sticky-notes/StickyNotesPage";
import { JournalPage } from "../features/journal/JournalPage";
import { FocusPage } from "../features/focus/FocusPage";
import { MusicPage } from "../features/music/MusicPage";
import { StatsPage } from "../features/stats/StatsPage";

// createHashRouter, not createBrowserRouter - Tauri serves the production
// build through its own asset protocol, not a server that can resolve
// arbitrary paths on refresh/deep link. Hash-based routing keeps route
// state in the URL fragment, which needs no server resolution at all.
export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/tracked-items" replace /> },
      { path: "tracked-items", element: <TrackedItemsPage /> },
      { path: "tracked-items/:id", element: <TrackedItemDetailPage /> },
      { path: "sticky-notes", element: <StickyNotesPage /> },
      { path: "journal", element: <JournalPage /> },
      { path: "focus", element: <FocusPage /> },
      { path: "music", element: <MusicPage /> },
      { path: "stats", element: <StatsPage /> },
    ],
  },
]);
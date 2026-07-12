import { NavLink } from "react-router-dom";
import {
  Flame,
  LayoutGrid,
  Timer,
  BookOpen,
  StickyNote,
  Music,
  BarChart3,
} from "lucide-react";
import { useFocusStore } from "../core/focus/store";
import { useAudioStore } from "../core/audio/store";
import styles from "./BottomDock.module.css";

const navItems = [
  { to: "/", label: "Home", icon: Flame, end: true },
  { to: "/tracked-items", label: "Items", icon: LayoutGrid, end: false },
  { to: "/focus", label: "Focus", icon: Timer, end: false },
  { to: "/journal", label: "Journal", icon: BookOpen, end: false },
  { to: "/sticky-notes", label: "Notes", icon: StickyNote, end: false },
  { to: "/music", label: "Music", icon: Music, end: false },
  { to: "/stats", label: "Stats", icon: BarChart3, end: false },
];

export function BottomDock() {
  const focusPhase = useFocusStore((s) => s.phase);
  const isMusicPlaying = useAudioStore((s) => s.isPlaying);

  return (
    <nav className={styles.dock}>
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            isActive ? `${styles.item} ${styles.active}` : styles.item
          }
        >
          {({ isActive }) => (
            <>
              <span style={{ position: "relative", display: "flex" }}>
                <Icon size={20} strokeWidth={1.75} />
                {to === "/focus" && focusPhase !== "idle" && (
                  <span className={styles.dot} />
                )}
                {to === "/music" && isMusicPlaying && (
                  <span className={styles.dot} />
                )}
              </span>
              {isActive && <span className={styles.label}>{label}</span>}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
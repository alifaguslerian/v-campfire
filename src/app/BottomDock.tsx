import { NavLink } from "react-router-dom";
import {
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
  { to: "/tracked-items", label: "Items", icon: LayoutGrid },
  { to: "/focus", label: "Focus", icon: Timer },
  { to: "/journal", label: "Journal", icon: BookOpen },
  { to: "/sticky-notes", label: "Notes", icon: StickyNote },
  { to: "/music", label: "Music", icon: Music },
  { to: "/stats", label: "Stats", icon: BarChart3 },
];

export function BottomDock() {
  const focusPhase = useFocusStore((s) => s.phase);
  const isMusicPlaying = useAudioStore((s) => s.isPlaying);

  return (
    <nav className={styles.dock}>
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
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

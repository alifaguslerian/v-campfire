import { NavLink } from "react-router-dom";
import { useFocusStore } from "../core/focus/store";
import { formatSecondsAsClock } from "../core/utils/time";
import styles from "./Sidebar.module.css";

const navItems = [
  { to: "/tracked-items", label: "Tracked Items" },
  { to: "/focus", label: "Focus" },
  { to: "/journal", label: "Journal" },
  { to: "/sticky-notes", label: "Sticky Notes" },
];

export function Sidebar() {
  const { phase, secondsRemaining } = useFocusStore();

  return (
    <nav className={styles.sidebar}>
      <div
        className={styles.brand}
        style={{ fontFamily: "var(--font-display)" }}
      >
        V Campfire
      </div>

      {phase !== "idle" && (
        <div
          className="tabular-nums"
          style={{ fontSize: "var(--text-sm)", color: "var(--accent-primary)" }}
        >
          {phase === "focus" ? "Focus" : "Break"} -{" "}
          {formatSecondsAsClock(secondsRemaining)}
        </div>
      )}

      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? `${styles.navLink} ${styles.active}`
                  : styles.navLink
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
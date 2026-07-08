import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

// Nav items are added one at a time as features actually exist - no
// placeholder links to Focus/Journal/etc. before v0.2 actually builds them.
const navItems = [{ to: "/tracked-items", label: "Tracked Items" }];

export function Sidebar() {
  return (
    <nav className={styles.sidebar}>
      <div
        className={styles.brand}
        style={{ fontFamily: "var(--font-display)" }}
      >
        V Campfire
      </div>
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

import styles from "./AmbientBackground.module.css";

// Purely visual, no state - mounted once in App.tsx alongside the other
// drivers. z-index: -1 and pointer-events: none, so it never interferes
// with layout or interaction. Only animates `opacity` (GPU-compositable) -
// never anything that would force a repaint every frame, to stay inside
// the idle-CPU budget in docs/PERFORMANCE.md.
export function AmbientBackground() {
  return (
    <div className={styles.background} aria-hidden="true">
      <div className={styles.glow} />
      <div className={styles.noise} />
    </div>
  );
}

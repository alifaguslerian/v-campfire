import type { ReactNode } from "react";

// Label + thin divider underneath - the recurring "section title" pattern
// from the visual reference (Project Pulse, Rituals, Growth, etc. each
// get their own label-plus-line). Used for every section heading on Home
// and reusable wherever the same rhythm is needed later.
//
// This is for main-content section titles specifically - real visual
// weight (serif, larger), per docs/DESIGN_SYSTEM.md's two-tier hierarchy.
// Secondary/sidebar labels (inside a Card, or clearly tertiary info) stay
// as plain small muted text, not this component - don't use SectionHeading
// for those, or the two-tier distinction disappears.
interface SectionHeadingProps {
  children: ReactNode;
}

export function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-xl)",
          color: "var(--text-primary)",
          marginBottom: 12,
        }}
      >
        {children}
      </p>
      <div style={{ borderBottom: "1px solid var(--border-subtle)" }} />
    </div>
  );
}
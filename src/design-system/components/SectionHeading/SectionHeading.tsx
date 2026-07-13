import type { ReactNode } from "react";

// Label + thin divider underneath - the recurring "section title" pattern
// from the visual reference (Project Pulse, Rituals, Growth, etc. each
// get their own label-plus-line). Used for every section heading on Home
// and reusable wherever the same rhythm is needed later.
interface SectionHeadingProps {
  children: ReactNode;
}

export function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "var(--text-sm)",
          marginBottom: 8,
        }}
      >
        {children}
      </p>
      <div style={{ borderBottom: "1px solid var(--border-subtle)" }} />
    </div>
  );
}

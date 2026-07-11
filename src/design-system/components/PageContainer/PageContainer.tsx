import type { HTMLAttributes } from "react";

// Constrains reading width and centers content - every feature page uses
// this instead of a raw padded div, so pages read like an editorial
// document instead of full-bleed dashboard panels stretched edge to edge.
export function PageContainer({
  style,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{ padding: 24, maxWidth: 720, margin: "0 auto", ...style }}
      {...rest}
    />
  );
}

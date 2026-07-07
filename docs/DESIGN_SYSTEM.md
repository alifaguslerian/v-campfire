# Design System

Theme character, palette, typography, and accessibility rules for V Campfire. Concrete tokens live in `src/design-system/tokens/` (`colors.css`, `spacing.css`, `typography.css`) - this doc explains the reasoning, the CSS files are the source of truth for actual values.

## Visual identity

Theme character: **"warm ember cabin at night"** - not terminal/cyberpunk (too cold for "cozy"), not generic luxury minimal (not personal enough).

- **Base**: dark charcoal, not pure black - dark mode default
- **Accent**: warm amber/ember as primary, muted terracotta/rust as secondary - no purple/violet
- **Typography**: serif display for headings (editorial, personal feel), humanist sans for body/UI
- **Shape**: moderate rounded corners, not uniform pills - "premium desk" not "SaaS dashboard"
- **Glow**: campfire glow effect used selectively (e.g. active focus session indicator), not repeated as decoration on every card

## Typography

- **Fraunces** for display/headings - variable font, `opsz` axis auto-adjusts between large (softer, more character) and small (cleaner) sizes. Chosen over Playfair Display, which has become the default "premium AI product" serif and no longer reads as distinctive.
- **Work Sans** for body/UI - humanist sans (organic letterforms in `a`, `g`) but stays legible at small sizes for dense dashboards. Chosen over Inter deliberately, per the project's own design principle of not defaulting to it.
- Both are SIL OFL licensed, self-hosted as `.woff2` under `src/design-system/tokens/fonts/` - **not** loaded from Google Fonts CDN, since the app is offline-first and must not make network requests on startup.
- Pomodoro timer digits use `font-variant-numeric: tabular-nums` on Work Sans rather than a separate monospace font, so digit width doesn't shift during countdown.

## Color palette

Every text/background pair below was checked against the actual WCAG contrast formula, not eyeballed - amber/rust tones are easy to get wrong on this axis.

| Token | Hex | Use | Contrast vs `bg-base` |
|---|---|---|---|
| `--bg-base` | `#14110F` | app background | - |
| `--bg-elevated` | `#1E1A17` | cards, surfaces | - |
| `--bg-elevated-2` | `#29231F` | modals, popovers | - |
| `--text-primary` | `#F2E9E1` | body text | 15.69:1 (AA) |
| `--text-secondary` | `#B8A99B` | secondary text | 8.23:1 (AA) |
| `--text-muted` | `#7A6C60` | placeholder/disabled only | 3.71:1 (AA-large only - never use for small body text) |
| `--accent-primary` | `#E8873A` | primary actions, active states, focus ring | 7.13:1 (AA), also valid as dark-text-on-amber for buttons |
| `--accent-primary-hover` | `#F49C52` | hover state | - |
| `--accent-secondary` | `#B24A2C` | badges, tags, secondary emphasis | - |
| `--color-error` | `#DD5B47` | destructive actions, errors | 5.07:1 (AA) |
| `--color-success` | `#8CA36A` | completed/success | 6.77:1 (AA) - muted olive, not saturated green, to avoid clashing with the warm palette |
| `--border-subtle` | `#332C27` | decorative dividers | 1.70:1 - fine, not a functional boundary, not required to meet contrast |
| `--border-functional` | `#74655A` | input outlines, anything conveying a required boundary | 3.36:1 (meets the 3:1 non-text UI contrast threshold) |

No separate warning or info color. `--accent-primary` already reads as "attention" - adding a fifth semantic color for a single-user app is unneeded complexity. Only error gets its own color, since it must be unambiguous (e.g. a delete confirmation).

## Spacing & shape

Scale: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px`. Radius: `6px` (inputs, small buttons), `10px` (cards), `16px` (modals) - moderate, never a full pill shape.

## Accessibility

Priorities kept cheap and relevant for a single-user app - not a full WCAG audit, which makes more sense for a product with a broad user base:

- **Contrast**: covered above, checked against real numbers rather than assumed.
- **`prefers-reduced-motion`**: every animation/micro-interaction must respect this media query - disable or drastically reduce transitions when the OS setting is on.
- **Basic keyboard navigation**: logical tab order, visible focus ring (never `outline: none` without a replacement), shortcuts for frequent actions (start/stop timer).
- **Focus management in modals**: focus trapped while open, returned to the triggering element on close - standard behavior if modals are built correctly, no extra library required.
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

Scale: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px`. Radius: `6px` (inputs, small buttons), **`14px`** (cards, bumped up from 10px), `16px` (modals) - moderate, never a full pill shape.

**One deliberate exception**: the bottom navigation dock uses a full-round pill (`border-radius: 9999px`). A floating dock reads as a physical object separate from the content surface, not a content card - full-round is the correct shape for that specific role. Cards, buttons, and every other content surface keep the moderate-radius rule unchanged.

## Typography hierarchy refinement (third visual reference pass)

A Google Stitch HTML export was reviewed for spacing/rhythm/hierarchy only, not copied. It independently converged on Fraunces + Work Sans, which corroborates that choice rather than contradicting it. Four things were accepted:

- **`--text-hero` (new, 4.5rem/72px)**: the Focus countdown was undersized at `--text-2xl` (40px) for a number meant to feel monumental - the one element in the app that should read as the dominant typographic moment on its screen. Used only for that countdown display, nowhere else.
- **Two-tier section heading hierarchy.** Main-column section titles (e.g. "Latest", "Today's journal") now get real visual weight - serif, larger - via an updated `SectionHeading`. Secondary/sidebar labels (inside a Card, or clearly tertiary like "At a glance") stay quiet muted captions, unchanged. This split is deliberate: primary content earns presence, secondary info stays out of the way.
- **Active-state pill badge**: a small pill (pulsing dot + uppercase tracked label) marking an active state at the top of a view (e.g. "Focus session" while a timer runs). Reuses the pulse animation pattern and amber accent already established for the dock's focus/music indicators - not a new interaction language, the same one applied somewhere more visible.
- **List-row affordance**: rows that link somewhere get a 2px colored left edge (`--accent-primary`) and a small arrow that fades/slides in on hover - `opacity` and `transform` only, GPU-compositable, respects `prefers-reduced-motion` like every other animation in this system.

**Rejected from this reference**: a top navbar with search and notification icons (reopens the "no top nav, bottom dock only" decision made earlier), and a near-invisible (~3% white tint) card background (our existing ~90%-opacity elevated surface is already validated and more legible - going more transparent has no upside here).

A second design reference was reviewed against the shipped v0.4 UI. Most of it was rejected - it proposed swapping to Playfair Display/Fira Sans (the exact "generic AI premium serif" Fraunces was chosen to avoid) and a full Material Design 3 token set (much of it irrelevant since this app is dark-only, never needs `-fixed`/`-fixed-dim` light-mode-parity tokens). What was accepted:

- **Shadows widened, not just deepened.** `--shadow-sm`/`--shadow-md` were tightly clustered (`0 2px 8px`) - a wider spread reads as softer, more convincing depth without looking heavier. New values:
  - `--shadow-sm: 0 4px 16px rgba(20, 14, 10, 0.3)`
  - `--shadow-md: 0 16px 40px rgba(20, 14, 10, 0.4)`
- **`--shadow-glow` (new token)**: a soft, low-opacity amber ambient glow (`0 0 24px rgba(232, 135, 58, 0.18)`) for the single most important element in a view - a primary action button, the active dock icon. Not applied broadly; one glowing element per screen at most, or it stops reading as emphasis.
- **Card radius 10px → 14px** - softer without approaching the pill-shape line.
- **Inputs and textareas: bottom-border only, not a boxed outline.** Already proven in the Journal page; now the default everywhere instead of Journal-only. `<select>` keeps a full (but still 1px, understated) border, since a dropdown's affordance depends on reading as a discrete clickable box in a way a text field doesn't.
- **Rejected**: full M3 color-role palette swap, Playfair Display/Fira Sans, "lists should avoid dividers" (conflicts with the ledger-style Stats page, which is already shipped and approved).

## Accessibility

Priorities kept cheap and relevant for a single-user app - not a full WCAG audit, which makes more sense for a product with a broad user base:

- **Contrast**: covered above, checked against real numbers rather than assumed.
- **`prefers-reduced-motion`**: every animation/micro-interaction must respect this media query - disable or drastically reduce transitions when the OS setting is on.
- **Basic keyboard navigation**: logical tab order, visible focus ring (never `outline: none` without a replacement), shortcuts for frequent actions (start/stop timer).
- **Focus management in modals**: focus trapped while open, returned to the triggering element on close - standard behavior if modals are built correctly, no extra library required.
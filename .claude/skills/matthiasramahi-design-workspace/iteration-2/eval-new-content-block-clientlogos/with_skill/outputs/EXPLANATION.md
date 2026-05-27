# clientLogosStrip — design rationale

A quiet, hairline-divided row of client/brand marks. Visually it belongs to the same family as `audience__grid` and `mr-cities__grid`: a matrix of cells joined by 1px gaps over `var(--border)`, no shadows, no rounded corners, no scale-on-hover. Not a "trusted by" sponsor wall.

## CMS shape (`contentBlocks.ts`)

The block exposes only what the editor actually decides:

- `eyebrow` — defaults to `Vertrauen`. Mono micro-kicker, same family as every other section eyebrow.
- `headline` — optional. Supports a single `*…*` pair to mark the steel-/sage `<em>` word ("Marken, *mit denen ich arbeite.*"). This keeps the canonical H2 em-treatment authoring-friendly without a richText editor.
- `theme` — `dark` (default) or `light`. Sets `data-theme` / `data-header-theme` so the sticky-header chrome JS retints correctly and the page keeps its dark → light → dark rhythm.
- `treatment` — `monochrome` (recommended) or `original`. Monochrome flattens colored brand logos via `grayscale + brightness + contrast` so a row of Mercedes red, Porsche gold and a magazine wordmark reads as one editorial line, not a circus.
- `logos` — 3–12 items (`minRows: 3`, `maxRows: 12`). Each item is `logo` (Media relationship), `name` (alt + aria-label, required), and an optional `href`. Editor copy explicitly nudges curation over completeness.

## Astro renderer (`ContentBlocks.astro`)

A new `clientLogosStrip` branch sits between `linkList` and `ctaBlock`. Logic:

1. Filter out empty logo rows so a half-filled block doesn't render an empty matrix.
2. Split the headline on `*…*` and wrap the captured word in `<em>` — the canonical headline accent (`var(--accent-2, #7a8a86)`).
3. Render each cell as a `<li>` containing either an `<a>` (when `href` set, with `aria-label`) or a plain `<span>`. The brand name is visually hidden but kept for screen readers — the visual language is logo-only.
4. Local `<style>` block scopes all CSS so we don't pollute `tokens.css`. Sizing uses the project's `clamp()` rhythm; easing is `var(--ease)`.

## How it fits the site visually

- **Geometry** — 6 cells per row on desktop, 4 at tablet, 2 on mobile. Cells are 1px-divided over `--border`, mirroring `audience__grid` and `mr-cities__grid`.
- **Color** — Dark theme uses `--bg`/`--fg`; light theme uses `--paper`/`--paper-ink` with paper-ink-tinted hairlines. No red, no gradient, no card chrome.
- **Logos** — Constrained to `max-height: 44px`, `object-fit: contain`. Monochrome treatment + 0.78 base opacity gives the "muted contact-sheet" tone; hover lifts to full opacity / full color over 0.6s — the same slow photographic easing the chapter grid uses. No bounce, no scale.
- **Headline** — `<em>` steel-grey, exactly like "BILDER, DIE EINEN RAUM **VERÄNDERN.**".
- **Motion** — Single opacity/filter transition, killed under `prefers-reduced-motion: reduce`.

After merging, run `payload generate:types` to refresh `payload-types.ts`.

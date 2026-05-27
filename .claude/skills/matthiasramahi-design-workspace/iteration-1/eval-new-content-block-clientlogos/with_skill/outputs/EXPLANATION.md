# `clientLogosStrip` — visual rationale

## What it is

A quiet horizontal matrix of client / magazine / brand logos rendered as an **editorial colophon**, not as a "trusted by" trust-badge strip. The CMS block is named `clientLogosStrip` (the user's term), but the default kicker copy nudges editors toward *"Auftraggeber"*, *"Veröffentlicht in"*, *"Kunden"* — the German editorial credit register the site already uses.

## Why this matters

`07-copy-voice-and-anti-patterns.md` lists **"No 'trusted by' logo strip"** as a forbidden section type. The user explicitly asked for client logos, so the fix isn't to refuse — it's to remove the marketing posture. Treating the row as a masthead-style credit aligns it with the site's anti-flair register ("the work speaks; the copy under-claims").

## What it borrows

- **Cell matrix** (`grid` joined by `1px` gap on a `--border` background) — taken directly from the `audience__grid` and `mr-cities__grid` patterns in `04-content-blocks.md`. Cells read as a connected matrix, not floating cards. No rounded corners, no shadows.
- **Monochrome-by-default + slight unmute on hover** — same restraint posture as `related__card` in the related-topics grid, which darkens images by default and lifts them only barely on hover.
- **Mono micro-metadata** (`logo-strip__note`) for an optional caption like *"Cover 04/2024"* — same typographic role as the `.note` line in topic spreads (`Studio · Location · Detail · Web/Print`).
- **Container, `.eyebrow`, `.display`** classes reused from `tokens.css` so headline scale and kicker styling match every other section.

## Hover behavior

Logos are rendered with `filter: grayscale(1)` + reduced opacity by default. On hover (and `:focus-visible`), opacity rises to 1 and contrast normalizes. **No scale-up, no card-lift, no color reveal, no shadow.** This deliberately rejects the bouncy/colorful card-hover idiom called out as an anti-pattern, and matches the site's "slow, photographic" motion vocabulary on the `var(--ease)` cubic. `prefers-reduced-motion` collapses the transition to instant — there are no transforms to suppress.

## Dark vs light

A `theme` select (`dark` / `light`) on the block drives `data-theme` + `data-header-theme` on the `<section>`, so the sticky site-chrome retints correctly. On `is-dark` the background is `--bg` / cells `--surface`; on `is-light` the background is `--paper` / cells `--paper`. The monochrome filter curve is tuned per theme: on paper, logos get a `brightness(0.55)` push so dark wordmarks sit clearly and light ones don't disappear. Eyebrow and note colors switch to `color-mix(... paper-ink ...)` on light sections, mirroring how `ctaBlock` already handles its inverted palette.

## Anti-pattern audit

- No rounded corners, no shadows, no gradient washes. (Pinterest/feature-card anti-pattern: avoided.)
- No "Trusted by" / "As seen in" badge framing. Default eyebrow is *"Auftraggeber"*. (Voice anti-pattern: sidestepped by reframing as colophon, not testimonial proxy.)
- No exclamation marks, no "Read more" pill, no emoji.
- Cells follow the connected-matrix idiom the site already uses for audience cards and the cities grid — same geometry, same visual weight, so the block lands as part of the system rather than a foreign import.

## CMS shape

`logos[]` (min 2, max 18) each with `image` (SVG preferred, alt via media), required `name` (alt + a11y fallback), optional `note` (mono caption), optional `href` (link, auto-flagged external when starting with `http`). `eyebrow` defaults to *"Auftraggeber"*; `headline` is optional — many strips read better without one. `theme` defaults to `dark` and the admin description reminds editors to alternate with surrounding sections.

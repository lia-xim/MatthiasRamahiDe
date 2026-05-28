# Legacy Reference Freeze

The current root `.html` files are the visual reference for the Astro + Payload migration. They are not the long-term architecture, but they are the baseline that protects the current design, copy, CTAs, SEO metadata, and recent manual edits while pages are adopted one by one.

## Rules

- Do not delete root `.html` files until the matching Astro/Payload route is adopted and visually checked.
- Do not use Payload as a permanent store for raw layout HTML.
- Keep `.html` URLs stable while migration happens.
- Adopt one page or page family at a time.
- After adoption, compare the adopted Astro route against `/legacy-baseline/<slug>`.

## Current Priority

1. Header and footer stay Payload-driven through the Astro shell.
2. The neutral photography pages are the canonical main pages.
3. Local SEO pages are enabled for private staging through the Astro/Payload adoption layer; the root `.html` files remain the visual baseline for review.
4. Blog and journal pages should move to structured blocks after the hero and article model are stable.

## Adopted Route Rule

Adopted `.html` URLs stay public, but they are no longer prerendered by the generic legacy endpoint. The middleware rewrites them internally to `/native/<slug>`, where Astro renders the Payload-backed shell. Non-adopted `.html` URLs remain static fallback pages until their page family is ready.

The adopted list lives in `apps/web/src/lib/adoptedRoutes.ts`.

## Refreshing The Freeze Manifest

Run:

```bash
corepack pnpm legacy:freeze
```

This writes `docs/legacy-reference-manifest.json` with checksums, titles, descriptions, canonicals and page classification.

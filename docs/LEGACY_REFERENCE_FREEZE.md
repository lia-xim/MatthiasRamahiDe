# Legacy Reference Freeze

The current root `.html` files are the visual reference for the Astro + Payload migration. They are not the long-term architecture, but they are the baseline that protects the current design, copy, CTAs, SEO metadata, and recent manual edits while pages are adopted one by one.

## Rules

- Do not delete root `.html` files until the matching Astro/Payload route is adopted and visually checked.
- Do not use Payload as a permanent store for raw layout HTML.
- Keep `.html` URLs stable while migration happens.
- Adopt one page or page family at a time.
- After adoption, compare the adopted Astro route against the separate reference server started by `corepack pnpm web:test:visual`.

## Current Priority

1. Header, footer, SEO metadata, canonicals and structured data are rendered through the Astro shell.
2. All previous public `.html` URLs are generated from the native Astro route registry.
3. Local SEO pages inherit one of the six native photography family layouts; Payload can override content and SEO fields without storing raw page HTML.
4. Blog and journal legacy URLs use native article renderers; new `/journal/<slug>` pages stay CMS-native.
5. Production CSS/JS references use neutral `native-*` assets. Older `legacy-*` assets stay with the frozen reference only.
6. The production asset sync does not scan root HTML by default. Set `SYNC_INCLUDE_ROOT_REFERENCE_HTML=true` only for explicit QA/reference workflows.
6. The remaining root `.html` files are an archive and QA baseline only. Remove or move them only after explicit archive/delete sign-off.

## Adopted Route Rule

Adopted `.html` URLs stay public, but they are no longer prerendered by a generic legacy endpoint. The middleware rewrites them internally to `/native/<slug>`, where Astro renders the Payload-backed native shell in local/server mode. The current static production model builds all previous root `.html` URLs through the native route registry.

The adopted list lives in `apps/web/src/lib/adoptedRoutes.ts`.

There is no `/legacy-baseline/*` route in the Astro app anymore. Visual Regression reads the frozen root HTML files through a short-lived QA server, so production source code does not depend on raw legacy rendering.

Current QA status: the native web build, `native:guard`, 217/217 legacy-route audit, grouped visual regression, strict site-quality audit, strict CMS readiness audit and strict CMS production audit pass as of 2026-05-29. Published CMS content now uses release-capable render sources (`native-component` or `structured-blocks`); `payload-legacy-html` is treated as import/archive metadata only. Remaining warnings are performance long-task warnings on media-heavy pages, not legacy-render dependencies.

## Refreshing The Freeze Manifest

Run:

```bash
corepack pnpm legacy:freeze
```

This writes `docs/legacy-reference-manifest.json` with checksums, titles, descriptions, canonicals and page classification.

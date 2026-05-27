# 06 — Astro + Payload CMS Bridge

The site has two coexisting implementations: legacy static HTML at the project root (the visual truth) and an Astro + Payload migration in `apps/web` + `apps/cms` (the future). This reference is how to work in the Astro side without breaking the visual contract.

**Big-picture rule:** The Astro side is a *parity port*, not a redesign. Every new component should be checkable against a legacy page. If you find yourself improving the design when porting, stop — that's two changes in one and risks both. Port to parity first; design improvements come later as deliberate user-approved changes.

## Architecture at a glance

```
apps/cms/   ← Payload 3 + Next 15 + Postgres (production) / SQLite (local dev)
  src/collections/        ← PortfolioProjects, ServicePages, JournalPosts, LocalSeoPages, SitePages, …
  src/fields/             ← seo.ts, slug.ts, contentBlocks.ts (reusable field groups)
  src/globals/            ← Navigation, SiteSettings, Footer, GlobalCtas
  src/payload.config.ts   ← entry point

apps/web/   ← Astro 5 + @astrojs/node (static SSG output)
  src/styles/tokens.css           ← canonical token source
  src/layouts/BaseLayout.astro    ← <html> shell, meta, JSON-LD
  src/components/
    SiteHeader.astro              ← shared header, fetches Navigation global
    SiteFooter.astro              ← shared footer, fetches Footer global
    ContactCta.astro              ← unified contact module
    ContentBlocks.astro           ← polymorphic block renderer
    ResponsiveImage.astro         ← <picture> with AVIF/WebP srcsets
  src/lib/
    payload.ts                    ← REST client + image/url helpers
    legacy.ts                     ← reads legacy HTML files from project root
  src/pages/
    index.astro                   ← home (currently legacy-served)
    [slug].ts                     ← catch-all → legacy HTML
    portfolio/[slug].astro        ← portfolio detail
    services/[slug].astro         ← service detail
    journal/[slug].astro          ← journal detail
    preview/[collection]/[slug].astro  ← live preview (SSR, noindex)
```

## Tokens — the Astro side is canonical

`apps/web/src/styles/tokens.css` is the **source of truth** for the design system going forward. It matches `brand-spec.md` exactly. When the user asks to change a token, update tokens.css and add the matching change in:

- `assets/site-chrome.css` (the legacy shared chrome — also references the variables, but some hex values are hardcoded in inline styles per page).
- `brand-spec.md` (documentation should stay in sync).

The Astro tokens use **oklch** with the canonical oxidized-red accent — `oklch(57% 0.185 31)`. This matches the canonical brand. Do not silently introduce the chrome/steel system (`#c8ccc6`) into tokens.css.

## BaseLayout — what every Astro page wraps with

```astro
---
// apps/web/src/layouts/BaseLayout.astro
const { title, description, canonicalUrl, noIndex, ogImage, ogType, jsonLd } = Astro.props
const settings = await getSiteSettings()
---
<html lang="de">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>{title ?? 'Matthias Ramahi Fotografie'}</title>
    <meta name="description" content={description ?? settings.defaultDescription}>
    <link rel="canonical" href={absoluteUrl(canonicalUrl ?? Astro.url.pathname)}>
    {noIndex && <meta name="robots" content="noindex">}
    <meta name="theme-color" content="#020306">
    {ogImage && <meta property="og:image" content={imageUrl(ogImage)}>}
    <meta property="og:type" content={ogType ?? 'website'}>
    <script type="application/ld+json" set:html={JSON.stringify([personJsonLd(settings), webSiteJsonLd(settings), localBusinessJsonLd(settings), ...(jsonLd ?? [])])}/>
    <link rel="stylesheet" href="/src/styles/tokens.css">
  </head>
  <body>
    <div class="site-shell">
      <SiteHeader />
      <main class="site-main"><slot /></main>
      <SiteFooter />
    </div>
  </body>
</html>
```

Props pattern:

```astro
<BaseLayout
  title="Motorrad Fotografie Köln — Matthias Ramahi"
  description="…"
  canonicalUrl="/motorrad-fotografie-koeln"
  ogImage={page.heroImage}
  jsonLd={[breadcrumbJsonLd(page), serviceJsonLd(page)]}
>
  <!-- page content -->
</BaseLayout>
```

The base layout auto-injects:
- `Person`, `WebSite`, `LocalBusiness` JSON-LD from `SiteSettings` global.
- Theme-color meta (`#020306`).
- Canonical URL (computed from props or `Astro.url.pathname`).
- Page-specific JSON-LD merges into the auto-injected array.

## Component contracts

### `<SiteHeader />`

No props. Fetches the `Navigation` global on render. Outputs the sticky top bar with brand mark, primary nav, accent CTA. Falls back to a hardcoded nav if CMS is empty.

### `<SiteFooter />`

No props. Fetches the `Footer` global. Outputs the multi-column footer.

### `<ContactCta cta? />`

Optional `cta` prop overrides the global CTA copy:

```ts
type ContactCtaProps = {
  cta?: {
    headline?: string
    lead?: string
    emailSubject?: string
    proofPoints?: string[]
  }
}
```

If `cta` is omitted, falls back to `GlobalCtas` global. The component renders the unified contact module — light paper section, two-column layout, form with mailto submission and honeypot. Don't reimplement it; pass props.

### `<ResponsiveImage media size? class? sizes? loading? fallback? />`

```ts
type ResponsiveImageProps = {
  media: PayloadMedia | string  // PayloadMedia object (preferred) or raw URL string
  size?: 'hero' | 'card' | 'mobile' | 'wide' | 'thumb'  // default 'card'
  class?: string
  sizes?: string                // default '(max-width: 760px) 100vw, 50vw'
  loading?: 'lazy' | 'eager'    // default 'lazy'
  fallback?: string             // bg color / placeholder
}
```

Outputs a `<picture>` with AVIF source set, WebP fallback source, and a final `<img>` for the worst-case fallback. Uses Payload-generated size variants (`thumb` 360, `mobile` 760, `card` 1100, `hero` 1920, `wide` 2560) and the focal point from the media object for `object-position`.

For hero images, pass `loading="eager"`.

### `<ContentBlocks blocks? />`

Polymorphic renderer for CMS-authored content blocks. Reads `blocks` array (the Payload `blocks` field) and renders each block type. Six block types currently supported:

| Block type | Fields | Visual |
| --- | --- | --- |
| `textBlock` | eyebrow, headline, body (richText) | Centered section with eyebrow + large display + prose |
| `imageSequence` | layout (editorial-strip\|contact-sheet\|stage\|single-large), items[{image, caption, cropIntent}] | Card grid (1px gap on rule bg) of images |
| `quoteBlock` | quote, attribution | Large display blockquote, centered |
| `faqBlock` | headline, items[{question, answer}] | Stack list, no accordion JS |
| `linkList` | headline, links[{label, href, description}] | Stack list of links |
| `ctaBlock` | headline, text, buttonLabel, emailSubject | Light paper card with ink CTA |

When adding a new block type, see "How to add a new content block" below.

## Routing model

```
/                              ← src/pages/index.astro (currently legacy-served; CMS Home not wired)
/portfolio                     ← redirect 308 → /portfolio.html (legacy)
/portfolio/[slug]              ← src/pages/portfolio/[slug].astro from PortfolioProjects collection
/services                      ← redirect 308 → /leistungen.html (legacy)
/services/[slug]               ← src/pages/services/[slug].astro from ServicePages collection
/{slug}                        ← service slug routing (e.g. /fotografie-duesseldorf)
/journal                       ← redirect 308 → /blog.html (legacy)
/journal/[slug]                ← src/pages/journal/[slug].astro from JournalPosts collection
/preview/[collection]/[slug]   ← SSR live preview with secret + API key
/{any-other-slug}              ← src/pages/[slug].ts catch-all → legacy HTML file from project root
```

**Local SEO pages are still served by the legacy bridge.** `LocalSeoPages` exists in the CMS, but there is no dedicated `src/pages/seo/[slug].astro` or similar yet. When the user is ready to migrate the SEO cluster to CMS-authored content, you'll need to:
1. Create a route (e.g., `src/pages/seo/[slug].astro` or a custom catch-all that takes priority over the legacy bridge for SEO slugs).
2. Render the same anatomy from `05-seo-subpage-scaffold.md` using CMS data instead of templated HTML.
3. Disable the legacy file for that slug (e.g., remove it from the legacy bridge alias table or rename it `.bak.html`).

## Payload collections — quick reference

### PortfolioProjects
- Required: title, slug, category (rel → portfolio-categories), coverImage, excerpt, seo.{title, description}
- Optional: gallery, presentationMode (floating-archive | narrative-stage | experimental-lens | editorial), cta (group), blocks (ContentBlocks)
- Sort/feature: featured, sortOrder, publishedAt
- Relations: relatedServices → service-pages

### ServicePages
- Required: title, slug, serviceType (automotive | sportwagen | oldtimer | motorrad | portrait | landschaft | fotolabor | grossformatdruck | werbetechnik | webdesign-seo | videografie | other), heroImage, intro, seo
- Optional: audience (array), proofPoints (array of {label, text}), faq (array of {q, a}), cta, blocks

### JournalPosts
- Required: title, slug, category (behind-the-scenes | automotive | portrait | landscape-print | process), publishedAt, coverImage, excerpt, seo
- Optional: readingTime, tags, relatedPages, blocks

### LocalSeoPages
- Required: title, slug, city, service, intro, seo
- Optional: canonicalServicePage (rel → service-pages), targetKeyword, localProof, localFaq, blocks
- Priority: high | medium | later

### SitePages
- Required: title, slug, pageType (home | about | contact | portfolio-index | services-index | journal-index | legal), seo
- Optional: heroImage, intro, contactOverride, blocks

### Media
- Built-in Payload uploads collection. Each image has size variants (thumb, mobile, card, hero, wide in both WebP raster and AVIF), focal point (focalX, focalY 0–100%), dominantColor, blurDataUrl, alt.

### Globals
- `Navigation` — header links + Fotografie submenu + header CTA
- `SiteSettings` — name, defaults, owner, contact, OG defaults
- `Footer` — statement, contact, footer link columns, social, legal
- `GlobalCtas` — default CTA + global contact module copy

## Workflows

### Add a new portfolio project

1. In Payload admin: Collections → Portfolio-Projekte → Create.
2. Fill required fields (title, slug, category, coverImage, excerpt, seo).
3. Optional: pick presentation mode, add gallery, set CTA override, add ContentBlocks.
4. Save as draft, preview at `/preview/portfolio-projects/{slug}?secret=…`
5. Publish — triggers `ASTRO_REBUILD_WEBHOOK_URL` if configured.

### Add a new service page

1. In Payload admin: Collections → Service-Seiten → Create.
2. Fill required fields; pick `serviceType` from enum.
3. Add audience, proofPoints, faq as needed.
4. ContentBlocks for richer body content.
5. Save → publish → site rebuilds at `/{slug}`.

### Add a new local SEO city page (CMS-side; legacy still primary)

The Astro/CMS LocalSeoPages collection is wired but no route renders them yet. For now, the user authors SEO pages as legacy HTML files (see `05-seo-subpage-scaffold.md`). When you do migrate:

1. Create a `LocalSeoPages` entry per city.
2. `slug` = the legacy filename without `.html` (e.g., `motorrad-fotografie-koeln`).
3. `service` = topic label; `city` = city name; `intro` = the lede paragraph.
4. `canonicalServicePage` = the parent topic service page.
5. `localProof` + `localFaq` for city-specific content slots.
6. ContentBlocks for any extra rich content (most pages won't need them — they follow the scaffold).

### Add a new content block type

1. **CMS side** — `apps/cms/src/fields/contentBlocks.ts`. Add to the `blocks` array:

```ts
{
  slug: 'testimonialBlock',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  fields: [
    { name: 'quote', label: 'Zitat', type: 'textarea', required: true },
    { name: 'author', label: 'Autor', type: 'text', required: true },
    { name: 'role', label: 'Rolle / Unternehmen', type: 'text' },
    { name: 'image', label: 'Porträt', type: 'relationship', relationTo: 'media' },
  ],
}
```

2. **Astro side** — `apps/web/src/components/ContentBlocks.astro`. Add to the discriminated union and add a renderer branch. Match an existing block's typographic scale (use `clamp()` sizes from `01-tokens-and-typography.md`).

3. **Types** — run `payload generate:types` to refresh `apps/cms/src/payload-types.ts`. The Astro component's union type should match.

4. **Test in live preview** before publishing.

5. **Document** — add the new block to `04-content-blocks.md`.

### Change a global token

1. Edit `apps/web/src/styles/tokens.css`.
2. Grep for any legacy hardcoded uses across `*.html` and `assets/*.css`:
   ```
   Grep "{{old-hex}}" --glob *.html
   Grep "{{old-hex}}" --glob *.css
   ```
3. Update legacy hardcoded references (where appropriate — some pages intentionally use a varied tone).
4. Update `brand-spec.md`.
5. Run `pnpm web:dev` and visually verify across the responsive matrix.

## Static-vs-dynamic

```js
// astro.config.mjs
export default defineConfig({
  output: 'static',
  adapter: node({ mode: 'standalone' }),
})
```

The site is **fully static** (SSG). The Node adapter is used for:
- Serving the static output.
- The `/preview/[collection]/[slug]` route (SSR with `export const prerender = false`).
- The legacy HTML catch-all (`src/pages/[slug].ts`) which reads files from disk.

No client-side hydration islands currently — the contact form uses an inline `<script is:inline>` for `mailto:` submission. If you need interactivity, add a `client:idle` island on a specific component rather than introducing a framework. The IntersectionObserver-driven photo reveals are pure CSS via `.is-visible` toggle, driven by inline scripts.

## Image strategy

CMS-uploaded images get size variants automatically:
- thumb (360w), mobile (760w), card (1100w), hero (1920w), wide (2560w)
- Both WebP raster and AVIF for each

`ResponsiveImage.astro` wires `srcset` + `<source>` for AVIF first, then WebP, then a final JPEG `<img>`. Hero images get `loading="eager"` and `fetchpriority="high"`. Everything else `loading="lazy"`.

For legacy `/assets/*` images, they're synced to `apps/web/public/assets/` by `tools/sync-legacy-public.mjs` (auto-run on `predev` / `prebuild` / `prepreview`). Reference them in Astro components via absolute paths like `/assets/optimized/motorrad-ninja-road-1920.webp`.

## Known gaps (as of the latest analysis)

These are pieces of the Astro architecture where the contract is unfinished. Be aware:

1. **No Astro route for LocalSeoPages.** They render via the legacy bridge currently. If migrating: add `src/pages/seo/[slug].astro` (or similar) and exclude SEO slugs from the legacy catch-all.
2. **SitePages slugs (`about`, `contact`, `legal`) not Astro-routed.** They route via legacy too. Decide whether to migrate.
3. **Index pages route to legacy** (`/portfolio`, `/services`, `/journal` all 308 → `.html` legacy). No CMS-authored listing pages yet.
4. **`--steel` token is unused** in tokens.css. Defined for future use; not wired.
5. **`cropIntent` field on imageSequence blocks** is parsed but `ResponsiveImage.astro` doesn't apply any cropping logic based on it. Either implement (e.g., switch `object-position` per intent) or remove the field.
6. **`--font-display` and `--font-body` are identical.** The brand spec suggests a hierarchy might exist; currently both point to Neue Haas Grotesk Display. Don't pretend a hierarchy exists.

## Visual regression checking

The repo includes a basic visual regression script: `apps/web/scripts/visual-regression.mjs`. It compares `/` against `/componentized-home` at desktop and mobile, writing diff images to `apps/web/.visual-regression/`. 2% threshold currently. When you port a legacy page to Astro components, run this against the legacy URL before declaring the port complete.

```powershell
corepack pnpm --filter @matthias-ramahi/web exec playwright install chromium
corepack pnpm --filter @matthias-ramahi/web test:visual
```

## What the Astro side should NOT do

- **Don't reimplement the lens shader / WebGL hero in Astro right now.** It's heavy and the parity gap isn't worth the cost. Keep `index.html` as legacy until a deliberate port is approved.
- **Don't introduce React/Vue.** Astro is the framework. Components are `.astro`. If you must hydrate something, use a vanilla web component or a tiny inline script.
- **Don't add Tailwind.** The token system is custom CSS variables. Tailwind would duplicate the model.
- **Don't change tokens silently as part of a "refactor".** Tokens are the brand. Token changes need explicit user approval.

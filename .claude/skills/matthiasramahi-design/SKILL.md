---
name: matthiasramahi-design
description: Authoritative design and build guide for matthiasramahi.de — a photography site (automotive, oldtimer, sportwagen, motorrad, portrait, landscape) with a cinematic dark editorial aesthetic, an oxidized-red accent, and a large local-SEO subpage cluster. Use this skill whenever the user is working in the C:\Users\matth\Documents\MatthiasRamahiDe project on the landing page, the photography topic hubs, the Topic×City SEO subpages, hero compositions, content blocks, typography/color tokens, motion, or the Astro/Payload migration. Triggers also include phrases like "neue Stadt-Seite", "Hero für X", "neuer Content-Block", "Token anpassen", "Komponente bauen", "wie ist der Style hier", "neue SEO-Seite", or any request to extend, port, or rebuild parts of this specific photography website — even when the user does not explicitly mention design or brand.
metadata:
  type: design-system-guide
  project: matthiasramahi.de
---

# matthiasramahi.de — Design & Build Guide

You are working on **Matthias Ramahi Fotografie** — a Düsseldorf/NRW photography portfolio whose site is a hybrid of ~191 legacy HTML pages and a newer Astro (`apps/web`) + Payload CMS (`apps/cms`) implementation. Both must continue to look like the same site. This skill is the source of truth for how that "same site" looks, reads, and behaves.

Read this whole SKILL.md before touching anything substantial. Then follow the pointers to the references — load only the ones that match the task. Don't reinvent the system from scratch when the answer is already encoded here.

## Calibration: what the rendered site actually looks like

If you can read the legacy HTML and the live screenshots side by side, you'll see the actual visual language. Five anchor moments from the landing page, in case you can't see screenshots:

1. **Hero** — Full-bleed sportscar/automotive image, ~100svh, dark veil from below. Massive uppercase lockup **"MATTHIAS / RAMAHI"** bottom-left in `Neue Haas Grotesk`-style display, very tight tracking, off-white. Top nav is mono uppercase, muted, with `PROJEKT ANFRAGEN [ ]` as a ghost-outlined CTA top-right. In the still it looks static — in motion there's a slow Ken-Burns, film-grain noise, an aperture beam, and a slight lens-cursor effect on desktop. Don't downgrade the hero to a flat image because a screenshot doesn't show motion.

2. **Light statement** — `BILDER, DIE EINEN RAUM **VERÄNDERN.**` huge display H2, where **the second line ("VERÄNDERN.") is steel-grey/sage**, not red. Right column has two short paragraphs of muted body copy and two CTAs: `MEHR ÜBER MICH` (ink-filled black on cream) + `BEREICHE ANSEHEN` (ghost outline). This light-paper section ALWAYS follows the hero.

3. **Dark "Sechs Bereiche"** — `SECHS BEREICHE. **EINE LINSE.**` with the second sentence in steel-grey. Below: a three-up image grid showing Automobil / Sportwagen / Oldtimer. Each image block has a mono `N° 01` micro-eyebrow + bold-sans label (`AUTOMOBIL`) + a tag-line (`STUDIO · LOCATION · DETAIL`). Sharp corners, no shadows, no rounded edges, no hover-scale. **This is editorial, not a card grid.**

4. **Light "Ausgewählte Arbeiten"** — `AUSGEWÄHLTE **ARBEITEN.**` (second word again steel-grey). 4-up image grid in 2 rows, varied photographic content (cars, details), consistent square-ish aspect ratios, sharp edges, generous gaps, cream background. Right column has a small body-copy line about the "stream of current series."

5. **Dark "Hinter der Kamera"** — Asymmetric: a square portrait (Matthias) on the left, copy on the right with `ÜBER MICH` eyebrow and `HINTER DER **KAMERA.**` headline (second word steel-grey again). Two CTAs: `MEHR ÜBER MICH` (white solid) + `PROJEKT ANFRAGEN` (ghost outline).

**The pattern across all of these:** the visible color accent is the steel-grey/sage on H2 em-words. Red is essentially invisible at scan distance. CTAs are ink-filled or ghost, never accent-colored. Image blocks are clean editorial geometry, not cards.

**Build new sections to match THIS, not an idealized version of it.** If your output uses red CTAs, rounded image cards, or red headline accents, you've drifted from the spec.

## When to use which reference

| You are doing… | Load this reference |
| --- | --- |
| Picking colors, fonts, spacing, easing — anything tokens | `references/01-tokens-and-typography.md` |
| Building/extending the landing page or a topic hub | `references/02-page-architecture.md` + `references/03-hero-formulas.md` |
| Adding a new section type (FAQ, comparison strip, contact sheet…) | `references/04-content-blocks.md` |
| Scaffolding a new Topic×City SEO subpage | `references/05-seo-subpage-scaffold.md` |
| Working in `apps/web` or `apps/cms` | `references/06-astro-cms-bridge.md` |
| Writing copy, naming sections, deciding "should I add X?" | `references/07-copy-voice-and-anti-patterns.md` |

If the user request is broad ("rebuild this site", "redesign the portrait page"), read at least 01, 02, 03, and 07 before proposing anything.

## What this site *is* (in one paragraph)

A cinematic, editorial photography site. Dark canvases interrupted by paper-light sections create a magazine rhythm. Type is large, compressed, uppercase, with monospace metadata for editorial credit. Photography is treated as content, not decoration — heroes are image-led; portfolio sections feel like contact sheets, archives, and chapters, never like Pinterest-style masonry cards. Motion is slow and photographic: Ken-Burns drift, film-grain noise, lens spotlights, aperture beams, focus-pull reveals. The accent is a single oxidized red, used as punctuation. The voice is German, declarative, technical-but-warm, and never adds fluff.

## Core posture rules (always)

1. **Two worlds, one look.** Legacy HTML in the project root is the *visual* source of truth right now; `apps/web` is the future. When in doubt: a new feature lives in both worlds, but if you can only do one, make it look right in the legacy HTML first (the user still ships from those files). The Astro side stays a parity port until the user explicitly cuts over.
2. **Dark cinematic → light editorial → dark cinematic.** Pages breathe by alternating section themes (`data-theme="dark"` / `"light"`, or `data-header-theme="dark"` / `"light"`). Never put 3+ consecutive sections in the same theme — it kills the rhythm. The site-chrome JS uses these markers to retint the sticky header per section; don't strip them.
3. **Two-tier accent.** The site uses *two* accents with different roles — don't confuse them:
   - **Steel-grey / sage** (`oklch(~78% 0.02 130)`, hex around `#c8ccc6` / `#7a8a86` / `#dce2df`) is the **canonical headline em-accent**. When you see "BILDER, DIE EINEN RAUM **VERÄNDERN.**" or "SECHS BEREICHE. **EINE LINSE.**", the second line is steel/sage. This is the dominant visible accent across the rendered site.
   - **Oxidized red** (`oklch(57% 0.185 31)` / `#cf392e`) is a **minor-punctuation accent** — small leading bars on kickers, link underline-on-hover, active-state markers, focus rings. **Never** a filled CTA background, **never** a hero background, **never** a headline em-color.
   - **CTAs use ink-fill or ghost-outline, never red-fill.** Primary CTA on a paper section: dark ink fill, paper text. Primary CTA on a dark section: white/off-white fill, dark text. Secondary CTA: ghost (1px outline matching `--fg` or `--paper-ink`). The token `--accent` is defined as oxidized red, but the **applied** primary CTA pattern is ink-on-paper / fg-on-dark — not accent.

   Legacy CSS files have varying token names: `assets/fotografie-overview.css` uses `--accent:#c8ccc6` (steel as primary accent variable), while `apps/web/src/styles/tokens.css` and `assets/local-seo.css` use red as `--accent`. This inconsistency is real — when reading legacy CSS, check which file's `--accent` you're in.
4. **Heroes are image-led and immersive.** Not feature blocks with stock illustration. Full-bleed photo with a heavy dark veil/vignette, compressed uppercase H1, one direct CTA, optional kicker. See `03-hero-formulas.md` for the five canonical hero patterns and when to use which.
5. **Image grids are fine; card chrome is forbidden.** The distinction matters:
   - **Allowed** — sharp-cornered image blocks in a 3-up or 4-up grid with mono-micro eyebrow ("N° 01") + bold-sans label underneath ("AUTOMOBIL") + tag-line ("STUDIO · LOCATION · DETAIL"). The "Sechs Bereiche" section on the landing page is exactly this. Contact-sheet strips (4-col uniform 6px-gap grid). Archive walls (column-count masonry with near-zero gap). Editorial 4-up galleries on light paper. Stage/chapter alternating image+copy spreads. Index strips.
   - **Forbidden** — the "card chrome" that makes a card *feel* like a card: `border-radius` > 4px, drop shadows, scale-on-hover bounces, gradient backgrounds, "Read more →" pill buttons, colored hover states, "as seen in" testimonial wraps.
   - The geometry is not what's wrong — it's the chrome. A 3-image grid with sharp edges, no shadows, and a mono eyebrow is **editorial**, not a "card."
6. **Motion is photographic.** Ken-Burns drift on hero images (28–32s), film-grain overlay (SVG noise, ~4.8% opacity, `mix-blend-mode: screen`), aperture beam pulses, IntersectionObserver-driven `translateY(18px)→0` reveals on photo grids, slow `cubic-bezier(.23,1,.32,1)` everywhere, and `prefers-reduced-motion: reduce` honored everywhere. No bouncy springs, no scroll-jacking parallax, no decorative gradient washes.
7. **Header + footer are shared chrome.** Every page uses the same fixed top bar (uppercase brand mark + mono nav + accent CTA) and the same multi-column footer with link taxonomy and contact card. They auto-tint to match the visible section's theme. Don't override per-page unless you have a real reason.
8. **SEO subpages are templated, not hand-crafted.** The ~22 cities × 6 topics = 130+ city pages all share one anatomy: hero (with `{{topic}} {{city}}` H1), statement, modules, gallery, audience, related topics, cities grid, search-keywords grid, contact CTA, footer. They differ only in copy, hero imagery is reused per topic. See `05-seo-subpage-scaffold.md` before creating one.
9. **Don't simplify the metaphors away.** When porting to Astro, the temptation is to flatten "iris reveal hero" or "lens shader" into a static image with a gradient. Preserve the moment, or skip the section — don't water it down. If the technique is too heavy for the new context, ask the user instead of degrading silently.
10. **Copy stays German, declarative, and photographic.** Vocabulary is "Linse", "Komposition", "Lack", "Patina", "kuratiert", "sauber", "ruhig", "präzise". Never marketing-speak ("unleash your", "elevate your"). See `07-copy-voice-and-anti-patterns.md` for tone calibration.

## The minimum tokens you must respect

This is the *core* set — read `01-tokens-and-typography.md` for the full system. Don't introduce a new color, font, or easing without grounding it here.

```css
/* Canonical token set */
:root {
  --bg:      oklch(14% 0.012 255);   /* ~#020306 — dark canvas */
  --surface: oklch(18% 0.014 255);   /* ~#07090d — slightly lifted */
  --fg:      oklch(96% 0.012 110);   /* ~#f3f5ef — off-white */
  --muted:   oklch(80% 0.012 110 / 0.66);
  --border:  oklch(92% 0.010 110 / 0.14);

  /* PRIMARY accent (the visible one — used on H2 em-text site-wide) */
  --accent-2: #7a8a86;               /* steel-grey/sage — H2 em-color, secondary marks */
  --chrome:   #c8ccc6;               /* warm chrome — alt variant of the same family */

  /* MINOR-PUNCTUATION accent (used sparingly for kicker bars, link hovers, focus rings) */
  --accent:   oklch(57% 0.185 31);   /* ~#cf392e — oxidized red, never filled CTA */

  --paper:   oklch(96% 0.012 100);   /* light editorial section bg */
  --paper-ink: oklch(16% 0.012 255); /* near-black ink on paper */
  --steel:   oklch(64% 0.05 230);    /* atmospheric blue, used sparingly in glows */

  --font-display: 'Neue Haas Grotesk Display','Söhne','Avenir Next','Helvetica Neue',Arial,system-ui,sans-serif;
  --font-body:    'Neue Haas Grotesk Display','Söhne','Avenir Next','Helvetica Neue',Arial,system-ui,sans-serif;
  --font-mono:    'JetBrains Mono','IBM Plex Mono','SFMono-Regular',ui-monospace,Menlo,monospace;

  --ease: cubic-bezier(0.23, 1, 0.32, 1);
}
```

Type scale (always `clamp()`, never fixed):

```css
/* Hero / display */                font-size: clamp(56px, 10.6vw, 168px);
/* Section H2 */                    font-size: clamp(44px, 6.4vw, 108px);
/* Small display / card title */    font-size: clamp(28px, 3.4vw, 52px);
/* Lead paragraph */                font-size: clamp(16px, 1.3vw, 21px);
/* Body */                          font-size: clamp(14px, 1.05vw, 16.5px);
/* Mono kicker / label */           font: 700 10px/1 var(--font-mono); letter-spacing: .26em;
```

Container: `width: min(100% - clamp(32px, 8vw, 128px), 1640px); margin-inline: auto;`

## Decision trees you'll need often

### "User wants a new section. Should it be dark or light?"

Look at the surrounding sections. If the previous is dark → make it light. If previous is light → dark. Two darks in a row only if the second is a hero/full-bleed and the first ended with strong content density. The site-chrome JS reads `data-theme` (or `data-header-theme`) to retint the header — set it.

### "User wants a new hero. Which formula?"

- **Brand-defining or landing-style:** use the *lens-shader hero* (Canvas + image cycle + lens cursor effect) — only worth it for `index.html` or a top-level launcher.
- **Topic hub / overview page:** *Ken-Burns static hero* — single hero image with continuous slow zoom+pan, dark veil, big uppercase H1, kicker + lead + CTA. This is the workhorse.
- **Portrait subpages:** *iris-reveal* — circular `clip-path` expanding from face area. Already implemented per portrait-page CSS, don't redo from scratch.
- **Motorrad subpages:** *filmstrip wipe* with red glowing edge — established pattern.
- **All other SEO city subpages:** Ken-Burns static hero with a 3-slide rotation. Use the topic's existing image set; don't introduce city-specific photography.

Full skeletons in `references/03-hero-formulas.md`.

### "User wants a new SEO subpage for City X, Topic Y."

Open `references/05-seo-subpage-scaffold.md`. The page is mechanical: copy the closest existing sibling (e.g., for `motorrad-fotografie-essen.html`, copy `motorrad-fotografie-koeln.html`), then change only the city-level variables — city name in H1 line 2, city-specific lede paragraph, contact-form pre-fill, JSON-LD `areaServed`, and canonical URL. Hero images, service cards, audience cards, gallery, and copy structure all stay identical. Then add the new page to the cities grid on every sibling page and update `sitemap-local-seo.xml`. Verify against the topic-master page (`motorrad-fotografie-duesseldorf.html`) for parity.

### "User wants to add a new content block in the Astro CMS."

Read `references/06-astro-cms-bridge.md` section on ContentBlocks. The pattern:
1. Add the block definition in `apps/cms/src/fields/contentBlocks.ts` (slug + fields).
2. Add the renderer branch in `apps/web/src/components/ContentBlocks.astro` (visual styling — match an existing block's typographic scale and color treatment; don't invent).
3. Run `payload generate:types` to update `apps/cms/src/payload-types.ts`.
4. Test with Live Preview before publishing.

### "User wants to change a token (e.g., the accent)."

This is a tokens-only change *if* the legacy CSS uses `var(--accent)` consistently — which it does in `site-chrome.css` and `local-seo.css`. But check `photo-main-service.css` and any inline `<style>` in HTML files: those frequently hardcode `#c63b31` or `#cf392e` rather than the variable. A token-only edit will miss those hardcoded references. Use `grep -E "#c[789ab][0-9a-f]{4}"` against `*.html` and the legacy CSS before declaring the change complete.

## Where new files live

- **New legacy SEO subpage:** project root, filename `{{topic-slug}}-{{city-slug}}.html`. Use the existing files in root as the canonical examples.
- **New Astro component:** `apps/web/src/components/`. Match `.astro` conventions (no React, no client JS unless you really need a hydration island).
- **New CMS collection field:** `apps/cms/src/collections/<Collection>.ts` or `apps/cms/src/fields/<field>.ts` for reusable groups.
- **New asset (image, video):** `assets/photos/` for hero source images, `assets/portfolio/` for portfolio sets, `assets/optimized/` for the WebP-resampled outputs. Filenames are kebab-case, semantically named (`motorrad-ninja-road.jpg`, not `IMG_2034.jpg`).
- **New token:** `apps/web/src/styles/tokens.css` (canonical) *and* a comment in `assets/site-chrome.css` near the existing tokens. Update `brand-spec.md` if the change is intentional.

## Two failure modes to avoid

**Failure mode 1: Watering down on port to Astro.** Don't replace the lens shader, iris reveal, or aperture beam with a CSS gradient and call it a port. If it's too heavy for the Astro context, leave the legacy HTML serving that route until a real implementation lands. The site-chrome JS handles the chrome — anything fancier is per-page.

**Failure mode 2: Treating SEO subpages as creative writing.** They are templated. The reason `motorrad-fotografie-koeln.html` and `motorrad-fotografie-essen.html` work as an SEO cluster is precisely that they share 95% of their copy and only diverge in city-specific paragraphs. If you "improve" the prose for one and not the others, you've broken the cluster's coherence and made future bulk updates hard. Be mechanical here.

## Verification before declaring done

After any visual change:

1. **Read the diff in light AND dark sections** — many CSS tokens render very differently across the two and a "fix" that looks great on dark may explode on paper.
2. **Check the cluster** if you touched an SEO subpage — does the new page match its siblings in section count and section order? Did you add it to the cities grid on the *other* siblings?
3. **Check the chrome** — the sticky header retints based on `data-theme` of the visible section. If you forgot the attribute, the header text color will fight the background.
4. **Test responsive breakpoints** — at least 390px (mobile), 820px (tablet), 1440px (desktop). The site uses `clamp()` extensively; layout should be fluid, not breakpoint-jumpy.
5. **Honor `prefers-reduced-motion`** — every animation must collapse to its end state when this is set. Check by enabling it in DevTools.

That's the system. Now read the right reference and build.

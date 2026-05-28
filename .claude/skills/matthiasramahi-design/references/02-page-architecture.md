# 02 — Page Architecture

How pages are composed: section orders, the dark/light rhythm, headers/footers, and the distinctive moments that make this site recognizably itself.

## The light/dark rhythm — the most important pattern on the site

Every long-form page alternates dark cinematic sections with light paper sections. This is not decorative — it's the page's *breath* and the site's editorial signature.

Rules:

- **Hero is always dark.** Image-led, with a heavy gradient veil.
- **Statement / manifesto** that follows the hero is **light** (paper) — readable, editorial.
- **Topic chapters / module grids** alternate dark → light → dark → light. If you have 6 topics, you get 3 darks and 3 lights.
- **Contact CTA** before the footer is **light** (paper) — it's the most important conversion point and needs the maximum readability + contrast jolt against the footer.
- **Footer is dark.**

Set the section's data attribute so the site-chrome JS can retint the sticky header:

```html
<section data-theme="dark" data-header-theme="dark">…</section>
<section data-theme="light" data-header-theme="light">…</section>
```

`data-header-theme` is the legacy-CSS name; `data-theme` is the Astro/newer name. In legacy pages, use `data-header-theme`. In Astro components, prefer `data-theme`. The chrome JS reads both via `elementFromPoint()` probing.

## Landing page (`index.html`) — section order

This is the launcher / overview page. Section sequence:

1. **Topbar** — fixed, theme-aware, identical to all pages.
2. **Hero** — dark. The lens-shader / WebGL hero (Canvas + image cycle + lens cursor). On lower-powered devices and `prefers-reduced-motion`, falls back to a Ken-Burns static hero. Word-by-word title reveal animation. See `03-hero-formulas.md`.
3. **Statement** — light (paper). Two-column manifesto: H2 on left, supporting copy + actions on right. Establishes the artistic position.
4. **Chapters** — dark. The 6 photography bereiche (Automobil, Sportwagen, Oldtimer, Motorrad, Portrait, Landschaft) as a 6-cell grid (3×2 on desktop, 1×6 on mobile). Each cell: image + kicker + topic name + short descriptor + arrow link.
5. **Portfolio teaser** — light. Dual marquee scrolling — two rows of portfolio thumbnails moving in opposite directions. Click any image → portfolio.html.
6. **About** — dark. Two-column: portrait image + short bio + arrow link to ueber-mich.html.
7. **Services index** — light. Numbered table (01, 02, 03…) of the 7 weitere Dienstleistungen. Hover indents the row + extends the arrow. No cards.
8. **Journal / blog teaser** — dark. 3-column grid of latest posts: image + mono date + title + excerpt + read-more.
9. **Contact CTA** — light (paper). The unified contact module: kicker + headline + lead + form fields + primary CTA + secondary mailto link.
10. **Footer** — dark.

Rhythm: D-L-D-L-D-L-D-L-D. Nine sections, perfectly alternating.

## Topic hub pages (`fotografie-duesseldorf.html`, etc.) — section order

These are the broad-topic landing pages (the level *above* SEO city subpages). Section sequence:

1. **Topbar.**
2. **Overview hero (OVH)** — dark. Static Ken-Burns hero, no shader. Big H1 ("Sechs Bereiche. Eine Linse."), lead, two CTAs.
3. **Six topic sections** — alternating dark/light. Each section: full-width spread with kicker (01–06) + H2 with italic-serif `<em>` + body paragraph + framed image + optional link. Alternates left-image / right-image via `nth-of-type(even)` order swap.
4. **Cluster** — light. SEO-readable paragraph explaining the cluster, plus a 6-link grid to the topic subpages.
5. **Contact CTA** — light.
6. **Footer** — dark.

Rhythm: D-L-D-L-D-L-D-L. Eight sections.

## Topic main pages (e.g., `motorrad-shooting-duesseldorf.html`)

These are the *primary* topic landing pages — one per topic, not per city. They're richer than SEO subpages but simpler than the topic-hub. Section sequence:

1. **Topbar.**
2. **Topic hero** — dark. Ken-Burns with topic-specific overlay technique (motorrad uses filmstrip wipe with red glowing edge; portrait uses iris reveal; automotive uses straight Ken-Burns).
3. **Statement** — light. Topic-specific manifesto ("Geschwindigkeit und Leidenschaft auf Bildern.").
4. **Index strip** — dark (sticky). Horizontal scrolling tab navigation: 01 Automobil · 02 Sportwagen · 03 Oldtimer · 04 Motorrad · 05 Portrait · 06 Landschaft. Active tab underlined.
5. **Series of topic spreads** — alternating dark/light. Each spread: kicker + H2 + lead + contact-sheet strip (4-column grid of small uniform images).
6. **Archive wall** — light (paper). Column-count masonry of all topic photos — feels like an archive shelf. Photos fade-and-rise in on scroll.
7. **Audience** — light. "Für wen ich arbeite" — 4-card grid of client types.
8. **Related topics** — dark. 3–4 cards linking to sibling topics (e.g., from motorrad: Automobil, Sportwagen, Videografie, Portfolio).
9. **Contact CTA** — light.
10. **Footer** — dark.

## SEO city subpages (e.g., `motorrad-fotografie-koeln.html`)

These are *templated*. See `05-seo-subpage-scaffold.md` for the exact anatomy and the variable slots. Section sequence is identical to topic main pages but with two extra navigation grids near the bottom:

1. Topbar
2. Topic hero (with city in H1 line 2)
3. Statement
4. Modules / mechanics grid (3–5 cards)
5. Portfolio gallery (6–8 tiles)
6. Audience grid
7. Related topics
8. **Cities grid** ← only on SEO subpages: all 22 cities + NRW + Deutschland
9. **Search keywords grid** ← only on SEO subpages: 5–6 long-tail keyword variants
10. Contact CTA (with city pre-filled in subject)
11. Footer

## Header (topbar) — what every page has

Shared via `assets/site-chrome.css` / `assets/site-chrome.js` (legacy) and `apps/web/src/components/SiteHeader.astro` (new).

- **Position:** fixed at top, full width, blurred backdrop (`backdrop-filter: blur(18px)`), faint bottom border.
- **Height:** `min-height: 72px`.
- **Grid:** `auto 1fr auto` — brand left, nav center, CTA right.
- **Brand mark:** two-line vertical lockup, `Matthias / Ramahi`, mono 11px, uppercase, very tight tracking. Links to `index.html`.
- **Nav:** mono 10px, uppercase, muted color, hover → off-white. Hover reveals a 1px vertical underline bar from the bottom (30px tall, with a soft glow shadow).
- **CTA right:** "Projekt anfragen" — accent button (filled with `var(--accent)` on legacy, ghost outline on Astro), mono 10px uppercase.
- **Mobile:** brand left + hamburger right. Menu is a full-screen dark overlay; mobile menu groups Fotografie subtopics together; contact/email is the last, most prominent item.
- **Theme tinting:** the chrome JS probes `data-theme` of the visible section every scroll and shifts the header text color between `var(--fg)` (on dark sections) and `var(--paper-ink)` (on light). Transition: `.35s var(--ease)`.

**Active states:** Each page marks its bereich active. Fotografie subpages mark `Fotografie` parent + their specific topic. This is wired via class-based active marker, not URL-based — when you add a new nav entry, update the markers in `site-chrome.js`.

## Footer — what every page has

- **Position:** below all content, full width, dark (always — even after a light contact CTA).
- **Padding:** `clamp(54px, 8vw, 110px) 0`.
- **Grid:** 4 columns on desktop (`1.35fr` for the brand/claim, then 4 narrow link columns). Collapses to 1 column on mobile.
- **Brand:** large brand mark + short statement: "Fotografie aus Düsseldorf — kuratiert für Marke, Sammlung und Druck. Editorial geführt, technisch ruhig, bereit für die nächste Ausgabe."
- **Link columns:** Fotografie (6 topics), Location (about, journal, contact, leistungen, portfolio), Services (7 services), Direct (email, phone, location).
- **Each column header:** mono uppercase 10px with bottom border, `letter-spacing: .26em`.
- **Each link:** has a left-accent bar (`::before`) that grows from `width:0` to `width:24px` on hover (using `var(--accent)`).
- **Contact card** (last column): labeled lines for email, phone, location location.
- **Legal:** Impressum + Datenschutz as small mono links at the very bottom.

## Distinctive moments — the things that make this site itself

These are the recognizable signatures. If you remove or weaken them, the site stops feeling like itself.

### 1. Film-grain overlay (site-wide)

```css
body::before {
  content: "";
  position: fixed;
  inset: -80px;
  background: url("data:image/svg+xml,…feTurbulence…");
  mix-blend-mode: screen;
  opacity: .048;
  animation: grain 2.2s steps(2) infinite;
  pointer-events: none;
}
@keyframes grain {
  0% { transform: translate(0,0); }
  50% { transform: translate(-8px, 4px); }
  100% { transform: translate(0,0); }
}
```

The grain runs at very low opacity (~4.8%) with `screen` blend, jittering every 2.2s. It's almost subliminal — but it's what gives every section that analog photographic feel. Don't remove it. Honor `prefers-reduced-motion` by pausing the animation.

### 2. Aperture beam (hero sections)

A horizontal scanning line, 96px tall, rotated -4°, sliding left-to-right across the hero. Chrome/steel gradient with blur. 11s loop with opacity pulse (0 → .42 → .24 → 0). Mimics a film shutter or optical glass.

```css
.hero-aperture {
  position: absolute;
  left: -10%;
  top: 40%;
  width: 120%;
  height: 96px;
  background: linear-gradient(90deg, transparent, rgba(220,226,223,.4), transparent);
  filter: blur(28px);
  transform: rotate(-4deg);
  animation: heroAperture 11s var(--ease) infinite;
  pointer-events: none;
}
@keyframes heroAperture {
  0%, 100% { transform: rotate(-4deg) translateX(-30%); opacity: 0; }
  30%      { opacity: .42; }
  60%      { opacity: .24; }
  80%      { transform: rotate(-4deg) translateX(30%); opacity: 0; }
}
```

### 3. Ken-Burns drift on hero images

Continuous slow zoom + pan, no reset:

```css
.hero__photo img {
  transform: scale(1.06);
  animation: kenBurns 28s ease-out forwards;
  filter: saturate(.92) contrast(1.02);
}
@keyframes kenBurns {
  to { transform: scale(1.18) translate(-1%, -1%); }
}
```

For looping versions, use `infinite alternate` over 32s.

### 4. Word-by-word title reveal

The landing hero title has each word wrapped in `<span class="word">`. On load, each word translates from `translate3d(-110%,0,0)` opacity 0 → `translate3d(0,0,0)` opacity 1, staggered .1s per line. On scroll-out, words slide right and fade.

```html
<h1 class="hero-title">
  <span class="line"><span class="word">Matthias</span></span>
  <span class="line"><span class="word">Ramahi</span></span>
</h1>
```

```css
.hero-title .word {
  display: inline-block;
  transform: translate3d(-110%, 0, 0);
  opacity: 0;
  animation: wordIn .9s var(--ease) forwards;
}
.hero-title .line:nth-child(2) .word { animation-delay: .14s; }
@keyframes wordIn { to { transform: translate3d(0,0,0); opacity: 1; } }
```

### 5. Scroll-in photo grid reveals

Photos in contact-sheet and portfolio strips fade up on entry:

```css
.pf-photo {
  transform: translateY(18px);
  opacity: 0;
  transition: transform .9s var(--ease), opacity .9s var(--ease);
}
.pf-photo.is-visible { transform: none; opacity: 1; }
```

Use IntersectionObserver to add `.is-visible`. Stagger via nth-child delays:
```css
.pf-photo:nth-child(2) { transition-delay: .06s; }
.pf-photo:nth-child(3) { transition-delay: .12s; }
/* … etc */
```

### 6. Lens-cursor effect (landing hero only)

WebGL shader. Mouse position controls a spotlight that pulls the surrounding image toward grayscale + slight blur. Far from cursor → desaturated; near cursor → full color. Chromatic aberration scales with mouse velocity. Click triggers a shutter flash. See `assets/fotografie-overview.js` for the actual GLSL.

If you can't port the shader (Astro context), fall back to a Ken-Burns hero rather than a static one. **Don't fake it with a CSS gradient.**

### 7. Header theme tinting

Already described above, but worth restating because it's easy to forget: every section needs `data-theme="dark|light"` (or `data-header-theme`). The chrome JS uses `document.elementFromPoint()` to find what's currently behind the header and transitions the header text color accordingly. If you forget the attribute, the header text will fight the section background.

## What the architecture explicitly avoids

This list is about **card chrome**, not about image-block geometry. A 3-up image grid with sharp edges, mono micro-eyebrow, and bold-sans label is **fine and used** (the "Sechs Bereiche" section). What's forbidden is the *chrome that makes blocks feel like UI cards*.

- No Pinterest-style masonry with rounded corners + shadows + scale-on-hover.
- No card-shadow feature blocks. (Border-radius > 4px, box-shadow, hover-lift — all forbidden.)
- No rounded-corner pill buttons with gradients.
- No testimonial sliders.
- No multi-step progress indicators.
- No social-proof "as seen in" logo strips.
- No newsletter signup boxes.
- No "Read more →" inside body copy.
- No popups, exit intent, modal interruptions.
- No scroll-jacking, no parallax that fights the user.
- No emoji or playful sticker illustrations.
- No light-mode toggle (the site has both light and dark sections by design — there's no user preference layer).

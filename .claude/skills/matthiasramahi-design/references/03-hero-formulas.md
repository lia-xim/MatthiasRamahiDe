# 03 — Hero Formulas

Five hero patterns are in use on this site. Each has a specific purpose; mixing them sloppily kills the rhythm. When the user asks for a new hero, pick from this list — don't invent a sixth.

## A. Landing hero — "Lens shader" (use only on `index.html`)

A WebGL canvas hero with an image cycle, lens spotlight following the cursor, chromatic aberration on velocity, and a shutter flash on click. This is the marquee experience and should not appear anywhere else — it's why landing.

### When to use
- `index.html` only.
- Top-level launcher experiences.

### When NOT to use
- Any topic hub or city subpage. Too heavy, and it dilutes the landing.

### Skeleton

```html
<section class="hero" data-theme="dark" data-header-theme="dark">
  <canvas class="hero-canvas" data-imgs="img1.webp,img2.webp,img3.webp,img4.webp,img5.webp,img6.webp" aria-hidden="true"></canvas>
  <div class="hero-glow"></div>          <!-- moving radial glow -->
  <div class="hero-aperture"></div>      <!-- scanning shutter line -->
  <div class="hero-cursor" aria-hidden="true"></div>
  <div class="hero-vignette"></div>
  <h1 class="hero-title">
    <span class="line"><span class="word">Matthias</span></span>
    <span class="line"><span class="word">Ramahi</span></span>
  </h1>
  <p class="hero-lede">
    Fotografie, die Räume öffnet — Automobile, Oldtimer, Sportwagen, Motorräder, Portraits und Landschaften, kuratiert aus Düsseldorf für Marke, Sammlung und Druck.
  </p>
  <div class="hero-actions">
    <a href="portfolio.html" class="btn">Portfolio ansehen</a>
    <a href="#anfrage" class="btn btn-accent">Anfrage senden</a>
  </div>
  <div class="hero-aperture-readout" aria-hidden="true">
    <span>F/2.8</span><span>ISO 200</span><span>1/250s</span>
  </div>
</section>
```

### Key behavior
- Canvas takes 100svh, behind everything.
- Title uses word-by-word reveal (see `02-page-architecture.md` § 4).
- On scroll out, title exits right with `.7s cubic-bezier(.62,.02,.86,.18)` ease.
- Mouse over: cursor crosshair (`.hero-cursor`) follows mouse with crosshair ring.
- Click anywhere: triggers `uShutter` 0→1→0 pulse + advances to next image.
- `prefers-reduced-motion`: canvas paints final state only, no animation.
- Mobile (`@media (hover: none)`): cursor hidden, no shader interactivity; falls back to image cycle on touch.

### Implementation reference
- Shader + canvas: `assets/fotografie-overview.js`
- CSS: `assets/site-chrome.css` (.hero-* selectors) + inline in `index.html`

---

## B. Topic-hub hero — "Ken-Burns static" (the workhorse)

A single hero image with continuous slow zoom+pan, heavy dark veil, large compressed uppercase H1, kicker + lead + one or two CTAs. This is the **default hero pattern** for any new top-level page that isn't `index.html`.

### When to use
- Topic hub pages (`fotografie-duesseldorf.html`, `leistungen.html`, `portfolio.html`, `ueber-mich.html`).
- Service main pages (`grossformatdruck-duesseldorf.html`, etc.).
- As the fallback when a richer hero (lens, iris, wipe) can't be ported.

### Skeleton

```html
<section class="ovh" data-theme="dark" data-header-theme="dark" aria-label="…">
  <div class="ovh__photo" role="img" aria-label="…">
    <img src="assets/optimized/…-hero-1920.webp" alt="" fetchpriority="high">
  </div>
  <div class="ovh__veil"></div>
  <div class="ovh__inner container">
    <span class="kicker">{{kicker_text}}</span>
    <h1 class="ovh__title">{{topic_h1}}<br><em>{{accent_line}}</em></h1>
    <p class="ovh__lede">{{lede_paragraph}}</p>
    <div class="ovh__actions">
      <a href="#anfrage" class="btn btn-accent">{{cta_primary}} →</a>
      <a href="{{secondary_href}}" class="btn btn-ghost">{{cta_secondary}}</a>
    </div>
    <div class="ovh__aperture" aria-hidden="true"></div>
  </div>
</section>
```

### CSS skeleton

```css
.ovh { position: relative; min-height: 100svh; overflow: hidden; display: grid; align-items: end; }
.ovh__photo { position: absolute; inset: 0; }
.ovh__photo img {
  width: 100%; height: 100%; object-fit: cover;
  transform: scale(1.06); animation: ovhKB 28s ease-out forwards;
  filter: saturate(.92) contrast(1.02);
}
.ovh__veil {
  position: absolute; inset: 0;
  background:
    radial-gradient(120% 80% at 30% 30%, rgba(2,3,6,.15), rgba(2,3,6,.86) 70%),
    linear-gradient(180deg, rgba(2,3,6,.4) 0%, rgba(2,3,6,.1) 35%, rgba(2,3,6,.78) 100%);
}
.ovh__inner { position: relative; padding: 0 0 clamp(54px,8vw,120px); }
.ovh__title {
  font-size: clamp(56px, 9.2vw, 148px);
  font-weight: 500;
  line-height: .9;
  letter-spacing: -.038em;
  text-transform: uppercase;
  margin: 16px 0 24px;
}
.ovh__title em {
  font-family: 'Iowan Old Style','Charter',Georgia,serif;
  font-style: italic; font-weight: 400;
  letter-spacing: -.045em; text-transform: none;
  color: var(--accent-2);
}
.ovh__lede { max-width: 64ch; font-size: clamp(16px, 1.3vw, 21px); color: var(--muted); margin: 0 0 28px; }
.ovh__actions { display: flex; gap: 14px; flex-wrap: wrap; }
.btn-accent { background: var(--accent); color: #0a0c11; }
.btn-ghost  { border: 1px solid var(--fg); color: var(--fg); }
@keyframes ovhKB {
  to { transform: scale(1.18) translate(-1%, -1%); }
}
```

### Notes
- The `<em>` inside the H1 introduces the italic-serif moment (see `01-tokens-and-typography.md` § Editorial italic serif accent).
- One primary CTA (filled accent) + one ghost secondary. Never three.
- Kicker line is mono and includes a small leading bar via `::before { content:""; width:24px; height:1px; background: currentColor; }`.

---

## C. Portrait hero — "Iris reveal"

A circular `clip-path` mask expanding from the subject's eye-area, with a pulsing catchlight dot before it expands. Established on portraitfotografie pages.

### When to use
- Portrait main pages (`portraitfotografie-duesseldorf.html`, `portraitfotografie-experience.html`, all `portraitfotografie-*` city pages).
- Do **not** use elsewhere — it's the portrait-section signature.

### Skeleton (simplified)

```html
<section class="hero-pt" data-theme="dark" data-header-theme="dark">
  <div class="hero-pt__stage">
    <div class="hero-pt__catchlight"></div>
    <div class="hero-pt__photo" style="background-image: url('…portrait.webp');"></div>
  </div>
  <h1 class="hero-pt__title">…</h1>
  <p class="hero-pt__lede">…</p>
</section>
```

### Animation

```css
.hero-pt__photo {
  clip-path: circle(0% at 50% 38%);
  animation: iris 3.4s var(--ease) .6s forwards;
}
.hero-pt__catchlight {
  position: absolute; left: 50%; top: 38%;
  width: 16px; height: 16px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,.9), transparent 60%);
  animation: catchlight 1.2s var(--ease) infinite;
  animation-iteration-count: 2;
}
@keyframes iris      { to { clip-path: circle(150vmax at 50% 38%); } }
@keyframes catchlight { 50% { transform: translate(-50%,-50%) scale(1.4); opacity:.4; } }
```

After the iris finishes, a subtle Ken-Burns kicks in on the now-visible image. Honor reduced-motion by starting at the final state.

---

## D. Motorrad hero — "Filmstrip wipe with red glowing edge"

A horizontal clip-path wipe from right to left, revealing each slide. The wipe edge glows oxidized red. Multiple slides cycle.

### When to use
- Motorrad pages (`motorrad-shooting-duesseldorf.html`, all `motorrad-fotografie-*` city pages).
- Do **not** use elsewhere.

### Skeleton

```html
<section class="hero-mr" data-theme="dark">
  <div class="hero-mr__stage">
    <div class="hero-mr__slide is-active" style="background-image: url('…motorrad-1.webp');"></div>
    <div class="hero-mr__slide" style="background-image: url('…motorrad-2.webp');"></div>
    <div class="hero-mr__slide" style="background-image: url('…motorrad-3.webp');"></div>
    <div class="hero-mr__edge"></div>
  </div>
  …
</section>
```

### CSS

```css
.hero-mr__slide {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  clip-path: inset(0 0 0 100%);
  transition: clip-path 1.8s var(--ease);
  transform: scale(1.10);
  animation: kenBurns 18s ease-out forwards;
}
.hero-mr__slide.is-active { clip-path: inset(0 0 0 0%); }
.hero-mr__edge {
  position: absolute; top: 0; bottom: 0; width: 2px;
  background: #c63b31;
  box-shadow: 0 0 28px #c63b31, 0 0 64px rgba(198,59,49,.45);
  /* JS animates left from 100% → 0% in sync with the wipe */
}
@keyframes kenBurns { to { transform: scale(1.0) translate(-1%,-1%); } }
```

---

## E. Portfolio archive hero — "Sequence stage"

A multi-image stage where one large image dominates and 2–3 thumbnails preview off-edge, suggesting depth. Used on portfolio-style surfaces (`floating-archive.html`, `narrative-stage.html`, `experimental-lens.html`, `matthias-ramahi-portfolio.html`).

### When to use
- Conceptual / portfolio pages.
- The `portfolio.html` overview hero.

### Skeleton

```html
<section class="hero-stage" data-theme="dark">
  <div class="hero-stage__main">
    <img src="…feature.webp" alt="">
  </div>
  <div class="hero-stage__sidedeck">
    <img src="…secondary-1.webp" alt="">
    <img src="…secondary-2.webp" alt="">
    <img src="…secondary-3.webp" alt="">
  </div>
  <div class="hero-stage__copy">
    <span class="kicker">Portfolio · {{count}} Serien</span>
    <h1>Bilder, die einen Raum verändern.</h1>
    <p>Ausgewählte Arbeiten aus Automobil, Sportwagen, Oldtimer, Motorrad, Portrait und Landschaft.</p>
    <a href="#serien" class="btn btn-accent">Serien öffnen →</a>
  </div>
</section>
```

The sidedeck images are smaller and overlap or slightly offset from the main; the main has the dominant aspect. This hero deliberately doesn't fill 100svh — it leaves a small gap below to suggest "more underneath", reinforcing the archive metaphor.

---

## Hero pattern selection — decision tree

```
Is this index.html?
├── YES → A. Lens shader hero
└── NO → Is this a portrait page?
    ├── YES → C. Iris reveal hero
    └── NO → Is this a motorrad page?
        ├── YES → D. Filmstrip wipe hero
        └── NO → Is this a portfolio/conceptual page?
            ├── YES → E. Sequence stage hero
            └── NO → B. Ken-Burns static hero (the workhorse default)
```

## Common across all heroes

- **Min-height:** `100svh` for primary heroes, `min(85svh, 900px)` for secondary/article heroes.
- **Heavy dark veil** so text stays readable regardless of underlying image: two-stop radial + linear gradient blend.
- **Kicker** above the H1, mono uppercase 10px with `letter-spacing: .26em` and a `::before` 24px bar.
- **H1** uppercase, compressed. If using a two-line treatment with em on one word, the em-color is **steel/sage (`var(--accent-2)`)**, not red. The italic-serif moment from older topic-hub pages is OK as a stylistic choice on topic hubs, but the dominant pattern on the landing-style heroes is a *sans display em in steel*, not italic serif.
- **Lead** in muted color, `max-width: 64ch`.
- **One primary CTA** (ink-filled — `--paper-ink` background on light, `--fg` background on dark) + optional ghost secondary (1px outline, transparent fill). **Never a red-filled button.** Never three.
- **Top-right header CTA** is ghost-outlined with a small bracket character `[ ]` or arrow suffix. Compact, quiet.
- **Aperture beam** in the absolute bottom-left or rotated across the middle (see `02-page-architecture.md` § 2).
- **`data-theme="dark"`** and **`data-header-theme="dark"`** so the sticky header tints correctly.
- **Motion in stills** — the hero looks "static" in a screenshot because Ken-Burns, grain, and the aperture beam don't render to a frame. Don't downgrade a hero to a static image because a screenshot doesn't show movement.

## How a hero fails

- Stock photography instead of Matthias's own work.
- Multiple competing CTAs.
- A **red-filled** CTA. (CTAs are ink-filled or ghost — never accent-filled.)
- Light gradient instead of strong dark veil.
- Round-cornered "cards" floating on top.
- Centered-everything layout (the site uses asymmetric bottom-left anchoring for hero copy).
- Headline em-word in red instead of steel/sage.
- Hero copy that explains a feature ("Mit unserer Plattform können Sie…") instead of stating a posture.
- Hero that's < 100svh on landing/topic-hub pages.
- "Downgrading" the hero to a flat static image because a screenshot didn't show animation. The motion is always present — implement it.

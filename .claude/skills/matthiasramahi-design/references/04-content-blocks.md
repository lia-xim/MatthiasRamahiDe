# 04 — Content Blocks

The recurring section "types" the site composes from. When the user asks for a new section, your first move is to pick from this catalogue. Only invent a new block type if nothing here fits the function — and even then, base its visual language on the closest existing block.

Each block below has a name, a purpose (when it's used), a skeleton, and notes on what makes it feel right.

---

## Chapter grid (the "Sechs Bereiche" pattern)

**Purpose:** 3–6 large image blocks arranged horizontally, each acting as a chapter/entry-point to a sub-area. Used on the landing page for "Sechs Bereiche. Eine Linse." (showing Automobil / Sportwagen / Oldtimer / Motorrad / Portrait / Landschaft).

This is the most-misread block in the system: at a glance it looks like a card grid, but it isn't — there are no shadows, no rounded corners, no hover-scale. It's a chapter index expressed as image+label.

**Skeleton:**

```html
<section class="chapters" data-theme="dark" data-header-theme="dark">
  <div class="chapters__inner container">
    <header class="chapters__head">
      <h2>Sechs Bereiche. <em>Eine Linse.</em></h2>
      <p class="chapters__lead">Jeder Bereich hat eine eigene visuelle Logik — Bewegung, Material, Mensch, Raum.</p>
    </header>
    <div class="chapters__grid">
      <a class="chapter" href="automobil-fotografie-duesseldorf.html">
        <figure class="chapter__photo"><img src="assets/photos/automobil-sunset.webp" alt=""></figure>
        <div class="chapter__label">
          <strong class="chapter__title">Automobil</strong>
          <span class="chapter__no">N° 01</span>
          <span class="chapter__tags">Location · Location · Detail</span>
        </div>
      </a>
      <a class="chapter" href="sportwagen-fotografie-duesseldorf.html">…</a>
      <a class="chapter" href="oldtimer-fotografie-duesseldorf.html">…</a>
      <!-- desktop shows 3 per row, mobile 1 per row -->
    </div>
  </div>
</section>
```

```css
.chapters__head { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: clamp(40px, 7vw, 112px); align-items: end; margin-bottom: clamp(36px, 5vw, 72px); }
.chapters__head h2 { font-size: clamp(54px, 9.4vw, 156px); line-height: .88; letter-spacing: -.045em; text-transform: uppercase; margin: 0; }
.chapters__head h2 em {
  font-style: normal; font-weight: 500;
  color: var(--accent-2);  /* steel-grey/sage — NOT red */
  letter-spacing: -.045em;
}
.chapters__lead { color: var(--muted); font-size: clamp(14px, 1.05vw, 16.5px); line-height: 1.55; max-width: 38ch; justify-self: end; text-align: right; }
.chapters__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(24px, 3vw, 40px); }
@media (max-width: 920px) { .chapters__grid { grid-template-columns: 1fr; } }
.chapter { display: grid; gap: 18px; color: var(--fg); }
.chapter__photo {
  aspect-ratio: 4/5;
  overflow: hidden;
  /* No border-radius. No box-shadow. */
}
.chapter__photo img {
  width: 100%; height: 100%; object-fit: cover;
  transition: filter 1.4s var(--ease), transform 1.4s var(--ease);
  filter: saturate(.94) contrast(1.04) brightness(.92);
}
.chapter:hover .chapter__photo img {
  filter: saturate(1.0) contrast(1.06) brightness(1.0);
  /* No scale. Color/contrast lift only — subtle, photographic. */
}
.chapter__label { display: grid; grid-template-columns: 1fr auto; align-items: baseline; gap: 8px; }
.chapter__title { font-size: clamp(22px, 2.4vw, 32px); font-weight: 600; letter-spacing: -.025em; text-transform: uppercase; }
.chapter__no { font: 700 10px/1 var(--font-mono); letter-spacing: .26em; text-transform: uppercase; color: var(--muted); }
.chapter__tags { grid-column: 1 / -1; font: 700 10px/1.4 var(--font-mono); letter-spacing: .22em; text-transform: uppercase; color: var(--muted); }
```

**Notes:**
- 3 cells per row on desktop. The 6 bereiche fit as 3+3 on the landing page (Automobil/Sportwagen/Oldtimer in row 1, Motorrad/Portrait/Landschaft in row 2), or as 6 in a single page-overview layout.
- Each cell is a single `<a>` — the whole block is clickable.
- The image has portrait (4:5) aspect ratio for the landing chapter grid; can be 4:3 or 16:10 for variant uses.
- **No box-shadow. No border-radius. No scale-on-hover.** Hover-lift is `filter` only — a quiet color/contrast normalization, mimicking a photographic lens focusing in.
- The H2 em-word is `var(--accent-2)` (steel), not red.
- This is the *canonical* "chapter" pattern. Use it any time you have a small number of large entry points (5–8 max) to sub-pages.

**Anti-pattern variant to avoid:** the same geometry with `border-radius: 12px`, `box-shadow: 0 4px 12px rgba(0,0,0,.1)`, and `transform: scale(1.04)` on hover. That's "card chrome" and lands the wrong way.

---

## Contact-sheet strip

**Purpose:** Show a tight grid of small uniform photos as a "sheet" — the editorial metaphor of a photographer's contact sheet. Used inside topic spreads on portfolio/topic pages.

**Skeleton:**

```html
<div class="pf-spread__strip">
  <figure class="pf-photo" data-i="0"><img src="…" loading="lazy" alt=""></figure>
  <figure class="pf-photo" data-i="1"><img src="…" loading="lazy" alt=""></figure>
  <figure class="pf-photo" data-i="2"><img src="…" loading="lazy" alt=""></figure>
  <figure class="pf-photo" data-i="3"><img src="…" loading="lazy" alt=""></figure>
</div>
```

```css
.pf-spread__strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}
.pf-photo { aspect-ratio: 4/3; overflow: hidden; }
.pf-photo img { width:100%; height:100%; object-fit: cover; transition: transform 1.4s var(--ease), filter 1.4s var(--ease); }
.pf-photo:hover img { transform: scale(1.04); filter: saturate(1.06); }
.pf-photo {
  transform: translateY(18px); opacity: 0;
  transition: transform .9s var(--ease), opacity .9s var(--ease);
}
.pf-photo.is-visible { transform: none; opacity: 1; }
.pf-photo:nth-child(2).is-visible { transition-delay: .06s; }
.pf-photo:nth-child(3).is-visible { transition-delay: .12s; }
.pf-photo:nth-child(4).is-visible { transition-delay: .18s; }
```

**Notes:** 4 columns on desktop, 2 on tablet, 1 on mobile. Photos stagger in via IntersectionObserver. Don't add captions — it's a sheet, not labeled cards.

---

## Archive wall (column-count masonry)

**Purpose:** A wall of photographs at varied aspect ratios, feeling like archive prints on a shelf. Used on topic main pages, portfolio.html, and conceptual pages.

**Skeleton:**

```html
<section class="pf-archive" data-theme="light">
  <div class="pf-archive__inner container">
    <header class="pf-archive__head">
      <span class="kicker">Archiv</span>
      <h2>Aus dem Bestand.</h2>
    </header>
    <div class="pf-archive__grid">
      <figure class="pf-photo"><img src="…" alt=""></figure>
      <figure class="pf-photo"><img src="…" alt=""></figure>
      <!-- 20–60 photos, natural aspect ratios -->
    </div>
  </div>
</section>
```

```css
.pf-archive__grid {
  column-count: 4;
  column-gap: 4px;
}
.pf-archive__grid .pf-photo {
  break-inside: avoid;
  margin-bottom: 4px;
}
@media (max-width: 1100px) { .pf-archive__grid { column-count: 3; } }
@media (max-width: 760px)  { .pf-archive__grid { column-count: 2; } }
```

**Notes:** Uses CSS `column-count`, not Grid or Flexbox masonry. Natural aspect ratios are preserved — don't force-crop. Near-zero gap (4px) is intentional; it reads as a continuous wall. Heavy use of `content-visibility: auto` and `contain-intrinsic-size: 600px` for performance.

**Anti-pattern:** Pinterest-style "card masonry" with rounded corners, shadows, captions, hover overlays. Don't.

---

## Comparison / topic spread

**Purpose:** A two-column section pairing copy and one large framed image. The site uses this for the 6 fotografie-bereiche on topic-hub pages, and inside topic main pages for each "module".

**Skeleton:**

```html
<section class="topic-spread" data-theme="dark" data-spread="01">
  <div class="topic-spread__inner container">
    <div class="topic-spread__copy">
      <span class="kicker">01 / Bereich</span>
      <h2>Automobil <em>als Bildsystem.</em></h2>
      <p class="lead">Fahrzeuge, Reflexe, Linien und Details als präzise Bildserie für Verkauf, Marke, Sammlung oder Kampagne.</p>
      <p class="note">Location · Location · Detail · Web/Print</p>
      <a href="automobil-fotografie-duesseldorf.html" class="topic-spread__link">Zum Bereich →</a>
    </div>
    <figure class="topic-spread__frame">
      <img src="assets/photos/automobil-sunset.webp" alt="">
    </figure>
  </div>
</section>
```

```css
.topic-spread__inner { display: grid; grid-template-columns: minmax(0,.86fr) minmax(0,1.14fr); gap: clamp(36px,8vw,120px); align-items: end; padding: clamp(58px,8vw,120px) 0; }
.topic-spread:nth-of-type(even) .topic-spread__inner { grid-template-columns: minmax(0,1.14fr) minmax(0,.86fr); }
.topic-spread:nth-of-type(even) .topic-spread__copy { order: 2; }
.topic-spread:nth-of-type(even) .topic-spread__frame { order: 1; }
.topic-spread__frame { border: 1px solid rgba(243,245,239,.14); box-shadow: 0 54px 80px -28px rgba(0,0,0,.55); overflow: hidden; }
.topic-spread__frame img { width:100%; aspect-ratio: 4/3; object-fit: cover; transition: transform 1.4s var(--ease); }
.topic-spread__frame:hover img { transform: scale(1.075); }
.topic-spread h2 em {
  font-family: 'Iowan Old Style','Charter',Georgia,serif;
  font-style: italic; font-weight: 400;
  color: var(--accent-2);
  letter-spacing: -.045em; text-transform: none;
}
```

**Notes:** Alternates left/right via `nth-of-type(even)`. The italic-serif `<em>` is per-spread per-topic. The `.note` line is mono micro-metadata. Don't introduce a shadow on the copy column or wrap it in a "card."

---

## Numbered services row

**Purpose:** List-style table of services or process steps. No cards — the table-as-content metaphor. Used on `leistungen.html`, on the homepage services section, and inside ablauf/process explanations.

**Skeleton:**

```html
<section class="service-table" data-theme="light">
  <div class="container">
    <header><span class="kicker">Leistungen</span><h2>Sieben Bereiche.</h2></header>
    <a class="service-row" href="fotolabor-druck-duesseldorf.html">
      <span class="service-row__no">01</span>
      <span class="service-row__name">Fotolabor &amp; Druck</span>
      <span class="service-row__desc">Fine Art Prints, Proofs, Papier- und Materialberatung.</span>
      <span class="service-row__arrow">→</span>
    </a>
    <a class="service-row" href="grossformatdruck-duesseldorf.html">…</a>
    <!-- 5 more -->
  </div>
</section>
```

```css
.service-row {
  display: grid;
  grid-template-columns: 56px minmax(220px,.42fr) minmax(0,1fr) 32px;
  gap: clamp(18px,4vw,64px);
  align-items: baseline;
  padding: clamp(22px,4vw,42px) 0;
  border-bottom: 1px solid var(--rule);
  transition: background .35s var(--ease), padding-left .35s var(--ease);
}
.service-row:hover { padding-left: 18px; }
.service-row:hover .service-row__arrow { transform: translateX(8px); opacity: 1; }
.service-row__no   { font: 700 11px/1 var(--font-mono); letter-spacing:.26em; color: var(--paper-muted); }
.service-row__name { font-size: clamp(28px,3vw,52px); line-height: 1; letter-spacing: -.025em; }
.service-row__desc { color: var(--paper-muted); font-size: clamp(14px,1.05vw,16.5px); line-height: 1.55; }
.service-row__arrow{ font-size: 18px; opacity: 0; transition: transform .35s var(--ease), opacity .35s var(--ease); }
```

**Notes:** Hover indents the row + advances the arrow + boosts the underline. The number takes a fixed 56px column. No shadows, no card framing.

---

## Manifesto / statement (two-column lead)

**Purpose:** A short editorial position statement. One on the landing page after the hero, one at the top of every topic main page, one near the beginning of `ueber-mich.html`.

**Skeleton:**

```html
<section class="statement" data-theme="light">
  <div class="statement__inner container">
    <h2 class="statement__title">Geschwindigkeit und <em>Leidenschaft</em> auf Bildern.</h2>
    <div class="statement__body">
      <p class="lead">Ein Motorrad muss auch im Stand Spannung tragen. Ich arbeite mit gesetzten Winkeln, kontrolliertem Licht und einer ruhigen Bildsprache — Mechanik, Material und Haltung wirken sofort, ohne Effektpose.</p>
      <p>Einsatz: Social, Website, Verkauf, Werkstatt, Kampagne. Sie erhalten Dateien für Web und Druck — bereit für Reels, Story, Magazin und Print, im einheitlichen Bild-Look.</p>
      <a href="#anfrage" class="btn btn-ink">Projekt anfragen →</a>
    </div>
  </div>
</section>
```

```css
.statement__inner { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(40px,7vw,112px); padding: clamp(76px,10vw,150px) 0; align-items: start; }
.statement__title { font-size: clamp(42px,7vw,116px); line-height: .94; letter-spacing: -.045em; text-transform: uppercase; margin: 0; }
.statement__body  { color: var(--paper-muted); font-size: clamp(16px,1.3vw,21px); line-height: 1.55; }
.statement__body p.lead { color: var(--paper-ink); margin: 0 0 18px; }
.btn-ink { background: var(--paper-ink); color: var(--paper); padding: 14px 22px; font: 700 11px var(--font-mono); letter-spacing:.22em; text-transform: uppercase; display: inline-flex; align-items: center; gap:10px; }
```

**Notes:** Always exactly two columns at desktop (H2 left, copy right). On mobile, stacks. H2 has one italic-serif `<em>`. The body has one strong lead paragraph + one supporting paragraph + one ink-filled CTA.

---

## FAQ stack

**Purpose:** Question-answer sections. Used on topic main pages, portrait subpages, and some service pages. Renders as a `stack-list` (a borderless table-like list), not as a JS accordion.

**Skeleton:**

```html
<section class="faq" data-theme="light">
  <div class="container">
    <header><span class="kicker">Häufig gefragt</span><h2>FAQ.</h2></header>
    <div class="stack-list">
      <article class="stack-item">
        <h3>Wie lange dauert ein Shooting?</h3>
        <p>Ein klassisches Portrait-Shooting plant sich auf 90–150 Minuten — inklusive Vorbereitung, mehrerer Looks und einer ruhigen Abschlussserie.</p>
      </article>
      <article class="stack-item">…</article>
    </div>
  </div>
</section>
```

```css
.stack-list { display: grid; border-top: 1px solid var(--rule); margin-top: 24px; }
.stack-item {
  display: grid;
  grid-template-columns: minmax(220px,.42fr) minmax(0,1fr);
  gap: clamp(18px,4vw,64px);
  padding: clamp(22px,4vw,42px) 0;
  border-bottom: 1px solid var(--rule);
}
.stack-item h3 { margin: 0; font-size: clamp(24px,3vw,46px); line-height: 1; letter-spacing: -.025em; }
.stack-item p  { margin: 0; color: var(--paper-muted); line-height: 1.55; }
```

**Notes:** No accordion expansion — all answers visible by default (favors SEO + accessibility over visual minimalism). On mobile, stacks question above answer.

---

## Audience cards ("Für wen ich arbeite")

**Purpose:** 4–5 small cards describing target client types. Used on topic main pages (motorrad, portrait especially) before the contact CTA.

**Skeleton:**

```html
<section class="audience" data-theme="light">
  <div class="container">
    <header>
      <span class="kicker">Für wen</span>
      <h2>Für <em>wen</em> ich arbeite.</h2>
      <p class="lead">Schreibe kurz, in welchem Kontext die Bilder gebraucht werden — und wir klären den Rest.</p>
    </header>
    <div class="audience__grid">
      <article class="audience__card">
        <span class="audience__no">01</span>
        <strong>Personal Brand</strong>
        <p>Selbstständige, Coaches, Speaker, Founder, Künstler.</p>
      </article>
      <article class="audience__card">…</article>
    </div>
    <footer>
      <p>Nicht aufgelistet? <em>Trotzdem schreiben.</em></p>
      <a href="#anfrage" class="btn btn-ink">Anfrage senden →</a>
    </footer>
  </div>
</section>
```

```css
.audience__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1px; background: var(--rule); border: 1px solid var(--rule); margin: 28px 0; }
.audience__card { background: var(--paper); padding: clamp(24px,4vw,46px); display: flex; flex-direction: column; gap: 12px; }
.audience__no { font: 700 11px var(--font-mono); letter-spacing:.26em; color: var(--paper-muted); }
.audience__card strong { font-size: clamp(22px,2.4vw,32px); letter-spacing: -.02em; font-weight: 500; }
.audience__card p { margin: 0; color: var(--paper-muted); }
```

**Notes:** Cards are joined by 1px grid gap on a `--rule` background — they read as a connected matrix, not floating cards. No shadows, no rounded corners. The closing footer pair ("Nicht aufgelistet? Trotzdem schreiben.") is signature site voice; keep it.

---

## Related-topics grid

**Purpose:** Cross-link to sibling topics at the end of a topic page. Used on every topic main page and SEO city subpage.

**Skeleton:**

```html
<section class="related" data-theme="dark">
  <div class="container">
    <header>
      <span class="kicker">Verwandt</span>
      <h2>Verwandte <em>Bereiche.</em></h2>
      <p>Selten allein. Die anderen Disziplinen mit ähnlicher Bildsprache.</p>
    </header>
    <div class="related__grid">
      <a class="related__card" href="automobil-fotografie-duesseldorf.html">
        <img src="assets/optimized/automobil-neon-1920.webp" alt="">
        <div class="related__content">
          <span>01 / Verwandt</span>
          <strong>Automobil</strong>
        </div>
      </a>
      <!-- 3–4 cards total -->
    </div>
  </div>
</section>
```

```css
.related__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.related__card { position: relative; overflow: hidden; aspect-ratio: 3/4; }
.related__card img { width:100%; height:100%; object-fit: cover; transition: transform 1.4s var(--ease), filter 1.4s var(--ease); filter: saturate(.88) brightness(.86); }
.related__card:hover img { transform: scale(1.06); filter: saturate(1.0) brightness(.94); }
.related__content { position: absolute; left: 16px; bottom: 16px; right: 16px; color: var(--fg); }
.related__content span { font: 700 9px var(--font-mono); letter-spacing:.24em; text-transform: uppercase; color: rgba(243,245,239,.6); display: block; margin-bottom: 6px; }
.related__content strong { font-size: clamp(20px,2vw,28px); font-weight: 500; letter-spacing: -.02em; }
@media (max-width: 920px) { .related__grid { grid-template-columns: repeat(2, 1fr); } }
```

**Notes:** 4 cards on desktop, 2 on mobile. Always portrait aspect (3:4). The image is darkened by default; hover unmutes it slightly. Card label is mono-eyebrow + bold short name. No "Read more" pill.

---

## Cities navigation grid (SEO only)

**Purpose:** The standardized list of 22 cities + NRW + Deutschland that appears near the bottom of every SEO city subpage. See `05-seo-subpage-scaffold.md` for the canonical city array.

**Skeleton:**

```html
<section class="mr-cities" data-theme="light" data-header-theme="light" aria-label="…">
  <div class="mr-cities__inner container">
    <div class="mr-cities__head">
      <span class="kicker">Standorte</span>
      <h2>{{topic_h1}} <em>vor Ort.</em></h2>
    </div>
    <nav class="mr-cities__grid" aria-label="Städte">
      <a class="mr-cities__cell" href="{{topic_slug}}-duesseldorf.html">Düsseldorf</a>
      <a class="mr-cities__cell" href="{{topic_slug}}-koeln.html">Köln</a>
      <!-- … 22 cells … -->
      <a class="mr-cities__cell" href="{{topic_slug}}-nrw.html">NRW</a>
      <a class="mr-cities__cell" href="{{topic_slug}}-deutschland.html">Deutschland</a>
    </nav>
  </div>
</section>
```

```css
.mr-cities__grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 1px; background: var(--rule); border: 1px solid var(--rule); }
@media (max-width: 1100px) { .mr-cities__grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 640px)  { .mr-cities__grid { grid-template-columns: repeat(2, 1fr); } }
.mr-cities__cell {
  background: var(--paper);
  padding: 22px 18px;
  display: flex; align-items: center; justify-content: flex-start;
  font: 700 13px var(--font-mono); letter-spacing: .18em; text-transform: uppercase;
  color: var(--paper-ink);
  transition: background .25s var(--ease);
}
.mr-cities__cell:hover { background: color-mix(in oklch, var(--paper) 88%, var(--paper-ink) 12%); }
.mr-cities__cell.is-active { background: var(--paper-ink); color: var(--paper); }
```

**Notes:** Always 22 cities + NRW + Deutschland, in this exact order: Düsseldorf, Köln, Essen, Dortmund, Duisburg, Bochum, Wuppertal, Leverkusen, Oberhausen, Krefeld, Mönchengladbach, Moers, Gelsenkirchen, Bergisch Gladbach, Solingen, Remscheid, Mettmann, Hilden, Dormagen, Neuss, NRW, Deutschland. The current city is `.is-active`. If you add a new SEO subpage, you must also add a link to it in this grid on **every other sibling page**.

---

## Search-keywords grid (SEO only)

**Purpose:** Long-tail keyword variants for the same topic. Used only on SEO subpages, immediately after the cities grid. The grid uses the same `mr-cities` skeleton but with 4–6 keyword-variant labels.

```html
<section class="mr-cities" data-theme="light" data-header-theme="light" aria-label="Motorrad Fotografie Suchbegriffe">
  <div class="mr-cities__inner container">
    <div class="mr-cities__head"><span class="kicker">Verwandt</span><h2>Motorrad Fotografie <em>Suchbegriffe.</em></h2></div>
    <nav class="mr-cities__grid">
      <a class="mr-cities__cell" href="motorrad-shooting-duesseldorf.html">Motorrad Shooting</a>
      <a class="mr-cities__cell" href="bike-fotografie-duesseldorf.html">Bike Fotografie</a>
      <a class="mr-cities__cell" href="custom-bike-fotografie-duesseldorf.html">Custom Bike Fotografie</a>
      <a class="mr-cities__cell" href="motorrad-verkaufsfotos-duesseldorf.html">Motorrad Verkaufsfotos</a>
      <a class="mr-cities__cell" href="biker-portrait-duesseldorf.html">Biker Portrait</a>
    </nav>
  </div>
</section>
```

Topic keyword sets:
- **Motorrad:** Motorrad Shooting, Bike Fotografie, Custom Bike Fotografie, Motorrad Verkaufsfotos, Biker Portrait
- **Automobil:** Autofotografie, Autohaus Fotografie, Autoverkauf Fotos, Fahrzeugfotografie, Automotive Fotografie
- **Sportwagen:** Sportwagen Shooting, Sportwagen Fotoshooting, Supersportwagen, Exotic Car, Performance Car
- **Oldtimer:** Oldtimer Shooting, Oldtimer Verkaufsfotos, Classic Car Fotografie, Sammlerfahrzeug, Youngtimer Fotografie
- **Portrait:** Business Portrait, Headshot, Personal Branding, Pressefoto, Unternehmensportrait
- **Landschaft:** Landschaftsbilder kaufen, Fine Art Prints Landschaft, Wandbilder Landschaftsfotografie, Naturfotografie Prints

---

## Contact CTA (unified)

**Purpose:** The final conversion module before the footer. Same module everywhere — only the headline, lead, and email-subject pre-fill change per page.

**Skeleton (legacy):**

```html
<section id="anfrage" class="contact-cta"
         data-contact-section data-theme="light" data-header-theme="light"
         data-contact-subject="{{topic_label}} {{city_name}} Anfrage"
         data-contact-headline="{{topic_label}} <em>{{city_name}} anfragen.</em>"
         data-contact-lead="{{contact_lead_text}}">
  <!-- Filled by site-chrome.js, or rendered server-side -->
</section>
```

The legacy `site-chrome.js` reads the `data-contact-*` attributes and injects the form. In Astro, use `apps/web/src/components/ContactCta.astro` which takes a `cta` prop or falls back to global CTA settings.

**Visual:**
- Light paper background.
- Two-column at desktop: left = headline + email + proof points; right = form fields.
- Email is large and bordered-bottom; hover changes border to accent.
- Form fields: name, email, project type select, message. Honeypot (`name="website"`) hidden.
- Submit uses `mailto:` with pre-filled subject + body.
- Proof points list: 3 short bullets with leading accent-bar.

**Per-page customization (legacy):** Change `data-contact-headline`, `data-contact-subject`, and `data-contact-lead`. Don't redesign the visual.

**Per-page customization (Astro):** Pass `cta={{ headline, emailSubject, lead, proofPoints[] }}` as a prop on `<ContactCta>`.

---

## When to add a NEW block type

Only when:

1. None of the above fits the content's function.
2. You can name it clearly (one word: "manifesto", "comparison", "archive").
3. Its visual language matches at least one existing block (same type scale, same color treatment, same easing).
4. You're willing to add it to both legacy CSS (`assets/site-chrome.css` or a per-section file) **and** Astro (`apps/web/src/components/ContentBlocks.astro`).

Then update this file with the new block.

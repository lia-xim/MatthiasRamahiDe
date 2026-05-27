# Portrait-Hero — Optionen, Empfehlung, Code

## Was aktuell schiefläuft

Die Iris-Reveal ist konzeptionell gut (Auge öffnet sich → Portrait), aber die Timeline ist gegen dich:

- **3,4 s** clip-path-Animation, **+ 3,2 s** bis der Titel überhaupt anfängt zu erscheinen, **+ 4,1 s** bis die CTAs da sind. Vier Sekunden bis zur ersten Conversion-Affordance ist auf einer SEO-Landingpage (`portraitfotografie-duesseldorf.html`) zu viel.
- `clip-path:circle()` mit `150vmax`-Radius über 3,4 s rendert auf Mobile-GPUs sichtbar gestaffelt — vor allem auf Android-Mittelklasse. Dazu kommen vier gleichzeitig im DOM gehaltene WebP-Slides plus eine 14-s-`transform:scale`-Animation pro Slide. Das ist viel Painting-Last für einen Above-the-fold-Bereich.
- Der pulsierende Catchlight ist ein nettes Detail, läuft aber **nur 0,7 s** sichtbar, bevor er wegfadet — viel Aufwand für wenig wahrgenommene Zeit.
- `mix-blend-mode:difference` auf dem Titel ist auf Mobile-Safari historisch teuer und kann beim Slide-Wechsel kurz flackern.

## Optionen

**A — Status quo aufräumen.** Iris auf 1,4 s kürzen, Titel-Delay auf 0,8 s, Slide-Wechsel von 4 auf 2 Portraits, Catchlight raus. Risiko: Du investierst Zeit in eine Mechanik, die auf Mobile trotzdem nie elegant wird.

**B — Static Hero mit langsamem Ken Burns.** Ein einziges Portrait, 20-s-Scale 1.08 → 1.00, Titel und CTAs ab 200 ms via `opacity`. Performt überall, ist aber für eine Service-Page mit dieser Bildtiefe etwas zu zurückhaltend — du verlierst die „Galerie"-Geste, die das Portfolio-Versprechen visuell stützt.

**C — Vertical Reveal / Shutter-Wipe.** Ein Bild, das von oben nach unten in 900 ms aufgezogen wird (`clip-path:inset(100% 0 0 0) → inset(0)`), darunter ruhiger Ken Burns. Schnell, mobil unproblematisch, photographisch konnotiert (Verschluss / Vorhang). Die Brand-Spec nennt explizit *„slow focus shifts, soft light sweeps, crop marks, aperture/glass/film-grain details"* — das passt.

**D — Crossfade-Slideshow ohne Reveal.** 2–3 Portraits, je 8 s mit 1,2 s Crossfade, Titel sofort sichtbar. Solide, aber generisch — sieht nach Wedding-Photographer-Template aus, nicht nach deinem Editorial-Ton.

**E — Split-Hero (Portrait links, Type rechts).** Bricht radikal mit den anderen Heroes der Site (`hero-pd`, `hero-pt`, Auto-Pages sind alle bildfüllend). Würde ich nicht machen — du brichst die Page-Familie, nur um den Animationsschmerz zu umgehen.

## Empfehlung: **C — Shutter-Wipe + ruhiger Ken Burns**

Begründung in drei Punkten:

1. **Brand-Fit.** Die Site spricht durchgängig die Sprache fotografischer Apparate: `hero-pd` (Print Develop), Aperture-Overlay auf `index.html`, Lens-Streaks auf Automobil. Ein Verschluss-Wipe ist konsistent — der Iris-Kreis ist es zwar auch, aber er kostet dich Sekunden, die der Wipe nicht kostet.
2. **Performance.** `clip-path:inset()` auf einer rechteckigen Maske ist auf jeder GPU billiger als ein animierter `circle()`-Radius — das Browser-Engine-Painting muss kein Distance-Field neu auswerten. Ein einziger Slide statt vier reduziert die Above-the-fold-Decode-Last um ~75%.
3. **Lesbarkeit & LCP.** Titel und Sub können nach 250 ms erscheinen statt nach 3,2 s. Das verbessert sowohl die wahrgenommene Geschwindigkeit als auch den LCP-Wert deutlich — kritisch für die Local-SEO-Pages.

**Was ich vom alten Hero rette:** Den Vignette-Layer, die Typo-Hierarchie (Serif `Iowan Old Style` + Mono-Caps-CTA), das `text-wrap:balance` am Titel, die Mobile-Breakpoints. Was rausfliegt: Catchlight, `mix-blend-mode:difference`, der 4-Slide-Cycle, die `--cx/--cy`-Variablen für den Iris-Punkt.

**Optional als Phase 2:** Wenn du den Portrait-Cycle wirklich vermisst, kannst du *nach* dem ersten Wipe alle 10 s ein Bild crossfaden — aber bewusst nur **zwei** Slides, vorgeladen, ohne erneutes Reveal. Erst Performance fixen, dann Variation dazudrehen.

## Hero-Skelett (HTML + CSS, drop-in)

```html
<section class="hero-pt" id="heroPt" data-header-theme="dark" aria-label="Portrait Fotografie">
  <div class="hero-pt__stage" aria-hidden="true">
    <div class="hero-pt__zoom">
      <img class="hero-pt__image"
           src="assets/portraits/_DSC0470-Enhanced-NR.webp"
           alt="" fetchpriority="high" decoding="async">
    </div>
    <span class="hero-pt__vignette"></span>
    <span class="hero-pt__grain"></span>
  </div>

  <h1 class="hero-pt__title">Portrait <em>Fotografie.</em></h1>

  <div class="hero-pt__sub-block">
    <p class="hero-pt__sub">Portraits als ruhige visuelle Haltung — Blick, Distanz und Licht so geführt, dass ein Bild professionell wirkt, ohne den Menschen dahinter glattzubügeln.</p>
    <div class="hero-pt__actions">
      <a href="#anfrage">Portraitshooting anfragen →</a>
      <a class="ghost" href="portfolio.html">Portfolio</a>
    </div>
  </div>
</section>
```

```css
.hero-pt{position:relative;height:100svh;max-height:100svh;overflow:hidden;background:#04050a;color:#f6f5f0}

/* Shutter-Wipe: von oben nach unten in 900ms */
.hero-pt__stage{position:absolute;inset:0;z-index:1;overflow:hidden;
  clip-path:inset(100% 0 0 0);
  animation:ptShutter 900ms cubic-bezier(.22,.9,.22,1) 120ms forwards}
@keyframes ptShutter{to{clip-path:inset(0 0 0 0)}}

/* Ruhiger Ken Burns — startet nach dem Wipe, sehr langsam */
.hero-pt__zoom{position:absolute;inset:0;transform:scale(1.08);transform-origin:50% 38%;
  animation:ptKen 22s cubic-bezier(.4,0,.2,1) 1s forwards;will-change:transform}
@keyframes ptKen{to{transform:scale(1)}}
.hero-pt__image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  object-position:50% 22%;filter:saturate(1.04) contrast(1.08) brightness(.94)}

/* Vignette + leichter Grain (statisch, kein Pulsieren) */
.hero-pt__vignette{position:absolute;inset:0;pointer-events:none;z-index:2;
  background:
    radial-gradient(ellipse 80% 84% at 50% 50%,transparent 32%,rgba(4,5,10,.36) 74%,rgba(4,5,10,.72) 100%),
    linear-gradient(180deg,rgba(4,5,10,.32) 0%,transparent 30%,transparent 58%,rgba(4,5,10,.68) 100%)}
.hero-pt__grain{position:absolute;inset:0;pointer-events:none;z-index:3;opacity:.06;mix-blend-mode:overlay;
  background:url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* Type — fadet ohne Verzögerungs-Treppe, kein mix-blend-mode */
.hero-pt__title{position:absolute;left:clamp(20px,4vw,60px);right:clamp(20px,4vw,60px);
  bottom:clamp(178px,26vh,288px);z-index:8;color:#f6f5f0;
  font-family:var(--font-display);font-weight:600;
  font-size:clamp(46px,9.4vw,160px);letter-spacing:-.052em;line-height:.86;
  text-wrap:balance;text-shadow:0 2px 28px rgba(0,0,0,.55);
  opacity:0;transform:translateY(14px);
  animation:ptIn 800ms cubic-bezier(.22,.9,.22,1) 350ms forwards}
.hero-pt__title em{font-style:italic;font-weight:500;color:var(--accent)}

.hero-pt__sub-block{position:absolute;left:clamp(20px,4vw,60px);right:clamp(20px,4vw,60px);
  bottom:clamp(40px,6vh,84px);display:flex;align-items:flex-end;justify-content:space-between;
  gap:36px;z-index:8}
.hero-pt__sub,.hero-pt__actions{opacity:0;transform:translateY(12px);
  animation:ptIn 750ms cubic-bezier(.22,.9,.22,1) forwards}
.hero-pt__sub{max-width:460px;color:rgba(246,245,240,.86);
  font-size:clamp(14.5px,1.05vw,17px);line-height:1.62;text-wrap:pretty;
  animation-delay:550ms}
.hero-pt__actions{display:flex;gap:14px;flex-wrap:wrap;animation-delay:700ms}
.hero-pt__actions a{display:inline-flex;align-items:center;gap:10px;padding:14px 22px;
  border:1px solid var(--accent);color:#f6f5f0;
  font-family:var(--font-mono);font-size:11px;letter-spacing:.22em;text-transform:uppercase;
  transition:background .35s ease,color .35s ease}
.hero-pt__actions a:hover{background:var(--accent);color:#0a0c11}
.hero-pt__actions a.ghost{border-color:rgba(243,245,239,.32);color:rgba(245,245,241,.72)}
.hero-pt__actions a.ghost:hover{border-color:#f6f5f0;color:#f6f5f0}

@keyframes ptIn{to{opacity:1;transform:translateY(0)}}

@media (max-width:780px){
  .hero-pt__sub-block{flex-direction:column;align-items:flex-start;gap:18px;bottom:clamp(28px,5vh,56px)}
  .hero-pt__title{font-size:clamp(42px,11vw,76px);bottom:clamp(220px,34vh,300px)}
}

@media (prefers-reduced-motion:reduce){
  .hero-pt__stage{clip-path:none;animation:none}
  .hero-pt__zoom{transform:scale(1.02);animation:none}
  .hero-pt__title,.hero-pt__sub,.hero-pt__actions{opacity:1;transform:none;animation:none}
  .hero-pt__grain{display:none}
}
```

Kein JS nötig — der gesamte Hero läuft über CSS-Keyframes. Das spart die `IntersectionObserver`-/`setInterval`-Logik aus dem aktuellen Script und entfernt den `visibilitychange`-Handler. Wenn du später den 2-Bild-Crossfade dazunimmst, lebt das in einem kleinen IIFE — aber erst messen, dann erweitern.

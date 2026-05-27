# Portrait-Hero: Optionen, Empfehlung, Skelett

## Kontext

Der aktuelle Portrait-Hero ist die kanonische **Iris-Reveal** Variante (Hero-Formel C aus dem Skill) — Catchlight pulsiert auf Schwarz, `clip-path: circle(0 → 150vmax)` öffnet die Bühne in 3.4s, dann läuft ein 4-Slide-Karussell mit Ken-Burns pro Slide alle 12s durch. Die Iris ist die **Signatur** der Portrait-Sektion (nur dort eingesetzt). Sie komplett zu ersetzen würde die Stil-Identität schwächen — das Skill warnt explizit vor „Watering down" beim Port (Failure Mode 1). Heißt: Wir behalten die Idee, lösen das Performance-Problem.

## Deine Optionen

**1. Iris behalten, aber straffen.** Reveal von 3.4s → 1.6s, Catchlight-Pulse 2 statt ∞ Iterationen (steht in der Skill-Referenz so), Slide-Cycle von 12s auf 9s, statisches Erstbild mit `fetchpriority=high` LCP-tauglich, danach Ken-Burns. Mobile bekommt `clip-path:none` und springt direkt ins Final-Frame — kein Reveal, dafür sofortiges Bild + langsames KB. Das ist die kleinste Änderung mit dem größten Effekt.

**2. Iris auf Mobile killen, Desktop unverändert.** Per Media-Query (`hover:none` / `width<780px`) den Iris-Pfad überspringen, Slide 0 direkt sichtbar. Desktop behält die volle Choreographie. Risiko: Du diagnostizierst weiterhin „langsam" auf langsamen Desktops/Tablets.

**3. Iris → Soft-Focus-Pull.** Statt geometrischem Kreis ein `filter: blur(28px) → blur(0)` über 1.4s mit gleichzeitigem `transform: scale(1.08) → 1.0`. Liest sich wie ein Schärfe-Ziehen am Objektiv. Photographisch korrekter, billiger zu rendern (GPU-Filter > clip-path animation), trotzdem ein eigener Moment. **Achtung:** `filter: blur()` auf großen Bildern kann auf Low-End-Mobile selbst teuer werden — Mobile dann auf `opacity 0→1` reduzieren.

**4. Iris → Ken-Burns ohne Reveal (Formel B).** Du fällst auf den Workhorse-Hero zurück. Sauber, schnell, garantiert performant. **Macht aber genau das, was das Skill verbietet** — die Portrait-Signatur wegen Performance abräumen. Ohne expliziten Grund nicht zu empfehlen.

**5. Iris durch Caustic/Light-Sweep ersetzen** (z. B. konische Licht-Bahn die übers Gesicht streicht). Klingt cool, ist aber ein neues Hero-Pattern und das Skill sagt klar: „pick from this list — don't invent a sixth." Vermeiden.

## Was du vermeiden solltest

- **Option 5** — neue, sechste Hero-Formel. Verstößt direkt gegen die Skill-Vorgabe und schwächt die Konsistenz zwischen Portrait-Hauptseite und allen `portraitfotografie-*-stadt.html` Subseiten, die mitziehen müssten.
- **Option 4** — Iris ersatzlos streichen ist „Watering down". Die Iris ist absichtlich der Portrait-Moment.
- **Roter Hover-Fill auf den CTAs** (steht aktuell im Code: `.hero-pt__actions a:hover{background:var(--accent)}` mit `--accent:#d8c9b8` — auf dieser Seite ist `--accent` ein warmer Champagner, nicht das Site-Rot, also OK; aber **nicht** zum Site-Rot wechseln). CTAs bleiben Ghost / Ink-Fill.
- **Iris-Dauer hochdrehen, weil's „cinematisch" wirkt.** 3.4s sind bereits am oberen Ende. Cinematic ≠ langsam.

## Empfehlung

**Option 1 — Iris straffen + Mobile-Bypass.** Begründung:

- Die Iris ist die **Portrait-Signatur**; das Skill nennt sie explizit als Hero-Formel C und sagt „Do not use elsewhere — it's the portrait-section signature." Sie zu erhalten ist Identität, nicht Nostalgie.
- Das tatsächliche Problem ist nicht „Iris ist falsch", sondern „Iris dauert zu lang und blockiert auf Mobile". Beides ist konfigurierbar ohne den Moment aufzugeben.
- Performance-Hebel sind klar messbar: LCP wird durch das statische Erstbild mit `fetchpriority="high"` getrieben (Bild ist sofort gepainted, Iris ist nur ein Reveal-Effekt drüber), Reveal-Dauer halbiert wahrgenommene Wartezeit, Mobile-Bypass entfernt den teuersten Pfad (`clip-path` Animation auf großem Element).
- Bleibt im Token-System: kein neues Easing, kein neues Pattern, kein Bruch zu den Sub-Seiten.

## Hero-Skelett (Option 1, gestrafft)

```html
<section class="hero-pt" id="heroPt" data-theme="dark" data-header-theme="dark" aria-label="Portrait Fotografie">
  <div class="hero-pt__stage" aria-hidden="true">
    <div class="hero-pt__photo" role="img" aria-label="Portrait">
      <img class="hero-pt__image"
           src="assets/portraits/_DSC0470-Enhanced-NR.webp"
           alt="" fetchpriority="high" decoding="async"
           width="1600" height="2560">
    </div>
    <span class="hero-pt__catchlight"></span>
    <span class="hero-pt__veil"></span>
  </div>

  <div class="hero-pt__inner container">
    <span class="kicker">Portrait · Düsseldorf</span>
    <h1 class="hero-pt__title">Portrait<br><em>Fotografie.</em></h1>
    <p class="hero-pt__lede">Portraits als ruhige visuelle Haltung — Blick, Distanz und Licht so geführt, dass ein Bild professionell wirkt, ohne den Menschen dahinter glattzubügeln.</p>
    <div class="hero-pt__actions">
      <a href="#anfrage" class="btn btn-ink">Portraitshooting anfragen →</a>
      <a href="portfolio.html" class="btn btn-ghost">Portfolio</a>
    </div>
  </div>
</section>

<style>
.hero-pt{position:relative;min-height:100svh;overflow:hidden;background:#04050a;color:var(--fg);display:grid;align-items:end}
.hero-pt__stage{position:absolute;inset:0;overflow:hidden}
.hero-pt__photo{position:absolute;inset:0;
  clip-path:circle(0% at 50% 38%);
  animation:ptIris 1.6s cubic-bezier(.23,1,.32,1) .15s forwards}
.hero-pt__photo img{width:100%;height:100%;object-fit:cover;object-position:50% 22%;
  transform:scale(1.06);animation:ptKB 28s ease-out .9s forwards;
  filter:saturate(.98) contrast(1.06) brightness(.94)}
.hero-pt__catchlight{position:absolute;left:50%;top:38%;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;
  background:radial-gradient(circle,#fffaee 0%,rgba(255,232,184,.4) 55%,transparent 75%);
  box-shadow:0 0 24px 6px rgba(255,242,210,.7),0 0 80px 16px rgba(255,228,176,.32);
  animation:ptCatch 1.2s var(--ease) 2}
.hero-pt__veil{position:absolute;inset:0;pointer-events:none;
  background:
    radial-gradient(120% 80% at 30% 30%,rgba(2,3,6,.2),rgba(2,3,6,.86) 70%),
    linear-gradient(180deg,rgba(2,3,6,.4) 0%,rgba(2,3,6,.1) 38%,rgba(2,3,6,.78) 100%)}
.hero-pt__inner{position:relative;padding:0 clamp(24px,4vw,72px) clamp(54px,8vw,120px)}
.hero-pt__title{font-family:var(--font-display);font-weight:500;text-transform:uppercase;
  font-size:clamp(56px,9.2vw,148px);line-height:.9;letter-spacing:-.038em;margin:16px 0 24px}
.hero-pt__title em{font-style:italic;font-weight:400;text-transform:none;color:var(--accent-2);letter-spacing:-.045em}
.hero-pt__lede{max-width:64ch;color:var(--muted);font-size:clamp(16px,1.3vw,21px);margin:0 0 28px}
.btn-ink{background:var(--fg);color:var(--bg)}
.btn-ghost{border:1px solid var(--fg);color:var(--fg)}

@keyframes ptIris{to{clip-path:circle(150vmax at 50% 38%)}}
@keyframes ptKB{to{transform:scale(1.16) translate(-1%,-1%)}}
@keyframes ptCatch{50%{transform:scale(1.5);opacity:.45}}

/* Mobile: kein Iris-Reveal, Bild ist sofort da */
@media (max-width:780px){
  .hero-pt__photo{clip-path:none;animation:none}
  .hero-pt__catchlight{display:none}
}
@media (prefers-reduced-motion:reduce){
  .hero-pt__photo,.hero-pt__photo img{animation:none;clip-path:none;transform:none}
  .hero-pt__catchlight{display:none}
}
</style>
```

Das Slide-Karussell habe ich bewusst weggelassen — der zweite große Performance-Posten der jetzigen Version. Wenn du das Bilderwechsel-Gefühl behalten willst, häng' es **nach** dem Iris-Reveal als optionalen 3-Slide-Crossfade dran (alle 9s, 1.2s Fade). Aber teste vorher, ob der Hero ohne Karussell nicht schon stark genug steht — bei ruhiger Portrait-Photographie meistens ja.

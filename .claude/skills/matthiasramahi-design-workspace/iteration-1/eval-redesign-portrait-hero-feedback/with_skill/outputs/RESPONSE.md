# Portrait-Hero — Optionen und Empfehlung

Bevor wir umbauen: Der Iris-Reveal ist laut Design-System (`03-hero-formulas.md` § C) die *Signatur* der Portrait-Sektion — bewusst nicht woanders verwendet. Das System warnt explizit davor, solche Momente beim Port platt zu walzen ("Don't simplify the metaphors away", SKILL.md Failure Mode 1). Wir lösen also nicht "Iris weg", sondern "Iris schlank machen". Das ist der Rahmen für alle Optionen.

## Die Optionen

**Option 1 — Iris straffen statt ersetzen (empfohlen).**
Die aktuelle Choreografie ist zu lang: 3.4s Iris + 14s Ken-Burns + 4 Slides à 12s + Crossfade + Catchlight-Pulse + Vignette-Fade. Mobil läuft das parallel zur Hero-Bild-Decodierung und blockiert den ersten sinnvollen Frame. Lösung: ein einziges Standbild (das stärkste Porträt), Iris von 3.4s auf 1.6s, Ken-Burns als ruhiges 24s-Schwingen statt 14s-Aufzoom, kein Slide-Stack mehr. Catchlight als optionaler Pre-Iris-Tease, nicht als Dauerpuls. Mobile: Iris-Radius im Endzustand startet, nur Ken-Burns läuft. Das ist die kanonische Iris-Hero aus dem Skill (§ C, Skeleton), nur ohne die akkumulierten Erweiterungen.

**Option 2 — Reduzierter Iris (Static + Catchlight-Tease, kein Reveal-Movement).**
Bild ist sofort sichtbar. Catchlight pulst 2x, dann fadet weg. Kein Clip-Path-Animation. Erhält das Catchlight-Motiv als Portrait-Signatur, verliert aber den "Auge öffnet sich"-Moment. Akzeptabel als Astro-Port, wenn Performance kritisch ist.

**Option 3 — Ken-Burns Static (Topic-Hub Standard, § B).**
Komplett von der Iris weggehen, Workhorse-Hero aus dem Skill nutzen. Funktioniert technisch — würde aber Portrait visuell mit den restlichen Topic-Hubs gleichschalten. Verliert Identität.

**Option 4 — Filmstrip Wipe, Sequence Stage, Lens Shader.**
Vermeiden. Wipe gehört zu Motorrad (§ D), Sequence Stage zu Portfolio (§ E), Lens Shader exklusiv zu `index.html` (§ A). Cross-using bricht das Patternsystem.

**Option 5 — Statisches Bild ohne Motion + langsamer Fade-In.**
Vermeiden. Watert die Portrait-Identität auf Stock-Niveau runter. Genau das Failure-Pattern aus SKILL.md Punkt 9.

## Empfehlung: Option 1

Begründung in drei Punkten:

1. **Das Iris-Reveal ist kein Bug, sondern die Markierung.** Es trennt Portrait sichtbar von Automobil/Motorrad/Landschaft. Der Skill kodifiziert das in § C ("Do **not** use elsewhere — it's the portrait-section signature"). Es zu entfernen wäre eine Identitätsentscheidung, kein Performance-Fix.

2. **Das tatsächliche Problem ist nicht der Iris, sondern der Stack drumherum.** Aktueller Code: 4 Porträts gestapelt, jedes mit eigenem Ken-Burns-Start zwischen `scale(1.55)` und `scale(2.6)`, 12s-Auto-Rotation, Catchlight mit Dauerpuls plus Box-Shadow-Animation, Vignette mit 3s-Delay-Fade-In, Title mit `mix-blend-mode: difference`. Das ist sechs Hero-Konzepte übereinander. Mobile rendert das mit gedrosselter Decoding-Pipeline und der LCP rutscht hinter 2.5s. Wenn man auf ein Bild und einen Ken-Burns reduziert, bleibt das Iris-Gefühl und der Performance-Druck ist weg.

3. **Es ist konsistent mit dem System.** § C zeigt die Iris-Hero als simples Skelett mit *einem* `__photo`, nicht mit einem Slide-Stack. Die aktuelle Implementierung ist eine Erweiterung, die über das kanonische Pattern hinausgewachsen ist. Zurück auf den kanonischen Stand zu gehen ist kein Verlust — es ist Restoration.

Was Du **vermeiden solltest**: alles, was die Iris durch einen CSS-Gradient oder ein statisches Bild ersetzt (Option 5), oder die Iris durch eine generische Topic-Hub-Hero ersetzt (Option 3). Beides würde Portrait visuell entkernen.

## Hero-Skelett — empfohlene Variante

Kürzer, ein Bild, kanonisches Iris-Pattern aus § C, `prefers-reduced-motion` als sicherer Endzustand, mobile-tauglich.

```html
<section class="hero-pt" data-theme="dark" data-header-theme="dark" aria-label="Portrait Fotografie">
  <div class="hero-pt__stage" aria-hidden="true">
    <div class="hero-pt__photo">
      <img src="assets/portraits/_DSC0470-Enhanced-NR.webp" alt="" fetchpriority="high" decoding="async">
    </div>
    <span class="hero-pt__catchlight"></span>
    <div class="hero-pt__vignette"></div>
  </div>

  <div class="hero-pt__copy container">
    <span class="kicker">01 / Portrait</span>
    <h1 class="hero-pt__title">Portrait <em>Fotografie.</em></h1>
    <p class="hero-pt__lede">Portraits als ruhige visuelle Haltung — Blick, Distanz und Licht so geführt, dass ein Bild professionell wirkt, ohne den Menschen dahinter glattzubügeln.</p>
    <div class="hero-pt__actions">
      <a href="#anfrage" class="btn btn-accent">Portrait-Shooting anfragen →</a>
      <a href="portfolio.html" class="btn btn-ghost">Portfolio</a>
    </div>
  </div>
</section>

<style>
.hero-pt{position:relative;min-height:100svh;overflow:hidden;display:grid;align-items:end;background:#04050a;color:var(--fg);--cx:50%;--cy:38%}
.hero-pt__stage{position:absolute;inset:0}
.hero-pt__photo{position:absolute;inset:0;clip-path:circle(0 at var(--cx) var(--cy));animation:ptIris 1.6s var(--ease) .25s forwards,ptKB 24s ease-in-out 1.9s forwards}
.hero-pt__photo img{width:100%;height:100%;object-fit:cover;object-position:50% 22%;filter:saturate(.96) contrast(1.06) brightness(.92);transform:scale(1.06);will-change:transform}
.hero-pt__catchlight{position:absolute;left:var(--cx);top:var(--cy);width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:radial-gradient(circle,#fffaee 0%,rgba(255,232,184,.4) 50%,transparent 72%);box-shadow:0 0 24px 6px rgba(255,242,210,.7),0 0 80px 14px rgba(255,228,176,.3);animation:ptCatch 1.2s var(--ease) 2;opacity:0}
.hero-pt__vignette{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 80% 80% at 50% 50%,transparent 35%,rgba(4,5,10,.7) 100%),linear-gradient(180deg,rgba(4,5,10,.35) 0%,transparent 35%,rgba(4,5,10,.7) 100%);opacity:0;animation:ptVeil 1s var(--ease) 1.8s forwards}
.hero-pt__copy{position:relative;z-index:2;padding:0 0 clamp(54px,8vw,120px)}
.hero-pt__title{font-size:clamp(56px,9.2vw,148px);font-weight:500;line-height:.9;letter-spacing:-.038em;text-transform:uppercase;margin:16px 0 24px}
.hero-pt__title em{font-family:'Iowan Old Style','Charter',Georgia,serif;font-style:italic;font-weight:400;text-transform:none;letter-spacing:-.045em;color:var(--accent-2)}
.hero-pt__lede{max-width:64ch;font-size:clamp(16px,1.3vw,21px);color:var(--muted);margin:0 0 28px}
.hero-pt__actions{display:flex;gap:14px;flex-wrap:wrap}

@keyframes ptIris{from{clip-path:circle(0 at var(--cx) var(--cy))}to{clip-path:circle(150vmax at var(--cx) var(--cy))}}
@keyframes ptKB{to{transform:scale(1.14) translate(-1%,-1%)}}
@keyframes ptCatch{0%{opacity:0;transform:scale(.6)}50%{opacity:1;transform:scale(1.3)}100%{opacity:0;transform:scale(2)}}
@keyframes ptVeil{to{opacity:1}}

@media (max-width:780px){.hero-pt__photo{animation-duration:1.2s,20s}}
@media (prefers-reduced-motion:reduce){
  .hero-pt__photo{clip-path:none !important;animation:none !important;transform:scale(1.04)}
  .hero-pt__catchlight{display:none}
  .hero-pt__vignette{opacity:1;animation:none}
}
</style>
```

Notizen: `--ease`, `--accent-2`, `--fg`, `--muted`, `.container`, `.kicker`, `.btn`, `.btn-accent`, `.btn-ghost` kommen aus `site-chrome.css` (§ Token-System). Der `<em>` im H1 nutzt den editorial-italic-serif-Move aus § Typography. `data-header-theme="dark"` bleibt — der Chrome-JS retintet darauf. Mobile kürzt die Iris-Animation auf 1.2s; reduced-motion springt direkt in den Endzustand.

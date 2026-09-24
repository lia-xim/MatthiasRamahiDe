# Technische Analyse: Robustheit, Safari & Layout-Shift

**Projekt:** matthiasramahi.de · **Stand:** 24.09.2026
**Basis:** Quellcode in `apps/web` (Astro 6, `output: 'server'`, Tina) und die ausgelieferten Assets in `apps/web/public/assets`. Die Live-Seite konnte ich aus der Analyseumgebung nicht abrufen. Alle Befunde stammen aus dem Code; wo etwas nur im Browser bestätigt werden kann, steht **„prüfen"** dabei.

---

## Kurzfazit

Die Seite sieht in Chrome unter Windows gut aus, weil sie praktisch dort entwickelt wurde. Die Probleme in Safari und auf „seltsamen Bildschirmen" haben **vier Hauptursachen**:

1. **Es gibt keine Webfonts.** Jede Plattform zeichnet eine andere Schrift (Mac/iOS: Avenir Next, Windows: Arial, Android: Roboto). Weil die Überschriften 900er Versalien mit −0,05em Laufweite sind, brechen Zeilen je nach System an anderen Stellen um. Dadurch ändern sich Höhen, und auch Wörter werden mitten im Wort getrennt.
2. **Das CSS läuft durch keinen Build-Schritt.** 48 handgepflegte Dateien bekommen kein Autoprefixing und keine Fallbacks. Deshalb fehlen zum Beispiel alle `-webkit-backdrop-filter`, die Safari bis Version 17 braucht.
3. **Die Kaskade hängt von der Ladereihenfolge ab.** Jede Datei definiert eigene `:root`-Tokens (10 verschiedene `--accent`-Werte). Dazu kommen 294× `!important` und nachgelagerte Patch-Dateien (`native-performance.css`, `site-readability.css`). Kleine Abweichungen zwischen Browsern verstärken sich dadurch.
4. **Wichtige Inhalte entstehen erst per JavaScript.** Kontaktformular und Exit-CTA werden per `innerHTML` nachgebaut, dazu kommen Scroll-Korrekturen per Timeout. Ohne JS oder bei langsamer Ausführung verschiebt sich das Layout sichtbar. In Safari fällt das stärker auf, weil Safari Scroll-Anchoring (`overflow-anchor`) nicht bzw. erst sehr spät unterstützt hat. Chrome kaschiert solche Sprünge.

Für den **Portfolio-Layout-Shift** gibt es zwei konkrete Kandidaten im Code: die „Closing"-Gruppe im Bildarchiv (Befund 2) und die per `hidden` versteckten Galerie-Karten auf den Portfolio-Detailseiten (Befund 3).

---

## Priorisierte Befunde

Legende: **P0** = sichtbarer Fehler, sofort beheben · **P1** = Robustheitsproblem mit hoher Wirkung · **P2** = Qualität/Performance/Wartbarkeit

### P0-1 · Keine Webfonts: jede Plattform zeigt eine andere Schrift

**Wo:** `src/styles/tokens.css:15`, `public/assets/portfolio-page.css:13`, `native-home.css` usw. Im gesamten Projekt gibt es **kein einziges `@font-face`** und keine `.woff2`-Datei.

```css
--display:'Neue Haas Grotesk Display','Söhne','Avenir Next','Helvetica Neue',Arial,system-ui,sans-serif;
--serif:'Iowan Old Style','Charter',Georgia,serif;
```

Neue Haas Grotesk und Söhne sind kommerzielle Schriften und bei Besuchern nicht installiert. Der Browser fällt deshalb auf die erste verfügbare Systemschrift zurück:

| Plattform | Tatsächliche Schrift (Display) | Serif |
|---|---|---|
| macOS / iOS (Safari, auch Chrome auf Mac) | **Avenir Next** (Heavy für 900) | Iowan Old Style |
| Windows | **Arial** (900 → synthetisch fett) | Georgia |
| Android | Arial-Alias → **Roboto** | Noto Serif / Georgia-Ersatz |
| Dein Rechner, falls NHG lokal installiert | Neue Haas Grotesk | – |

Avenir Next Heavy läuft deutlich breiter als Arial Bold. Mit `font-size: clamp(46px, 7.2vw, 116px)`, `letter-spacing: -.05em` und dem globalen `overflow-wrap: anywhere` aus `site-readability.css:40` passiert Folgendes:
- Überschriften brechen in Safari auf mehr Zeilen um, Sektionen werden höher, und Hero-Texte drücken gegen den unteren Rand.
- Lange deutsche Wörter („FAHRZEUGFOTOGRAFIE") werden **mitten im Wort** getrennt, weil `anywhere` jede Stelle als Umbruchpunkt erlaubt.
- `font-weight: 520` (tokens.css `.display`) funktioniert nur mit einer variablen Schrift. Systemschriften runden auf 400 oder 600.

**Fix:**
1. Die Schrift selbst hosten: lizenzierte NHG-Display-WOFF2-Dateien oder eine freie Alternative mit ähnlichem Charakter, etwa *Inter Tight*, *Archivo* oder *Schibsted Grotesk* (variabel, OFL).
2. Metrisch angepasste Fallbacks einsetzen, damit der Font-Swap keinen Layout-Shift erzeugt:

```css
@font-face{
  font-family:'MR Display';
  src:url('/fonts/mr-display-var.woff2') format('woff2');
  font-weight:100 900; font-display:swap;
}
/* Fallback mit angepassten Metriken → minimaler Shift beim Swap */
@font-face{
  font-family:'MR Display Fallback';
  src:local('Arial'), local('Helvetica Neue');
  size-adjust:104%; ascent-override:92%; descent-override:24%; line-gap-override:0%;
}
:root{ --display:'MR Display','MR Display Fallback',system-ui,sans-serif; }
```
3. Die Schrift im `<head>` preloaden: `<link rel="preload" href="/fonts/mr-display-var.woff2" as="font" type="font/woff2" crossorigin>`. Die CSP erlaubt `font-src 'self'` bereits.
4. `overflow-wrap:anywhere` für Überschriften durch `overflow-wrap:break-word; hyphens:auto;` ersetzen. `lang="de"` ist gesetzt, Silbentrennung funktioniert also.

> Allein dieser Punkt dürfte einen großen Teil der „auf manchen Geräten sieht es anders aus"-Effekte beseitigen.

---

### P0-2 · Portfolio-Archiv: Die „Closing"-Gruppe ist engine-abhängig (wahrscheinlichste Safari-Ursache)

**Wo:** `public/assets/portfolio-page.css:117–121` und `:141–145`, erzeugt in `NativePortfolioIndexPage.astro:142–152`

```css
.pf-archive__group--closing{grid-template-rows:repeat(2,minmax(0,1fr))}
.pf-archive__group--closing .pf-photo:nth-child(-n+3){grid-row:1 / span 2}   /* aspect-ratio 2/3 */
.pf-archive__group--closing .pf-photo:nth-child(n+4){grid-column:4;aspect-ratio:auto;height:100%}
```

**Das Problem:** Die Zeilenhöhe des Grids ergibt sich nur aus Elementen, die **zwei flexible Zeilen überspannen**. Die beiden Querformat-Bilder in Spalte 4 haben keine eigene Höhe (das `img` ist absolut positioniert) und hängen per `height:100%` an einer Zeile, deren Höhe erst im zweiten Layout-Durchgang feststeht. Wie überspannende Elemente in flexiblen Tracks behandelt werden, wurde in der Grid-Spezifikation später geändert. Chrome, Firefox und WebKit haben das zu unterschiedlichen Zeitpunkten umgesetzt. Die Folge sind je nach Engine und Version kollabierte oder überlappende Zeilen, und die Gruppe springt, sobald Bilder nachladen und ein Relayout auslösen. Dazu kommt ein Bruchpunkt bei 1080 px, an dem die Gruppe über `nth-child` komplett umsortiert wird.

**Fix (deterministisch, ohne Grid-Rätsel):** Spalte 4 als eigenen Stapel rendern.

```astro
<!-- NativePortfolioIndexPage.astro, nur für group.format === 'closing' -->
<div class="pf-archive__group pf-archive__group--closing">
  {group.photos.slice(0, 3).map(renderPhoto)}
  <div class="pf-archive__stack">
    {group.photos.slice(3).map(renderPhoto)}
  </div>
</div>
```
```css
.pf-archive__group--closing{align-items:stretch}
.pf-archive__stack{display:flex;flex-direction:column;gap:var(--archive-gap);min-width:0}
.pf-archive__stack .pf-photo{flex:1 1 0;min-height:0;aspect-ratio:auto}
/* ≤1080px: zwei Spalten: Porträt 1+2 oben, Porträt 3 + Stapel unten, ohne nth-child-Umsortierung */
```
Die Porträts bekommen ihre Höhe über `aspect-ratio: 2/3` aus der Spaltenbreite. Der Stapel wird per `stretch` genau so hoch, und die beiden Querformate teilen sich die Höhe per Flexbox. Alle Engines rechnen das gleich.

**Außerdem:** Die Einteilung Hoch-/Querformat (`:135–136`) nutzt `imageDimensions(…,'card')`. Fehlen die Maße im CMS, greift der Fallback `720×900`, und ein **Querformat landet als Hochformat** in einer 2:3-Kachel. Wenn ein Bild keine Maße hat, sollte der Build warnen oder abbrechen (`media:audit` erweitern).

---

### P0-3 · Das `hidden`-Attribut wird durch `display`-Regeln ausgehebelt

**Wo:** `src/styles/tokens.css:66` → `.card{display:flex}`. Betroffen ist `LoadMoreGallery.astro` auf **allen Portfolio-Detailseiten** (`/portfolio/[slug]`).

```astro
<article class="card" data-gallery-item hidden={index >= batchSize}>
```
Eine Autoren-Regel `display:flex` gewinnt immer gegen die Browser-Regel `[hidden]{display:none}`. Die Galerie zeigt deshalb **alle** Bilder sofort, und alle lazy-Bilder landen im Layout. Der Button „Mehr Bilder laden" tut sichtbar nichts und verschwindet nach dem Klick. Das ist ein sichtbarer Fehler, und die Seite ist unnötig lang.

Dasselbe Muster steckt in `portfolio-page.css:52` (`.hero-actions .btn{display:inline-flex}`): Hero-Buttons mit `hidden` erscheinen als **leere Buttons**, wenn einem CMS-Slide Label oder Link fehlt.

**Fix (eine Zeile, global in die erste geladene CSS-Datei):**
```css
[hidden]{display:none !important}
```

---

### P1-4 · `backdrop-filter` ohne `-webkit-`-Präfix: kein Glas-Effekt in Safari ≤ 17

**Wo:** In 21 CSS-Dateien fehlt das Präfix, darunter `portfolio-page.css` (Lightbox, Hero-Buttons), `site-lightbox.css`, `native-home.css` und alle Themen-Seiten. Nur `site-chrome.css`, `journal-support.css` und `native-performance.css` haben es.

Safari unterstützt `backdrop-filter` **ohne Präfix erst ab Version 18** (Herbst 2024). Auf iPhones mit iOS ≤ 17 und auf Macs mit Safari 17 fehlt die Unschärfe komplett. Halbtransparente Buttons und Overlays liegen dann ohne Blur über dem Foto und sind teils schlecht lesbar.

**Fix:** Nicht in 21 Dateien per Hand nachziehen, sondern einen Build-Schritt einführen (siehe P1-8), der das anhand einer `browserslist` automatisch erledigt.

---

### P1-5 · `overflow-x:hidden` auf `html` **und** `body` macht `body` zum Scroll-Container

**Wo:** `portfolio-page.css:21`, `critical-home.css`, `native-home.css:18–19`, `native-automobil.css`, `native-services.css`, `native-journal.css`, `native-legal-inline.css:2` u. a. Zusätzlich setzt `site-chrome.css:53` `body{overflow-x:hidden}` global.

Haben `html` und `body` **beide** einen `overflow`-Wert ungleich `visible`, wird `body` zu einem eigenen Scroll-Container. Das hat drei Folgen:
- **`position: sticky` funktioniert nicht mehr.** Konkret betroffen ist die `.toc` (Inhaltsverzeichnis) auf Impressum/Datenschutz (`NativeLegalPage.astro` lädt `native-legal-inline.css`).
- iOS Safari zeigt dabei bekannte Eigenheiten: Scroll-Events, Momentum-Scrolling, Pull-to-Refresh und der `body{overflow:hidden}`-Scroll-Lock von Menü und Lightbox verhalten sich uneinheitlich.
- Der eigentliche Grund für seitliches Scrollen (ein Element ist zu breit) bleibt versteckt, statt behoben zu werden.

**Fix:**
```css
html{overflow-x:clip}      /* clip erzeugt KEINEN Scroll-Container (Safari 16+) */
body{overflow-x:visible}   /* alle body/html-overflow-Deklarationen in den Seiten-CSS entfernen */
```
Besser noch: die Elemente finden, die überstehen. Kandidaten sind die Keyframe-Animation mit `translateX(100vw)` in `native-motorrad.css:77` und `.hero-aperture` mit `left/right:-15vw` (Portfolio/Home). Diese Elemente lokal mit `overflow:clip` auf dem Section-Container einfassen.

---

### P1-6 · Per JavaScript nachgebaute Inhalte → Layout-Shift, ohne JS nichts

**Wo:** `site-chrome.js:721–1003` (Kontaktformular) und `:463–488` (Exit-CTA)

- `<section id="anfrage" data-contact-section />` ist im HTML **leer**. Das komplette Formular kommt erst per `innerHTML` rein, wenn der Abschnitt in die Nähe des Viewports kommt oder nach bis zu 4,2 s (Safari hat kein `requestIdleCallback` und nutzt deshalb immer den Timeout).
- Beim Sprung auf `#anfrage` (Header-CTA auf dem Portfolio: `ctaHref="#anfrage"`) landet der Browser zuerst auf einer 0 px hohen Section. Danach wird das Formular eingefügt, und `scrollToRequestSlot()` korrigiert die Position **dreimal per Timeout** (sofort, +90 ms, +240 ms). Das ist genau der sichtbare Ruck.
- Auf Seiten ohne Formular wird zusätzlich eine Exit-CTA vor dem Footer eingefügt. Der Footer verschiebt sich dadurch nachträglich.
- Es gibt **zwei parallele Kontaktformulare**: `ContactCta.astro` (serverseitig, sauber) und das `innerHTML`-Formular in `site-chrome.js`.
- **Relative Links:** `'contact.html#anfrage'` und `'portfolio.html'` (`site-chrome.js:340, 379, 481`) zeigen auf verschachtelten Pfaden (`/journal/…`, `/portfolio/…`) auf `/journal/contact.html` usw. **Prüfen**, ob die Middleware das auffängt. Sonst immer wurzelrelativ schreiben (`/contact.html#anfrage`).

**Fix:** Formular und Exit-CTA **serverseitig in Astro rendern**. `ContactCta.astro` existiert schon und kann die `data-contact-*`-Varianten per Props übernehmen. JS nur noch für das Absenden verwenden. Die Scroll-Retry-Logik fällt dann weg.

---

### P1-7 · Header-Theme-Erkennung: bis zu 25 Hit-Tests pro Scroll-Frame + wechselnde `theme-color`

**Wo:** `site-chrome.js:497–540`

Bei jedem Scroll-Frame ruft `probe()` bis zu 5×5 = **25× `document.elementFromPoint()`** auf. Jeder Aufruf kann ein Layout erzwingen. Auf iPhones und älteren Macs kostet das spürbar Scroll-Performance. Außerdem wird `<meta name="theme-color">` beim Scrollen umgeschaltet. Safari färbt damit die Adress- bzw. Tab-Leiste ein, sodass die **Browser-Leiste beim Scrollen flackert oder die Farbe springt**. Das ist eine typische „nur in Safari komisch"-Beobachtung.

**Fix:** Ein `IntersectionObserver` auf alle `[data-header-theme]`-Sections, mit einem schmalen Beobachtungsband auf Höhe des Headers:
```js
new IntersectionObserver(cb, { rootMargin: '-72px 0px -92% 0px' })
```
`theme-color` bleibt statisch oder wird nur einmal pro Seite gesetzt.

---

### P1-8 · Architektur: Das CSS/JS läuft an Astro vorbei

**Ist-Zustand:**
- Die Quellen liegen in `/assets` (Repo-Root) und werden per `tools/sync-public-assets.mjs` nach `apps/web/public/assets` kopiert. Es gibt also **zwei Kopien**, und Vite verarbeitet keine davon: kein Minify, kein Autoprefix, keine Fallbacks, keine Content-Hashes (stattdessen `?v=`-Query).
- Jede Seiten-CSS definiert eigene `:root`-Tokens, zum Beispiel `--accent` in 10 verschiedenen Werten (`#c8ccc6`, `oklch(54% .13 36)`, `oklch(57% .185 31)`, …). Wer „gewinnt", hängt davon ab, welche Dateien in welcher Reihenfolge geladen werden. Die Portfolio-**Detail**-Seite lädt zum Beispiel die komplette `native-home.css` (33 KB) mit, nur für die Hero-Stile.
- **294× `!important`**. `site-chrome.css:83–89` dokumentiert selbst, dass es gegen alte Inline-Styles ankämpft. Dazu kommen zwei Patch-Schichten: `native-performance.css` (setzt z. B. global `.hero{cursor:auto!important}`) und `site-readability.css` (überschreibt `font-size` auf *allen* `p, li, a, label`).
- Drei Dateien bringen einen globalen `*{margin:0;padding:0}`-Reset mit (`portfolio-page.css`, `native-portrait.css`, `native-landscape.css`), der auch Header und Footer trifft.
- Moderne Syntax ohne Fallback: `oklch()` (Safari ≥ 15.4), `color-mix()` (Safari ≥ 16.2, in 12 Dateien), `svh` (≥ 15.4), `:has()` (≥ 15.4), `overflow-wrap:anywhere` (≥ 15.4). Ältere Geräte bekommen **ungültige Deklarationen**, also transparente Flächen, falsche Farben oder eine Hero-Höhe von `auto`.

**Ziel-Architektur (schrittweise):**
1. **Eine `browserslist`** im Root, zum Beispiel `"> 0.5% in DE, last 3 Safari versions, iOS >= 15.4, not dead"`.
2. CSS aus `public/` in `src/styles/` verschieben und in Layouts und Komponenten **importieren** (`import '../styles/portfolio.css'`). Vite verarbeitet es dann mit **Lightning CSS** (`vite.css.transformer: 'lightningcss'`) und erzeugt automatisch `-webkit-`-Präfixe, `oklch`→`rgb`-Fallbacks, `color-mix`-Auflösung, Minify und Hash-Dateinamen.
3. **`@layer`** statt `!important`:
   ```css
   @layer reset, tokens, base, chrome, components, pages, overrides;
   ```
   Seiten-CSS kommt in `pages`, der Header in `chrome`. Die Reihenfolge ist damit fest definiert, unabhängig davon, wann eine Datei lädt.
4. **Ein Token-Set** (`tokens.css`) für die ganze Seite. Seiten dürfen nur *benannte* Varianten setzen (`[data-page="portrait"]{--accent:…}`), nie `:root` neu definieren.
5. Einen `.media-frame`-Baustein für alle Bildkacheln (siehe P2-11), statt pro Seite eigene Varianten.

---

### P2-9 · JS-Gewicht und Duplikate

- Das Portfolio lädt `native-home.js` (45 KB unminifiziert) inklusive eines kompletten WebGL-Shaders. Der ist per Default **deaktiviert** (`initialStaticHeroReason()` gibt immer mindestens `'performance-default'` zurück). Toter Code auf jeder Seite, die das Script lädt.
- Es gibt **drei Lightbox-Implementierungen** (`site-lightbox.js`, `pf-viewer` in `portfolio-page.js`, `#lightbox` in `native-home.js`).
- Zwei `MutationObserver` beobachten den **gesamten Dokumentbaum** (`site-chrome.js`, `native-home.js`).
- Eine „Image-Recovery"-Schicht (`site-chrome.js:1–130`) tauscht bei Fehlern `src`/`srcset` gegen immer größere Varianten. Das kaschiert kaputte CMS-Pfade, statt sie im Build zu melden.
- Gesamt auf `/portfolio`: **≈ 125 KB JS + 77 KB CSS**, unminifiziert.

**Fix:** Den Shader nur bei `?hero=shader` per dynamischem `import()` nachladen. Eine gemeinsame Lightbox auf Basis von `<dialog>` bauen: nativer Fokus-Trap, `Esc`, und `::backdrop` in allen aktuellen Browsern. Scripts über Astro-`<script>` bündeln lassen, dann sind sie minifiziert, gehasht und dedupliziert.

---

### P2-10 · Bilder, die ohne JS unsichtbar bleiben

`native-automobil.css:31`, `native-motorrad.css:31`, `native-oldtimer.css:32`, `native-sportwagen.css:31`, `native-portrait.css:16` und `native-landscape.css:16` enthalten:
```css
img[loading="lazy"]{opacity:0}
img[loading="lazy"].is-loaded{opacity:1}
```
Die Klasse `.is-loaded` setzt nur JavaScript. Bricht ein Script ab, etwa durch einen Syntaxfehler in einem älteren Browser, einen CSP-Block oder eine blockierende Erweiterung, bleiben **alle Lazy-Bilder unsichtbar**. `native-home.css:52` macht es bereits richtig und blendet nur Bilder aus, die das Script markiert hat (`[data-lf="1"]`).

**Fix:** Überall das `[data-lf="1"]`-Muster verwenden oder `html.js img[loading=lazy]` mit einer früh gesetzten `js`-Klasse.

---

### P2-11 · `height:100%`-Bilder in `aspect-ratio`-Boxen

`portfolio-page.css:84/104` (Genre-Streifen), `native-portfolio-project.css` (`.project-perspective-row__visual img`) und `tokens.css:69` (`.card img`) nutzen ein Bild **im Fluss** mit `height:100%` in einer Box mit `aspect-ratio`. Genau dieses Muster wurde für `.pv-img`/`.sh-img` bereits in `site-readability.css:61–62` als WebKit-Problem gepatcht. Die Prozenthöhe wird in älteren WebKit-Versionen nicht als definit behandelt, was zu anderem Bildausschnitt bzw. einer anderen Höhe führt.

**Fix:** Ein Baustein für alle Fälle:
```css
.media-frame{position:relative;overflow:hidden;aspect-ratio:var(--ratio,1)}
.media-frame > img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
```

---

### P2-12 · Kein Edge-Caching: jede Anfrage rendert serverseitig neu

- `astro.config.mjs`: `output: 'server'`, und fast alle Routen haben `prerender = false`.
- `lib/liveCache.ts`: `ASTRO_LIVE_PAGE_CACHE_SECONDS` ist per Default `0` → **`Cache-Control: no-store`**. Die Portfolio-Detailseiten setzen `no-store` fest (`[slug].astro:32`).
- Die Inhalte kommen per Default aus lokalen Tina-Dateien (`cmsContentSource() → 'tina'`). Sie ändern sich also nur bei einem Deploy.

**Das bedeutet:** Jeder Besuch startet eine Vercel-Function (Cold Starts, schwankende TTFB), und das CDN cacht nichts. **Prüfen:** Ist `ASTRO_LIVE_PAGE_CACHE_SECONDS` in Vercel gesetzt?

**Fix:** Öffentliche Seiten auf `prerender = true` umstellen oder mindestens `s-maxage` mit `stale-while-revalidate` setzen. Für den Tina-Editor bleibt SSR über die Preview-/Edit-Route. Das ist der größte Stabilitätsgewinn für wenig Aufwand.

---

### P2-13 · Kleinere Punkte

- **Critical-CSS auf der Startseite:** Alle Stylesheets werden per `media="print" onload` nachgeladen (`AdoptedPageLayout.astro:149–152`). Weicht `critical-home.css` vom finalen CSS ab, springt der erste Viewport beim Nachladen. Mit dem Build aus P1-8 ist das CSS klein genug, um es normal render-blocking zu laden.
- **`sizes` in `ResponsiveImage.astro`:** Der Default `(max-width:760px) 100vw, 50vw` wird auch im 3-spaltigen `.card-grid` verwendet, sodass zu große Bilder geladen werden. Die Archiv- und Streifen-Bilder im Portfolio haben gar kein `srcset`.
- **Mobile-Hero:** `@keyframes heroPanMobile` animiert `background-position`. Das läuft ohne GPU-Beschleunigung und zeichnet jeden Frame neu, was auf iPhones Akku und Flüssigkeit kostet. Besser ein `<img>` mit `transform` animieren.
- **Doppelter Fokusring:** `site-chrome.css:26` und `:56` definieren zwei verschiedene `:focus-visible`-Stile.
- **Breakpoint 1241–1599 px** (`site-readability.css`): Auf den meisten Laptop-Breiten (1280, 1366, 1440, 1536) zeigt der Desktop das Hamburger-Menü statt der Navigation. Prüfen, ob das gewollt ist.

---

## Wie du Safari unter Windows testest

- **Playwright WebKit** ist schon da (`playwright` in den devDependencies, `test:visual` existiert). Ein WebKit-Projekt ergänzen:
  ```js
  // scripts/visual-regression.mjs
  import { webkit, devices } from 'playwright'
  const browser = await webkit.launch()
  const ctx = await browser.newContext({ ...devices['iPhone 13'] })
  ```
  Die Engine entspricht ziemlich genau Safari. Fonts und das Scroll-Verhalten von echtem iOS bildet sie nicht 1:1 ab.
- **Echte Geräte:** BrowserStack oder LambdaTest (iOS 16/17/18, Safari auf macOS 14/15).
- **Testmatrix für Breiten:** 320 · 375 · 390 · 430 · 768 · 1024 · 1280 · 1366 · 1440 · 1920 · 2560, jeweils Hoch- und Querformat am Handy, dazu 200 % Browser-Zoom.
- **CLS messen:** `PerformanceObserver({type:'layout-shift', buffered:true})` im Chrome-Test sowie die Lighthouse-Audits, die schon vorhanden sind. Safari meldet `layout-shift` nicht, dort helfen nur visuelle Diffs.

---

## Umsetzungsplan

**Phase 1 · Quick Wins (1–2 Tage)**
1. `[hidden]{display:none!important}` global (P0-3)
2. Closing-Gruppe im Archiv als Flex-Stapel umbauen (P0-2)
3. Webfont selbst hosten + Fallback-Metriken, `overflow-wrap:anywhere` bei Überschriften entfernen (P0-1)
4. `html{overflow-x:clip}`, alle `html/body{overflow-x:hidden}` entfernen (P1-5)
5. Relative `contact.html`-Links wurzelrelativ machen (P1-6)
6. WebKit-Lauf in `test:visual` ergänzen

**Phase 2 · Asset-Pipeline (≈ 1 Woche)**
7. `browserslist` + Lightning CSS, CSS nach `src/styles` und per Import einbinden (P1-4, P1-8)
8. `@layer`-Struktur, ein Token-Set, `!important` schrittweise abbauen
9. Kontaktformular und Exit-CTA serverseitig rendern (P1-6)
10. Header-Theme per IntersectionObserver (P1-7)

**Phase 3 · Performance & Betrieb**
11. Prerender/Edge-Caching für öffentliche Seiten (P2-12)
12. JS konsolidieren: Shader optional, eine `<dialog>`-Lightbox, Astro-Bundling (P2-9)
13. `.media-frame`-Baustein, `srcset`/`sizes` im Portfolio (P2-11, P2-13)

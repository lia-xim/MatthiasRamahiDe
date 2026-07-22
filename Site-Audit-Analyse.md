# Site-Audit-Analyse — matthiasramahi.de

**Grundlage:** Contextter Site Audit, Run `mh8azatar3f07fqj5aygg6v39h8ax800` (Jul 20), 4.654 Findings über 23 Issue-Codes.
**Vorgehen:** Jeder Issue-Code wurde gegen den Live-HTML-Output, den Quellcode und — wo relevant — gegen die HTTP-Header und externen Ziele verifiziert. Keine Bewertung wurde aus der Report-Beschreibung übernommen.
**Ergebnis:** 6 echte Probleme gefixt, 1 dokumentiert. 8 systematische Crawler-Fehler identifiziert.

---

## 1. Kurzfassung

Der Crawler ist mechanisch solide: er findet Seiten zuverlässig, folgt der Sitemap, holt Ressourcen, misst Header und baut einen Link-Graph. Die **Regel-Ebene darüber ist aber deutlich schwächer als die Datenerhebung.** Ein Großteil der Findings entsteht dadurch, dass korrekt implementierte Web-Standards als Fehler gewertet werden — `alt=""`, `data:`-URIs, `preconnect`, `srcset`, `aria-label`, `<nav>`.

Die Verteilung der 4.654 Findings:

| Kategorie | Findings | Anteil |
|---|---:|---:|
| Eindeutig falsch (False Positive) | 1.700 | 36,5 % |
| Überwiegend falsch (Fehlklassifikation mit wahrem Kern) | 415 | 8,9 % |
| Technisch wahr, aber nicht handlungsrelevant | 1.516 | 32,6 % |
| Wahr und handlungsrelevant | 1.023 | 22,0 % |

Die 1.023 wahren Findings gehen auf **9 verschiedene Ursachen** zurück, die zusammen rund **30 einzigartige Assets/URLs** betreffen. Der Rest ist Vervielfachung derselben Sache über alle Seiten.

**Die wichtigste Zahl:** Der Report meldet 4.654 Probleme. Tatsächlich handeln musste ich an 6 Stellen. Ein Nutzer ohne Zeit für diese Verifikation hätte entweder alles ignoriert oder Tage mit Nicht-Problemen verbracht — und dabei den einen wirklich wertvollen Fund (den verwaisten Artikel) zwischen 1.238 falschen Alt-Text-Meldungen übersehen.

---

## 2. Was echt war — und gefixt wurde

### 2.1 Verwaister Journal-Artikel (der wertvollste Fund)

**Gemeldet als:** `internal_inlinks_missing` (medium, 1 URL) + `orphan_sitemap_url` (medium, 1 URL) — dasselbe Problem, doppelt gezählt.

`/blog-portraits-ohne-generische-posen.html` liefert HTTP 200, steht in `sitemap-journal.xml`, hat aber **null eingehende interne Links**. Verifiziert: die Journal-Sitemap listet 7 Artikel, der Blog-Index verlinkte nur 6.

Die Ursachensuche war lehrreich, weil meine erste Hypothese falsch war. Zunächst sah es nach CMS/Static-Drift aus (`NativeJournalIndexPage.astro:59` ersetzt die statische Liste komplett durch CMS-Daten). Das stimmte nicht — **alle 7 Artikel existieren im CMS**, alle mit `status: published` und gültiger `legacyUrl`.

Die echte Ursache:

```
publishedAt: portraits-ohne-generische-posen = 2026-05-28  ← neuester Beitrag
Sortierung:  '-publishedAt'  →  posts[0] = Portrait-Artikel
featured   = posts[0]                    // belegt den Featured-Slot
gridPosts  = posts.slice(1)              // → fällt aus dem Grid
featuredHref = featuredSettings.buttonHref   // CMS-Override → Automotive-Artikel!
```

Der Portrait-Artikel belegte den Featured-Slot, aber **jedes Feld des Featured-Blocks** (Href, Headline, Text, Bild) wird vom CMS überschrieben und zeigt auf den Automotive-Artikel. Der Slot-Beitrag wurde also gleichzeitig aus dem Grid entfernt *und* nie verlinkt.

**Fix** (`NativeJournalIndexPage.astro`): Kuratiert das CMS einen Beitrag per `buttonHref`, belegt genau dieser den Featured-Slot — und genau dieser wird aus dem Grid entfernt.

```ts
const curatedFeaturedIndex = curatedFeaturedHref
  ? posts.findIndex((post) => post.href === curatedFeaturedHref)
  : -1
const featuredIndex = curatedFeaturedIndex >= 0 ? curatedFeaturedIndex : 0
const featured = posts[featuredIndex]
const gridPosts = posts.filter((_, index) => index !== featuredIndex)
```

**Verifiziert:** `/blog.html` verlinkt jetzt 7 statt 6 Artikel. Der Featured-Block zeigt unverändert die CMS-kuratierten Inhalte und verlinkt weiter den Automotive-Artikel — der Portrait-Artikel erscheint zusätzlich als reguläre Karte im Grid. Verhalten erhalten, Orphan beseitigt.

> **Konstruktionsfehler, nicht Inhaltsfehler.** Die Struktur lässt jeden zukünftigen Beitrag verwaisen, sobald das CMS-`buttonHref` nicht auf den neuesten Beitrag zeigt. Das wäre erneut passiert.

---

### 2.2 Cache-Policy der Root-Assets

**Gemeldet als:** `static_resource_cache_policy_missing` (medium, 700 Assets) — tatsächlich 7 einzigartige Assets × 100 Seiten.

Verifiziert per HTTP-Header:

```
favicon.ico          Cache-Control: public, max-age=0, must-revalidate
favicon.svg          Cache-Control: public, max-age=0, must-revalidate
favicon-32x32.png    Cache-Control: public, max-age=0, must-revalidate
favicon-16x16.png    Cache-Control: public, max-age=0, must-revalidate
apple-touch-icon.png Cache-Control: public, max-age=0, must-revalidate
site.webmanifest     Cache-Control: public, max-age=0, must-revalidate
/assets/*            Cache-Control: public, max-age=31536000, immutable   ← Vergleich
```

Die Regeln in `vercel.json` deckten `/assets/`, `/_astro/` und `/uploads/` ab — die Dateien im Web-Root fielen durch auf Vercels Default. Bei jedem Seitenaufruf ein Revalidierungs-Roundtrip.

**Fix** (`vercel.json`): eigene Header-Regel für die Favicon-Familie und das Manifest. Bewusst **nicht** `immutable`/1 Jahr, weil diese Dateien unversioniert sind — ein Favicon-Wechsel wäre sonst bei Bestandsnutzern eingefroren:

```json
"Cache-Control": "public, max-age=604800, stale-while-revalidate=2592000"
```

Das 7. Asset (`analytics.contextter.com/script.js`) ist Third-Party, liegt nicht in deiner Hand und ist mit `max-age=86400` + ETag korrekt gecacht. Der Crawler sollte fremde Origins hier ausnehmen.

---

### 2.3 Mehrdeutiger Anchor-Text „Übersicht" (sitewide)

**Gemeldet als:** Teil von `duplicate_internal_anchor_targets` (low, 252 URLs = jede Seite der Site).

Eigener Scan über 90 Live-Seiten bestätigt:

```
"Übersicht" → 2 Ziele
      90x  /fotografie.html
      90x  /leistungen.html
```

Im Footer stehen zwei Spalten („Fotografie" und „Weitere Dienstleistungen"), jede mit einem generischen `Übersicht`-Link. Für Screenreader per `aria-labelledby` der Spalte noch auflösbar, für Suchmaschinen aber zwei identische Ankertexte auf zwei verschiedene Seiten — auf jeder einzelnen Seite der Website. Zugleich ein **WCAG 2.4.4-Verstoß** (Link Purpose): identischer Linktext, verschiedene Ziele, dieselbe Seite.

**Fix** (`siteChromeContent.ts`): `Alle Fotografie-Bereiche` bzw. `Alle Leistungen`.

> Bei der ersten Fassung hätte ich `Fotografie Übersicht` gewählt — mein Scan zeigte rechtzeitig, dass dieser Ankertext bereits auf 78 Seiten für `/fotografie-duesseldorf.html` vergeben ist. Ich hätte eine neue Mehrdeutigkeit eingeführt statt eine zu beseitigen.

---

### 2.4 Doppelte Topic-Anchors auf den Hub-Seiten

**Gemeldet als:** ebenfalls `duplicate_internal_anchor_targets`.

Auf allen vier Hub-Seiten (`/fotografie.html`, `-nrw`, `-deutschland`, `-duesseldorf`) erschien derselbe Ankertext **zweimal auf derselben Seite** mit verschiedenen Zielen:

```
"Automobil" → /automobil-fotografie.html               (Hauptnavigation)
"Automobil" → /automobil-fotografie-duesseldorf.html   (Block "Düsseldorf")
```

Das ist Keyword-Kannibalisierung zwischen zwei konkurrierenden Seiten plus derselbe WCAG-Verstoß. Verschärfend: auf `/fotografie-nrw.html` und `/fotografie-deutschland.html` zeigte der zweite Block auf *Düsseldorf*-Seiten, obwohl der Seitenkontext NRW bzw. Deutschland ist.

**Fix** (`NativePhotographyPage.astro`): ortsqualifizierte Labels — `Automobil Düsseldorf` usw. Das Muster war im selben File bereits vorhanden: die NRW-Gruppe nutzte längst `Automobil NRW`. Nur die Düsseldorf-Gruppe war inkonsistent.

---

### 2.5 Fehlende Bilddimensionen (CLS)

**Gemeldet als:** `image_missing_dimensions` (low, 11 Assets). **Exakt korrekt** — meine Messung fand genau 11: 6 auf `/ueber-mich.html`, 5 auf `/portfolio/portfolio-auswahl-automobil`.

Echte Content-Bilder ohne `width`/`height` → Layout-Shift beim Nachladen. Pikant: das Media-Manifest **kennt** die Maße (`width: 1920, height: 1280`), die Renderer gaben sie nur nicht aus. Die statischen Fallback-Daten hatten Dimensionen, die CMS-Pfade nicht.

**Fix:** in `NativeAboutPage.astro` und `pages/portfolio/[slug].astro` die Maße über den vorhandenen `imageDimensions()`-Helper aus dem Media-Objekt ableiten, wenn das CMS-Item selbst keine mitbringt.

**Verifiziert:** beide Seiten jetzt 0 Bilder ohne Dimensionen.

---

### 2.6 Portfolio-Seite ohne Bild-SEO

**Gemeldet als:** Teil von `image_missing_alt` — als Regel falsch (siehe 3.3), hat hier aber ein echtes Problem freigelegt.

`/portfolio.html`: **58 Bilder, alle `alt=""`, kein einziges mit beschreibendem Text.** Bei einer Fotografen-Portfolio-Seite ist das relevant: die Bilder *sind* der Inhalt, und die Seite hat mit 148 Wörtern ohnehin wenig Text. Für Google Images war die Seite praktisch unsichtbar.

**Fix** (`NativePortfolioIndexPage.astro`): `alt={photo.caption || ''}` statt hartkodiertem `alt=""`. Die `caption` war bereits vorhanden und wurde als `data-caption` und `aria-label` genutzt — nur nicht als Alt-Text.

**Verifiziert:** 57 von 58 Bildern haben jetzt beschreibenden Alt-Text (das 58. ist der Lightbox-Platzhalter, dort ist `alt=""` korrekt).

> **Offen, weil Redaktionsarbeit:** Die Captions sind knapp („Portrait", „Detail", „Panorama"). Besser als leer, aber echtes Bild-SEO bräuchte Beschreibungen wie „Porsche 911 im Streiflicht, Düsseldorfer Hafen". Das ist eine CMS-Pflegeaufgabe, kein Code-Fix.

---

### 2.7 Nicht gefixt: Titel-/Description-Längen und doppelte H1

Diese Findings sind **korrekt, aber marginal** — ich habe sie bewusst nicht angefasst, weil sie redaktionelle Entscheidungen sind:

- **`title_too_long`** (9 URLs): gemessen 61–68 Zeichen bei Schwellwert 60. Google schneidet nach *Pixelbreite* (~580 px) ab, nicht nach Zeichenzahl. 61 Zeichen sind unkritisch.
- **`meta_description_too_long`** (43 URLs): 162–164 Zeichen bei Schwellwert 160. Google schreibt Descriptions ohnehin in der Mehrzahl der Fälle um.
- **`h1_duplicate`** (2 URLs): „Automobil Fotografie" als H1 auf `/automobil-fotografie.html` und `/portfolio/portfolio-auswahl-automobil`. Sachlich richtig, minimale Auswirkung.

Sag Bescheid, wenn ich die Titel/Descriptions trotzdem kürzen soll — es sind Content-Dateien, das ist schnell gemacht.

---

## 3. Die systematischen Crawler-Fehler

Acht Ursachen erklären praktisch alle 2.115 falschen bzw. überwiegend falschen Findings.

### 3.1 `preconnect`/`dns-prefetch` als ladbare Ressource behandelt

**Betrifft:** `broken_resource` (high, 100 Findings) — 100 % falsch.

```html
<link rel="preconnect" href="https://cms.matthiasramahi.de" crossorigin />
```

Der Crawler holte diese URL, bekam 401 und meldete „Broken resource, severity high". Ein `preconnect` ist ein **Verbindungs-Hint**: der Browser führt DNS + TCP + TLS aus und fordert die URL **nie** an. Der HTTP-Status des Origin-Roots ist per Definition irrelevant.

Verifiziert: `cms.matthiasramahi.de/` gibt 401 (Basic Auth auf dem Admin), `cms.matthiasramahi.de/uploads/...` gibt 200 — und genau von dort lädt die Seite ihre Hero-Bilder. Der Preconnect ist also nicht nur unschädlich, sondern **richtig und performance-relevant**. Der Report empfahl, ihn zu entfernen.

**Regel:** `rel` in (`preconnect`, `dns-prefetch`, `prefetch`, `prerender`, `me`, `alternate`) nie als Ressource abrufen. Bei `preconnect` ist ausschließlich die DNS-/TLS-Erreichbarkeit des Origins prüfbar, kein HTTP-Status.

---

### 3.2 `data:`-URIs in `srcset` werden am Komma zerlegt

**Betrifft:** `broken_image_resource` (high, 37) + `resource_content_type_mismatch` (low, 37) — 74 Findings, 100 % falsch.

Vergleich HTML gegen Report:

```
HTML real:      srcset="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
Report meldet:  https://matthiasramahi.de/R0lGODlhAQABAIAAAAAAAP/ywAAAAAAQABAAACAUwAOw==  → 404
```

Zwei unabhängige Bugs in einem String:

1. **Srcset-Parsing:** `srcset` wird naiv am Komma gesplittet. Eine `data:`-URI enthält aber legitim ein Komma (`base64,`). Der Parser zerlegte den Wert in `data:image/gif;base64` und `R0lGODlh…`, hielt Letzteres für eine relative URL und löste sie gegen den Origin auf.
2. **URL-Normalisierung:** Der Original-Base64 enthält `AAAAAP///ywAAA`, der Report `AAAAAP/ywAAA` — der Normalisierer kollabierte `///` zu `/` und **korrumpierte damit die Nutzdaten**. Dieser Bug trifft auch legitime Pfade.

Das geprüfte Markup ist korrekt und bewusst so gebaut: ein 3-Spalten-Hero, bei dem auf Mobil nur Spalte 1 ihr echtes Bild lädt und die dekorativen Spalten 0 und 2 ein transparentes 1×1-Pixel bekommen (`aria-hidden="true"`, `alt=""`). Eine saubere Bandbreiten-Optimierung — hier als High-Severity-Fehler gemeldet.

**Folgefehler:** Weil die erfundene URL eine 404-HTML-Seite lieferte, feuerte zusätzlich `resource_content_type_mismatch` („Content-Type text/html, erwartet image"). Das ist **tautologisch**: jede 404 liefert `text/html`, also meldet jedes fehlgeschlagene Bild automatisch auch einen Content-Type-Mismatch. Diese Regel darf nur auf 2xx-Antworten laufen.

---

### 3.3 `alt=""` wird als „fehlendes alt" gezählt

**Betrifft:** `image_resource_missing_alt` (1.238) + `image_missing_alt` (128) = **1.366 Findings, 29 % des gesamten Reports.**

Der Beweis ist eindeutig. Ich habe über alle geprüften Seiten Bilder **ohne `alt`-Attribut** von solchen **mit `alt=""`** getrennt:

| Seite | Report meldet | Tatsächlich |
|---|---|---|
| `/business-portrait-duesseldorf.html` | `imageCount: 13; missing: 4` | 13 Bilder, 0 ohne Attribut, **4× `alt=""`** |
| `/sportwagen-fotografie-dormagen.html` | `imageCount: 23; missing: 3` | 23 Bilder, 0 ohne Attribut, **3× `alt=""`** |
| `/blog-automotive-fotografie-duesseldorf.html` | `imageCount: 6; missing: 2` | 6 Bilder, 0 ohne Attribut, **2× `alt=""`** |
| `/ueber-mich.html` | `imageCount: 7; missing: 1` | 7 Bilder, 0 ohne Attribut, **1× `alt=""`** |
| `/blog.html` | `imageCount: 8; missing: 1` | 8 Bilder, 0 ohne Attribut, **1× `alt=""`** |

Über **alle** geprüften Seiten: **kein einziges Bild ohne `alt`-Attribut.** Die Korrelation mit der `alt=""`-Anzahl ist exakt.

`alt=""` ist die von HTML-Spec und WCAG (Technik H67) **vorgeschriebene** Kennzeichnung dekorativer Bilder. Ein leerer Alt-Text sagt dem Screenreader „überspring mich" — genau richtig für die `aria-hidden`-Hero-Spalten. Der Crawler bestraft hier die korrekte Implementierung und würde den Nutzer dazu bringen, die Barrierefreiheit aktiv zu verschlechtern.

**Regel:** `alt` fehlt ≠ `alt=""`. Nur ein fehlendes Attribut ist ein Fehler. Sinnvoller Zusatz-Check wäre stattdessen: *„Seite hat N Content-Bilder, aber 0 mit beschreibendem Alt-Text"* — genau der Check, der `/portfolio.html` (58/58 dekorativ) korrekt und ohne 1.365 Fehlalarme gefunden hätte.

---

### 3.4 `srcset`-Kandidaten und `<a href>`-Ziele werden als geladene Bilder bewertet

**Betrifft:** `large_image_resource` (medium, 48) — 6 einzigartige Assets, 0 davon zutreffend.

Aufschlüsselung der Evidence-Zeilen: 39× `element: link`, 3× `element: a`, 1× `element: img`.

- **`<a href="…webp">`** (3 Assets auf `/portfolio.html`): Lightbox-Klickziele. Ein Link-Ziel wird beim Seitenaufruf **nie** geladen. Die Empfehlung „compress, resize, or lazy-load the image" ist für ein `<a href>` sinnlos — es ist bereits maximal lazy.
- **`srcset`-Maximalkandidaten** (CMS-Assets): verifiziert am Live-HTML —

  ```
  srcset="…_DSC8015-760x950.webp   760w,
          …_DSC8015-1100x1375.webp 1100w,
          …_DSC8015-1920x2400.webp 1920w"   ← als "Large image resource" gemeldet
  ```

  Der Browser wählt **genau einen** Kandidaten nach Viewport und DPR. Der 1920w-Eintrag ist der Sinn von Responsive Images. Der Crawler lädt den größten Kandidaten und meldet ihn als zu groß — er bestraft damit die lehrbuchmäßig korrekte Implementierung.

**Regel:** Bildgewicht am *tatsächlich selektierten* Kandidaten für ein definiertes Viewport-Profil messen, nicht an allen Kandidaten. `<a href>`-Ziele gehören nicht in die Ressourcen-Gewichtsanalyse.

---

### 3.5 `aria-label` wird bei der Anchor-Text-Ermittlung ignoriert

**Betrifft:** `empty_internal_anchor_text` (medium, 2 URLs / 33 Links).

Der Report meldet 33 Links mit leerem Ankertext auf `/portfolio.html`. Das tatsächliche Markup:

```html
<a class="pf-photo" data-caption="Portrait" href="/assets/portfolio/_DSC9321-Enhanced-NR.webp"
   aria-label="Portrait">
```

Jeder dieser Links trägt ein `aria-label`. Der Accessible Name ist gesetzt — der Crawler wertet ihn nicht aus. (Mein eigener Analyzer, der `aria-label` berücksichtigt, meldete korrekt 0.)

Zweiter Fehler in derselben Regel: die Ziele sind `.webp`-**Dateien**, keine HTML-Seiten. Dateilinks gehören nicht in einen internen Link-Graph für SEO-Zwecke — sie übertragen kein PageRank an Seiten.

**Regel:** Accessible Name nach Spezifikation ermitteln (`aria-label` → `aria-labelledby` → Linktext → `alt` des enthaltenen Bildes → `title`). Nicht-HTML-Ziele aus dem Seiten-Linkgraph ausschließen.

---

### 3.6 `<nav>` innerhalb `<main>` wird als Boilerplate gewertet

**Betrifft:** `contextual_internal_inlinks_missing` (208) + `body_internal_links_missing` (198) + `weak_internal_inlinks` (9) = **415 Findings.**

Der Report behauptet für die Städteseiten `bodyInternalOutlinkCount: 0` — „keine kontextuellen internen Links im Body". Verifiziert am Markup von `/sportwagen-fotografie-dormagen.html`:

| Block (innerhalb `<main>`) | Links | Überschrift darüber |
|---|---:|---|
| `<nav aria-label="Verwandte Fotografie-Bereiche">` | 6 | „Weitere Fotografie-Bereiche Dormagen." |
| `<nav aria-label="Städte">` | 24 | „Sportwagen Fotografie vor Ort." |
| `<nav aria-label="Suchvarianten">` | 7 | „Sportwagen Fotografie Suchbegriffe." |

Das sind **37 interne Links im `<main>`**, jeder unter einer eigenen inhaltlichen H2. Der Crawler zählt sie als 0, weil sie in `<nav>`-Elementen liegen.

Das ist der problematischste Denkfehler im ganzen Regelwerk: **Er bestraft korrekte HTML5-Semantik.** Hätte der Entwickler `<div class="grid">` statt `<nav aria-label="Städte">` geschrieben, wären dieselben Links als Body-Links gezählt worden und 415 Findings verschwunden. Die Regel belohnt schlechtere Barrierefreiheit.

Zusätzlich: der Boilerplate-Verdacht lässt sich empirisch prüfen. Mein Vergleich zweier Städteseiten zeigt differenziert:

| Block | Über Seiten identisch? | Bewertung |
|---|---|---|
| „Verwandte Fotografie-Bereiche" | **nein** — Anker variieren („Automobilfotografie Dormagen" vs. „…Köln") | echt kontextuell |
| „Städte" | ja | echtes Boilerplate |
| „Suchvarianten" | ja | echtes Boilerplate |

**Regel:** Boilerplate über *Inhaltsvergleich zwischen Seiten* bestimmen (Shingling/Diffing), nicht über den Tagnamen. Ein Linkblock, der auf allen 190 Seiten identisch ist, ist Boilerplate — egal ob `<nav>` oder `<div>`. Ein Block, der pro Seite variiert, ist es nicht.

**Wahrer Kern:** Die Städteseiten haben tatsächlich 0 Links im Fließtext (`<p>`); der Blog-Artikel hat 3. Für einen 190-Seiten-Cluster ist „keine redaktionellen Inline-Links" eine legitime Beobachtung — aber als **eine Empfehlung**, nicht als 415 Findings unter drei Codes.

---

### 3.7 Externe Links ohne Browser-User-Agent geprüft

**Betrifft:** `broken_external_link` (low, 55) + `redirected_external_link` (info, 55) = 110 Findings, beide falsch.

**Google-Review-Link** — gemeldet als `targetLatestStatus: "failed"`:

```
ohne UA:        → accounts.google.com/v3/signin/...    (Google-Bot-Wall)
Browser-UA:     → google.com/maps/place/...   HTTP 200  (funktioniert einwandfrei)
```

**Instagram** — gemeldet mit `redirectCount: 1` auf die Login-Wall:

```
mein Test:      https://www.instagram.com/mathewspictures/   HTTP 200, kein Redirect
```

Beides sind Anti-Bot-Mechanismen der Zielseiten, keine defekten Links.

Besonders kritisch ist hier die **Empfehlung**: *„Where practical, update external links to their final HTTPS destination."* Befolgt man sie, ersetzt man den Instagram-Profillink durch eine Instagram-**Login-URL** und den Google-Bewertungslink durch eine Google-**Anmeldeseite**. Der Report empfiehlt hier aktiv, funktionierende Links zu zerstören.

**Regel:** Externe Ziele mit realistischem User-Agent prüfen, `HEAD`→`GET`-Fallback, mehrfach mit Backoff wiederholen. Bekannte Login-Wall-Domains (Instagram, Facebook, LinkedIn, X, Google-Property-Redirects) als „nicht botprüfbar" markieren statt als defekt. Redirect-Ziele **nie** zur Übernahme empfehlen, wenn das Ziel eine Auth-/Login-URL ist.

---

### 3.8 Weitere durchgängige Defekte

**`placement: body` für alles im `<head>`** — viermal unabhängig bestätigt. Stylesheets, Favicons, `preconnect`-Hints und das Analytics-Script werden alle als `placement: body` gemeldet. Gemessen: `/ueber-mich.html` hat **9 Stylesheets im Head und 0 im Body**. Das Feld scheint konstant „body" zu liefern und ist damit wertlos — es ist aber genau das Feld, das ein Nutzer zur Priorisierung heranziehen würde.

**`missingAlt true` auf jedem Issue-Typ** — dieses Feld erscheint in der Evidence von `broken_resource` (ein `<link>`-Element!), `static_resource_cache_policy_missing` (Stylesheets), `broken_external_link`, `thin_content` und `render_blocking_resource`. Ein Alt-Text-Feld auf einem Stylesheet-Finding ist offensichtlich ein Leck aus einem gemeinsamen Evidence-Objekt.

**Boilerplate-Issue-Summary** — alle Graph-Findings tragen denselben Text: *„Affected pages are deeper than click depth 5 and have fewer than 3 contextual body inlinks."* Er steht auch über `duplicate_internal_anchor_targets` und `empty_internal_anchor_text`, wo er inhaltlich keinen Sinn ergibt. Die Evidence widerspricht ihm sogar direkt: dort steht `depth: 1` und `internalInlinkCount: 29`, während die Summary „tiefer als Klicktiefe 5" und „weniger als 3 Inlinks" behauptet.

**Generische Fix-Empfehlungen** — der erste Empfehlungssatz ist bei den meisten Codes identisch („Open affected URLs from the inventory, inspect source evidence and rerun after fixing the affected template"). Das ist keine Empfehlung, sondern eine Aufforderung, die Arbeit selbst zu machen. Teilweise passen sie auch nicht zum Code: unter `image_missing_dimensions` steht „Inspect the rendered main-content extraction".

**Zähl-Inflation** — durchgängig werden *Vorkommen* als *Assets* ausgewiesen:

| Code | Meldung | Tatsächlich einzigartig |
|---|---|---|
| `static_resource_cache_policy_missing` | 700 assets | **7** |
| `render_blocking_resource` | 1.516 assets | **32** |
| `broken_resource` | 100 assets | **1** |
| `broken_image_resource` | 37 assets | **1** |
| `duplicate_internal_anchor_targets` | 252 urls | **~2 Ursachen** |

Der Report führt „Affected count from run: 100 assets" und direkt darunter „Loaded affected assets in this copy: 1" — die Datenstruktur *kennt* die Unterscheidung, die Beschriftung nutzt sie nur nicht.

---

## 4. Was der Crawler nicht geprüft hat

Zur fairen Einordnung habe ich unabhängig geprüft, was ein ausgereiftes Audit zusätzlich abdecken sollte. Die Website steht dabei sehr gut da — was zugleich zeigt, dass diese Checks fehlen und nicht etwa stillschweigend bestanden wurden:

Über 120 Live-Seiten gemessen:

```
Seiten ohne JSON-LD:          0
Seiten ohne og:title:         0
Doppelte <title>:             0
Doppelte meta description:    0
Mehrfach genutzte canonical:  0
www → non-www:                307 ✓
http → https:                 308 ✓
404-Handling:                 404 ✓
robots.txt + Sitemap-Referenz: ✓
```

**Ein echter Fund, den das Audit übersehen hat:** **111 von 120 Seiten verlinken sich selbst** im `<main>`. Die Städte-Grids enthalten die jeweils aktuelle Stadt — die Köln-Seite verlinkt „Köln" auf sich selbst. Selbstreferenzierende Links sind ein klassischer Audit-Check (verwässern interne Linksignale, verwirren Nutzer). Er fehlt komplett.

Weitere fehlende Checks: Canonical-Konsistenz und -Ketten, Duplicate Title/Description clusterweit, hreflang-Validierung, strukturierte Daten gegen Schema.org, Redirect-Ketten intern, Mixed Content, HTTP/2-Nutzung, Sitemap-`lastmod`-Plausibilität, Paginierungs-Semantik.

---

## 5. Bewertung des Systems

**Was gut funktioniert**

- **Erhebung und Abdeckung.** 252 Sitemap-URLs vollständig erfasst, Ressourcen inklusive Third-Party verfolgt, Header-Details (ETag, `lastModified`, `contentEncoding`, `responseTimeMs`) sauber gespeichert. Die Rohdaten-Ebene ist gut.
- **Der Link-Graph ist echt.** `internal_inlinks_missing` hat einen realen Orphan gefunden, den weder die Sitemap-Prüfung noch der Build bemerkt hätten — und dessen Ursache tief in einer Featured-Slot-Logik lag. Das ist genau der Mehrwert, den ein Site-Audit liefern soll.
- **Die Anchor-Analyse hat echte Substanz.** Der „Übersicht"-Konflikt und die doppelten Topic-Anchors sind reale Probleme, die ich manuell kaum gefunden hätte.
- **Evidence ist nachvollziehbar.** Dass ich jeden einzelnen Fund verifizieren konnte, liegt daran, dass Source-URL, Ziel-URL, Element, Attribut und HTTP-Details mitgeliefert werden. Viele kommerzielle Tools zeigen weniger.
- **Messgenauigkeit dort, wo die Regel stimmt.** `image_missing_dimensions` meldete 11 — ich fand exakt 11. Die Alt-Zählungen stimmten auf jeder Seite exakt mit meinen `alt=""`-Zahlen überein. Der Crawler misst präzise; er interpretiert nur falsch.

**Was das System begrenzt**

Der Kern: **die Regeln kennen die Web-Plattform nicht gut genug.** Sechs der acht Fehlerursachen sind kein Programmierfehler, sondern eine fehlende Kenntnis darüber, was ein Standard bedeutet — `alt=""`, `preconnect`, `srcset`, `data:`, `aria-label`, `<nav>`. Das Muster ist bemerkenswert einheitlich: **je korrekter eine Seite gebaut ist, desto mehr Findings erzeugt sie.** Eine Seite mit `alt="foto"` überall, ohne `srcset`, ohne `preconnect` und mit `<div>` statt `<nav>` hätte einen deutlich saubereren Report bekommen als diese hier.

Dazu kommt die fehlende Aggregation. Der Report zählt Vorkommen statt Ursachen, splittet eine Ursache über mehrere Codes (der `data:`-Bug erzeugt zwei Codes; der Orphan wird doppelt gezählt; `thin_content` und `low_content_density` messen dasselbe an denselben zwei Seiten) und liefert generische Empfehlungstexte. Das Ergebnis ist ein Report, dessen Signal-Rausch-Verhältnis den Nutzer eher abschreckt als führt.

**Fairerweise:** Die Website ist ein hartes Testobjekt. Sie nutzt bewusst fortgeschrittene Techniken (Art-Direction per transparentem Pixel, dreistufige `srcset`, semantische `<nav>`-Grids, `aria-label`-Lightboxen, Cross-Origin-CMS-Medien). Ein Crawler, der auf Standard-WordPress kalibriert wurde, läuft hier in jede Falle. Das spricht für die Website — und zeigt, gegen welche Art von Seiten das Regelwerk noch nicht getestet wurde.

**Ehrliche Gesamtnote:** Erhebung **stark**, Regelwerk **schwach**, Aufbereitung **schwach**. Das ist die gute Nachricht — die Erhebung ist der schwer zu bauende Teil. Die acht Regelkorrekturen aus Abschnitt 3 sind überschaubarer Aufwand und würden diesen Report von 4.654 auf grob 30–40 Findings bringen, von denen fast jedes zuträfe.

---

## 6. Priorisierte Empfehlungen für den Site-Audit-Crawler

**P0 — beseitigen 2.100+ Fehlalarme, jeweils kleine Änderungen**

1. `alt=""` nicht als fehlend werten. Stattdessen neuer Check „Seite ohne beschreibenden Alt-Text bei N Content-Bildern". *(−1.366)*
2. `srcset` spec-konform parsen (`data:`-URIs überspringen, nicht naiv am Komma splitten) und die `///`-Kollabierung im URL-Normalisierer beheben. *(−74)*
3. `rel="preconnect|dns-prefetch|prefetch|prerender"` nicht abrufen. *(−100)*
4. `aria-label`/`aria-labelledby` in die Accessible-Name-Ermittlung aufnehmen; Nicht-HTML-Ziele aus dem Seiten-Linkgraph nehmen. *(−2 URLs / 33 Links)*
5. Externe Links mit Browser-UA prüfen; Login-Wall-Domains als „nicht prüfbar" statt „defekt" führen; nie auf Auth-URLs als Redirect-Ziel verweisen. *(−110)*
6. `resource_content_type_mismatch` nur auf 2xx-Antworten auswerten. *(−37)*

**P1 — Klassifikationsqualität**

7. Boilerplate über Seitenvergleich statt Tagname bestimmen. `<nav>` innerhalb `<main>` mit variierendem Inhalt ist kontextuell. *(−415, ersetzt durch 1 Empfehlung)*
8. Bildgewicht am selektierten `srcset`-Kandidaten pro Viewport-Profil messen; `<a href>`-Ziele ausschließen. *(−48)*
9. `placement` korrekt aus der DOM-Position ableiten (`head`/`header`/`nav`/`main`/`footer`) — aktuell konstant „body".
10. `missingAlt` aus dem gemeinsamen Evidence-Objekt entfernen, wo es nicht anwendbar ist.

**P2 — Aufbereitung**

11. Nach **Ursache** gruppieren, nicht nach Vorkommen: „6 Assets ohne Cache-Policy, betrifft 100 Seiten" statt „700 Assets".
12. Eine Ursache = ein Finding. `broken_image_resource` + `content_type_mismatch` zusammenführen; `internal_inlinks_missing` + `orphan_sitemap_url` zusammenführen; `thin_content` + `low_content_density` zusammenführen.
13. Issue-Summary pro Code schreiben statt Graph-Boilerplate wiederzuverwenden — besonders dort, wo die Evidence der Summary widerspricht.
14. Empfehlungen konkret und code-nah formulieren. „Open affected URLs and inspect" ist keine Empfehlung.
15. Schwellwerte begründen und als „marginal" kennzeichnen: 61 Zeichen Titel und 164 Zeichen Description sollten nicht wie echte Defekte aussehen. Titel besser in Pixelbreite messen; HTML-Entities vor der Längenmessung dekodieren (`&amp;` zählt aktuell als 5 Zeichen statt 1).

**P3 — fehlende Checks**

16. Selbstreferenzierende interne Links (hier: 111 von 120 Seiten — echter Fund, nicht gemeldet).
17. Canonical-Konsistenz und -Ketten, Duplicate Title/Description clusterweit, hreflang-Validierung, strukturierte Daten gegen Schema.org, interne Redirect-Ketten, Mixed Content.

---

## 7. Geänderte Dateien

Nichts committet oder gepusht — alles liegt als Working-Tree-Änderung bereit.

| Datei | Änderung |
|---|---|
| `vercel.json` | Cache-Header für Favicon-Familie und `site.webmanifest` |
| `apps/web/src/data/siteChromeContent.ts` | Footer: `Übersicht` → `Alle Fotografie-Bereiche` / `Alle Leistungen` |
| `apps/web/src/components/native/NativeJournalIndexPage.astro` | Featured-Slot nimmt den kuratierten Beitrag; behebt den Orphan |
| `apps/web/src/components/native/NativePhotographyPage.astro` | Düsseldorf-Gruppe: ortsqualifizierte Anker |
| `apps/web/src/components/native/NativeAboutPage.astro` | Bilddimensionen aus dem Media-Objekt ableiten |
| `apps/web/src/pages/portfolio/[slug].astro` | Bilddimensionen für Related-Cards und Perspektiv-Figure |
| `apps/web/src/components/native/NativePortfolioIndexPage.astro` | Alt-Text aus `caption` statt hartkodiertem `alt=""` |

**Validierung:** `corepack pnpm web:build` läuft grün. Alle Änderungen gegen den lokalen Preview-Server verifiziert:

| Prüfung | Vorher | Nachher |
|---|---|---|
| Artikel-Links auf `/blog.html` | 6 | **7** |
| Bilder mit echtem Alt auf `/portfolio.html` | 0 von 58 | **57 von 58** |
| Bilder ohne Dimensionen (`ueber-mich`) | 6 | **0** |
| Bilder ohne Dimensionen (Portfolio-Projekt) | 5 | **0** |
| Mehrdeutiges `Übersicht` im Footer | 2 Ziele | **beseitigt** |
| Doppelte Topic-Anchors pro Hub-Seite | 6 Paare | **beseitigt** |

Regressionsprüfung über 10 Seiten: alle HTTP 200, keine Bilder ohne `alt`-Attribut, keine Bilder ohne Dimensionen, Featured-Block inhaltlich unverändert.

**Noch offen:**
- Portfolio-Captions redaktionell anreichern (CMS-Pflege, kein Code)
- Optional: 9 Titel auf ≤60 Zeichen und 43 Descriptions auf ≤160 Zeichen kürzen
- Optional: Selbstlinks aus den Städte-Grids entfernen

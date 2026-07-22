# Site-Audit-Analyse V2 — Crawler-Vergleich

**Vergleich:** Run `mh8azatar3f07fqj5aygg6v39h8ax800` (V1) gegen `mh82c3cdzkda9cb1dsctjf4zkn8aw9np` (V2), beide Jul 20.
**Kontrollbedingung:** Die Website ist zwischen beiden Runs **nachweislich unverändert** — kein Commit, kein Deploy, meine V1-Fixes liegen weiterhin uncommitted im Working Tree. Damit ist jede Differenz zwischen V1 und V2 **ausschließlich** dem Crawler zuzuschreiben. Sauberes A/B mit fixiertem Testobjekt.

**Ergebnis:** 7 von 17 Empfehlungen umgesetzt, davon 2 mit Fehlern. Die 4 größten False-Positive-Quellen sind unverändert. 1 neuer Bug. Netto: die **Aufbereitung** ist deutlich besser, das **Regelwerk** fast unverändert.

---

## 0. Verifikation der Kontrollbedingung

Bevor irgendein Vergleich Sinn ergibt — die Seite muss identisch sein. Geprüft:

```
git log                          unverändert (5020647, keine neuen Commits)
git status                       meine 7 Dateien weiterhin " M", nicht committet

Live-Gegenprobe:
  Footer "Übersicht"             1×  (mein Fix nicht live)
  Footer "Alle Leistungen"       0×  (mein Fix nicht live)
  favicon.ico Cache-Control      public, max-age=0, must-revalidate  (unverändert)
  Artikel-Links auf /blog.html   6   (Orphan weiterhin vorhanden)
  Portfolio-Bilder mit echtem alt 0  (unverändert)
```

Bestätigt: identisches Testobjekt. Alle Zahlen unten messen den Crawler, nicht die Seite.

---

## 1. Gesamtbild

| | V1 | V2 | Δ |
|---|---:|---:|---:|
| Findings laut Header | 4.654 | 4.418 | −236 (−5 %) |
| Issue-Codes | 23 | 21 | −2 |
| Report-Größe | 932 KB / 3.166 Zeilen | 549 KB / 2.695 Zeilen | −41 % |
| Gelistete Einzelposten (Assets/URLs) | 1.097 | 897 | −200 |

Die wichtigste strukturelle Änderung ist ein neues Feld im Blockkopf:

```
V1:  - Affected count from run: 100 assets
V2:  - Unique affected assets from run: 1
```

Genau meine Empfehlung P2/#11 („nach Ursache gruppieren, nicht nach Vorkommen"). Der Report ist dadurch erheblich lesbarer — aus „100 assets" wird sichtbar „1 Asset auf 100 Seiten".

**Aber:** Die zugrundeliegende Finding-Menge ist praktisch unverändert (−5 %). Das Rauschen wurde **zusammengefasst, nicht beseitigt**. Wer die Blocküberschriften liest, sieht ein aufgeräumtes Bild; wer die Findings verarbeitet, bekommt weiterhin ~4.400 Datensätze, von denen die Mehrzahl falsch ist.

---

## 2. Was umgesetzt wurde

### 2.1 Die gefährliche Empfehlung ist weg — sauber gelöst

Das war der kritischste Punkt aus V1. Der alte Text hätte funktionierende Links zerstört:

```
V1 (entfernt):
  "Where practical, update external links to their final HTTPS destination
   to reduce latency and avoid stale outbound references."

V2 (neu):
  "Only update the link when the final URL is a public destination for the
   same content. Never replace a working public link with a login, sign-in,
   challenge, or account-authentication URL."
```

Das ist nicht nur die Entfernung eines schädlichen Satzes, sondern ein explizit formulierter Schutz gegen genau den Fehlerfall (Instagram-Login-Wall, Google-Signin-Redirect). Gut gelöst.

Einschränkung: Die **Erkennung** ist unverändert. `broken_external_link` meldet weiterhin 55 URLs mit `targetLatestStatus: "failed"` für den Google-Review-Link, und `redirected_external_link` weiterhin 55 für Instagram. Live-Gegenprobe mit Browser-User-Agent, direkt eben:

```
g.page/r/CX0tbKvX5WvpEBM/review   →  HTTP 200, google.com/maps/place/…
instagram.com/mathewspictures/    →  HTTP 200, kein Redirect
```

Beide Links funktionieren. Der Schaden ist jetzt begrenzt, weil die Empfehlung warnt — aber 110 Fehlalarme bleiben.

### 2.2 `resource_content_type_mismatch` entfernt

V1: 37 Findings, allesamt tautologisch (jede 404 liefert `text/html`, also meldete jedes fehlgeschlagene Bild automatisch auch einen Content-Type-Mismatch). In V2 existiert der Code nicht mehr. Meine P0-Empfehlung #6, korrekt umgesetzt.

### 2.3 `<a href>`-Ziele fliegen aus der Bildgewichtsanalyse — **und ich lag in V1 teilweise falsch**

`large_image_resource`: 6 → 3 einzigartige Assets. Die entfernten 3 waren exakt die Lightbox-Klickziele auf `/portfolio.html` (`<a href="…webp">`), die beim Seitenaufruf nie geladen werden. Meine P1-Empfehlung #8, umgesetzt.

**Korrektur meiner V1-Analyse:** Ich hatte `large_image_resource` als „100 % False Positive" eingestuft. Das war zu pauschal. Nachgeprüft:

| Asset | Größe | Status |
|---|---:|---|
| `_DSC2321-2560x1707.webp` | 492 KB | **`<link rel="preload" as="image">`** auf `/automotive-fotografie-duesseldorf.html` |
| `20250607-DSC04495-1920x2560.webp` | 502 KB | **`<link rel="preload" as="image">`** auf `/landschaftsfotografie.html` |
| `_DSC8015-1920x2400.webp` | 556 KB | nur srcset-Kandidat auf `/` |

Das Preload-Markup ist art-directed:

```html
<link rel="preload" as="image" href="…_DSC2321-760x507.webp"   media="(max-width: 900px)" fetchpriority="high">
<link rel="preload" as="image" href="…_DSC2321-2560x1707.webp" media="(min-width: 901px)" fetchpriority="high">
```

Auf Desktop wird die 492-KB-Datei also **eager mit hoher Priorität geladen** — das ist das LCP-Bild. Der Fund ist berechtigt. In V1 hatte ich nur die Homepage geprüft (dort war das gemeldete Asset tatsächlich nur ein srcset-Kandidat) und daraus zu breit verallgemeinert.

`large_image_resource` ist damit von **0/6 auf 2/3 korrekt** gestiegen — die deutlichste inhaltliche Verbesserung im ganzen Vergleich.

### 2.4 Kontextuelle Inlinks: von 208 auf 14

`contextual_internal_inlinks_missing` meldete in V1 208 URLs, in V2 nur noch 14. Die neue Liste ist inhaltlich sinnvoll:

```
6× /portfolio/portfolio-auswahl-*        (Projektseiten, nur aus Grids verlinkt)
3× /blog-*                               (Journal-Artikel)
1× /impressum.html                       (252 Inlinks, alle placement:"footer" — korrekt!)
4× diverse (fotografie-deutschland, keyword-datenbank-seo, sammlerfahrzeug-, youngtimer-)
```

Die ~190 Städte-Cluster-Seiten sind verschwunden. Der Crawler bewertet die `<nav>`-Grids im `<main>` jetzt also als kontextuelle Inlinks — genau meine P1-Empfehlung #7. Und `/impressum.html` mit 252 reinen Footer-Inlinks korrekt zu erkennen, ist ein gutes Zeichen: der Graph-Analyzer klassifiziert Platzierungen inzwischen differenziert.

### 2.5 Doppelter Code zusammengeführt

`internal_inlinks_missing` (V1: 1 URL) ist entfallen; der verwaiste Artikel wird jetzt nur noch unter `orphan_sitemap_url` geführt:

```
- https://matthiasramahi.de/blog-portraits-ohne-generische-posen.html
  discoverySource: sitemap_index; inSitemap: true; depth: 1; httpStatus: 200
```

Der Fund bleibt erhalten, die Doppelzählung ist weg. Meine P2-Empfehlung #12, teilweise umgesetzt — `thin_content` und `low_content_density` melden weiterhin dieselben zwei Seiten unter zwei Codes.

### 2.6 HTML-Entities werden vor der Längenmessung dekodiert

Meine P2-Empfehlung #15. Nachgerechnet:

| Titel | V1 (roh) | V2 | Korrekt dekodiert |
|---|---:|---:|---:|
| `Fotoshooting Gutschein Düsseldorf – Portrait, Paar & Fahrzeug` | 65 | **61** | 61 ✓ |
| `Landschaftsfotografie Print kaufen — Fine Art, NRW & Deutschland` | 68 | **64** | 64 ✓ |
| `Motorsport & Sportwagen Fotografie Düsseldorf \| Matthias Ramahi` | 67 | **63** | 63 ✓ |

Exakt richtig. Zusätzlich enthält die Evidence jetzt den **Titeltext selbst** (`length: 62; title: …`) — eine Verbesserung, die ich nicht vorgeschlagen hatte und die die Findings sofort beurteilbar macht.

### 2.7 Severity korrigiert

`static_resource_cache_policy_missing`: medium → low. Angemessen für Favicon-Caching.

---

## 3. Der neue Bug: „Unique" ist kleiner als „Loaded"

Die neu eingeführte Unique-Zählung ist in **4 von 21 Blöcken nachweislich falsch**:

| Code | Unique laut Header | Loaded | Tatsächlich gelistete URLs |
|---|---:|---:|---:|
| `static_resource_cache_policy_missing` | **3** | 7 | **7** |
| `render_blocking_resource` | **15** | 32 | **32** |
| `image_resource_missing_alt` | **22** | 71 | **71** |
| `duplicate_internal_anchor_targets` | **250** | 252 | **252** |

Eine geladene Teilmenge kann die Gesamtmenge nicht übersteigen — `unique < loaded` ist logisch unmöglich. Und die Listen enthalten nachweislich mehr verschiedene URLs, als der Header behauptet.

Beim Cache-Block sind die 7 gelisteten Assets eindeutig verschieden:

```
analytics.contextter.com/script.js, apple-touch-icon.png, favicon-16x16.png,
favicon-32x32.png, favicon.ico, favicon.svg, site.webmanifest
```

Header sagt: 3.

Bei `render_blocking_resource` sind es 32 verschiedene CSS-Dateien (`site-chrome.css`, `native-home.css`, `native-about.css`, 4× `/_astro/*.css` …) — es existiert keine Deduplizierung, die daraus 15 macht. Header sagt: 15.

**Warum das ernst ist:** Die Unique-Zahl ist genau die Kennzahl, nach der ein Nutzer künftig priorisiert. Sie ist jetzt die prominenteste Zahl im Block — und sie **untertreibt systematisch**. Beim Cache-Block verschweigt sie 4 von 7 real betroffenen Assets. Ein Nutzer, der „3" liest und drei Favicons fixt, lässt die übrigen offen und hält das Thema für erledigt.

Eine falsche kleine Zahl ist schlechter als eine richtige große: Sie erzeugt falsche Sicherheit statt sichtbaren Handlungsbedarf.

---

## 4. Was unverändert blieb

Die vier größten False-Positive-Quellen aus V1 sind vollständig erhalten.

### 4.1 `alt=""` gilt weiterhin als „fehlendes alt" — die größte Einzelquelle

`image_missing_alt`: 128 → 128. `image_resource_missing_alt`: 71 gelistet. Die Evidence ist Zeichen für Zeichen dieselbe:

```
imageCount: 58; imagesMissingAltCount: 58     ← /portfolio.html
imageCount: 23; imagesMissingAltCount: 3
imageCount:  6; imagesMissingAltCount: 2
```

In V1 hatte ich für jede dieser Seiten nachgewiesen: **kein einziges Bild ohne `alt`-Attribut**; die gemeldete Zahl entspricht exakt der Anzahl der `alt=""`. Das ist die von HTML-Spec und WCAG (H67) vorgeschriebene Kennzeichnung dekorativer Bilder. Der Crawler bestraft weiterhin die korrekte Implementierung und würde den Nutzer dazu bringen, die Barrierefreiheit aktiv zu verschlechtern.

Das war meine **P0-Empfehlung #1** und mit ~150 gelisteten Posten die mit Abstand wirksamste Einzelkorrektur. Nicht umgesetzt.

### 4.2 `data:`-URI-Parsing — Nutzdaten werden weiterhin korrumpiert

`broken_image_resource`: 1 → 1, Evidence identisch:

```
HTML real:      srcset="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
V1 meldet:      https://matthiasramahi.de/R0lGODlhAQABAIAAAAAAAP/ywAAAAAAQABAAACAUwAOw==
V2 meldet:      https://matthiasramahi.de/R0lGODlhAQABAIAAAAAAAP/ywAAAAAAQABAAACAUwAOw==   ← identisch
```

Beide Teilbugs bestehen fort: das naive Splitten des `srcset` am Komma (`base64,` ist ein legitimes Komma innerhalb einer `data:`-URI) und das Kollabieren von `///` zu `/` im URL-Normalisierer. Letzteres ist der gefährlichere von beiden, weil er auch legitime Pfade beschädigen kann.

Bemerkenswert: Der **Folgefehler** wurde gefixt (`resource_content_type_mismatch` entfernt), die **Ursache** nicht. Das Symptom ist weg, die Krankheit nicht.

### 4.3 `preconnect` wird weiterhin als ladbare Ressource behandelt

`broken_resource`: 1 → 1, weiterhin **Severity high**, Evidence identisch:

```
resourceUrl: https://cms.matthiasramahi.de/; resourceType: other;
element: link; attribute: href; placement: body; httpStatus: 401
```

Das ist `<link rel="preconnect">` im `<head>`. Der Browser führt DNS + TCP + TLS aus und fordert die URL nie an. Der 401 des Origin-Roots ist per Definition irrelevant — und der Preconnect ist hier sogar performance-relevant richtig, weil die Hero-Bilder von diesem Origin kommen.

Weiterhin die einzige High-Severity-Meldung im Report, und weiterhin falsch. Ein Nutzer, der nach Severity priorisiert, beginnt mit dem einzigen Finding, das er nicht anfassen darf.

### 4.4 `aria-label` wird weiterhin ignoriert

`empty_internal_anchor_text`: 2 → 2, dieselben 33 Links auf `/portfolio.html`. Das Markup hat unverändert:

```html
<a class="pf-photo" href="/assets/portfolio/_DSC9321-Enhanced-NR.webp" aria-label="Portrait">
```

Beide Teilprobleme bestehen: der Accessible Name aus `aria-label` wird nicht ausgewertet, und `.webp`-Dateilinks werden weiterhin als interne Seitenlinks gezählt.

### 4.5 `placement` für `<head>`-Ressourcen — jetzt exakt diagnostizierbar

Verteilung in V2:

```
placement: body      1087×
placement: header       1×
```

Aufgeschlüsselt nach Ressourcentyp — **alle** im `<head>`, alle als „body" gemeldet:

```
image    -> body   582×     (Favicons, Preloads)
script   -> body   100×     (Analytics-Script)
other    -> body   100×     (preconnect / dns-prefetch)
manifest -> body   100×     (<link rel="manifest">)
```

Ein `<link rel="manifest">` steht zweifelsfrei im `<head>`. Live-Gegenprobe für `/ueber-mich.html`: Stylesheets, `favicon.ico` und `preconnect` liegen alle vor `</head>`.

Die eine `header`-Meldung ist aufschlussreich: sie betrifft ein `<img>` **innerhalb eines `<header>`-Elements**. Der Klassifizierer kennt also `header` als Region — ihm fehlt schlicht der Fall `head`. Alles aus dem Dokumentkopf fällt auf den Default „body" durch. Das ist eine Ein-Zeilen-Korrektur.

### 4.6 `missingAlt`-Leak — unverändert

V1: 16 Codes tragen `- missingAlt true` in der Evidence. V2: 15 Codes (der Rückgang um 1 entspricht exakt dem entfernten Code). Weiterhin darunter:

```
title_too_long, meta_description_too_long, h1_duplicate, low_content_density,
thin_content, broken_external_link, redirected_external_link,
render_blocking_resource, static_resource_cache_policy_missing, broken_resource
```

Ein Alt-Text-Feld auf einem Titellängen-Finding. Das Leck aus dem gemeinsamen Evidence-Objekt besteht fort.

### 4.7 `body_internal_links_missing` — hier wird es ernst

197 URLs (V1: 198), also praktisch unverändert. Und hier liegt der schwerwiegendste inhaltliche Befund des Vergleichs.

Verteilung der beiden Kennzahlen über den **gesamten** Report:

```
bodyInternalOutlinkCount: 0    →  185× vorhanden, 185× null
bodyInternalInlinkCount:  0    →    8× vorhanden,   8× null
```

**Kein einziger Wert über null, nirgends im Report.**

Gegenprobe an der Live-Seite. Ich habe interne Links im `<main>` gezählt und dabei getrennt, ob sie in einem `<nav>` liegen:

| Seite | Links im `<main>` | davon in `<nav>` | **außerhalb `<nav>`** | Report sagt |
|---|---:|---:|---:|---|
| `/` | 22 | **0** | **22** | `bodyInternalOutlinkCount: 0` |
| `/automobil-fotografie-dormagen.html` | 45 | 39 | **6** | `bodyInternalOutlinkCount: 0` |
| `/sportwagen-fotografie-koeln.html` | 42 | 37 | **5** | `bodyInternalOutlinkCount: 0` |

Die Startseite hat 22 interne Links im `<main>`, **keinen einzigen davon in einem `<nav>`** — darunter „Arbeiten ansehen → /portfolio.html", „Mehr über mich → /ueber-mich.html", „Automobil Bereich ansehen → /automobil-fotografie-duesseldorf.html". Gemeldet als null.

Damit ist die naheliegende Erklärung widerlegt: Es ist **nicht** die `<nav>`-Fehlklassifikation aus V1. Ich habe auch die Alternativhypothese getestet, „body" meine nur Links im Fließtext (`<p>`) — sie erklärt 4 von 8 Stichproben und scheitert an den übrigen 4 (`/leistungen.html`, `/ueber-mich.html`, `/fotografie.html`, `/blog-oldtimer-wertobjekt.html` haben 0 Links in `<p>`, werden aber **nicht** gemeldet).

Das Feld ist konstant null. `body_internal_links_missing` meldet damit **197 von 252 Seiten — 78 % der Website —** auf Basis einer Kennzahl, die nie berechnet wird.

**Und daraus folgt ein Widerspruch innerhalb desselben Reports:** `contextual_internal_inlinks_missing` wurde korrigiert und erkennt jetzt, dass die Städteseiten sehr wohl kontextuelle **Inlinks** erhalten (sie sind aus der Liste verschwunden). Diese Inlinks können nur aus den Grids im `<main>` der Geschwisterseiten stammen. Dieselben Geschwisterseiten werden gleichzeitig als „hat keine kontextuellen **Outlinks** im Body" gemeldet. Ein Link kann nicht am Ziel als kontextuell zählen und an der Quelle nicht existieren.

Der Inlink-Pfad wurde repariert, der Outlink-Pfad nicht — die beiden Hälften derselben Analyse widersprechen sich jetzt.

### 4.8 Weiteres Unverändertes

- **Boilerplate-Issue-Summary:** 5 Blöcke (V1: 6) tragen weiterhin „Affected pages are deeper than click depth 5 and have fewer than 3 contextual body inlinks", auch dort, wo die Evidence direkt widerspricht (`depth: 1`, `internalInlinkCount: 252`).
- **`duplicate_internal_anchor_targets`:** 252 → 250 URLs, Struktur unverändert. Es wird weiterhin praktisch jede Seite der Website gelistet, statt die ~2 tatsächlich mehrdeutigen Ankertexte zu benennen. Der echte Befund („Übersicht" → 2 Ziele; Topic-Anker doppelt auf 4 Hub-Seiten) bleibt in 250 Zeilen begraben.
- **Titel-Schwellwert:** weiterhin Zeichenzahl statt Pixelbreite, weiterhin keine Kennzeichnung als „marginal" bei 61 von 60 Zeichen.
- **Fehlende Checks:** unverändert keine Prüfung auf Selbstverlinkung (real: 111 von 120 Seiten), Canonical-Ketten, hreflang-Validierung, strukturierte Daten, interne Redirect-Ketten.

---

## 5. Bilanz gegen meine 17 Empfehlungen

| # | Empfehlung | Prio | Status |
|---|---|---|---|
| 1 | `alt=""` nicht als fehlend werten | P0 | **offen** |
| 2 | `srcset`/`data:`-Parsing + `///`-Kollaps | P0 | **offen** |
| 3 | `preconnect`/`dns-prefetch` nicht abrufen | P0 | **offen** |
| 4 | `aria-label` als Accessible Name | P0 | **offen** |
| 5 | Externe Links mit Browser-UA | P0 | teilweise — Empfehlungstext ✅, Erkennung offen |
| 6 | Content-Type nur auf 2xx | P0 | **erledigt** |
| 7 | Boilerplate per Seitenvergleich | P1 | teilweise — Inlinks ✅, Outlinks offen (widersprüchlich) |
| 8 | Bildgewicht am selektierten Kandidaten | P1 | **erledigt** |
| 9 | `placement` korrekt ableiten | P1 | **offen** |
| 10 | `missingAlt`-Leak entfernen | P1 | **offen** |
| 11 | Nach Ursache statt Vorkommen gruppieren | P2 | erledigt, **aber fehlerhaft** |
| 12 | Eine Ursache = ein Finding | P2 | teilweise — 1 von 3 Merges |
| 13 | Issue-Summary pro Code | P2 | **offen** |
| 14 | Konkrete Empfehlungen | P2 | teilweise — 1 Text verbessert |
| 15 | Schwellwerte/Entities | P2 | teilweise — Entities ✅, Pixelbreite offen |
| 16 | Selbstverlinkungs-Check | P3 | **offen** |
| 17 | Canonical/hreflang/Schema-Checks | P3 | **offen** |

**4 vollständig, 5 teilweise, 8 offen.** Auffällig: von 6 P0-Punkten ist genau einer erledigt — die Arbeit floss überwiegend in P2 (Aufbereitung), während die höchstpriorisierten Regelkorrekturen liegen blieben.

---

## 6. Wo der Report jetzt steht

Bewertung der 21 Codes nach gelisteten Einzelposten:

| Bewertung | Codes | Posten |
|---|---|---:|
| **Falsch** | `broken_resource`, `broken_image_resource`, `empty_internal_anchor_text`, `image_missing_alt`, `image_resource_missing_alt`, `broken_external_link`, `redirected_external_link`, `body_internal_links_missing` | **510** |
| **Wahr, nicht handlungsrelevant** | `render_blocking_resource` | 32 |
| **Wahr, über-berichtet** | `duplicate_internal_anchor_targets` | 252 |
| **Wahr** | `static_resource_cache_policy_missing` (6/7), `image_missing_dimensions` (11), `large_image_resource` (2/3), `orphan_sitemap_url` (1), `h1_duplicate` (2), `title_too_long` (9), `meta_description_too_long` (43), `thin_content` (1/2), `contextual_internal_inlinks_missing` (14) | **89** |

Der einzelne größte Posten ist jetzt `body_internal_links_missing` mit 197 Einträgen — auf Basis eines Feldes, das konstant null ist. Er hat in V2 die Rolle übernommen, die in V1 `image_resource_missing_alt` (1.238) hatte.

Positiv gegenüber V1: Der Report ist 41 % kleiner, die Blockköpfe sind endlich interpretierbar, die Titel-Evidence ist selbsterklärend, `contextual_internal_inlinks_missing` ist von Rauschen zu einer brauchbaren 14er-Liste geworden, und die eine gefährliche Empfehlung ist beseitigt.

---

## 7. Empfehlungen für V3

**Zuerst — der neue Bug, weil er aktiv in die Irre führt**

1. Unique-Zählung korrigieren. Invariante erzwingen: `unique ≥ loaded ≥ 0`, und `unique ≥ Anzahl distinkter URLs in der Liste`. Ein Assertion-Test im Report-Renderer hätte alle 4 Fälle gefunden. Solange die Zahl untertreibt, ist sie schädlicher als die alte Vorkommenszählung.

**Dann die vier offenen P0 — zusammen ~510 Fehlalarme, jeweils kleine Eingriffe**

2. `alt=""` ≠ fehlendes `alt`. Nur das fehlende Attribut ist ein Fehler. Stattdessen neuer Check „N Content-Bilder, 0 mit beschreibendem Alt-Text" — der hätte `/portfolio.html` (58/58) korrekt gefunden, ohne die ~150 Fehlalarme. *(−150)*
3. `srcset` spec-konform parsen; `data:`-URIs überspringen; `///`-Kollaps im Normalisierer beheben. *(−1, aber es korrumpiert Daten)*
4. `rel="preconnect|dns-prefetch|prefetch|prerender"` nicht abrufen. *(−1, aber die einzige High-Severity-Meldung)*
5. Accessible Name nach Spezifikation (`aria-label` → `aria-labelledby` → Text → `alt` → `title`); Nicht-HTML-Ziele aus dem Seitengraph nehmen. *(−2 URLs / 33 Links)*
6. Externe Ziele mit Browser-UA prüfen; Login-Wall-Domains als „nicht botprüfbar" führen statt als defekt. *(−110)*

**Dann der Widerspruch im Linkgraph**

7. `bodyInternalOutlinkCount` implementieren — er ist im gesamten Report konstant null. Dieselbe Regionslogik nutzen, die für `contextual_internal_inlinks_missing` bereits funktioniert, damit In- und Outlink-Sicht konsistent sind. Vorher `body_internal_links_missing` deaktivieren: 197 Meldungen aus einem nicht berechneten Feld sind schlimmer als keine Meldung. *(−197)*
8. `placement`: `head` als Region ergänzen. Die eine korrekte `header`-Meldung zeigt, dass die Logik existiert und nur diesen Fall nicht kennt. *(1.087 Felder werden nutzbar)*

**Aufbereitung**

9. `missingAlt` aus dem gemeinsamen Evidence-Objekt entfernen, wo nicht anwendbar (15 Codes).
10. `duplicate_internal_anchor_targets` nach **Ankertext** gruppieren statt nach Seite: „‚Übersicht' zeigt auf 2 Ziele, betrifft 250 Seiten" statt 250 Zeilen. Der Code hat echte Substanz, sie ist nur unauffindbar.
11. Issue-Summary pro Code schreiben; die Graph-Boilerplate widerspricht teilweise der eigenen Evidence.
12. `thin_content` und `low_content_density` zusammenführen (messen dasselbe an denselben 2 Seiten).

**Neue Checks**

13. Selbstverlinkung (real: 111 von 120 Seiten — echter, unentdeckter Fund).
14. Canonical-Ketten, hreflang, strukturierte Daten, interne Redirect-Ketten.

---

## 8. Fazit

Der Agent hat an der richtigen Stelle angefangen und die Priorisierung dann verloren. Die **Aufbereitung** ist spürbar besser — Unique-Zählung als Konzept, 41 % kleinerer Report, selbsterklärende Titel-Evidence, korrigierte Severity, ein zusammengeführter Doppel-Code. Die eine aktiv gefährliche Empfehlung wurde nicht nur entfernt, sondern durch eine präzise Schutzregel ersetzt. Und `large_image_resource` ist von 0/6 auf 2/3 korrekt gestiegen.

Aber von sechs P0-Punkten wurde genau einer erledigt. Die vier größten False-Positive-Quellen — `alt=""`, `data:`-URIs, `preconnect`, `aria-label` — sind Zeichen für Zeichen unverändert. Zusammen mit dem konstant-null-Feld hinter `body_internal_links_missing` stehen weiterhin ~510 falsche Posten im Report.

Zwei Muster sind dabei charakteristisch und sollten die Arbeitsweise für V3 bestimmen:

**Symptom statt Ursache.** Beim `data:`-URI-Bug wurde der Folgefehler entfernt (`resource_content_type_mismatch`) und die Ursache stehengelassen. Der Report sieht sauberer aus, der Parser ist unverändert kaputt.

**Halb reparierte Pfade erzeugen Widersprüche.** Die Inlink-Seite der Linkgraph-Analyse wurde korrigiert, die Outlink-Seite nicht. Vorher war der Report konsistent falsch; jetzt widerspricht er sich selbst — dieselben Links zählen am Ziel als kontextuell und an der Quelle als nicht existent. Das ist für einen Nutzer schwerer zu durchschauen als der ursprüngliche Zustand.

Dasselbe gilt für den neuen Unique-Bug: Eine falsche kleine Zahl an der prominentesten Stelle des Blocks erzeugt falsche Sicherheit. Beim Cache-Block verschweigt sie 4 von 7 real betroffenen Assets.

**Für V3 die klare Reihenfolge:** erst die Unique-Invariante absichern (Fehlinformation), dann `body_internal_links_missing` deaktivieren bis das Feld berechnet wird (197 Falschmeldungen aus dem Nichts), dann die vier offenen P0-Regeln (~510 Fehlalarme). Das sind überschaubare Eingriffe und würden den Report von ~900 gelisteten Posten auf grob 90 bringen — von denen dann fast jeder zuträfe.

Die Erhebungsschicht war schon in V1 stark und ist es geblieben. Sie war nie das Problem.

---

## Anhang: Codes V1 → V2

| Code | Sev V1→V2 | V1 Vorkommen | V1 gelistet | V2 gelistet |
|---|---|---:|---:|---:|
| `broken_resource` | high | 100 | 1 | 1 |
| `broken_image_resource` | high | 37 | 1 | 1 |
| `static_resource_cache_policy_missing` | medium→low | 700 | 7 | 7 |
| `large_image_resource` | medium | 48 | 6 | 3 |
| `title_too_long` | medium | 9 | 9 | 9 |
| `empty_internal_anchor_text` | medium | 2 | 2 | 2 |
| `thin_content` | medium | 2 | 2 | 2 |
| `internal_inlinks_missing` | medium→entfernt | 1 | 1 | — |
| `orphan_sitemap_url` | medium | 1 | 1 | 1 |
| `render_blocking_resource` | low | 1.516 | 32 | 32 |
| `image_resource_missing_alt` | low | 1.238 | 71 | 71 |
| `duplicate_internal_anchor_targets` | low | 252 | 252 | 252 |
| `contextual_internal_inlinks_missing` | low | 208 | 208 | **14** |
| `body_internal_links_missing` | low | 198 | 198 | 197 |
| `image_missing_alt` | low | 128 | 128 | 128 |
| `broken_external_link` | low | 55 | 55 | 55 |
| `redirected_external_link` | info | 55 | 55 | 55 |
| `meta_description_too_long` | low | 43 | 43 | 43 |
| `resource_content_type_mismatch` | low→entfernt | 37 | 1 | — |
| `image_missing_dimensions` | low | 11 | 11 | 11 |
| `weak_internal_inlinks` | low | 9 | 9 | 9 |
| `h1_duplicate` | low | 2 | 2 | 2 |
| `low_content_density` | low | 2 | 2 | 2 |

*Hinweis: „V1 gelistet" ist die in V1 geladene Teilmenge (teils gekappt), „V2 gelistet" die tatsächlich distinkten URLs im Block. Die Spalte „Unique affected … from run" aus V2 ist absichtlich nicht aufgeführt, da sie in 4 Blöcken nachweislich falsch ist (Abschnitt 3).*

# Site-Audit-Analyse V5

**Datum:** 2026-07-21
**Report:** `Site-Audit-V5.md` — Run `mh8bavf7nscbevtwweqq4v2as18ay1ga`, „Run: Jul 21", exportiert 17:10, **3.171 Findings, 16 Codes**
**Vorgänger:** V4 (16:14, 4.223 Findings, 21 Codes)
**Testobjekt:** matthiasramahi.de, unverändert
**Geändert:** `contextter-5.0/packages/jobs/.../core-link-findings.ts` + Regressionstests — nichts committet, nichts gepusht

---

## 0. Das Wichtigste zuerst

**Das Deployment ist gelandet.** Der Test, den ich in V4 als einzige verlässliche Prüfung vorgeschlagen hatte, schlägt eindeutig um:

| | `placement: head` | `placement: body` |
|---|---:|---:|
| V4 | 1 | 1.087 |
| **V5** | **865** | **12** |

Damit misst V5 zum ersten Mal seit V1 tatsächlich den aktuellen Regelcode. Ergebnis: **−1.052 Findings, −5 Codes**, und praktisch die gesamte Reduktion entfällt auf Fehlalarme.

Gleichzeitig habe ich in dieser Runde **zwei Fehler gefunden — einen in meiner eigenen V4-Analyse und einen im Crawler**, der durch das Deployment erst sichtbar wurde.

---

## 1. Meine V4-Vorhersage gegen das Ergebnis

In V4 hatte ich eine konkrete Prognose abgegeben. Abgleich:

| Code | V4 | Prognose | **V5 tatsächlich** | |
|---|---:|---:|---:|:--|
| `broken_resource` | 100 | 0 | **0** | ✅ |
| `broken_image_resource` | 37 | 0 | **0** | ✅ |
| `image_resource_missing_alt` | 1.238 | 0 | **0** | ✅ |
| `image_missing_alt` | 128 | 0 | **0** | ✅ |
| `empty_internal_anchor_text` | 2 | 0 | **0** | ✅ |
| `image_alt_coverage_missing` | — | 1 | **1** | ✅ |
| `image_missing_dimensions` | 11 | 0 | **11** | ❌ |

Sechs von sieben exakt. Die eine Abweichung war **mein Fehler**, nicht der des Crawlers — siehe 3.1.

Gesamt 4.223 → 3.171. Meine Schätzung lautete „etwa 2.700"; die Differenz erklärt sich durch `self_referential_internal_link` (227), das erst jetzt sichtbar wurde, und durch einen Anstieg bei `render_blocking_resource`.

---

## 2. Was V5 erledigt hat

### 2.1 Die vier Web-Standard-Fehlalarme sind vollständig weg

```
broken_resource              100  →  0     preconnect wird nicht mehr abgerufen
broken_image_resource         37  →  0     data:-URI wird nicht mehr am Komma zerlegt
image_resource_missing_alt 1.238  →  0     alt="" gilt als dekorativ, nicht als fehlend
image_missing_alt            128  →  0     dito
empty_internal_anchor_text     2  →  0     aria-label zählt als Accessible Name
```

Rund **1.500 Fehlalarme** in einem Schritt. Die einzige `high`-Meldung des gesamten Reports war der `preconnect`-Fehlalarm — V5 hat **keine einzige High-Severity-Meldung mehr**.

### 2.2 Meine neue Regel funktioniert wie entworfen

```
## No image on the page has descriptive alt text
- Finding occurrences from run: 1
- Evidence: imageCount: 58; imagesWithDescriptiveAltCount: 0; imagesMissingAltCount: 0
- Affected: https://matthiasramahi.de/portfolio.html
```

Genau ein Treffer, genau die Seite, die ich manuell als defekt verifiziert habe. Der `alt=""`-Fix beseitigt 1.366 Fehlalarme, **ohne** den einen echten Bildbefund mitzunehmen. Das war der Zweck der Regel, und er ist erfüllt.

*Aber die Darstellung stimmt nicht* — siehe 4.3.

### 2.3 Bot-Gating wurde als Kategorie eingeführt

Meine V4-Empfehlung P1 #6 ist teilweise umgesetzt. Neu:

```
external_link_unverifiable   55   info   →  https://www.instagram.com/mathewspictures
broken_external_link         55   low    →  https://g.page/r/CX0tbKvX5WvpEBM/review
```

Beide betreffen dieselben 55 Quellseiten (beide Links stehen im geteilten Footer), aber **unterschiedliche Ziele** — kein Doppel-Report. Instagram ist korrekt in die neue Kategorie gewandert.

Der Google-Bewertungslink jedoch nicht. Live nachgemessen:

```
ohne User-Agent, HEAD:   302
Browser-UA, GET+Redirects:  200
```

Er funktioniert. Solange er als „broken" geführt wird, besteht das Risiko, dass jemand einen funktionierenden Google-Bewertungslink entfernt. **Die Kategorie existiert jetzt — der Fall muss nur noch hinein.**

### 2.4 Zähler und Aggregation

`static_resource_cache_policy_missing` bleibt bei 700 Vorkommen / **7 unique** / Severity `low` — beide V3-Regressionen sind stabil behoben. `low_content_density` ist entfallen.

---

## 3. Ein Fehler in meiner V4-Analyse

### 3.1 `image_missing_dimensions` ist ein True Positive — ich lag falsch

In V4 hatte ich diesen Code als Fehlalarm eingestuft, weil ich die gemeldeten Bilder im Live-HTML mit `width`/`height` gefunden hatte. **Das war ein Methodenfehler.** Ich hatte pro *Datei* geprüft; der Befund gilt aber pro *Vorkommen* (Seite × Bild).

Die tatsächlichen Quellseiten stehen in V5 in der Asset-Liste:

| Quellseite | `<img>` gesamt | ohne `width`/`height` | gemeldet |
|---|---:|---:|---:|
| `/ueber-mich.html` | 7 | **6** | 6 |
| `/portfolio/portfolio-auswahl-automobil` | 19 | **5** | 5 |
| | | **11** | **11** |

Perfekte Präzision. Und der entscheidende Nachweis — auf `portfolio-auswahl-automobil` kommt dieselbe Datei zweimal vor:

```
#7   1100x733       assets-portfolio-dsc3879-1920-1100x733.webp     ← mit Dimensionen
#19  *** OHNE ***   assets-portfolio-dsc3879-1920-1100x733.webp     ← gemeldet
```

Der Crawler markiert korrekt das Vorkommen ohne Dimensionen. Ich hatte in V4 das erste Vorkommen geprüft und daraus fälschlich „Fehlalarm" geschlossen.

**Lehre für die Verifikation:** Ein Resource-Finding ist an ein (Seite, Element)-Paar gebunden, nicht an eine URL. Die Evidence enthält allerdings **keine `sourceUrl`** — nur die separate Asset-Liste am Blockende stellt den Bezug her. Genau diese Lücke hat meinen Fehler begünstigt (s. 4.2).

---

## 4. Neue Befunde in V5

### 4.1 Regression: zwei verifizierte True Positives verschwunden

`body_internal_links_missing` war in V4 bei **2** Seiten — beide hatte ich live verifiziert. In V5: **entfallen**.

Die Seiten haben sich nicht geändert (frisch gemessen: je 49 interne Links, **0 in `<main>`**). Ursache ist der neu deployte Region-Klassifizierer.

**Diagnose.** `dom-context.ts` liefert zwei bewusst orthogonale Dimensionen:

```ts
navigationRole   = liegt in einem <nav> / [role=navigation]
structuralRegion = head | header | body | sidebar | footer | unknown
```

Ein `<nav>` innerhalb von `<main>` ist damit korrekt `structuralRegion: "body"` **und** `navigationRole: true`. Ein bestehender Test (`http-fetcher-links.scenario.ts:182`) schreibt diese Trennung ausdrücklich fest.

Die **Regel** las jedoch nur die Region:

```ts
!internalLinks.some((link) => link.structuralRegion === "body")
```

Auf diesen zwei Seiten steht das geteilte Mobile-Menü als nacktes `<nav>` direkt im `<body>` — nach `</header>` (8558) und vor `<main>` (9598). Seine 13 Links werden Region `body` und gelten damit als Fließtext-Verlinkung, obwohl sie Navigations-Boilerplate sind.

```
videografie-duesseldorf.html   header 14 | body 13 (Mobile-Menü) | footer 25   →  Regel schwieg
```

**Behoben** in `core-link-findings.ts`: Die Regel liest jetzt beide Dimensionen.

```ts
const isContextualBodyLink = (link) =>
  link.structuralRegion === "body" && !link.navigationRole;
```

Verifikation gegen echte Seiten:

| Seite | interne Links | davon kontextuell | Regel feuert |
|---|---:|---:|---|
| videografie-duesseldorf | 49 | **0** | **ja** ✓ |
| viola-musik-duesseldorf | 49 | **0** | **ja** ✓ |
| sportwagen-fotografie-koeln | 42 | 5 (echte CTAs) | nein ✓ |
| portfolio | 12 | 12 | nein ✓ |

Die zwei True Positives sind zurück, ohne dass die 190 Städteseiten fälschlich feuern — deren drei Link-Grids liegen zwar in `<main>`, sind aber `<nav>`, und die fünf echten Fließtext-CTAs genügen.

*Wichtig:* Mein erster Versuch war falsch. Ich hatte zunächst `dom-context.ts` geändert, um `<nav>` aus `body` herauszunehmen — das hat den bestehenden Orthogonalitäts-Test gebrochen. **Der Fehler saß nicht im Datenmodell, sondern im Konsumenten.** Nach dem Rückbau und der Korrektur am richtigen Ort sind beide Suites grün.

### 4.2 `self_referential_internal_link` (227) — echt, aber die Zahl braucht Kontext

Live verifiziert an `youngtimer-fotografie.html`: Die Seite verlinkt einmal in `<main>` auf sich selbst, Ankertext „Youngtimer Fotografie", und zwar **innerhalb eines `<nav>`-Themen-Grids**.

Das ist exakt der Fall, den die Regel treffen *will* — ihre eigene Beschreibung lautet „a template or listing that does not exclude the current item", die Empfehlung „Exclude the current page from the relevant listing". Ich habe die Nav-Ausnahme aus 4.1 hier deshalb **bewusst nicht** angewandt und das im Code vermerkt.

Der Befund ist also korrekt. 227 von rund 250 Seiten heißt: Das Themen-Grid schließt die aktuelle Seite nie aus — ein einzelner Template-Fix. Severity `info` ist angemessen.

### 4.3 Meine eigene Regel wird falsch klassifiziert

`image_alt_coverage_missing` ist **seitenbezogen** (ich habe sie mit `measurementUnit: "source_page"` registriert), wird im Report aber als Asset-Problem geführt:

```
- Category: Images & media
- Source: resource
- Unique affected assets from run: 1          ← es ist eine Seite, kein Asset
- Loaded unique affected assets in this copy: 1
- Issue summary: Resource evidence stores source page, element, attribute,     ← fremder Boilerplate
                 nearest heading and missing-alt count.
Recommended fix:
- Add missing dimensions and alt text at template level…                       ← fremder Boilerplate
Affected assets:
- https://matthiasramahi.de/portfolio.html                                     ← eine Seite
```

Drei Fehler: falsche Maßeinheit („assets" statt „URLs"), generischer Issue-Summary statt meiner Beschreibung, und ein sachfremder erster Fix-Vorschlag. Das ist meine Regel, also mein offener Punkt — die Kategorie-/Unit-Zuordnung im Issue-Katalog stimmt nicht mit der Registrierung überein.

### 4.4 `render_blocking_resource` ist gestiegen

```
V4:  1.516 Vorkommen / 32 unique
V5:  1.745 Vorkommen / 33 unique
```

Plausibel als Folge der korrigierten `<head>`-Erkennung — Stylesheets im `<head>` werden jetzt zuverlässig erfasst. Der Code bleibt aber der größte Einzelposten des Reports bei geringem Handlungswert: 1.745 Meldungen für 33 Dateien, und Stylesheets im `<head>` sind der Normalfall.

### 4.5 Unverändert offen aus meiner V4-Empfehlungsliste

| Empfehlung | Status |
|---|---|
| P1 #3 `bodyInternalInlinkCount` auf der Inlink-Seite ersetzen | ❌ weiterhin 8× `bodyInternalInlinkCount: 0` |
| P1 #5 Titel/Description in Pixelbreite | ❌ `title_too_long` 9, `meta_description_too_long` 43 unverändert |
| P1 #6 Bot-Gating | ⚠️ Kategorie da, `g.page` noch nicht einsortiert |
| P2 #8 `duplicate_internal_anchor_targets` gruppieren | ❌ weiterhin 252 Findings für 1 Ursache |
| P2 #10 Drittanbieter-Ressourcen trennen | ❌ Analytics-Skript weiterhin in `cache_policy` |
| P0 #2 Crawler-Build-SHA im Report | ❌ nicht umgesetzt |

---

## 5. Stand der Trefferquote

| Kategorie | Codes | Bewertung |
|---|---|---|
| **Echt, präzise** | `image_missing_dimensions` (11/11), `large_image_resource` (503–569 KB), `static_resource_cache_policy_missing` (6/7), `h1_duplicate`, `orphan_sitemap_url`, `self_referential_internal_link`, `image_alt_coverage_missing`, `thin_content`, `contextual_internal_inlinks_missing` | Kern des Reports |
| **Echt, aber schlecht aggregiert** | `duplicate_internal_anchor_targets` (252 für 1 Ursache), `render_blocking_resource` (1.745 für 33 Dateien) | Zahlen irreführend |
| **Grenzwertig** | `title_too_long`, `meta_description_too_long` (Zeichen statt Pixel) | Rauschen |
| **Falsch** | `broken_external_link` (g.page, live 200) | 55 Meldungen |
| **Regression (behoben)** | `body_internal_links_missing` (2 TPs verloren) | jetzt wieder da |

Von 3.171 Posten sind rund **55 nachweislich falsch** — gegenüber ~1.650 in V4. Die Fehlalarmquote ist von etwa 39 % auf unter 2 % gefallen.

Die verbleibende Schwäche ist nicht mehr Korrektheit, sondern **Proportion**: 1.745 + 252 = 1.997 der 3.171 Posten (63 %) entfallen auf zwei Codes, hinter denen 33 Dateien und ein Ankertext stehen.

---

## 6. Was ich geändert habe

```
packages/jobs/.../findings/core-link-findings.ts                        +19
  → isContextualBodyLink(): structuralRegion === "body" && !navigationRole
  → body_internal_links_missing nutzt es; self_referential_internal_link
    bewusst nicht (kommentiert)

packages/jobs/.../findings/__tests__/ground-truth-matthiasramahi.test.ts +52
  → 2 neue Tests: Chrome-only-Seiten feuern, Städteseite feuert nicht

packages/jobs/.../__tests__/fixtures/videografie-duesseldorf.html        neu
packages/jobs/.../__tests__/fixtures/viola-musik-duesseldorf.html        neu
```

**Validierung:** `@contextter/jobs` 99 Tests grün (+2), `@contextter/ai` 76 grün, Typecheck und Lint der berührten Dateien sauber. Der bestehende Orthogonalitäts-Kontrakt in `http-fetcher-links.scenario.ts` bleibt unangetastet.

---

## 7. Empfehlung für V6

**Zuerst — die zwei Zahlen, die den Report dominieren:**

1. `duplicate_internal_anchor_targets` in der Projektion nach Ankertext gruppieren (252 → ~1–3).
2. `render_blocking_resource` pro Datei statt pro Vorkommen ausweisen, und Stylesheets im `<head>` nur melden, wenn sie tatsächlich kritisch sind (Größe, Anzahl, `media`-Attribut).

**Dann — die verbliebenen Korrektheitspunkte:**

3. `g.page` in `external_link_unverifiable` einsortieren: Retry mit Browser-UA, bevor „broken" vergeben wird.
4. `bodyInternalInlinkCount` auf der Inlink-Seite ersetzen — dieselbe Verwechslung von Region und Navigationsrolle wie in 4.1, nur gespiegelt. Nach meinem Fix ist die Vorlage vorhanden.
5. Kategorie/Maßeinheit von `image_alt_coverage_missing` auf `urls` korrigieren und den Issue-Summary aus der Regel statt aus dem Bild-Boilerplate ziehen.
6. Titel/Description in Pixelbreite messen.

**Dann — Diagnostizierbarkeit:**

7. `sourceUrl` in die Resource-Evidence aufnehmen. Ohne sie ist ein Resource-Finding nicht lokalisierbar — das hat in V4 zu meiner Fehleinschätzung geführt.
8. Crawler-Build-SHA in den Report-Kopf. Seit V1 offen, und in genau der Runde, in der es gefehlt hat, hat es eine ganze Analyse gekostet.

---

## 8. Fazit

V5 ist die erste Runde, in der die Regel-Ebene tatsächlich gemessen wurde — und sie hält, was der Code versprochen hat: rund 1.500 Fehlalarme weg, keine High-Severity-Meldung mehr, Fehlalarmquote von ~39 % auf unter 2 %.

Zwei Dinge sind mir dabei wichtiger als die Zahlen.

**Erstens:** Das Deployment war die ganze Zeit das eigentliche Problem, nicht die Regeln. Drei Analyse-Runden lang wurden korrekte Fixes geschrieben, die nie gemessen wurden. Die Lehre steht in Empfehlung 8 und kostet eine Zeile im Report-Kopf.

**Zweitens:** Diese Runde hat zwei Fehler zutage gefördert, die in dieselbe Kategorie fallen — meiner bei `image_missing_dimensions` (pro Datei statt pro Vorkommen geprüft) und der des Crawlers bei `body_internal_links_missing` (Region gelesen, Navigationsrolle ignoriert). Beide entstanden dadurch, dass eine zweidimensionale Wirklichkeit auf eine Dimension reduziert wurde. Dass der Crawler beide Dimensionen überhaupt sauber erhebt und im Report ausgibt, ist der Grund, warum beide Fehler gefunden werden konnten.

Ein Werkzeug, dessen Rohdaten reich genug sind, um seine eigenen Regeln zu widerlegen, ist an der richtigen Stelle gebaut. Der offene Rest — Gruppierung, Pixelmessung, Bot-Gating — sind Designentscheidungen, keine Defekte.

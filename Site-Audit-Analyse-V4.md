# Site-Audit-Analyse V4

**Datum:** 2026-07-21
**Report:** `Site-Audit-V4.md` — Run `mh83h24pemwpdvggzjkz8jn91d8azw0e`, „Run: Jul 21", exportiert 16:14, 4.223 Findings, 21 Codes
**Vergleich:** V1 (20.07. 19:06) · V2 (20.07.) · V3 (Run Jul 20, exportiert 21.07. 01:09)
**Testobjekt:** matthiasramahi.de, unverändert
**Geänderter Code:** `contextter-5.0/` (Crawler) — nichts committet von mir, nichts gepusht

---

## 0. Das Wichtigste zuerst

**V4 misst nicht den aktuellen Crawler.** Die Regel-Ebene des Reports ist gegenüber V1 von vorgestern byte-identisch, obwohl die dafür verantwortlichen Fixes seit dem 20.07. 23:22 im Repository liegen und durch Tests gegen echtes Markup als funktionierend nachgewiesen sind.

Der Beweis in einer Zeile:

```
V4 meldet für sportwagen-fotografie-koeln.html:   imageCount: 23; imagesMissingAltCount: 3
Aktueller Code, dieselbe Seite, mein Test:        imageCount: 23; imagesMissingAltCount: 0
```

Beide Zahlen beziehen sich auf exakt dieselbe HTML-Datei. Der Code, der V4 erzeugt hat, ist nicht der Code im Repository.

**Konsequenz:** V4 taugt nicht zur Bewertung der Fixes. Bevor der nächste Run gefahren wird, muss geklärt werden, warum die Regel-Ebene nicht deployt ist — sonst misst auch V5 wieder den alten Stand.

---

## 1. Die Zwei-Ebenen-Diagnose

Nicht der ganze Crawler ist veraltet. Die Trennung ist exakt und aufschlussreich:

| Ebene | Nachweis in V4 | Zustand |
|---|---|---|
| **Report-Generator** (`apps/app`) | Drei-Zeilen-Zähler (`Finding occurrences` / `Unique affected` / `Loaded unique`), `missingAlt`-Leak verschwunden, Root-Cause-Ankertexte | ✅ aktuell |
| **Materialisierung** (`packages/db`, Convex) | `large_image_resource` 48→45 (Lightbox-`<a>` gefiltert), Severity `cache_policy` medium→low, neue Evidence-Feldreihenfolge | ✅ aktuell |
| **Link-Findings** (`packages/jobs`) | `body_internal_links_missing` liefert `internalLinkCount: 49` statt des alten `bodyInternalOutlinkCount: 0` | ✅ aktuell |
| **HTML-Parser / Resource-Discovery** (`packages/ai`) | `preconnect` weiterhin als Ressource, `data:`-URI weiterhin zerlegt, `alt=""` weiterhin als fehlend, `placement: body` für `<head>` | ❌ **veraltet** |

Drei von vier Ebenen sind aktuell. Nur `packages/ai` — der eigentliche Regel-Kern — nicht.

Das ist kein Deployment-Ausfall, sondern ein gezielter Ausfall bei genau einem Paket. `@contextter/ai` ist ein *source-first*-Paket (`main: ./src/index.ts`, Build ist ein No-op-Echo), es gibt also kein veraltetes `dist` als einfache Erklärung. Die Ursache muss im Build-/Bundling-Pfad der Inngest-Worker liegen und ist der erste Punkt, den ich prüfen würde.

---

## 2. V1 → V4 im Detail

| Code | V1 | V4 (Vork./Unique) | Sev | Bewertung |
|---|---:|---|---|---|
| `broken_resource` | 100 | 100 / 1 | **high** | ❌ Fehlalarm, unverändert |
| `broken_image_resource` | 37 | 37 / 1 | high | ❌ Fehlalarm, unverändert |
| `image_resource_missing_alt` | 1.238 | 1.238 / **71** | low | ❌ Fehlalarm; Unique-Zahl neu und korrekt |
| `image_missing_alt` | 128 | 128 / 128 | low | ❌ Fehlalarm, Evidence byte-identisch |
| `empty_internal_anchor_text` | 2 | 2 / 2 | med | ❌ Fehlalarm (33 `.webp`-Links) |
| `image_missing_dimensions` | 11 | 11 / 11 | low | ❌ **Fehlalarm — neu entdeckt, s. 3.1** |
| `render_blocking_resource` | 1.516 | 1.516 / **32** | low | ⚠️ technisch wahr, geringer Wert |
| `static_resource_cache_policy_missing` | 700 | 700 / **7** | **low** | ✅ echt; beide V3-Regressionen behoben |
| `large_image_resource` | 48 | **45** / **3** | med | ✅ echt, live verifiziert (503–569 KB) |
| `body_internal_links_missing` | 198 | **2** / 2 | low | ✅ echt, live verifiziert |
| `contextual_internal_inlinks_missing` | 208 | **14** / 14 | low | ✅ plausibel |
| `duplicate_internal_anchor_targets` | 252 | 252 / 252 | low | ⚠️ echt, aber 252 Zeilen für 1 Ursache |
| `weak_internal_inlinks` | 9 | 9 / 9 | low | ⚠️ nutzt weiter das kaputte Feld, s. 3.2 |
| `low_content_density` | 2 | 2 / 2 | low | ⚠️ misst das Falsche, s. 3.3 |
| `thin_content` | 2 | 2 / 2 | med | ⚠️ Messung korrekt, Seitentyp ignoriert |
| `title_too_long` | 9 | 9 / 9 | med | ⚠️ Zeichen statt Pixel |
| `meta_description_too_long` | 43 | 43 / 43 | low | ⚠️ dito |
| `broken_external_link` | 55 | 55 / 55 | low | ❌ Bot-Gating, live widerlegt |
| `redirected_external_link` | 55 | 55 / 55 | info | ❌ Bot-Gating |
| `h1_duplicate` | 2 | 2 / 2 | low | ✅ echt |
| `orphan_sitemap_url` | 1 | 1 / 1 | med | ✅ echt |
| `internal_inlinks_missing` | 1 | — | — | entfallen |
| `resource_content_type_mismatch` | 37 | — | — | ✅ entfallen (war tautologisch) |

**Was V4 gegenüber V1 wirklich verbessert hat:** die Aufbereitung. Unique-Zahlen sind erstmals korrekt (1.516→32, 1.238→71, 700→7), die beiden V3-Regressionen sind behoben, der `missingAlt`-Leak ist weg. Das ist echter Fortschritt — aber ausschließlich auf der Darstellungsebene.

**Was unverändert ist:** jeder einzelne Regel-Fehlalarm.

---

## 3. Drei Befunde, die in keiner Vorrunde geprüft wurden

### 3.1 `image_missing_dimensions` ist ein Fehlalarm (11 Meldungen)

Bisher nirgends verifiziert. Ich habe jedes gemeldete Bild im Live-HTML nachgeschlagen:

| gemeldetes Bild | Seite | im HTML |
|---|---|---|
| `assets-portfolio-dsc3879-…-1100x733` | automobil-fotografie, sportwagen-koeln | `width="1100" height="733"` |
| `assets-photos-motorrad-…-1100x1650` | motorrad-fotografie | `width="1100" height="1650"` |
| `assets-photos-oldtimer-stage-…-1100x733` | oldtimer-fotografie | `width="1100" height="733"` |
| `assets-portfolio-dsc3982-…-1100x733` | automobil-fotografie, sportwagen-koeln | `width="1100" height="733"` |

Das Markup ist völlig gewöhnlich:

```html
<img loading="lazy" src="…oldtimer-stage-1920-1100x733.webp?v=…" alt="Oldtimerfotografie"
     width="1100" height="733" decoding="async">
```

Über 19 Seiten und 223 Bilder fehlen `width`/`height` bei genau **6** — und keines der gemeldeten ist darunter. Die Regel-Logik selbst ist korrekt (`entry.width == null || entry.height == null`); der Crawler füllt die Felder nur nicht. In der Evidence fehlen `width`/`height` deshalb ganz.

**Mit dem aktuellen Code getestet:** alle 14 Bilder der Seite werden korrekt mit Dimensionen erfasst, **0 fehlend**. Auch dieser Fehlalarm ist im Repository bereits behoben — er kommt nur nicht in den Run.

### 3.2 Die Linkgraph-Reparatur ist halb geblieben

V3 hatte das konstant-null-Feld auf der **Outlink**-Seite ersetzt. V4 zeigt: die **Inlink**-Seite benutzt es weiter.

```
body_internal_links_missing (Outlink):  internalLinkCount: 49                    ← neu, funktioniert
weak_internal_inlinks      (Inlink):    bodyInternalInlinkCount: 0               ← altes kaputtes Feld
contextual_internal_inlinks_missing:    bodyInternalInlinkCount: 0               ← ebenso
```

`bodyInternalInlinkCount` ist in **jeder** Evidence-Zeile des Reports 0 — auch bei Seiten mit 42 Body-Links. Das Feld trägt keine Information, geht aber in zwei Regeln ein. Der Widerspruch, den V3 aufgelöst zu haben schien, besteht auf der anderen Hälfte des Graphen fort.

### 3.3 `low_content_density` misst Markup-Gewicht, nicht Inhalt

```
contentDensity: 0.0212; cleanedTextLength: 1006; contentLengthBytes: 47427   (portfolio.html)
```

Die Metrik ist Text ÷ HTML-Bytes. Ich habe portfolio.html zerlegt:

| Anteil | Bytes | % |
|---|---:|---:|
| HTML gesamt | 47.396 | 100 |
| `<style>` inline | 1.742 | 3 |
| `<script>` inline | 1.731 | 3 |
| **Markup + Text** | **43.923** | **93** |

Die 2,1 % kommen also nicht von inline-CSS, sondern von 58 Bildern mit je ~200 Zeichen langen CDN-URLs plus `srcset`-Varianten. Die Zahl ist rechnerisch korrekt, ihre **Ursache** ist aber Bildauszeichnung, nicht dünner Inhalt. Als „Content"-Problem gemeldet führt sie in die Irre: Wer dem folgt, schreibt Text nach, obwohl das Verhältnis von der Bildergalerie kommt.

---

## 4. Gegenprobe: Was der aktuelle Code über dieselbe Website sagt

Ich habe die 19 echten Seiten heruntergeladen und mit dem **aktuellen** Repository-Code durch den Crawler geschickt.

```
preconnect als Ressource        0      (V4: 100 Vorkommen)
data:-URI als Ressource         0      (V4:  37)
.webp im Link-Graph             0      (V4:  33 Links in empty_internal_anchor_text)
Ressourcen mit placement=head   275    (V4: durchgehend "body")
img/src ohne width|height       6/177  (V4: 11 gemeldet, alle nachweislich mit Dimensionen)
```

Pro Seite, Bild-Kennzahlen:

| Seite | img | missAlt | mit Alt-Text | feuert `image_alt_coverage_missing` |
|---|---:|---:|---:|:--:|
| portfolio | 58 | 0 | **0** | **ja** |
| sportwagen-fotografie-koeln | 23 | 0 | 20 | nein |
| leistungen | 23 | 0 | 22 | nein |
| motorrad-fotografie | 19 | 0 | 16 | nein |
| oldtimer-fotografie | 14 | 0 | 14 | nein |
| automobil-fotografie | 13 | 0 | 13 | nein |
| portraitfotografie-duesseldorf | 13 | 0 | 9 | nein |
| _root | 11 | 0 | 10 | nein |
| naturfotografie-prints | 9 | 0 | 9 | nein |
| fine-art-prints-landschaft | 9 | 0 | 9 | nein |
| landschaftsfotografie-essen | 9 | 0 | 9 | nein |
| blog | 8 | 0 | 7 | nein |
| ueber-mich | 7 | 0 | 6 | nein |
| fotografie | 6 | 0 | 6 | nein |
| videografie-duesseldorf | 1 | 0 | 0 | nein (< 8 Bilder) |
| contact / viola / blog-oldtimer | 0 | 0 | 0 | nein |

`missAlt` ist auf **jeder** Seite 0 — korrekt, denn keine Seite hat ein `<img>` ohne `alt`-Attribut. Die 128 + 1.238 Meldungen aus V4 lösen sich vollständig auf.

Gleichzeitig bleibt der eine **echte** Bildbefund erhalten: portfolio.html mit 58 Bildern und keinem einzigen Alt-Text.

*Einschränkung, damit die Zahlen richtig gelesen werden:* Mein Harness konstruiert HTTP-Responses ohne echte Header und leitet URLs aus Dateinamen ab. Die dabei zusätzlich erscheinenden Codes `security_headers_missing_or_weak` (18), `canonical_mismatch` (1) und `hreflang_self_reference_missing` (1) sind **Artefakte meines Testaufbaus**, keine Befunde über die Website. Belastbar sind ausschließlich die rein HTML-basierten Zahlen oben.

---

## 5. Verifikation der echten Befunde

Was V4 richtig meldet, habe ich live nachgemessen:

**`large_image_resource` — 3 unique, alle echt:**
```
_DSC2321-2560x1707.webp          503.984 B   (<link rel=preload>, automotive-fotografie-duesseldorf)
_DSC8015-1920x2400.webp          568.926 B   (Startseite)
20250607-DSC04495-1920x2560.webp 514.500 B   (landschaftsfotografie)
```
Der Lightbox-Filter greift: V1 warf 784-KB-`<a href>`-Ziele mit hinein (nie automatisch geladen), V4 zählt nur noch tatsächlich geladene Bilder. 48→45 Vorkommen, 6→3 unique.

**`body_internal_links_missing` — 2 URLs, beide echt:**

| Seite | interne Links in `<main>` | `<nav>` in `<main>` |
|---|---:|---:|
| videografie-duesseldorf | **0** | 0 |
| viola-musik-duesseldorf | **0** | 0 |
| *Gegenprobe* sportwagen-koeln | 42 | 3 |
| *Gegenprobe* leistungen | 15 | 0 |

Präzise Regel: feuert genau dort, wo wirklich keine Links im Hauptinhalt stehen, und schweigt bei Seiten mit Link-Grids.

**`static_resource_cache_policy_missing` — 7 unique, 6 davon echt:** Favicons und `site.webmanifest` liefern weiterhin `public, max-age=0, must-revalidate`. Der siebte Posten ist das Analytics-Skript eines Drittanbieters — nicht beeinflussbar und in einer eigenen Kategorie besser aufgehoben.

---

## 6. Was am Site Audit verbessert werden sollte

### P0 — Deployment (blockiert alles andere)

1. **Klären, warum `packages/ai` nicht im Run ankommt.** Solange das offen ist, ist jede weitere Regelarbeit unsichtbar. Konkreter Verifikationsschritt für V5: Prüfen, ob `placement: head` im Report auftaucht. Erscheint dort weiter durchgehend `body`, läuft immer noch alter Code — dann sind alle anderen Zahlen wertlos.
2. **Deployment-Marker in den Report aufnehmen.** Eine Zeile `Crawler build: <sha>` im Kopf hätte diese ganze Analyse auf dreißig Sekunden verkürzt. Ohne sie ist nicht unterscheidbar, ob eine Regel falsch ist oder nur alt.

### P1 — Regeln (im Code teils schon gelöst, aber unbestätigt)

3. `bodyInternalInlinkCount` auf der Inlink-Seite genauso ersetzen wie auf der Outlink-Seite (betrifft `weak_internal_inlinks`, `contextual_internal_inlinks_missing`).
4. `low_content_density` entweder gegen den Textanteil *ohne* Attributwerte rechnen oder in „Markup-Overhead" umbenennen — es ist eine Performance-, keine Content-Metrik.
5. Titel- und Description-Länge in Pixelbreite messen statt in Zeichen (betrifft 52 Meldungen, überwiegend Grenzfälle bei 61–65 Zeichen).
6. Externe Linkprüfung: Retry mit Browser-User-Agent und eine eigene Kategorie „nicht prüfbar (Bot-Gating)". Beide gemeldeten Ziele liefern mit Browser-UA HTTP 200. Eine „kaputter Link"-Meldung, die zum Entfernen eines funktionierenden Google-Bewertungslinks führt, richtet Schaden an.
7. `thin_content` seitentyp-abhängig bewerten — auf einer Kontaktseite ist wenig Text kein Mangel.

### P2 — Aggregation

8. `duplicate_internal_anchor_targets` bereits in der **Projektion** nach Ankertext gruppieren, nicht erst im Report. 252 Findings für eine Ursache („Übersicht" → 2 Ziele) ist ein Datenmodell-Problem, das die Aufbereitung derzeit nur kaschiert.
9. `uniqueAffectedCount` auch bei abgeschnittenen Ergebnismengen korrekt berechnen. Aktuell fällt der Wert bei `hasMoreFindings` auf den Vorkommenswert zurück — also genau dann, wenn der Report groß ist und die Zahl am meisten irritiert.
10. Drittanbieter-Ressourcen (`analytics.contextter.com`) getrennt ausweisen. Sie sind nicht behebbar und verwässern sonst die Trefferquote.

### P3 — Testinfrastruktur

11. **Die `siteAuditV2`-Testsuite in `packages/db` ist flaky.** Wiederholte Läufe derselben Datei ergaben 4, dann 1, dann 1 Fehler; der ganze Ordner 37 bzw. 72 Fehler. Dominanter Fehler: `test began while previous transaction was still open` (10 von 11 Fällen) — ein Transaktions-Leak im `convex-test`-Harness, lastabhängig. Das ist nicht durch meine Änderungen verursacht (nachgewiesen: nach Entfernen meiner Registry-Tupel schlugen sogar *mehr* Tests fehl), aber es ist gefährlich: Eine Suite, deren Ergebnis von der Maschinenlast abhängt, kann eine echte Regression nicht mehr von Rauschen unterscheiden.

### P4 — Neue Checks

12. **Boilerplate-Anteil je Seite.** Bei 190 Seiten mit identischen 93-Link-Grids ist „wie viel Prozent dieser Seite ist einzigartig?" die aussagekräftigste Einzelmetrik, die das Tool derzeit nicht hat.
13. Canonical-Ketten, hreflang-Reziprozität, strukturierte Daten gegen Schema.org.

---

## 7. Bewertung

**Was gut ist:**

Die Evidenzqualität bleibt die größte Stärke. Jeder Fund liefert Quell-URL, Ziel-URL, Element, Attribut, DOM-Index und Statuscode. Genau deshalb konnte ich in dieser Runde drei neue Regelprobleme finden und den Deployment-Ausfall überhaupt nachweisen — bei einem Tool, das nur Zahlen ausgibt, wäre das unmöglich gewesen.

Die Aufbereitungsebene ist inzwischen solide. Unique-Zahlen stimmen, der Evidence-Leak ist weg, die Root-Cause-Sektion für Ankertexte ist eine sinnvolle Ergänzung, und die beiden V3-Regressionen wurden sauber zurückgenommen. Die Regeln, die tatsächlich repariert wurden (`body_internal_links_missing`, `large_image_resource`), sind **präzise**: Sie feuern bei echten Fällen und schweigen bei den Gegenproben. Das ist gute Arbeit.

**Was nicht gut ist:**

Vier Runden Analyse, drei Runden Fixes — und die Trefferquote der Regel-Ebene ist seit V1 unverändert, weil die Fixes den Crawler nicht erreichen. Rund 1.500 der 4.223 Posten in V4 sind nachweislich falsch, und für jeden einzelnen davon existiert im Repository bereits die Lösung.

Das ist die eigentliche Lehre dieser Runde, und sie ist keine SEO-Erkenntnis, sondern eine Prozess-Erkenntnis: **Ein Fix, der nicht deployt ist, ist kein Fix.** Der Zyklus „analysieren → korrigieren → neu crawlen" hat dreimal sauber funktioniert, solange die Änderungen in Convex und in der App lagen. Sobald sie im Crawler-Paket lagen, ist er stumm gerissen — und niemand hat es gemerkt, weil der Report keine Versionsinformation trägt.

**Bewertung der Problemerkennung selbst**, unabhängig vom Deployment: Gemessen am aktuellen Code liefert das System auf dieser Website eine gute Trefferquote. Die verbleibenden Schwächen sind konzeptioneller Natur — Zeichen statt Pixel, Metriken ohne Seitentyp-Kontext, kein Bewusstsein für Bot-Gating, Vorkommen statt Objekte in der Gruppierung. Das sind lösbare Designfragen, keine Fehler.

---

## 8. Empfehlung für V5

Vor dem nächsten Crawl:

1. Deployment des Crawler-Pakets sicherstellen und mit `placement: head` gegenprüfen.
2. Crawler-Build-SHA in den Report-Kopf aufnehmen.

Erwartetes Ergebnis, wenn beides erledigt ist — gemessen an meinem Lauf des aktuellen Codes über dieselben Seiten:

| Code | V4 | Erwartung V5 |
|---|---:|---:|
| `broken_resource` | 100 | **0** |
| `broken_image_resource` | 37 | **0** |
| `image_resource_missing_alt` | 1.238 | **0** |
| `image_missing_alt` | 128 | **0** |
| `image_missing_dimensions` | 11 | **0** |
| `empty_internal_anchor_text` | 2 | **0** |
| `image_alt_coverage_missing` | — | **1** (portfolio.html) |

Von 4.223 auf etwa 2.700 Posten, bei gleichzeitig **einem zusätzlichen echten Befund**. Bleiben die Zahlen wie in V4, ist das Deployment weiterhin das Problem — und keine Regel muss angefasst werden.

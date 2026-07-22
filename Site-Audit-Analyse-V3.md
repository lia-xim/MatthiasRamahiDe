# Site-Audit-Analyse V3 — Crawler-Vergleich (dritte Iteration)

**Vergleich:** Run `mh82c3cdzkda9cb1dsctjf4zkn8aw9np` (V2) gegen `mh8dvtahj5wjrr53wr1zttgd9s8axvep` (V3).
**Kontrollbedingung:** Website weiterhin **nachweislich unverändert** — kein Commit, kein Deploy, meine Original-Fixes liegen unverändert uncommitted im Working Tree. Jede Differenz misst ausschließlich den Crawler.
**Ergebnis:** 1 echter Fix (der wichtigste offene Punkt aus V2), 2 Regressionen, und die 4 zentralen Regel-Bugs zum dritten Mal byte-genau unverändert.

---

## 0. Kontrollbedingung

```
git log                          unverändert (5020647, keine neuen Commits seit V1)
git status                       meine 7 Dateien weiterhin " M", nicht committet
Live-Gegenprobe:
  favicon.ico Cache-Control      public, max-age=0, must-revalidate   (unverändert)
  /blog.html Artikel-Links       6   (Orphan weiterhin da)
  Portfolio-Bilder mit echtem alt 0
```

Identisches Testobjekt. Alle Zahlen unten messen den Crawler.

---

## 1. Gesamtbild

| | V1 | V2 | V3 |
|---|---:|---:|---:|
| Findings laut Header | 4.654 | 4.418 | 4.223 |
| Issue-Codes | 23 | 21 | 21 |

Der gesamte Rückgang V2 → V3 (−195) stammt aus **genau einem Code**: `body_internal_links_missing` fiel von 197 auf 2. Alle übrigen 20 Codes sind in Zahl und Evidence unverändert. Das ist kein Nebeneffekt-Rauschen — es ist eine einzige, gezielte Änderung.

Das ist gleichzeitig die gute und die ernüchternde Nachricht: Der Agent hat **genau den einen Punkt** getroffen, den ich in V2 als oberste Priorität markiert hatte („`body_internal_links_missing` deaktivieren, bis das Feld berechnet wird — 197 Falschmeldungen aus dem Nichts") — und **nur** diesen. Die vier P0-Regelfehler, die in jeder bisherigen Analyse ganz oben standen, sind zum dritten Mal unangetastet.

---

## 2. Was gut gemacht wurde

### 2.1 `body_internal_links_missing`: 197 Fehlalarme → 2 echte Funde

Das ist ein sauberer, vollständiger Fix — kein halber. In V2 war dieser Code der größte Einzelposten (197 URLs, 78 % der Website), getrieben von `bodyInternalOutlinkCount`, einem Feld, das im gesamten Report konstant null war. In V3 ist dieses Feld **entfernt** und durch `internalLinkCount` ersetzt:

```
V2 Evidence:  internalOutlinkCount: 49; bodyInternalOutlinkCount: 0; wordCount: 735
V3 Evidence:  internalLinkCount: 49
```

Die verbleibenden 2 gemeldeten Seiten habe ich live gegengeprüft — und sie sind **echt**:

| Seite | interne Links im `<main>` | `<nav>`-Grids | Wörter |
|---|---:|---:|---:|
| `/videografie-duesseldorf.html` | **0** | 0 | 275 |
| `/viola-musik-duesseldorf.html` | **0** | 0 | 254 |
| — Gegenprobe: `/` | 22 | 0 | 412 |
| — Gegenprobe: `/sportwagen-fotografie-dormagen.html` | 42 | 3 | 884 |
| — Gegenprobe: `/leistungen.html` | 15 | 0 | 434 |

Die beiden gemeldeten Seiten haben tatsächlich **null interne Links im Hauptinhalt** — keine Städte-Grids, keine Fließtext-Links, nichts. Es sind isolierte Service-Seiten. Die zuvor 195 fälschlich geflaggten Seiten (Startseite, Städte-Cluster, Leistungen) sind alle korrekt herausgefallen, weil sie reale Links im `<main>` haben.

**Zwei Dinge auf einmal gelöst:**

1. **197 False Positives → 2 True Positives.** Präzise umgekehrte Trefferquote.
2. **Der interne Widerspruch aus V2 ist aufgelöst.** In V2 erkannte `contextual_internal_inlinks_missing` die Städteseiten als kontextuell verlinkt (Inlink-Seite repariert), während `body_internal_links_missing` dieselben Seiten als „keine Body-Outlinks" meldete (Outlink-Seite kaputt) — derselbe Link zählte am Ziel als kontextuell und an der Quelle als nicht existent. In V3 sind die Städteseiten aus `body_internal_links_missing` verschwunden. Beide Hälften der Linkgraph-Analyse stimmen jetzt überein.

Das war meine wichtigste V3-Empfehlung, und sie wurde nicht nur abgehakt, sondern **richtig** umgesetzt: kein Deaktivieren mit Datenverlust, sondern das kaputte Feld durch ein funktionierendes ersetzt. Der beste einzelne Fix in drei Iterationen.

### 2.2 Die sichere externe-Link-Empfehlung ist erhalten geblieben

Der V2-Schutztext steht unverändert im Report:

```
"Never replace a working public link with a login, sign-in, challenge,
 or account-authentication URL."
```

Kein Rückfall auf die ursprünglich gefährliche Formulierung. Gut, dass diese Absicherung nicht mit den anderen Rückabwicklungen (siehe 3) verloren ging.

---

## 3. Was schlecht gemacht wurde: zwei Regressionen

V3 hat zwei korrekte V2-Verbesserungen wieder rückgängig gemacht — vermutlich als Überreaktion auf meine V2-Kritik am Unique-Zähler.

### 3.1 Der „Unique"-Zähler ist jetzt der Vorkommenswert unter falschem Label

Das ist die gravierendere der beiden Regressionen. Die Entwicklung über drei Versionen:

| Version | Feld & Wert (cache-Block) | Reale Unique-Assets | Bewertung |
|---|---|---:|---|
| V1 | `Affected count from run: 700 assets` | 7 | ehrlich (Vorkommen, korrekt benannt) |
| V2 | `Unique affected assets from run: 3` | 7 | Bug — **untertreibt**, verbirgt 4 von 7 |
| V3 | `Unique affected assets from run: 700` | 7 | **Label widerspricht sich selbst** |

In V2 hatte ich kritisiert, dass `unique < loaded` (3 < 7) logisch unmöglich ist und Arbeit verbirgt. Der Agent hat das „behoben", indem er die Zahl auf den alten Vorkommenswert (700) zurückgesetzt hat — aber das Label „Unique affected" beibehalten. Jetzt behauptet der Report:

```
- Unique affected assets from run: 700
- Loaded affected assets in this copy: 7
```

700 „unique" Assets, von denen 7 geladen wurden — und die Liste darunter enthält exakt 7 verschiedene URLs (`favicon.ico`, `favicon.svg`, 3 weitere Favicons, `apple-touch-icon.png`, `site.webmanifest`, `analytics…/script.js`). Es gibt keine 700 unique Assets; es gibt 7.

Betroffen sind die 3 Codes, bei denen ein Asset auf vielen Seiten vorkommt:

| Code | „Unique" laut V3 | Real unique |
|---|---:|---:|
| `render_blocking_resource` | 1.516 | 32 |
| `image_resource_missing_alt` | 1.238 | 71 |
| `static_resource_cache_policy_missing` | 700 | 7 |

**Einordnung:** Die V2-Version verbarg Arbeit (sagte 3, obwohl 7 zu fixen waren) — das war aktiv irreführend. Die V3-Version verbirgt nichts (700 ≥ 7), ist also weniger schädlich, aber das Label ist jetzt nachweislich falsch und die eigentliche Aggregations-Verbesserung aus V2 ist verloren. Netto ein Rückschritt: aus „ehrlicher Vorkommenszähler" (V1) wurde über einen Umweg „Vorkommenszähler, der behauptet, ein Unique-Zähler zu sein" (V3). Die logische Unmöglichkeit `unique < loaded` ist zwar beseitigt — aber durch Rückbau, nicht durch korrekte Berechnung.

Der richtige Wert stünde bereits im Report: `Loaded affected … in this copy: 7` ist für diese Seite die tatsächliche Unique-Zahl. Es fehlt nur die Zeile „auf 100 Seiten".

### 3.2 Severity-Rückstufung rückgängig gemacht

```
static_resource_cache_policy_missing:   V1 medium  →  V2 low  →  V3 medium
```

V2 hatte diesen Code korrekt auf `low` herabgestuft (fehlendes Favicon-Caching ist kein Medium-Problem). V3 hat das auf `medium` zurückgesetzt. Zusammen mit 3.1 wirkt es, als sei die gesamte V2-Aggregationsarbeit an diesem Code rückabgewickelt worden.

---

## 4. Was weiterhin offen ist: die vier P0-Regelfehler (3. Iteration unverändert)

Diese vier Evidenz-Blöcke sind in V1, V2 **und** V3 byte-genau identisch. Sie sind in jeder Analyse P0 und wurden dreimal nicht angefasst.

| Code | Sev | V3-Status | Nachweis |
|---|---|---|---|
| `broken_resource` | **high** | unverändert | `preconnect` auf `cms.…de/` (401) wird als ladbare Ressource behandelt. Einzige High-Meldung im Report, weiterhin falsch. |
| `broken_image_resource` | high | unverändert | `data:`-URI wird am Komma zerlegt → erfundene URL `…/R0lGODlhAQABAIAAAAAAAP/yw…` mit `///`→`/`-Korruption. |
| `image_missing_alt` (+`image_resource_missing_alt`) | low | unverändert | `alt=""` (spec-konform dekorativ) wird als fehlend gezählt: `imageCount: 23; imagesMissingAltCount: 3`. Größte Einzelquelle. |
| `empty_internal_anchor_text` | medium | unverändert | 33 Lightbox-Links mit `aria-label` gelten als leer; `.webp`-Dateilinks im Seitengraph. |

Dazu unverändert aus V2:

- **`placement`**: 1.087× „body", 1× „header". Alle `<head>`-Ressourcen (Favicons, Preloads, `preconnect`, `manifest`) weiterhin als „body" gemeldet. Der Klassifizierer kennt `header`, aber keinen `head`-Fall.
- **`missingAlt`-Leak**: weiterhin auf 15 Codes, inklusive `title_too_long` und `h1_duplicate`.
- **Boilerplate-Issue-Summary**: weiterhin 5 Blöcke mit „deeper than click depth 5 …", teils der eigenen Evidence widersprechend.
- **`duplicate_internal_anchor_targets`**: weiterhin 252 URLs, nach Seite statt nach Ankertext gruppiert — der echte Befund („Übersicht" → 2 Ziele) bleibt in 252 Zeilen begraben.

---

## 5. Das Muster über drei Iterationen

Der aussagekräftigste Befund ist nicht ein einzelner Fix, sondern die Kurve über drei Runden:

| Was | Art des Fehlers | V1 | V2 | V3 |
|---|---|---|---|---|
| `resource_content_type_mismatch` | tautologischer Folgecode | ✗ | **behoben** | behoben |
| `large_image_resource` | Regel zu grob | ✗ | **verbessert** (0/6→2/3) | gehalten |
| `contextual_internal_inlinks` | `<nav>`-Fehlklassifikation (Inlink) | ✗ | **behoben** (208→14) | gehalten |
| `body_internal_links` | konstant-null-Feld (Outlink) | ✗ | ✗ (Widerspruch) | **behoben** (197→2) |
| gefährliche externe Empfehlung | Sicherheit | ✗ | **behoben** | gehalten |
| Entity-Dekodierung (Titel) | Messung | ✗ | **behoben** | gehalten |
| **`alt=""` als fehlend** | **Web-Standard** | ✗ | ✗ | ✗ |
| **`data:`-URI-Parsing** | **Web-Standard** | ✗ | ✗ | ✗ |
| **`preconnect` abgerufen** | **Web-Standard** | ✗ | ✗ | ✗ |
| **`aria-label` ignoriert** | **Web-Standard** | ✗ | ✗ | ✗ |
| `placement` für `<head>` | DOM-Region | ✗ | ✗ | ✗ |

Das Muster ist eindeutig: **Der Agent behebt zuverlässig die Fehler, die als konkreter, benannter Datenfluss beschrieben sind** — ein tautologischer Code, ein konstant-null-Feld, ein Empfehlungstext, eine Entity-Dekodierung. Er behebt in drei Runden **keinen einzigen** der vier Fehler, die ein Verständnis eines Web-Standards erfordern: was `alt=""` bedeutet, wie `srcset` und `data:`-URIs aufgebaut sind, was `preconnect` tut, wie der Accessible Name aus `aria-label` entsteht.

Genau diese vier sind aber die größten False-Positive-Quellen (zusammen ~510 gelistete Posten) und die einzige High-Severity-Meldung im ganzen Report. Es werden also konsequent die mechanisch greifbaren Fehler zuerst abgearbeitet und die konzeptionell anspruchsvollen umgangen — obwohl Letztere die wirkungsvollsten sind.

Ein zweites Muster: **jede „Korrektur" am Zählwerk hat eine neue Inkonsistenz erzeugt.** V2 führte den Unique-Zähler ein und untertrieb (3 statt 7). V3 korrigierte das durch Rückbau und überschrieb das Label falsch (700 „unique"). Zweimal hintereinander wurde dieselbe Kennzahl angefasst und blieb zweimal falsch — einmal zu niedrig, einmal falsch benannt. Das deutet darauf hin, dass die zugrundeliegende Datenstruktur (Vorkommen vs. Unique) nicht sauber getrennt ist und jede Änderung nur ein Symptom verschiebt.

---

## 6. Empfehlungen für V4 — in dieser Reihenfolge

Die Aufbereitungs-Ebene ist inzwischen weitgehend in Ordnung. Der Wert liegt jetzt fast vollständig in der **Regel-Ebene**, die seit V1 unberührt ist.

**Zuerst — die vier Web-Standard-Regeln, die dreimal übersprungen wurden (~510 Fehlalarme):**

1. `alt=""` ≠ fehlendes `alt`. Nur das fehlende Attribut ist ein Fehler. Stattdessen der Check „N Content-Bilder, 0 mit beschreibendem Alt-Text". *(−~150)*
2. `srcset` spec-konform tokenisieren (`data:`-URIs mit Komma nicht am Komma splitten); `///`→`/`-Kollaps im URL-Normalisierer beheben, weil er auch echte Pfade korrumpiert.
3. `rel="preconnect|dns-prefetch|prefetch|prerender"` nicht abrufen. Beseitigt die einzige — falsche — High-Severity-Meldung.
4. Accessible Name nach Spezifikation (`aria-label` → `aria-labelledby` → Text → `alt` → `title`); Nicht-HTML-Ziele aus dem Seitengraph. *(−33 Links)*

**Dann die zwei Regressionen aus V3:**

5. Unique-Zähler korrekt berechnen **oder** ehrlich benennen. Wenn die echte Unique-Zahl nicht vorliegt: Feld auf den V1-Namen „Affected count from run" zurücksetzen (ehrlicher Vorkommenswert). Die Zeile „Loaded … in this copy: 7" enthält bereits die reale Unique-Zahl — es fehlt nur „auf N Seiten". Invariante `unique ≥ loaded ≥ Anzahl distinkter gelisteter URLs` als Assertion im Renderer.
6. `static_resource_cache_policy_missing` wieder auf `low`.

**Dann Rest-Aufbereitung (unverändert seit V2):**

7. `placement`: `head` als Region ergänzen — die eine korrekte `header`-Meldung zeigt, dass die Logik existiert und nur diesen Fall nicht kennt.
8. `missingAlt` aus dem gemeinsamen Evidence-Objekt entfernen, wo nicht anwendbar (15 Codes).
9. `duplicate_internal_anchor_targets` nach Ankertext gruppieren statt nach Seite.

**Neue Checks (P3):** Selbstverlinkung (real: 111 von 120 Seiten), Canonical-Ketten, hreflang, strukturierte Daten.

---

## 7. Fazit

V3 hat **eine** Sache gemacht — und die richtig. `body_internal_links_missing` war die klarste offene Baustelle, und der Fix ist vorbildlich: 197 False Positives auf 2 verifizierte True Positives, das kaputte Feld ersetzt statt nur stummgeschaltet, und der interne Widerspruch der Linkgraph-Analyse dabei aufgelöst. Wäre das die einzige Änderung gewesen, wäre V3 ein klarer Fortschritt.

Es ist aber begleitet von zwei Rückschritten am Zählwerk (Unique-Label sagt jetzt „700" für 7 Assets; Severity zurückgedreht) und — schwerwiegender — vom dritten Überspringen der vier zentralen Regelfehler. Diese vier sind nicht Nebensache: Sie stellen die größte False-Positive-Quelle und die einzige High-Severity-Meldung des Reports, und sie sind seit V1 Zeichen für Zeichen unverändert.

Der rote Faden über drei Iterationen: **Der Agent arbeitet die als konkreter Datenfluss beschreibbaren Fehler ab und umgeht systematisch die, die Web-Standard-Wissen erfordern.** Solange `alt=""`, `srcset`/`data:`, `preconnect` und `aria-label` nicht angefasst werden, sinkt die Finding-Zahl weiter in Trippelschritten (4.654 → 4.418 → 4.223), während der harte Kern des Rauschens — rund 510 Posten aus vier Regeln — unberührt bleibt. Die nächste Iteration sollte genau dort ansetzen und nichts anderes: die vier Regeln, dann die zwei Regressionen. Das brächte den Report von ~4.200 auf grob 90 belastbare Posten. Alles andere ist inzwischen Politur an einem Report, dessen Substanzproblem woanders liegt.

---

## Anhang: Trajektorie der 21 Codes über drei Runden

| Code | Sev (V3) | V1 | V2 | V3 | Bewertung V3 |
|---|---|---:|---:|---:|---|
| `broken_resource` | high | 1 | 1 | 1 | falsch (preconnect) |
| `broken_image_resource` | high | 1 | 1 | 1 | falsch (data:-URI) |
| `static_resource_cache_policy_missing` | medium | 700→7 | 3 | 700 | Label-Regression |
| `large_image_resource` | medium | 6 | 3 | 3 | 2/3 korrekt |
| `title_too_long` | medium | 9 | 9 | 9 | marginal wahr |
| `empty_internal_anchor_text` | medium | 2 | 2 | 2 | falsch (aria-label) |
| `thin_content` | medium | 2 | 2 | 2 | 1/2 wahr |
| `orphan_sitemap_url` | medium | 1 | 1 | 1 | **wahr** |
| `render_blocking_resource` | low | 1516→32 | 15 | 1516 | Label-Regression; nicht handlungsrelevant |
| `image_resource_missing_alt` | low | 1238→71 | 22 | 1238 | Label-Regression + `alt=""`-Bug |
| `duplicate_internal_anchor_targets` | low | 252 | 250 | 252 | wahr, über-berichtet |
| `image_missing_alt` | low | 128 | 128 | 128 | falsch (`alt=""`) |
| `broken_external_link` | low | 55 | 55 | 55 | falsch (Bot-Wall) |
| `meta_description_too_long` | low | 43 | 43 | 43 | marginal wahr |
| `contextual_internal_inlinks_missing` | low | 208 | 14 | 14 | **wahr** (V2-Fix gehalten) |
| `image_missing_dimensions` | low | 11 | 11 | 11 | **wahr** |
| `weak_internal_inlinks` | low | 9 | 9 | 9 | teils wahr |
| `body_internal_links_missing` | low | 198 | 197 | **2** | **wahr (V3-Fix)** |
| `low_content_density` | low | 2 | 2 | 2 | Duplikat von thin_content |
| `h1_duplicate` | low | 2 | 2 | 2 | marginal wahr |
| `redirected_external_link` | info | 55 | 55 | 55 | falsch (Bot-Wall) |
| `resource_content_type_mismatch` | — | 37 | entfernt | entfernt | V2-Fix gehalten |
| `internal_inlinks_missing` | — | 1 | entfernt | entfernt | V2-Merge gehalten |

*„700→7" in Spalte V1 bezeichnet Vorkommen→real-unique. Die V3-Spalte zeigt den Wert des Feldes „Unique affected … from run", der bei 3 Codes fälschlich den Vorkommenswert trägt.*

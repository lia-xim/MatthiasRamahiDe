# Site-Audit-Analyse V8

**Datum:** 2026-07-21
**Report:** `Site-Audit-V8.md` — exportiert 22:19, **1.265 Findings, 17 Codes**
**Run ID:** `mh86gceh57v8bjtf610j2amhcs8azkjj` (neuer Crawl)
**Crawler build:** `418257d4a2fa-dirty-3dd758a28afe` — **identisch mit V7**
**Vorgänger:** V7 — 745 Findings, 2 Codes (Ausfall) · V6 — 3.171 Findings, 16 Codes

---

## 0. Das Wichtigste zuerst

**Zwei Dinge auf einmal: Der V7-Ausfall ist behoben, und drei Empfehlungen sind gelandet.**

Der V7-Ausfall war **kein Code-Fehler**. V8 läuft auf **demselben Build** wie V7 und liefert alle 14 verlorenen Codes zurück. Damit ist die V7-Diagnose bestätigt: ein transienter Lane-Ausfall, keine Regression. Das ist die gute Nachricht — und zugleich die beunruhigende, denn ein Run kann offenbar mit `completed` enden, obwohl sechs von sieben Lanes nichts geliefert haben.

Und die Reduktion 3.171 → 1.265 ist diesmal **echte Aggregation, kein Verlust**. Sie lässt sich vollständig auf drei Änderungen zurückführen:

```
render_blocking_resource            1745  →    33     -1712
duplicate_internal_anchor_targets    252  →    56      -196
body_internal_links_missing            0  →     2        +2
                                                      -----
                                    3171  →  1265     -1906
```

**Jeder andere Code ist unverändert.** 17 Codes statt 16 — es wurde nichts verloren, im Gegenteil.

---

## 1. Die drei Änderungen im Detail

### 1.1 `render_blocking_resource`: 1.745 → 33 (Empfehlung P2 #7)

```
V6:  Finding occurrences: 1745   Unique affected assets: 33
V8:  Finding occurrences:   33   Unique affected assets: 33
```

Vorkommen und Unique sind jetzt 1:1 — die Regel meldet pro Datei statt pro Seite × Datei. Das war mit Abstand der größte Einzelposten des Reports und hat den Aufwand um Faktor 53 überzeichnet. 33 Stylesheets sind eine überschaubare, prüfbare Liste; 1.745 Meldungen waren es nicht.

### 1.2 `duplicate_internal_anchor_targets`: 252 → 56 / 5 unique (Empfehlung P2 #6)

Das ist die wertvollste der drei Änderungen, weil sie nicht nur die Zahl senkt, sondern den Befund **überhaupt erst benutzbar macht**. Die Evidence ist jetzt nach Ankertext gruppiert:

```
anchorText: Supersportwagen Fotografie
occurrenceCount: 9   sourcePageCount: 9
sourcePages: sportwagen-shooting-duesseldorf.html, sportwagen-fotografie-leverkusen.html, …
targetCount: 2
targets[0]: supersportwagen-fotografie-duesseldorf.html
targets[1]: supersportwagen-fotografie.html
```

**Live verifiziert** — der Befund ist echt und das Muster jetzt sichtbar:

| Quellseite | „Supersportwagen Fotografie" zeigt auf |
|---|---|
| `motorsport-sportwagen-fotografie-duesseldorf.html` | `supersportwagen-fotografie-**duesseldorf**.html` |
| `performance-car-fotografie-duesseldorf.html` | `supersportwagen-fotografie-**duesseldorf**.html` |
| `sportwagen-shooting-duesseldorf.html` | `supersportwagen-fotografie-**duesseldorf**.html` |
| `sportwagen-fotografie-hilden.html` | `supersportwagen-fotografie.html` |
| `sportwagen-fotografie-leverkusen.html` | `supersportwagen-fotografie.html` |

Innerhalb *einer* Seite ist jeder Anker eindeutig; der Konflikt entsteht **seitenübergreifend**. Düsseldorf-Seiten verlinken die Stadt-Variante, andere die generische.

Das ist der eigentliche Fortschritt: In V6 waren das 252 Zeilen, aus denen niemand dieses Muster hätte ablesen können. Jetzt sind es 5 Ankertexte mit Quellen und konkurrierenden Zielen — und man kann tatsächlich **entscheiden**. Meine Einschätzung: Das Verhalten ist wahrscheinlich beabsichtigt (lokale Relevanz) und damit eher ein `info`-Befund als ein Fehler. Aber diese Beurteilung war vorher schlicht nicht möglich.

### 1.3 `body_internal_links_missing`: 0 → 2 — mein Fix ist live

```
- Finding occurrences from run: 2
- Unique affected urls from run: 2
- Evidence: internalLinkCount: 49
- https://matthiasramahi.de/videografie-duesseldorf.html
- https://matthiasramahi.de/viola-musik-duesseldorf.html
```

Exakt die zwei Seiten, die ich in V5 als verlorene True Positives identifiziert hatte, und exakt die Vorhersage aus meiner V7-Analyse. Die Regel liest jetzt `structuralRegion === "body" && !navigationRole` — das Mobile-Menü, das als nacktes `<nav>` zwischen `</header>` und `<main>` steht, gilt nicht mehr als Fließtext-Verlinkung.

Und die Gegenprobe hält: Die 190 Städteseiten feuern **nicht**, weil ihre fünf echten Fließtext-CTAs weiterhin als kontextuell zählen.

### 1.4 Der V7-Zählfehler ist behoben

```
static_resource_cache_policy_missing
V7:  Header 250  ←→  Evidence 700 Zeilen   (widersprüchlich)
V8:  Header 700  ←→  Evidence 700          ✓
```

---

## 2. Der V7-Ausfall: Diagnose bestätigt

| | V7 | V8 |
|---|---|---|
| Crawler build | `418257d4a2fa-dirty-3dd758a28afe` | **identisch** |
| Codes | 2 | 17 |
| Lanes mit Findings | nur `resource_fetch` | alle |

**Gleicher Code, gegensätzliches Ergebnis.** Damit ist ausgeschlossen, dass V7 durch eine Regeländerung verursacht wurde — es war ein Laufzeit-Ausfall, wie in meiner V7-Analyse vermutet.

Das entlastet die Regeln, verschärft aber den Prozesspunkt: **Ein Run darf nicht `completed` melden, wenn sechs von sieben Lanes leer und fehlerfrei enden.** V7 hat genau das getan und wäre ohne den Vergleich zweier Reports nicht aufgefallen. Diese Absicherung fehlt weiterhin (P0 #3 und #4 aus meiner V7-Analyse).

---

## 3. Wo der Report jetzt steht

| Kategorie | Codes | Vorkommen |
|---|---|---:|
| **Echt, präzise, verifiziert** | `image_missing_dimensions` (11/11), `large_image_resource` (503–569 KB), `static_resource_cache_policy_missing` (6 von 7), `h1_duplicate`, `orphan_sitemap_url`, `self_referential_internal_link`, `image_alt_coverage_missing`, `body_internal_links_missing`, `thin_content`, `contextual_internal_inlinks_missing` | ~960 |
| **Echt, jetzt gut aggregiert** | `render_blocking_resource` (33/33), `duplicate_internal_anchor_targets` (56/5) | 89 |
| **Grenzwertig** | `title_too_long` (9), `meta_description_too_long` (43) | 52 |
| **Weiterhin falsch** | `broken_external_link` — g.page, live HTTP 200 mit Browser-UA | 55 |
| **Mit kaputtem Feld** | `weak_internal_inlinks` — `bodyInternalInlinkCount: 0` | 9 |

Nachweislich falsch: **55 von 1.265 ≈ 4 %.**

Die Kurve über acht Runden:

| | Findings | Codes | Fehlalarme |
|---|---:|---:|---:|
| V1 | 4.654 | 23 | ~1.650 (35 %) |
| V4 | 4.223 | 21 | ~1.650 (39 %) |
| V5 | 3.171 | 16 | ~55 (2 %) |
| V7 | 745 | 2 | Ausfall |
| **V8** | **1.265** | **17** | **~55 (4 %)** |

V5 hat die Fehlalarme beseitigt, V8 die Überzeichnung. Beides ohne Erkennungsverlust — im Gegenteil, V8 hat mit `body_internal_links_missing` einen Code mehr als V6.

---

## 4. Was offen bleibt

| Punkt | Stand | Herkunft |
|---|---|---|
| Run-Status-Gate gegen Lane-Ausfall | ❌ offen | V7 P0 #3 |
| Regressionsschranke bei Findings-Verlust zwischen zwei Runs | ❌ offen | V7 P0 #4 |
| `g.page` in `external_link_unverifiable` einsortieren | ❌ offen, 55 Fehlalarme | V5 |
| `bodyInternalInlinkCount` auf der Inlink-Seite ersetzen | ❌ offen | V5 — Vorlage steht in meinem Fix |
| Titel/Description in Pixelbreite | ❌ offen | V4 |
| `sourceUrl` in die Resource-Evidence | ❌ offen | V5 |
| Invariante `Vorkommen ≥ unique ≥ distinkte URLs` als Assertion | ❌ offen | V7 — vier Zählfehler in acht Runden |
| Worker aus sauberem Stand bauen (`-dirty`) | ❌ offen | V6 |

---

## 5. Empfehlung für V9

**P0 — die Absicherung, die V7 gebraucht hätte**

1. Lane-Status pro Run persistieren und im Report ausweisen. Ein Run mit leerer Lane ohne Fehler ist `partial`, nicht `completed`.
2. Automatischer Vergleich zum Vorlauf: Ein Rückgang um mehrere Codes ist ein Alarm. Die Compare-Funktion existiert — sie sollte das selbst tun.

**P1 — die letzten 55 Fehlalarme**

3. `g.page` retry mit Browser-UA, dann `external_link_unverifiable`. Das ist der einzige verbliebene nachweisbare Fehlalarm im ganzen Report.

**P2 — Restpräzision**

4. `bodyInternalInlinkCount` ersetzen (`weak_internal_inlinks`, `contextual_internal_inlinks_missing`).
5. Titel/Description in Pixelbreite.
6. `sourceUrl` in die Resource-Evidence.
7. Zähl-Invariante als Assertion im Renderer.

**P3 — neue Checks**, jetzt sinnvoll, weil das Rauschen weg ist

8. Boilerplate-Anteil je Seite. Bei 190 Seiten mit identischen Link-Grids ist „wie viel Prozent dieser Seite ist einzigartig?" die aussagekräftigste fehlende Metrik.
9. Canonical-Ketten, hreflang-Reziprozität, strukturierte Daten gegen Schema.org.

---

## 6. Fazit

V8 ist die beste Runde der Serie. Nicht wegen der Zahl, sondern weil sich jede einzelne Änderung sauber zurückverfolgen lässt: −1.712 aus einer Aggregationsregel, −196 aus einer Gruppierung, +2 aus einer Regelkorrektur, sonst nichts. Chirurgischer geht es nicht.

Inhaltlich bemerkenswert ist `duplicate_internal_anchor_targets`. Der Befund war in V1 bis V6 unverändert vorhanden und unverändert wertlos — 252 Zeilen, aus denen sich keine Handlung ableiten ließ. Dieselbe Erkenntnis steht jetzt in fünf Zeilen mit Quellen und konkurrierenden Zielen, und man kann sie beurteilen (mein Urteil: wahrscheinlich beabsichtigte lokale Relevanz, eher `info` als Fehler). **Die Regel hat sich nicht geändert — nur ihre Darstellung.** Das ist ein guter Beleg dafür, dass Aggregation kein Kosmetikthema ist: Sie entscheidet darüber, ob ein korrekter Befund überhaupt zu einer Entscheidung führen kann.

Der offene Kern ist nicht mehr die Erkennung, sondern die **Betriebssicherheit**. V7 hat gezeigt, dass ein stiller Lane-Ausfall unbemerkt durchgeht und als Erfolg gelesen werden kann — 745 Findings sahen aus wie das Ziel. Dass V8 mit demselben Build wieder vollständig lief, ist beruhigend für den Code und beunruhigend für den Betrieb: Der Unterschied lag nicht am Programm, und es gibt weiterhin nichts, das ihn meldet.

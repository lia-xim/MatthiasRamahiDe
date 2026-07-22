# Site-Audit-Analyse V7 — Regression

**Datum:** 2026-07-21
**Report:** `Site-Audit-V7.md` — exportiert 20:15, **745 Findings, 2 Codes**
**Run ID:** `mh8ay3mznhxxqmaa2w6tyw4hdd8azasa` (neu — echter neuer Crawl)
**Crawler build:** `418257d4a2fa-dirty-3dd758a28afe` (neuer Dirty-Hash, also neuer Code)
**Vorgänger:** V6 — 3.171 Findings, 16 Codes

---

## 0. Das Wichtigste zuerst

**V7 ist keine Verbesserung, sondern ein Ausfall.** Von 16 Issue-Codes sind **14 verschwunden** — darunter mehrere, die ich in den Vorrunden live als echt verifiziert habe.

Der Rückgang von 3.171 auf 745 sieht nach dem erhofften Aufräumen aus. Er ist es nicht: Die Website ist unverändert, die Regeln bestehen ihre Tests, und die Befunde fehlen einfach.

**Beleg — dieselben Seiten, jetzt live nachgemessen:**

```
title_too_long        motorsport-fotografie.html    65 Zeichen   → V7 meldet nichts
                      naturfotografie-prints.html   62 Zeichen   → V7 meldet nichts
                      blog.html                     62 Zeichen   → V7 meldet nichts
image_alt_coverage    portfolio.html   58 Bilder, 58× alt=""     → V7 meldet nichts
```

Das ist gefährlicher als das ursprüngliche Fehlalarm-Problem. Ein Report mit 1.650 falschen Meldungen kostet Zeit. Ein Report, der 12 reale Problemklassen still weglässt, erzeugt **falsche Sicherheit**.

---

## 1. Was fehlt

| Code | V6 | V7 | Bewertung aus Vorrunden |
|---|---:|---:|---|
| `render_blocking_resource` | 1.745 | — | echt (schlecht aggregiert) |
| `duplicate_internal_anchor_targets` | 252 | — | echt (schlecht aggregiert) |
| `self_referential_internal_link` | 227 | — | **live verifiziert echt** |
| `broken_external_link` | 55 | — | Fehlalarm (Verlust unkritisch) |
| `external_link_unverifiable` | 55 | — | korrekt eingeführt, jetzt weg |
| `meta_description_too_long` | 43 | — | grenzwertig |
| `contextual_internal_inlinks_missing` | 14 | — | plausibel echt |
| `image_missing_dimensions` | 11 | — | **live verifiziert echt, 11/11 Präzision** |
| `title_too_long` | 9 | — | **live nachgemessen, weiter gültig** |
| `weak_internal_inlinks` | 9 | — | echt (mit kaputtem Feld) |
| `h1_duplicate` | 2 | — | **live verifiziert echt** |
| `thin_content` | 2 | — | echt |
| `orphan_sitemap_url` | 1 | — | **live verifiziert echt** |
| `image_alt_coverage_missing` | 1 | — | **meine Regel, live verifiziert echt** |
| `large_image_resource` | 45 | **45** | ✅ geblieben |
| `static_resource_cache_policy_missing` | 700 | **250** | ✅ geblieben, Zahl falsch (s. 3) |

Mindestens **sechs live verifizierte True Positives** sind verschwunden.

---

## 2. Diagnose: nur eine Lane hat geliefert

Das Muster ist nicht zufällig. Die beiden überlebenden Codes gehören **beide** zur `resource_fetch`-Lane. Jede andere Lane ist vollständig stumm:

| Lane | Codes in V6 | in V7 |
|---|---|:--:|
| `resource_fetch` | `large_image_resource`, `static_resource_cache_policy_missing` | ✅ **beide da** |
| `fetch` | `title_too_long`, `thin_content`, `image_alt_coverage_missing` | ❌ keiner |
| `resource_discovery` | `image_missing_dimensions`, `render_blocking_resource` | ❌ keiner |
| `link_projection` | `duplicate_internal_anchor_targets`, `self_referential_internal_link`, `contextual_internal_inlinks_missing`, `weak_internal_inlinks` | ❌ keiner |
| `metadata_projection` | `h1_duplicate`, `meta_description_too_long` | ❌ keiner |
| `external_link_check` | `broken_external_link`, `external_link_unverifiable` | ❌ keiner |
| `sitemap_discovery` | `orphan_sitemap_url` | ❌ keiner |

Bemerkenswert: `render_blocking_resource` und `image_missing_dimensions` liegen in `resource_discovery` und sind weg, während `large_image_resource` in `resource_fetch` liegt und bleibt. Der Schnitt verläuft exakt entlang der Lane-Grenze, nicht entlang der Themen.

**Der Crawl selbst war nicht kleiner.** Die Evidence von `static_resource_cache_policy_missing` nennt **107 distinkte Quellseiten** — in V6 waren es 100. Es wurden also gleich viele oder mehr Seiten abgerufen. Es fehlen nicht die Seiten, es fehlen die Auswertungen.

**Die Regeln funktionieren.** Ich habe die Regel-Suite gegen den aktuellen Code laufen lassen: **15 Tests grün**, darunter meine Ground-Truth-Assertions, die ausdrücklich prüfen, dass `image_alt_coverage_missing` auf portfolio.html und `body_internal_links_missing` auf den zwei Service-Seiten feuern. In-Process feuern sie. Im Run erscheinen sie nicht.

Damit liegt der Fehler zwischen Regelauswertung und Report — in Materialisierung, Lane-Abschluss oder Eligibility-Gate. Der Run meldet trotzdem `completed`.

**Ein möglicher Auslöser** steht im Changelog des laufenden Umbaus (`2026-07-20-site-audit-finding-precision.md`):

> „Contextual-link warnings are only published from **complete DOM evidence**, so missing or legacy placement data no longer turns real main-content links into false findings."

Ein solches Gate erklärt die stumme `link_projection`-Lane — aber nicht, warum `title_too_long` oder `h1_duplicate` fehlen. Wenn ein Evidence-Vollständigkeits-Gate breiter greift als beabsichtigt, wäre das die einfachste Erklärung für alle sieben Lanes.

---

## 3. Zusätzlich: ein neuer Zählfehler

```
static_resource_cache_policy_missing
  Header:   Finding occurrences from run: 250
  Evidence: 700 Zeilen (107 Quellseiten × 7 Assets)
  Loaded findings included: 745   = 45 + 700   ✓ korrekt
```

Die Kopfzahl **250** widerspricht den eigenen Daten des Reports. `large_image_resource` stimmt dagegen (45 Header / 45 Evidence).

Das ist die dritte Variante desselben Musters über sieben Runden: V1 zählte Vorkommen ehrlich, V2 unterzählte Unique (3 statt 7), V3 überschrieb das Label falsch (700 „unique"), V5/V6 hatten es korrekt — und V7 unterzählt jetzt die Vorkommen. Die Invariante `Vorkommen ≥ unique ≥ Anzahl distinkter gelisteter URLs` wird weiterhin nirgends erzwungen. Als Assertion im Renderer wäre jede dieser vier Varianten sofort aufgefallen.

---

## 4. Was das über den Prozess sagt

Sieben Runden, und das Muster ist inzwischen deutlich:

| Runde | Was gemessen wurde | Ergebnis |
|---|---|---|
| V1–V3 | alter Crawler | 4.654 → 4.223, Fehlalarme unverändert |
| V4 | alter Crawler (Deploy fehlte) | keine Regeländerung messbar |
| V5 | **neuer Crawler** | 3.171, Fehlalarmquote 39 % → <2 % |
| V6 | derselbe Run, neuer Report | nur Darstellung |
| V7 | **neuer Crawler** | 745, **12 Problemklassen verloren** |

V5 war der Durchbruch. V7 hat ihn zum großen Teil wieder eingerissen — nicht durch schlechtere Regeln, sondern durch einen Ausfall in der Kette dahinter.

Die eigentliche Lücke ist Absicherung: Es gibt keinen Mechanismus, der bemerkt, dass ein Run mit `completed` endet, obwohl sechs von sieben Lanes nichts geliefert haben. Ein Crawl derselben Website, der von 16 auf 2 Codes fällt, müsste den Run als unvollständig markieren, nicht als abgeschlossen.

---

## 5. Empfehlung — in dieser Reihenfolge

**P0 — Ausfall beheben und absichern**

1. **Lane-Abschluss prüfen.** Warum liefern `fetch`, `resource_discovery`, `link_projection`, `metadata_projection`, `external_link_check` und `sitemap_discovery` in Run `mh8ay3mznhxxqmaa2w6tyw4hdd8azasa` keine Findings, während `resource_fetch` normal arbeitet? Die Regeln sind es nachweislich nicht.
2. **Verdacht zuerst prüfen:** das „complete DOM evidence"-Gate aus dem Changelog. Greift es breiter als für Kontext-Link-Regeln gedacht?
3. **Vollständigkeits-Gate für den Run-Status.** Ein Run darf nicht `completed` melden, wenn eine Lane ohne Ergebnis und ohne Fehler endet. Mindestens: Lane-Status pro Run persistieren und im Report ausweisen.
4. **Regressionsschranke gegen Findings-Verlust.** Zwischen zwei Runs derselben Site ist ein Rückgang um 12 Codes ein Alarm, kein Erfolg. Ein Vergleich Vorlauf/Nachlauf (die Compare-Funktion existiert bereits) sollte das automatisch melden.

**P1 — Zählwerk endgültig schließen**

5. Invariante `Vorkommen ≥ unique ≥ distinkte gelistete URLs` als Assertion im Renderer. Vier verschiedene Zählfehler in sieben Runden sind genug Evidenz, dass Vorkommen und Unique im Datenmodell nicht sauber getrennt sind.

**P2 — offen aus V5/V6, unverändert**

6. `duplicate_internal_anchor_targets` in der Projektion nach Ankertext gruppieren.
7. `render_blocking_resource` pro Datei statt pro Vorkommen.
8. `g.page` in `external_link_unverifiable` einsortieren (Retry mit Browser-UA).
9. `bodyInternalInlinkCount` auf der Inlink-Seite ersetzen — Vorlage steht in meinem `core-link-findings.ts`-Fix.
10. Titel/Description in Pixelbreite statt Zeichen.
11. `sourceUrl` in die Resource-Evidence.
12. Worker aus sauberem Stand bauen, damit `-dirty` verschwindet.

---

## 6. Erwartung für V8

Wenn der Lane-Ausfall behoben ist und mein `core-link-findings.ts`-Fix im Build ist:

| Code | V6 | V7 | Erwartung V8 |
|---|---:|---:|---:|
| `body_internal_links_missing` | 0 | — | **2** |
| `image_alt_coverage_missing` | 1 | — | **1** |
| `image_missing_dimensions` | 11 | — | **11** |
| `self_referential_internal_link` | 227 | — | **227** |
| `h1_duplicate` / `orphan_sitemap_url` / `thin_content` | 2/1/2 | — | **2/1/2** |
| `title_too_long` | 9 | — | **9** |
| `static_resource_cache_policy_missing` | 700 | 250 | **~700** (Zahl korrigiert) |

Das ist zugleich die Prüfliste: Erscheinen diese Codes wieder, war es ein Lane-Ausfall. Bleiben sie weg, ist es eine bewusste, aber nicht dokumentierte Regeländerung — und dann muss für jeden einzelnen begründet werden, warum ein verifizierter Befund nicht mehr gemeldet wird.

---

## 7. Fazit

Die Zahl 745 sieht nach dem Ziel aus, auf das sechs Runden hingearbeitet haben. Sie ist das Gegenteil.

Was in V5 erreicht wurde — Fehlalarmquote unter 2 % bei erhaltener Erkennung — war die richtige Kurve. V7 senkt die Zahl weiter, aber durch Verlust statt durch Präzision. Für ein Audit-Werkzeug ist das die schlechtere Fehlerrichtung: Ein Fehlalarm wird beim Prüfen entdeckt, ein fehlender Befund nie.

Der Befund selbst ist allerdings gut eingegrenzt und wahrscheinlich schnell zu beheben: Die Regeln sind grün, der Crawl hat 107 Seiten erfasst, und der Schnitt verläuft exakt entlang einer Lane-Grenze. Das deutet auf einen einzelnen Schalter, nicht auf verstreute Schäden.

Bemerkenswert ist eher, dass dieser Ausfall nur auffiel, weil zwei aufeinanderfolgende Reports derselben Website verglichen wurden. Genau dafür gibt es die Compare-Funktion — sie sollte das selbst tun.

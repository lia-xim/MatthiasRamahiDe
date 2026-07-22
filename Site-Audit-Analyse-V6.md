# Site-Audit-Analyse V6

**Datum:** 2026-07-21
**Report:** `Site-Audit-V6.md` — exportiert 19:00, 3.171 Findings, 16 Codes
**Run ID:** `mh8bavf7nscbevtwweqq4v2as18ay1ga` — **identisch mit V5**
**Crawler build:** `418257d4a2fa-dirty` (neu im Report)

---

## 0. Das Wichtigste zuerst

**V6 ist kein neuer Crawl, sondern ein Re-Export desselben Runs wie V5.** Gleiche Run-ID, gleiche 3.171 Findings, 72 Bytes Größenunterschied. Geändert hat sich ausschließlich die Report-Ebene — und zwar an genau zwei Stellen, beide aus meiner V5-Empfehlungsliste.

Der vollständige Inhaltsunterschied V5 → V6:

```
+ - Crawler build: 418257d4a2fa-dirty            (Empfehlung #8)

  image_alt_coverage_missing:                    (Empfehlung #5)
- Source: resource                          →  + Source: crawler
- Unique affected assets from run: 1        →  + Unique affected urls from run: 1
- Loaded unique affected assets in this copy →  + Loaded unique affected URLs in this copy
- Issue summary: Resource evidence stores…  →  + Issue summary: The page contains images, but none has
                                                 descriptive alternative text; decorative images with
                                                 alt="" remain valid.
- Add missing dimensions and alt text…      →  + Add descriptive alt text to meaningful images on the
                                                 affected page while keeping alt="" only for genuinely
                                                 decorative images.
- Affected assets:                          →  + Affected URLs:
```

Sonst nichts. **Für die Bewertung der Problemerkennung liefert V6 keine neuen Daten** — die Trefferquote-Analyse aus V5 gilt unverändert.

---

## 1. Was umgesetzt wurde

### 1.1 Crawler-Build im Report (Empfehlung #8, seit V1 offen)

```
- Run ID: mh8bavf7nscbevtwweqq4v2as18ay1ga
- Crawler build: 418257d4a2fa-dirty
- Loaded findings included: 3171
```

Das war der Punkt, dessen Fehlen in V4 eine ganze Analyserunde gekostet hat: Ohne Build-Kennung war nicht unterscheidbar, ob eine Regel falsch ist oder nur alt.

**Und es ist richtig gebaut.** Die Kennung stammt aus `run.workerRuntime?.version` (`agentEndpoints.ts:266` → `route.ts:191`), ist also **pro Run gespeichert und beschreibt den Crawl-Zeitpunkt** — nicht den Export. Das ist der entscheidende Unterschied: Genau deshalb zeigt dieser Re-Export vom 19:00 die Kennung des Crawls, der vor 17:10 lief, statt der des exportierenden Prozesses. Hätte man den SHA beim Export ermittelt, wäre das Feld schlimmer als nutzlos gewesen.

**Eine Einschränkung bleibt:** Das Suffix `-dirty` heißt, der Worker wurde aus einem Arbeitsverzeichnis mit uncommitteten Änderungen gebaut. Die Kennung identifiziert den Code damit *nicht eindeutig* — zwei Runs mit demselben Label können unterschiedlichen Code ausgeführt haben. Für die Frage „alt oder neu?" reicht sie; für „welcher Code genau?" nicht. Das ist ehrliche Kennzeichnung und besser als eine falsche Gewissheit, aber Reproduzierbarkeit ist damit nicht hergestellt.

### 1.2 Meine Regel wird korrekt klassifiziert (Empfehlung #5)

In V5 hatte ich drei Fehler an meiner eigenen Regel gemeldet. Alle drei sind behoben:

| | V5 | V6 |
|---|---|---|
| Maßeinheit | „affected **assets**" bei einer Seite | „affected **urls**" ✅ |
| Quelle | `Source: resource` | `Source: crawler` ✅ |
| Issue summary | fremder Bild-Boilerplate | eigene Beschreibung ✅ |
| Fix-Vorschlag | „Add missing dimensions…" | passender Text ✅ |
| Liste | „Affected assets:" | „Affected URLs:" ✅ |

Der Block liest sich jetzt schlüssig:

```
## No image on the page has descriptive alt text
- Source: crawler
- Unique affected urls from run: 1
- Issue summary: The page contains images, but none has descriptive alternative
                 text; decorative images with alt="" remain valid.
- Evidence: imageCount: 58; imagesWithDescriptiveAltCount: 0; imagesMissingAltCount: 0
Affected URLs:
- https://matthiasramahi.de/portfolio.html
```

Besonders gut: Der neue Issue-Summary nennt die Ausnahme ausdrücklich mit („decorative images with `alt=""` remain valid"). Genau diese Unterscheidung war der Grund, warum es die Regel gibt — dass sie jetzt im Text steht, verhindert, dass jemand den `alt=""`-Fix wieder rückgängig macht.

**Kleiner Rest:** Der Abschnitt „Recommended fix" führt zwei Zeilen, die inhaltlich dasselbe sagen — die neue Issue-Guidance und meine Finding-Empfehlung. Redundant, nicht falsch.

---

## 2. Was V6 nicht beantwortet

Weil derselbe Run erneut exportiert wurde, ist **keine** der crawler-seitigen offenen Fragen gemessen:

| Punkt | Stand in V6 | Bedeutung |
|---|---|---|
| Mein `body_internal_links_missing`-Fix | 0 Findings | Der Run stammt von vor dem Fix — die zwei True Positives fehlen weiterhin |
| `broken_external_link` (g.page) | 55 | Fehlalarm unverändert; live liefert der Link 200 mit Browser-UA |
| `duplicate_internal_anchor_targets` | 252 | 252 Findings für eine Ursache, unverändert |
| `render_blocking_resource` | 1.745 / 33 unique | größter Einzelposten, unverändert |
| `bodyInternalInlinkCount: 0` | 8× | kaputtes Feld auf der Inlink-Seite, unverändert |
| Titel/Description in Pixelbreite | 9 / 43 | unverändert |
| `self_referential_internal_link` | 227 | echt, unverändert |

Diese Liste ist identisch mit dem Stand aus V5. Es fehlt schlicht ein neuer Crawl.

---

## 3. Bewertung

V6 ist eine kleine, saubere Runde. Beide Änderungen sind vollständig umgesetzt, keine hat etwas anderes beschädigt, und die Build-Kennung ist an der architektonisch richtigen Stelle verankert (am Run, nicht am Export).

Bemerkenswert ist, was diese Runde über den Arbeitsmodus zeigt: Es wurden zwei **Report-Ebenen**-Punkte umgesetzt und dann re-exportiert. Das ist effizient — für Darstellungsfragen braucht man keinen neuen Crawl, und ein Re-Export beweist die Änderung schneller und billiger. Genau deshalb war es aber auch die dritte Runde in Folge, in der die Regel-Ebene nicht gemessen wurde: V4 wegen fehlenden Deployments, V5 hat es gemessen, V6 wieder nicht, weil kein neuer Run lief.

Die Build-Kennung macht diesen Unterschied ab jetzt sichtbar. Zusammen mit der Run-ID im Kopf lässt sich in einer Zeile erkennen, ob ein Report neue Daten enthält oder nur neu formatiert ist — das war bisher nur durch Diffen feststellbar.

---

## 4. Empfehlung für V7

**Voraussetzung:** ein neuer Crawl. Ohne ihn misst auch V7 nichts.

Erwartete Änderung allein durch meinen `core-link-findings.ts`-Fix (Tests grün, gegen echte Seiten verifiziert):

| Code | V6 | Erwartung V7 |
|---|---:|---:|
| `body_internal_links_missing` | 0 | **2** (videografie-, viola-musik-duesseldorf) |
| `self_referential_internal_link` | 227 | 227 (bewusst unverändert) |

**Danach in dieser Reihenfolge — die zwei Codes, die 63 % des Reports ausmachen:**

1. `duplicate_internal_anchor_targets` in der Projektion nach Ankertext gruppieren (252 → ~1–3).
2. `render_blocking_resource` pro Datei statt pro Vorkommen ausweisen (1.745 → 33) und nur melden, wenn ein Stylesheet tatsächlich kritisch ist.

**Dann Korrektheit:**

3. `g.page` in `external_link_unverifiable` einsortieren — Retry mit Browser-UA, bevor „broken" vergeben wird. Die Kategorie existiert seit V5, dieser Fall fehlt noch.
4. `bodyInternalInlinkCount` auf der Inlink-Seite ersetzen. Es ist dieselbe Verwechslung von Region und Navigationsrolle wie die, die ich in `body_internal_links_missing` behoben habe — die Vorlage steht in `core-link-findings.ts`.
5. Titel/Description in Pixelbreite messen.

**Dann Diagnostizierbarkeit:**

6. `sourceUrl` in die Resource-Evidence aufnehmen (Empfehlung #7 aus V5, offen). Ohne sie ist ein Resource-Finding nur über die separate Asset-Liste lokalisierbar — genau diese Lücke hat in V4 zu meiner Fehleinschätzung bei `image_missing_dimensions` geführt.
7. Den Build-Worker aus einem sauberen Stand bauen, damit das `-dirty`-Suffix verschwindet und die Kennung den Code eindeutig identifiziert.

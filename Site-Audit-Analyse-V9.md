# Site-Audit-Analyse V9

**Datum:** 2026-07-21  
**Grundlage:** Agent-Copy des Runs `mh80qyth0vsjjscwppvvneh9nh8ay8hc`, 1.210 geladene Findings, 16 Codes  
**Crawler-Build:** `418257d4a2fa-dirty-3dd758a28afe` — identisch mit V8  
**Vorgänger:** `Site-Audit-V8.md`, Run `mh86gceh57v8bjtf610j2amhcs8azkjj`, 1.265 Findings, 17 Codes  
**Testobjekt:** 251 aktuell erreichbare Sitemap-URLs von `matthiasramahi.de`; an der Website wurde nichts geändert

## 0. Das Wichtigste zuerst

V9 ist vollständig und verliert keinen verifizierten True-Positive-Code. Die einzige Veränderung gegenüber V8 ist, dass `broken_external_link` mit 55 Fehlalarmen entfallen ist; dieselben Google- und Instagram-Ziele stehen jetzt ausschließlich unter `external_link_unverifiable`. Beide Ziele liefern in meiner Live-Gegenprobe mit Browser-User-Agent HTTP 200.

Der verbleibende Hauptfehler liegt bei `contextual_internal_inlinks_missing`: 9 der 14 gemeldeten Seiten besitzen nachweislich kontextuelle Inlinks. Der aktuelle Crawl hat 23.560 interne Link-Vorkommen, die Projektion las aber nur die ersten 5.000 Kanten. Dadurch fehlten unter anderem die Links von `/blog.html` auf drei Artikel und von `/portfolio.html` auf sechs Portfolio-Auswahlen. Diesen Projektionsfehler habe ich im Crawler-Backend korrigiert und gegen unvollständige Body-Evidence abgesichert.

Die Zählung des Reports ist in dieser Runde konsistent: Die 16 Kopfzahlen summieren sich exakt zu 1.210; für jeden Code gilt `Vorkommen ≥ unique ≥ distinkte gelistete URLs/Assets`. Im Report stehen 777 Vorkommen von `placement: head` und 12 von `placement: body`; die alte Head/Body-Regression ist damit nicht zurück.

## 1. Deployment-/Run-Status

| Prüfung | V8 | V9 | Urteil |
|---|---|---|---|
| Run-ID | `mh86gceh57v8bjtf610j2amhcs8azkjj` | `mh80qyth0vsjjscwppvvneh9nh8ay8hc` | neuer Crawl |
| Crawler-Build | `418257d4a2fa-dirty-3dd758a28afe` | identisch | gleicher Worker-Build |
| Geladene Findings | 1.265 | 1.210 | −55 |
| Codes | 17 | 16 | nur `broken_external_link` entfallen |
| `placement: head` / `body` | Head dominiert | 777 / 12 | aktueller DOM-Parser |

Der Report misst einen neuen Crawl mit demselben Worker-Bundle. Aus der Build-Kennung allein darf die Reduktion daher nicht als neuer Worker-Code-Effekt verkauft werden. Die konkrete Evidence passt jedoch exakt zur parallel vorhandenen Projektionskorrektur: ein Transportfehler ohne terminale HTTP-Antwort wird nicht mehr als kaputter Link, sondern als unverifizierbar materialisiert. Die Kennung deckt nur den gebündelten Crawl-Worker ab, nicht zwingend die separat deployte Convex-Projektion.

Alle erwarteten Lanes liefern wieder: Fetch, Resource Fetch, Resource Discovery, Link Projection, Metadata Projection, External Link Check und Sitemap Discovery. V9 zeigt nicht das V7-Ausfallmuster.

## 2. Vergleich zum Vorgänger

| Code | Severity | V8 Vork./Unique | V9 Vork./Unique | Status |
|---|---|---:|---:|---|
| `title_too_long` | medium | 9 / 9 | 9 / 9 | unverändert |
| `large_image_resource` | medium | 45 / 2 | 45 / 2 | unverändert |
| `thin_content` | medium | 2 / 2 | 2 / 2 | unverändert |
| `orphan_sitemap_url` | medium | 1 / 1 | 1 / 1 | unverändert |
| `duplicate_internal_anchor_targets` | low | 56 / 5 | 56 / 5 | unverändert |
| `broken_external_link` | low | 55 / 55 | — | **ENTFALLEN; Fehlalarme** |
| `meta_description_too_long` | low | 43 / 43 | 43 / 43 | unverändert |
| `render_blocking_resource` | low | 33 / 33 | 33 / 33 | unverändert |
| `contextual_internal_inlinks_missing` | low | 14 / 14 | 14 / 14 | unverändert, teilweise falsch |
| `image_missing_dimensions` | low | 11 / 11 | 11 / 11 | unverändert |
| `weak_internal_inlinks` | low | 9 / 9 | 9 / 9 | unverändert |
| `static_resource_cache_policy_missing` | low | 700 / 7 | 700 / 7 | unverändert |
| `body_internal_links_missing` | low | 2 / 2 | 2 / 2 | unverändert |
| `h1_duplicate` | low | 2 / 2 | 2 / 2 | unverändert |
| `image_alt_coverage_missing` | low | 1 / 1 | 1 / 1 | unverändert |
| `self_referential_internal_link` | info | 227 / 227 | 227 / 227 | unverändert |
| `external_link_unverifiable` | info | 55 / 55 | 55 / 55 | unverändert; enthält jetzt alle drei externen Vorkommen je Seite |

`broken_external_link` ist der einzige entfallene Code. Das zugrunde liegende Website-Problem ist nicht verschwunden, weil es nie existierte: Der Google-Bewertungslink liefert mit Browser-UA HTTP 200 und endet auf Google Maps. Der Verlust ist daher erwünscht und kein False Negative.

## 3. Verdikt je Issue-Code

| Code | Verdikt | Live-Beleg und Prüftiefe |
|---|---|---|
| `title_too_long` | grenzwertig | Alle 9 URLs frisch geladen; alle Titel liegen bei 61–65 Zeichen und stimmen exakt mit dem Report. Die Messung ist korrekt, der starre 60-Zeichen-Schwellwert bleibt schwächer als eine Pixelmessung. |
| `large_image_resource` | echt, aber vervielfacht | Beide Assets frisch per HEAD geprüft: 503.984 B und 514.500 B, HTTP 200. 45 Vorkommen sind Referenzen auf 2 echte große Preload-/Hero-Assets. |
| `thin_content` | grenzwertig | Frisch im `<main>` gemessen: Kontakt 32 Wörter/226 Zeichen, Portfolio 118 Wörter/1.006 Zeichen; der Report misst 30 bzw. 105 Wörter bei identischer Textlänge. Rechnerisch dünn, aber für Kontakt- und Galerie-Seitentyp nicht automatisch ein Fehler. |
| `orphan_sitemap_url` | echt | Alle 251 Sitemap-Seiten geladen und alle internen Links aufgelöst: Artikel liefert HTTP 200, steht in der Sitemap und hat 0 eingehende Quellen. |
| `duplicate_internal_anchor_targets` | echt, gut gruppiert | Siteweiter Live-Graph bestätigt die konkurrierenden Zielpaare, z. B. „Supersportwagen Fotografie“ auf die generische und die Düsseldorf-URL. Inhaltlich häufig beabsichtigte lokale Relevanz; Severity `low` passt. |
| `meta_description_too_long` | grenzwertig | Alle 43 URLs frisch geladen; 43/43 liegen bei 161–165 Zeichen und stimmen mit dem Report. Messung korrekt, Grenzwert redaktionell schwach. |
| `render_blocking_resource` | technisch echt, begrenzter Handlungswert | Evidence zeigt 33 eindeutige Stylesheets als normale `<link rel="stylesheet">` im `<head>`. Ohne Trace/Größenbudget ist „render blocking“ technisch wahr, aber keine belastbare Optimierungsempfehlung. |
| `contextual_internal_inlinks_missing` | **teilweise Fehlalarm** | Vollscan über 251 Seiten: 9/14 URLs besitzen echte Body-Inlinks — 3 Artikel von `/blog.html`, 6 Portfolio-Seiten von `/portfolio.html`. Die übrigen 5 haben keine kontextuelle Quelle. Ursache: 5.000-Kanten-Schnitt bei 23.560 internen Vorkommen. |
| `image_missing_dimensions` | echt, 11/11 | Vorkommensgenau geprüft: `/ueber-mich.html` 6 von 7 Bildern ohne Maße; Portfolio-Auswahl Automobil 5 von 19. Gesamt exakt 11. |
| `weak_internal_inlinks` | echt | Die 3 Artikel und 6 Portfolio-Auswahlen haben jeweils nur eine externe Quellseite. Selbst-/Fragmentlinks wurden nicht als zusätzliche Quelle gezählt. |
| `static_resource_cache_policy_missing` | 6 echt, 1 Drittanbieter | Frische Header: 6 First-Party-Root-Assets liefern `max-age=0, must-revalidate`; `analytics.contextter.com/script.js` liefert `max-age=86400` und ist fremd. 700 = 7 Assets × 100 Quellen, Zählung korrekt, Handlung nur bei 6 Assets. |
| `body_internal_links_missing` | echt | `/videografie-duesseldorf.html` und `/viola-musik-duesseldorf.html` haben keine Links auf andere interne Seiten im Hauptinhalt. Hash-CTAs wie `#anfrage` sind keine Seiten-Outlinks; Navigation/Footer zählen bewusst nicht. |
| `h1_duplicate` | echt | Beide Live-Seiten tragen exakt die H1 „Automobil Fotografie“. Geringe Auswirkung, aber korrekte Erkennung. |
| `image_alt_coverage_missing` | echt, präzise | `/portfolio.html`: 58 Bilder, 0 ohne `alt`-Attribut, 0 mit beschreibendem Alt-Text. Die Regel bewahrt die korrekte Unterscheidung zwischen `alt=""` und fehlendem Attribut. |
| `self_referential_internal_link` | echt, Template-Ursache | Mehrere repräsentative Seiten frisch geprüft; die Themen-/Städte-Grids enthalten die aktuelle Seite. 227 Seiten sind 227 Ausprägungen eines Templatefehlers, nicht 227 unabhängige Reparaturen. |
| `external_link_unverifiable` | echte Prüfgrenze, kein Websitefehler | `g.page` und Instagram liefern im Browser-UA-Test HTTP 200. Der Crawler sah Auth-/Bot-Gating bzw. keine belastbare terminale Antwort und stuft daher korrekt als unverifizierbar statt kaputt ein. |

## 4. Neue Befunde

### 4.1 Die Linkprojektion ist auf großen Graphen unvollständig

Frische Gesamtmessung:

| Messwert | Anzahl |
|---|---:|
| Sitemap-Seiten, HTTP 200 | 251 |
| interne Link-Vorkommen | 23.560 |
| eindeutige Quelle-Ziel-Beziehungen | 13.010 |
| kontextuelle Body-Link-Vorkommen ohne Hash-CTAs | 1.477 |
| bisheriger allgemeiner Projektions-Scan | maximal 5.000 Kanten |

Die Projektion sortiert den allgemeinen Scan nach Quelle und schneidet nach 5.000 Dokumenten ab. `internalInlinkCount` kommt dagegen aus den vollständig während der Discovery fortgeschriebenen Inventarzählern. So entsteht ein widersprüchlicher Zustand: „hat Inlinks“, aber in der abgeschnittenen Evidence „hat 0 Body-Inlinks“.

Der Fix lädt zusätzlich die per Index begrenzte `placement=body`-Scheibe. Sie ist auf dieser Website mit 1.477 Vorkommen vollständig. Wird auch diese Scheibe künftig größer als das Limit, markiert der Code die Evidence als unvollständig und emittiert den Negativbefund nicht. Fehlende Evidence darf nicht als Beweis für fehlende Links dienen.

### 4.2 Der Build-Marker ist nur ein Worker-Marker

V8 und V9 tragen denselben Crawler-Build, unterscheiden sich aber in der External-Link-Projektion. Das ist erklärbar, weil die Build-Kennung aus dem gebündelten Site-Audit-Executor stammt, während die Convex-Materialisierung separat deployt wird. Für reproduzierbare Vergleiche braucht der Report zusätzlich eine Projektions-/Backend-Version; sonst ist „gleicher Build = gleicher Code“ nicht für die gesamte Pipeline wahr.

## 5. Regressionen

Keine verifizierten True-Positive-Codes sind verschwunden. Der einzige entfallene Code, `broken_external_link`, war in V8 ein bestätigter Fehlalarm.

Eine offene False-Negative-Grenze bleibt: Der allgemeine Linkprojektions-Scan ist weiterhin nur eine 5.000-Kanten-Stichprobe. Der neue Fix macht die konkrete Body-Inlink-Regel vollständig oder fail-safe; eine vollständige, paginierte Projektion aller Linkregeln ist damit noch nicht gebaut. Insbesondere die exakte Vollständigkeit von siteweiten Anchor-Konflikten kann bei großen Graphen weiterhin nicht aus dem Run garantiert werden.

## 6. Was ich geändert habe

**Crawler-/Backend-Code:**

- `packages/db/convex/siteAuditV2/services/projectionMaterialization.ts`: separate indexierte Body-Kanten-Scheibe laden, mit der allgemeinen Stichprobe deduplizieren, Vollständigkeit per Sentinel feststellen.
- `packages/db/convex/siteAuditV2/models/projectionMaterialization.ts`: Vollständigkeitsstatus in den Projektionskontext aufnehmen.
- `packages/db/convex/siteAuditV2/services/linkProjections.ts`: `contextual_internal_inlinks_missing` nur bei vollständiger Body-Evidence emittieren.
- `packages/db/convex/__tests__/siteAuditV2.linkProjectionEdgeLoading.test.ts`: Regressionstest für eine Body-Kante außerhalb der allgemeinen Stichprobe sowie für die Sättigungsgrenze.
- `apps/web/content/changelog/2026-07-20-site-audit-finding-precision.md`: kundenorientierter Hinweis zur korrigierten Inlink-Präzision.

Keine Website-Datei wurde geändert. Fremde gestagte External-Link-Änderungen und sonstige Dirty-Tree-Arbeit wurden nicht zurückgesetzt oder umformatiert.

**Validierung:**

- DB-Fokustests: 9/9 grün (`linkProjectionEdgeLoading`, vorhandene External-Link-Projektionstests und Health-Rule-Registry).
- Jobs Ground Truth: 10/10 grün.
- AI Resource Fetcher: 10/10 grün.
- ESLint für die drei geänderten DB-Quelldateien: 0 Fehler; die neue Testdatei ist durch die vorhandene Lint-Konfiguration ignoriert.
- `git diff --check`: grün.
- `@contextter/db check-types`: nicht grün wegen eines fremden, reproduzierbaren Fehlers in `convex/actions/contentStudioProduction.ts:154` (`"recoverable"` fehlt in `ProductionRunExecutionContext.status`). Für die berührten Site-Audit-Dateien meldete TypeScript keinen Fehler.

Umsetzungsstand: **95 %**. Der Fix und seine fokussierte Regression sind fertig; offen sind der durch fremde Content-Studio-Arbeit blockierte DB-Gesamttypecheck und die Verifikation durch einen neuen Crawl.

## 7. Empfehlung für V10

### P0 — diesen Fix wirklich messen

1. Backend/Convex-Projektion mit der Body-Scheibe deployen und einen neuen Crawl starten.
2. Im V10-Report prüfen, dass `contextual_internal_inlinks_missing` von 14 auf **5** sinkt. Die neun zu entfernenden URLs sind die drei gemeldeten Journal-Artikel und sechs Portfolio-Auswahlen.
3. `weak_internal_inlinks` muss bei **9** bleiben: Die Links existieren, kommen aber jeweils nur von einer Quellseite.

### P1 — Betriebssicherheit aus V7 schließen

4. Lane-Abschluss pro Run persistieren und einen Lauf mit unvollständiger Lane als `partial` markieren.
5. Projektions-/Backend-Version zusätzlich zum Worker-Build in den Report schreiben.
6. Den allgemeinen Linkgraphen paginiert/inkrementell projizieren; der aktuelle 5.000er Sample-Pfad bleibt eine False-Negative-Grenze für andere Linkregeln.

### Konkrete Prüfliste

| Code | V9 | Erwartung V10 |
|---|---:|---:|
| `contextual_internal_inlinks_missing` | 14 | **5** |
| `weak_internal_inlinks` | 9 | **9** |
| `broken_external_link` | 0 | **0** |
| `external_link_unverifiable` | 55 | **55** oder weniger, aber niemals dieselben Ziele als `broken` ohne terminalen 4xx/5xx-Beleg |
| `image_missing_dimensions` | 11 | **11** |
| `image_alt_coverage_missing` | 1 | **1** |
| `body_internal_links_missing` | 2 | **2** |
| `orphan_sitemap_url` | 1 | **1** |
| `title_too_long` | 9 | **9** |
| `meta_description_too_long` | 43 | **43** |
| `large_image_resource` | 45 | **45** |
| `static_resource_cache_policy_missing` | 700 | **700** |
| `render_blocking_resource` | 33 | **33** |
| `h1_duplicate` | 2 | **2** |
| `self_referential_internal_link` | 227 | **227** |
| `thin_content` | 2 | **2** |
| `duplicate_internal_anchor_targets` | 56 | **mindestens 56**; eine höhere Zahl ist nach der breiteren Body-Evidence möglich und muss je neuem Anchor-Konflikt belegt sein |

Wenn nur die neun falschen Kontext-Inlink-Findings entfallen und keine zusätzlichen Anchor-Konflikte materialisiert werden, lautet die erwartete Gesamtsumme **1.201**.

## 8. Fazit

V9 ist gegenüber V8 in der wichtigsten Fehlerrichtung besser: 55 falsche Broken-Link-Warnungen sind weg, ohne dass ein bestätigter True-Positive-Code verloren ging. Die meisten verbleibenden Regeln messen ihre jeweilige Eigenschaft korrekt; Titel-, Description-, Thin-Content- und Render-Blocking-Befunde bleiben vor allem eine Frage von Schwellenwert und Handlungswert.

Die neue Gegenprobe zeigt aber auch, dass die Linkprojektion noch nicht vollständig skalierte. Bei 23.560 internen Link-Vorkommen ist eine unsichtbare 5.000er Stichprobe keine belastbare Grundlage für eine Negativaussage. Der konkrete Body-Inlink-Fehler ist jetzt fail-safe behoben; die allgemeine paginierte Linkprojektion und das Lane-Status-Gate bleiben die zwei technischen Punkte mit dem größten Sicherheitsgewinn.

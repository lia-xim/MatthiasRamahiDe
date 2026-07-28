# SEO Indexing Action Plan

Erstfassung: 2026-06-30
Letzte Aktualisierung: 2026-07-28

## Ausgangsbefund 2026-06-30

- Die live ausgelieferte Seiten-Sitemap umfasst 251 normale Seiten-URL-Eintraege.
- Die Search-Console-Zahl 493 entsteht aus 251 Seiten-URLs plus 242 URL-Eintraegen in der Bild-Sitemap.
- Die GSC-Liste `Gefunden - zurzeit nicht indexiert` besteht aus 172 aktuellen Seiten im neuen URL-Format.
- Die GSC-Listen `Nicht gefunden (404)` und `Gecrawlt - zurzeit nicht indexiert` enthalten zusammen 349 gemeldete alte URLs aus WordPress-/Shop-/Tag-/Category-/Portfolio-Altbestand.
- Der GSC-Export `Indexierte Seiten` enthaelt noch alte, indexierte URLs: 76 exportierte URLs liegen in der aktuellen normalen Sitemap, 49 weitere sind Alt-URLs ausserhalb der Sitemap.
- Der neue GSC-Export-URL-Audit prueft 521 exportierte URL-Eintraege direkt gegen die lokale HTTP-Ausgabe: 0 offene technische Problemfaelle.

## Umgesetzte Runde 1

- Alte, thematisch klare URLs leiten jetzt per 308 auf passende neue Seiten weiter.
- Alte Archive, Shop-Pfade, WordPress-Systempfade und nicht mehr sinnvolle Altseiten antworten jetzt mit 410 Gone und `X-Robots-Tag: noindex`.
- `/index.html` und `/front-page/` leiten auf `/`.
- Die 404/410-Seite unterscheidet sichtbar zwischen nicht gefunden und dauerhaft entfernt.
- Die Fotografie-Uebersicht hat einen kuratierten Local-Hub mit starken internen Links zu Duesseldorf-, NRW- und Suchintent-Seiten.

## Umgesetzte Runde 2

- Sechs alte, im GSC-Export noch indexierte URLs, die lokal noch 404 waren, leiten jetzt auf passende Zielseiten:
  `/artikel/`, `/gruppen-fotografie/`, `/fine-art-portraets-fotografie/`, zwei alte Autofotografie-Artikel und eine alte Oldtimer-Wuppertal-URL.
- Defekte Umlaute in Meta-Descriptions indexierbarer Local-SEO-Seiten wurden korrigiert, z. B. `D?sseldorf`, `f?r`, `H?ndler`, `Gro?format`.
- Die Local-SEO-/Native-Sitemap verwendet als frisches Aenderungsdatum `2026-06-30`.
- Das Duplicate-Audit bricht jetzt ab, wenn keine statisch gerenderten Local-SEO-HTML-Dateien vorliegen, damit kein falscher Report geschrieben wird.

## Umgesetzte Runde 3

- Der Local-SEO-Duplicate-Audit kann jetzt gegen gerenderte SSR-Seiten laufen und bewertet damit die wirklich ausgelieferte HTML-Ausgabe.
- Fahrzeug-, Landschafts- und Portrait-Prioritaetsseiten wurden in den sichtbaren Mittel- und Ablaufsektionen ausgebaut.
- Die ehemals mittleren und hohen Duplicate-/Kannibalisierungsrisiken sind dadurch auf `niedrig` bzw. `mittel-niedrig` reduziert.
- Ein eigener GSC-Export-URL-Audit wurde ergaenzt: `tools/audit-gsc-indexing-exports.mjs`.
- Der neue Report `docs/seo-gsc-export-url-audit.md` klassifiziert die exportierten Search-Console-URLs als Redirect, Gone oder indexierbare 200er-Seite.
- Ein sitemapweiter Indexability-Audit wurde ergaenzt: `tools/audit-sitemap-indexability.mjs`.
- Der neue Report `docs/seo-sitemap-indexability-audit.md` prueft alle normalen Sitemap-URLs auf Status, Canonical, noindex, Title- und Canonical-Duplikate.

## Umgesetzte Runde 4

- Die drei GSC-Exportlisten wurden als URL-only Release-Fixtures im Repo abgelegt:
  `tools/fixtures/gsc-indexing-exports/not-found-2026-06-30.txt`,
  `tools/fixtures/gsc-indexing-exports/crawled-not-indexed-2026-06-30.txt`,
  `tools/fixtures/gsc-indexing-exports/found-not-indexed-2026-06-30.txt`.
- Ein neuer Release-Preview-Audit wurde ergaenzt: `tools/run-seo-release-preview-audit.mjs`.
- Der neue Scriptlauf `corepack pnpm seo:audit:release-preview` baut eine previewfaehige Server-Version, startet `astro preview`, prueft `seo:release-routing`, den Sitemap-Indexability-Audit und den GSC-Export-Audit gegen die Fixtures.
- Die GitHub-Action `Web Quality` fuehrt den Release-Preview-Audit jetzt als abschliessenden Gate aus. Dadurch bleiben die bestehenden Vercel-/Static-Audits unverfaelscht und CI blockiert kuenftig Deployments, falls alte GSC-URLs wieder als offene 404/403/Canonical-Probleme ausgeliefert werden.
- Fuer die Post-Deploy-Pruefung gibt es jetzt direkte Live-Befehle:
  `corepack pnpm seo:audit:sitemap-live` und `corepack pnpm seo:audit:gsc-live`.

## Verifikation

- `corepack pnpm --filter @matthias-ramahi/web exec astro check`: 0 Fehler, 0 Warnungen.
- `corepack pnpm web:build`: erfolgreich.
- `corepack pnpm vercel:build`: erfolgreich. Der Vercel-Output enthaelt die Catch-all-Serverroute `^(?:/(.*?))?/?$` auf `_render` und den kompilierten `adoptedRoutes`-Chunk.
- Sitemap-Check: 493 URL-Eintraege gesamt = 251 normale Seiten-Eintraege plus 242 Bild-Sitemap-Eintraege.
- `Indexierte Seiten`: 125 exportierte URLs geparst; 76 in der normalen Sitemap, 49 ausserhalb. Die 49 Alt-URLs liefern jetzt 39 Redirects und 10 Gone, keine 404.
- `Nicht gefunden (404)`: 129 exportierte URLs geprueft; 76 Redirects zu indexierbaren Zielseiten und 53 Gone, keine offenen 404.
- `Gecrawlt - zurzeit nicht indexiert`: 220 exportierte URLs geprueft; 130 Redirects zu indexierbaren Zielseiten und 90 Gone, keine offenen 404.
- `Gefunden - zurzeit nicht indexiert`: 172 exportierte URLs geprueft; alle sind aktuelle 200er-Seiten mit eigener Canonical.
- GSC-Export-URL-Audit gesamt: 521 URL-Eintraege, 206 Redirects zu indexierbaren Zielseiten, 143 Gone, 172 indexierbare 200er-Seiten, 0 offene technische Problemfaelle.
- Sitemap-Indexability-Audit: 251 normale Sitemap-URLs, alle 251 `200`, alle indexierbar mit Self-Canonical, 0 technische Problemfaelle, 0 doppelte Canonicals, 0 doppelte Titles.
- Aktuelle lokale Nachpruefung am 2026-06-30 auf isoliertem Port `http://127.0.0.1:47891`: GSC-Export-URL-Audit erfolgreich mit 521 URL-Eintraegen, 206 Redirects zu indexierbaren Zielseiten, 143 Gone, 172 indexierbaren 200er-Seiten und 0 offenen Problemfaellen.
- Aktuelle lokale Nachpruefung am 2026-06-30 auf isoliertem Port `http://127.0.0.1:47891`: Sitemap-Indexability-Audit erfolgreich mit 251 normalen Sitemap-URLs, 251 indexierbaren 200ern, 0 technischen Problemfaellen, 0 doppelten Canonicals und 0 doppelten Titles.
- `corepack pnpm seo:audit:release-preview`: erfolgreich. Geprueft wurden 118 Release-Redirects, 251 normale Sitemap-URLs und 521 GSC-Fixture-URLs; Ergebnis: 0 offene Problemfaelle.
- Redirect-Beispiele aus `Seite mit Weiterleitung`: `/fotografie-musiker/`, `/automobil-fotografie`, `/fotografie`, `/index.html`, `/landschaftsfotografie`, `/sportwagen-fotografie`, `/autofotografie-duesseldorf/` und `/autofotografie-dortmund/` leiten korrekt auf kanonische Ziele.
- `Alternative Seite mit richtigem kanonischen Tag`: `/autofotografie-dortmund/` leitet jetzt direkt per 308 auf `/automobil-fotografie-dortmund.html`.
- `Wegen Zugriffsverbot (403) blockiert`: In den angehaengten Exportdateien ist keine konkrete 403-Beispiel-URL enthalten. Die geprueften 521 URLs enthalten lokal keinen 403-Fall.
- Local-SEO-Duplicate-Audit: 219 Seiten geprueft, 0 Title-Duplikate, 0 Canonical-Probleme, Risikoverteilung `niedrig: 209`, `mittel-niedrig: 10`.
- Browser-QA: `/fotografie.html` laedt, Local-Hub ist vorhanden, keine Console-Warnungen/Fehler, Link `Autohaus Fotografie` navigiert korrekt zu `/autohaus-fotografie.html`.
- Mobile-QA: Local-Hub passt bei 390px Breite ohne horizontalen Link-Ueberlauf.

## Live-Produktionsabgleich

- Live-Sitemap am 2026-06-30: `corepack pnpm seo:audit:sitemap-indexability -- --origin https://matthiasramahi.de --report /tmp/matthias-live-sitemap-indexability.md --strict` erfolgreich.
- Live-Sitemap-Ergebnis: 251 normale Sitemap-URLs, alle 251 `200`, 0 technische Problemfaelle, 0 doppelte Canonicals, 0 doppelte Titles.
- Live-GSC-Export-Abgleich am 2026-06-30: `corepack pnpm seo:audit:gsc-exports -- --origin https://matthiasramahi.de --not-found <404-export.txt> --crawled <gecrawlt-export.txt> --found <gefunden-export.txt> --report /tmp/matthias-live-gsc-export-url-audit.md --strict` schlaegt erwartbar fehl, weil die Produktion noch offene Alt-404 ausliefert.
- Live-GSC-Ergebnis: 521 URL-Eintraege, 333 offene 404, 16 Redirects zu indexierbaren Zielseiten, 172 indexierbare 200er-Seiten.
- Live-Gruppen: `Nicht gefunden (404)` = 124 offene 404 und 5 Redirects; `Gecrawlt - zurzeit nicht indexiert` = 209 offene 404 und 11 Redirects; `Gefunden - zurzeit nicht indexiert` = 172 indexierbare 200er.
- Live-Recheck am 2026-06-30: unveraendert rot. `corepack pnpm seo:audit:gsc-exports -- --origin https://matthiasramahi.de ... --strict` ergibt weiterhin 333 offene 404, 16 Redirects zu indexierbaren Zielseiten und 172 indexierbare 200er.
- Live-Recheck per Shortcut am 2026-06-30: `corepack pnpm seo:audit:sitemap-live` erfolgreich mit 251 indexierbaren Sitemap-URLs; `corepack pnpm seo:audit:gsc-live` schlaegt erwartbar fehl mit 333 offenen 404.
- Post-Deployment-Recheck am 2026-06-30: `corepack pnpm seo:audit:gsc-live` erfolgreich. 521 URL-Eintraege, 206 Redirects zu indexierbaren Zielseiten, 143 Gone, 172 indexierbare 200er-Seiten, 0 offene Problemfaelle.
- Post-Deployment-Recheck am 2026-06-30: `corepack pnpm seo:audit:sitemap-live` erfolgreich. 251 normale Sitemap-URLs, 251 indexierbare 200er, 0 technische Problemfaelle, 0 doppelte Canonicals, 0 doppelte Titles.
- Schlussfolgerung: Die normale Sitemap und die aus GSC exportierten Problem-URLs sind live technisch sauber. Die naechste Bewegung ist jetzt die Validierung in der Google Search Console.

## GSC-Follow-up 2026-07-04

- Google Search Console meldet nach dem Re-Crawl 276 indexierte Seiten statt vorher 126. Das ist die erwartete positive Bewegung nach Redirect-/Gone-Bereinigung und Sitemap-Stabilisierung.
- `Gefunden - zurzeit nicht indexiert` ist von 172 auf 1 Beispiel gefallen: `/portfolio/portfolio-auswahl-automobil`.
- `Gecrawlt - zurzeit nicht indexiert` ist von 220 auf 175 gefallen. Die verbliebenen Beispiele sind groesstenteils alte WordPress-/Tag-/Category-/Artikel-URLs, die live bereits redirecten oder Gone liefern.
- `Nicht gefunden (404)` ist von 129 auf 62 gefallen. Die noch sichtbaren Beispiele enthalten viele bereits bereinigte Alt-URLs; hier muss GSC weiter nachziehen.
- `Seite mit Weiterleitung` ist von 16 auf 29 gestiegen. Das ist in dieser Phase erwartbar und grundsaetzlich positiv, solange die Ziele indexierbar sind.
- `Durch noindex-Tag ausgeschlossen`: `/journal` war live eine statisch prerenderte Redirect-Seite mit `200` und `noindex`. Fix: `/journal` und `/journal/` sind jetzt echte Server-Redirects auf `/blog.html`.
- `Alternative Seite mit richtigem kanonischen Tag`: `/autofotografie-bochum/` und `/autofotografie-dortmund/` leiten live per 308 auf selbstkanonische Automobil-Seiten.
- `Wegen Zugriffsverbot (403) blockiert`: `/wp-admin/*` liefert live bereits `410 Gone` mit `X-Robots-Tag: noindex`; die GSC-Meldung ist hier ein Altstand.
- `Duplikat - Google hat andere Canonical bestimmt`: `/fotografie-duesseldorf.html` und `/fotografie-deutschland.html` liefern live `200`, `index,follow` und Self-Canonical. Weiter beobachten, weil diese beiden Uebersichtsseiten bewusst nahe an der Haupt-Fotografie-Struktur liegen.
- Portfolio-Staerkung: Der Portfolio-Index verlinkt jetzt sichtbar auf die sechs kuratierten Portfolio-Auswahlseiten, inklusive `/portfolio/portfolio-auswahl-automobil`. Das erhoeht die interne Linkkraft fuer den letzten `Gefunden - zurzeit nicht indexiert`-Fall.
- Release-Gate erweitert: `tools/assert-seo-release-routing.mjs` prueft jetzt `/journal` und `/journal/` explizit als Redirects auf `/blog.html`.

## GSC-Follow-up 2026-07-28

- Der aktuelle Export `Indexierte Seiten` meldet 266 Seiten und enthaelt 265 eindeutige URLs.
- Von den 252 normalen URLs der Live-Sitemap sind 249 bereits im Export der indexierten Seiten enthalten.
- Die drei noch nicht im Index-Export sichtbaren Sitemap-URLs sind `/fotografie-duesseldorf.html`, `/fotografie-deutschland.html` und `/keyword-datenbank-seo.html`. Alle drei liefern live `200`, `index,follow` und einen Self-Canonical.
- Der aktuelle Export `Gecrawlt - zurzeit nicht indexiert` enthaelt 172 eindeutige URLs: 84 Tag-Archive, 22 Kategorie-Archive, 33 alte WordPress-Artikelpfade und keine einzige aktuelle `.html`-URL.
- Die fehlgeschlagene GSC-Validierung fuer `Nicht gefunden (404)` bedeutet daher nicht, dass die neue Website technisch 34 kaputte Zielseiten hat. Relevante Alt-URLs leiten live per `308` weiter; absichtlich entfernte Archive, Shopreste und WordPress-Probes liefern `410 Gone`.
- Alle 34 am 2026-07-28 genannten Beispiel-URLs wurden live einzeln geprueft: 26 liefern `308`, 8 liefern `410`, keine liefert weiterhin `404`.
- Der Live-Sitemap-Audit prueft 252 normale URLs: 252 indexierbare `200`-Antworten, 0 technische Problemfaelle, 0 doppelte Canonicals und 0 doppelte Titles.
- Der Live-Abgleich der bisherigen 521 GSC-Fixture-URLs ergibt 206 Redirects zu indexierbaren Zielen, 143 `410 Gone`, 172 indexierbare `200`-Seiten und 0 offene technische Problemfaelle.
- Der Export-Audit arbeitet jetzt parallel und mit einem Request-Timeout. Dadurch koennen grosse GSC-Exporte regelmaessig geprueft werden, ohne dass ein einzelner langsamer Altpfad den gesamten Lauf blockiert.

## Wachstumsprioritaeten ab 2026-07-28

Der verbindliche Seitenrollen-, Hub-/Cluster- und 90-Tage-Plan steht in
`docs/seo-hub-cluster-strategy.md`. Dieses Dokument bleibt die Quelle fuer technische
Indexierung, GSC-Altbestand, Redirects und Gone-Entscheidungen.

1. Die bestehenden kanonischen URLs stabil halten. Keine Massen-Relaunches oder Slug-Wechsel fuer bereits indexierte Seiten.
2. `/fotografie-deutschland.html` wird dauerhaft auf `/fotografie-duesseldorf.html` konsolidiert. Die alte URL bleibt aus Sitemap und interner Navigation entfernt; `/fotografie.html`, `/fotografie-duesseldorf.html` und `/fotografie-nrw.html` behalten getrennte Rollen.
3. `/keyword-datenbank-seo.html` bleibt als transparente Contextter-Fallstudie indexierbar. Sie dokumentiert reale Produktentscheidungen, verlinkt gefolgt auf die deutsche Contextter-Produktseite und wird nicht als konkurrierende SEO-Dienstleistungsseite ausgebaut.
4. Zuerst Bottom-of-Funnel-Seiten mit realer Nachfrage und Umsatznaehe ausbauen: konkrete Shooting-Art, Zielgruppe, Ort, Ablauf, Nutzung und Preis-/Anfragefragen.
5. Pro Kerncluster wenige starke, erfahrungsbasierte Ratgeber priorisieren. Jeder Ratgeber verlinkt kontextuell auf die passende Leistungsseite; jede Leistungsseite verlinkt auf die wirklich hilfreichen Ratgeber.
6. Echte Belege verstaerken: reale Serien, Kundenstimmen mit Einwilligung, nachvollziehbare Fallstudien, lokale Partner, Fachbeitraege, Interviews und Branchenverzeichnisse mit konsistentem NAP.
7. Bilder und Video als eigenes Suchinventar behandeln: aussagekraeftige Dateinamen, konkrete Alt-Texte, Bildunterschriften, passende Zielseiten und Auswertung der Bild-/Video-Suche in GSC.
8. Neue Seiten nur aus Search-Console-, Anfrage- oder Kundenfragen ableiten. Seiten ohne Impressionen, Links, klare Intent-Rolle oder belegbaren Mehrwert werden zusammengelegt, weitergeleitet oder auf `410` gesetzt.
9. Alle vier Wochen messen: indexierte Sitemap-URLs, nicht indexierte aktuelle Canonicals, Impressionen/Klicks je Cluster, Anfragen je Landingpage, neue verweisende Domains und Marken-/Entity-Nennungen.

## Wiederholbare Audit-Commands

- Sitemap/Canonical lokal oder live:
  `corepack pnpm seo:audit:sitemap-indexability -- --origin <origin> --strict`
- GSC-Exportdateien lokal oder live:
  `corepack pnpm seo:audit:gsc-exports -- --origin <origin> --not-found <404-export.txt> --crawled <gecrawlt-export.txt> --found <gefunden-export.txt> --strict`
- Post-Deploy-Live-Shortcuts:
  `corepack pnpm seo:audit:sitemap-live && corepack pnpm seo:audit:gsc-live`
- Local-SEO-Duplicate-Audit gegen SSR:
  `LOCAL_SEO_AUDIT_ORIGIN=<origin> node tools/audit-local-seo-duplicates.mjs`

## Naechste SEO-Runden

1. GSC nach Deployment validieren: `Nicht gefunden (404)`, `Seite mit Weiterleitung`, `Alternative Seite mit richtigem kanonischen Tag`, `Gecrawlt - zurzeit nicht indexiert` und `Gefunden - zurzeit nicht indexiert` jeweils als behoben bzw. neu crawlen lassen.
2. Fuer die eine 403- und die zwei Google-Duplikat-URLs konkrete Beispiel-URLs aus GSC nachreichen oder beim naechsten Export in den Audit aufnehmen; in den aktuellen drei Exportdateien sind diese Beispiele nicht enthalten.
3. Alte Blogartikel nicht pauschal wiederherstellen. Nur Themen mit erkennbarem Suchwert als neue Evergreen-Seiten neu schreiben; der Rest bleibt Redirect oder Gone.
4. Bild-Sitemap-Entscheidung separat treffen: fuer Fotografie kann sie nuetzlich bleiben, sie verfaelscht aber die GSC-Sitemap-Zahl optisch.

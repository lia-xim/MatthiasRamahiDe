# SEO-Potenzialanalyse matthiasramahi.de – 24. September 2026

Fortsetzung von `docs/seo-hub-cluster-strategy.md` (28.07.) und `docs/seo-fahrzeug-cluster-plan-2026-08-31.md`. Ziel: mehr Klicks aus der Google-Suche. Ergebnis: wo Potenzial liegt, welche Seiten neu entstehen, welche verbessert und welche aktualisiert werden sollten.

## Datenbasis und Grenzen

| Quelle | Stand | Hinweis |
|---|---|---|
| Crawl Foundry Domain-Snapshot matthiasramahi.de | 31.08.2026 | 62 Keywords, ~125 geschätzte Klicks/Monat, 80 verweisende Domains |
| Crawl Foundry Site-Audit `aud_13gqa26hx51t` | 08.09.2026 | **nur 100 von 163 gefundenen URLs gecrawlt** (URL-Limit) |
| Crawl Foundry Domain-Snapshot oldtimerphotography.de | 09.09.2026 | Wettbewerbervergleich |
| Live-Prüfung einzelner Seiten | 24.09.2026 | Titel, H1, Weiterleitungen |
| Lokale Content-Dateien (`apps/web/content`) | Stand Rechner 24.09. | Abgleich lokal ↔ live |

**Nicht verfügbar:** Google Search Console ist im Crawl-Foundry-Workspace nicht verbunden, und es gibt kein Rank-Tracking. Suchvolumen und Traffic sind Schätzungen des Datenanbieters, keine GSC-Werte. Die Abschnitte 1–7 beruhen auf dem Snapshot vom 31.08.; der frische Snapshot vom 24.09. steht im Nachtrag direkt darunter. „Nicht mehr gelistet“ heißt: im Snapshot vom 24.09. nicht mehr unter den rankenden Keywords.

## Nachtrag 24.09., 17:00 – frischer Snapshot (`snap_bd2znq0zc8ui`, 0,13 €)

| Kennzahl | 31.08. | 24.09. |
|---|---:|---:|
| Organische Keywords | 62 | **43** |
| Geschätzte Klicks/Monat gesamt | ~125 | ~127 |
| davon Startseite (v. a. Em Pöötzke) | ~96 | ~107 |
| davon Fotografie-Keywords (grob) | ~29 | **~20** |

**Weggefallen seit 31.08.** (bestätigt die Befürchtung aus Abschnitt 2):

| Keyword | Volumen | Position 31.08. | 24.09. |
|---|---:|---:|---|
| lowkey fotografie | 590 | 27 | nicht mehr gelistet |
| high-key fotos / high key fotos | 50 / 50 | 21 / 31 | nicht mehr gelistet |
| actioncam für motorrad | 590 | 24 | nicht mehr gelistet |
| bilder farben | 390 | 18 | nicht mehr gelistet |
| professioneller fotodruck | 210 | 24 | nicht mehr gelistet |
| **fahrzeugfotografie** | 50 | **9** | nicht mehr gelistet |
| fotografieren in düsseldorf | 50 | 7 | nicht mehr gelistet |

**Veränderte Positionen:**

| Keyword | Volumen | 31.08. | 24.09. |
|---|---:|---:|---:|
| fotoshooting mit auto | 260 | 14 | **38** ↓ |
| fotolabor düsseldorf | 110 | 15 | 21 ↓ |
| motorrad fotoshooting | 210 | 21 | 28 ↓ |
| fotoshooting motorrad | 210 | 22 | 18 ↑ |
| fotoshooting mit motorrad | 210 | 23 | 19 ↑ |
| motorrad fotograf / fotograf motorrad | 110 | 6 / 5 | 7 / 6 |
| auto fotoshooting | 260 | 23 | 23 |
| fotospots für autos in der nähe | 110 | 11 | 11 |
| neu: fotografie autos | 260 | – | 39 |
| neu: keyword datenbanken | 170 | – | 23 |

**Folgerungen:**

1. Die drei Ratgeber-Rankings (Low-/High-Key, Actioncam, Farben) sind nach den Weiterleitungen **komplett verschwunden**. Die neuen Journal-Beiträge aus Abschnitt 2 sind damit die wichtigste Blog-Maßnahme. Die alten URLs sollten auf die neuen Beiträge zeigen, sobald diese online sind.
2. **Fahrzeugfotografie ist aus den Top 10 gefallen.** Das ist die einzige Seite aus dem Fahrzeug-Plan, die nachweislich live umgestellt wurde (Title „Fahrzeugfotografie für Verkauf, Bestand & Archiv“). Mögliche Ursache: Der Title beginnt zwar mit dem Keyword, die Seite wurde aber inhaltlich auf Dokumentation/Bestand verengt. Vor dem Deploy der übrigen Plan-Änderungen die Fahrzeugfotografie-Seite prüfen. Bei 50 Suchen/Monat und einer einzelnen Messung ist das noch kein Beweis, aber ein Warnsignal.
3. „Fotoshooting mit auto“ ist von 14 auf 38 gefallen, obwohl die lokale Neufassung noch nicht live ist. Die Rolle zwischen `/fotoshooting-mit-auto.html` und `/auto-fotoshooting.html` ist live offenbar weiter unscharf. Das spricht dafür, den Plan vom 31.08. zügig zu deployen.
4. Die Motorrad-Shooting-Varianten schwanken zwischen 18 und 28. Den Abschnitt „Motorrad-Fotoshooting“ auf dem Pillar (Abschnitt 3) weiter priorisieren.
5. **Update 17:15:** Die Fahrzeug-Änderungen wurden um 17:10 als Commit `e921bef` gepusht und von Vercel deployt (`dpl_7jDGixQqNuCp4unfcyzXNap76oX8`). Live geprüft: `/auto-fotoshooting.html` → „Auto-Fotoshooting NRW: Ablauf & Kosten“, `/motorrad-fotografie.html` → „Motorradfotografie NRW“. Abschnitt 1 ist damit erledigt; der 6-Wochen-Review zählt ab dem 24.09. (frühestens 05.11.2026).
6. Der Beitrag `journal-posts/low-key-high-key-portraits.json` liegt als Entwurf (`status: draft`) im Repo. Bei der Veröffentlichung in `apps/web/src/lib/adoptedRoutes.ts` die Ziele von `low-key-fotografie-beleuchtung-und-high-key-fotografie`, `portraitfotografie/low-key-fotografie-beleuchtung-und-high-key-fotografie`, `portraitfotografie/moody-portrait-fotografie`, `portraitfotografie/moody-portrait-look-mit-flat-profile-sanft-unterbelichtet` und `portraitfotografie/kreative-schattenfotografie-tipps-guide` auf `blog-low-key-high-key-portraits.html` umstellen. Die Mikrogesten-URL leitet bereits auf `blog-portraits-ohne-generische-posen.html`.
7. Keyword-Recherche für Blog-Themen: Der Lauf (`aop_dqihfwrcg9l0`, 0,51 €) wurde angenommen, war um 17:10 aber noch nicht gestartet. Die Ergebnisse werden nachgereicht.

**Korrektur zum Audit:** Die Audit-Werte „63 Seiten blockiert/nicht indexierbar“ und „0 eingehende Links“ auf Stadtseiten sind Effekte des Crawl-Limits. 163 − 100 = 63. Außerdem verlinkt z. B. `/motorrad-fotografie-nrw.html` live alle 22 Motorrad-Stadtseiten. Das ist **kein** Indexierungs- oder Verlinkungsproblem.

## Nachtrag 25.09. – Live-Crawl aller 270 Sitemap-URLs

Commit `cca3e15` ist live (Vercel Production, Status success); alle drei Beiträge, die Fotolabor-FAQ, der Fahrzeugfotografie-Title und die 308-Weiterleitungen sind live geprüft. `seo:audit:sitemap-live --strict`: 270/270 URLs 200 und indexierbar, keine Duplikate.

Eigener Crawl (kostenlos, ohne Crawl Foundry):

| Befund | Umfang | Einordnung |
|---|---:|---|
| **Keine Leistungsseite verlinkt einen Journal-Beitrag.** Die 30 Beiträge hängen nur an `/blog.html` und untereinander; die drei neuen Ratgeber haben 4–7 interne Links | alle 6 Fotografie-Familien | **behoben:** Block „Aus dem Journal“ (`NativeFamilyJournalLinks.astro`) auf allen Seiten der sechs Familien, Beiträge nach Journal-Cluster |
| Meta-Description > 160 Zeichen | 40 Seiten, v. a. Stadtseiten (161–167) | 3 neue/geänderte Seiten gekürzt; Rest kosmetisch |
| Title > 60 Zeichen (inkl. „\| Matthias Ramahi“) | 13 | niedrig; Keyword steht jeweils vorne |
| Title = H1 | 17 | niedrig |
| Hero-Bilder mit `alt=""` | Pillar- und Stadtseiten, 3–4 je Seite | für eine Fotografie-Seite Bildersuche-Potenzial; Alt-Texte nur mit geprüften Motivangaben |
| Journal-Beiträge < 300 Wörter im Hauptinhalt | 5 (u. a. `location-scouting-duesseldorf`, Position 11 für „fotospots für autos in der nähe“) | Ausbau nur mit eigenen, geprüften Inhalten |
| `/fahrzeugfotografie.html` nur 4 interne Links | 1 | aus Oldtimer- und Motorrad-Kontext verlinken |

Crawl Foundry: Der Keyword-Lauf `aop_dqihfwrcg9l0` ist fehlgeschlagen (`KEYWORD_RESEARCH_SOURCE_RESERVATION_INVALID`, 0 € berechnet). GSC, Backlinks und Rank-Tracking fehlen weiterhin.

## Kurzfazit

1. **Die Optimierungen vom 31.08. sind live nur teilweise angekommen.** Bei 3 von 4 geprüften Kernseiten weichen Title und Description live von den lokalen Content-Dateien ab. Das kommt zuerst, weil der geplante Review am 12.10. sonst den falschen Stand misst.
2. **77 % des geschätzten Traffics sind themenfremd.** Die Startseite rankt für Düsseldorfer Bar- und Clubnamen (Em Pöötzke, Mahiki usw.). Fotografie-Keywords bringen nur rund 30 Klicks im Monat.
3. **Drei alte Ratgeber mit echtem Suchvolumen wurden auf Leistungsseiten umgeleitet.** Anfragen wie „lowkey fotografie“ (590/Monat) oder „actioncam für motorrad“ (590) landen auf Seiten, die die Frage nicht beantworten. Hier liegen die günstigsten **neuen Seiten**.
4. **Viele Fotografie-Keywords stehen auf Position 11–30.** Sie sind mit bestehenden Seiten erreichbar. Grob geschätzt bringt Position 5 für alle Suchgruppen rund **+150 Klicks/Monat**, Position 3 rund +330 (heute ~30).
5. **Die Messung fehlt.** Ohne GSC-Anbindung und Rank-Tracking lässt sich keine der Maßnahmen bewerten.

## 1. Sofort: Deploy-Stand prüfen

| Seite | Lokal (Content-Datei) | Live am 24.09. |
|---|---|---|
| `/auto-fotoshooting.html` | „Auto-Fotoshooting NRW: Ablauf & Kosten \| Matthias Ramahi“, H1 „Auto-Fotoshooting NRW“ | „Auto Fotoshooting — Matthias Ramahi“, H1 „Auto-Fotoshooting“, alte Description |
| `/motorrad-fotografie.html` | „Motorradfotografie NRW \| Matthias Ramahi“ | „Motorradfotografie — Matthias Ramahi“ |
| `/automobil-fotografie.html` | „Automobilfotografie NRW \| Matthias Ramahi“ | „Automobilfotografie in NRW · Matthias Ramahi“ |
| `/fahrzeugfotografie.html` | „Fahrzeugfotografie für Verkauf, Bestand & Archiv“ | identisch ✔ |

Die Dateien wurden am 31.08. geändert. Die letzten Commits (02.–10.09.) betreffen Crawl-Foundry-Umbenennung, Hero und Lesbarkeit. Wahrscheinlich sind die Änderungen am Fahrzeug-Cluster also noch nicht committet oder deployt. Laut `docs/browser-readability-2026-09-10.md` enthält der lokale Checkout außerdem weitere, nicht zugeordnete Änderungen.

**Aktion:** `git status` für `apps/web/content/local-seo-pages` und `service-pages` prüfen, die Fahrzeug-Plan-Änderungen gezielt committen und deployen und danach `seo:audit:sitemap-live` laufen lassen. Den Review-Termin 12.10. auf 6 Wochen **nach** dem tatsächlichen Deploy verschieben.

## 2. Neue Seiten: verlorene Ratgeber-Rankings zurückholen

Im Snapshot vom 31.08. rankten noch alte WordPress-Artikel. Diese URLs leiten heute per Redirect auf Leistungsseiten (live geprüft). Google ersetzt eine Ratgeber-URL durch eine Leistungsseite in der Regel nicht im selben Ranking, weil die Suchabsicht nicht passt. Die Rankings werden also verschwinden.

| Alte URL (heute Redirect auf) | Keyword | Volumen/Monat | Position 31.08. | Vorschlag |
|---|---|---:|---:|---|
| `/portraitfotografie/low-key-fotografie-beleuchtung-und-high-key-fotografie/` → `/portraitfotografie.html` | lowkey fotografie · high-key fotos · high key fotos | 590 · 50 · 50 | 27 · 21 · 31 | **Neuer Journal-Beitrag „Low-Key- und High-Key-Portraits: Licht, Hintergrund, Belichtung“** mit eigenen Beispielbildern; alte URL auf diesen Beitrag umleiten; Links von `/portraitfotografie-beleuchtung.html` (erwähnt Low-/High-Key heute gar nicht) und vom Portrait-Pillar |
| `/motorradfotografie/motorrad-fotografie-mit-gopros/` → `/motorrad-fotografie.html` | actioncam für motorrad | 590 | 24 | **Journal-Beitrag „Actioncam am Motorrad: Halterung, Perspektive, Sicherheit“**, nur mit echter eigener Erfahrung oder eigenem Material; Link zu Motorrad-Pillar und `motorrad-fotoshooting-sicherheit` |
| `/portraitfotografie/farbtheorie-in-der-fotografie/` → `/portraitfotografie.html` | bilder farben | 390 | 18 | **Journal-Beitrag „Farbwirkung in der Fotografie“**; mit dem vorhandenen Beitrag `farbharmonie-fahrzeugfotografie` gegenseitig verlinken |
| `/portraitfotografie/mikrogesten-und-haende-im-charakterportraet…/` | handtypen | 50 | 17 | niedrige Priorität; als Abschnitt in `portraits-ohne-generische-posen` aufnehmen und die alte URL dorthin umleiten |

Das sind Informationsanfragen: Sie bringen Klicks und thematische Autorität, aber wenige direkte Anfragen. Deshalb verweist jeder Beitrag laut `JOURNAL_WORKFLOW.md` auf genau eine passende Leistungsseite.

## 3. Bestehende Seiten verbessern: Keywords auf Position 5–30

Varianten mit identischem Suchvolumen sind beim Datenanbieter meist dieselbe Suchgruppe. Ihr Volumen wird deshalb **nicht** addiert.

| Suchgruppe | Volumen | Beste Position | Zielseite | Maßnahme |
|---|---:|---:|---|---|
| motorrad fotograf / fotograf motorrad / motorrad fotografie | 110–140 | 5–9 | `/motorrad-fotografie.html` | **Schützen.** Keine URL-, H1- oder Rollenänderung; nur Title-Update aus Abschnitt 1 deployen |
| motorrad fotoshooting / fotoshooting motorrad / fotoshooting mit motorrad (+ motorrad shooting 70) | 210 | 21 | `/motorrad-fotografie.html` | Auf dem Pillar einen eigenen Abschnitt „Motorrad-Fotoshooting: Ablauf, Location & Kosten“ mit Preis und FAQ ergänzen. **Kandidat für eine neue Seite** `/motorrad-fotoshooting.html` nach dem Muster `/auto-fotoshooting.html`: Die Düsseldorf-Variante `motorrad-shooting-duesseldorf` existiert schon, eine allgemeine NRW-Seite fehlt. Entscheiden, sobald GSC zeigt, ob der Pillar für „fotoshooting“-Anfragen Impressionen, aber keine Klicks bekommt |
| fotoshooting mit auto / auto fotoshooting / fotoshooting auto | 260 | 14 | `/fotoshooting-mit-auto.html` · `/auto-fotoshooting.html` | Ist im Plan vom 31.08. schon gelöst. **Nur deployen** (Abschnitt 1) |
| autofotografie / autofoto | 210 / 90 | 25 / 17 | `/autofotografie.html` | wie Plan 31.08.; nach dem Deploy messen |
| automotive fotografie | 90 | 31 | `/automotive-fotografie.html` | B2B-Belege ergänzen, sobald freigegeben |
| professioneller fotodruck · fotolabor düsseldorf | 210 · 110 | 24 · 15 | `/fotolabor-druck-duesseldorf.html` | **Quick Win:** Title und H1 auf „Fotolabor Düsseldorf“, Abschnitt „Professioneller Fotodruck: Papiere, Formate, Preise“, FAQ. Die Seite rankt bereits |
| fotospots für autos in der nähe (+ auto fotospots nrw 40) | 90 | 11 | Journal `location-scouting-duesseldorf` · `/auto-fotografieren-tipps.html` | Position 11 ist fast Seite 1. Den Location-Scouting-Beitrag um **selbst geprüfte** Fahrzeug-Spots mit Zufahrt, Erlaubnis, Licht und eigenem Bild erweitern. Keine ungeprüfte Ortsliste |
| motorrad fotografieren | 110 | 13 | Journal `motorrad-fotoshooting-checkliste` bzw. `motorradfotografie-linien` | Einen Beitrag zum Hauptziel für „Motorrad fotografieren (Tipps)“ machen und Title/H1 anpassen |
| fahrzeugfotografie | 50 | 9 | `/fahrzeugfotografie.html` | ist live aktuell; beobachten |
| dating fotograf | 90 | 41 | `/dating-fotoshooting.html` | den Begriff „Dating-Fotograf“ in Einstieg und FAQ aufnehmen |

## 4. Traffic-Qualität: themenfremde Rankings der Startseite

31 von 62 Keywords (~96 von ~125 geschätzten Klicks) sind themenfremd, vor allem Bar-, Club- und Lokalnamen: Em Pöötzke (1.600/Monat, Position 5), Mahiki, Tipsy Country Club, Jazz-Bars, Papidoux, Nilsson u. a. Sie ranken auf der Startseite. em-pöötzke.de verlinkt die Seite mehrfach. Das schadet nicht, verfälscht aber jede Traffic-Kennzahl.

- **Messung:** Diese Klicks in allen Reports getrennt von den Fotografie-Clustern führen.
- **Frage an dich:** Diese Rankings deuten auf frühere Gastro- und Eventfotografie hin. Falls das ein aktuelles Angebot ist (mit Bildrechten), wäre eine Seite „Gastronomie- & Eventfotografie Düsseldorf“ die einzige neue Leistungsseite, die aus vorhandener Sichtbarkeit sofort Nachfrage machen könnte. Falls nicht, einfach ignorieren.

## 5. Wettbewerber: oldtimerphotography.de

| | matthiasramahi.de (31.08.) | oldtimerphotography.de (09.09.) |
|---|---:|---:|
| Organische Keywords | 62 | 2.301 |
| Geschätzte Klicks/Monat | ~125 | ~9.947 |
| Verweisende Domains | 80 | 123 |

Dessen Traffic kommt aus **fahrzeugspezifischen Seiten mit eigenen Fotos**: Shelby GT500 „Eleanor“ (~1.221), General Motors (~2.758), Jaguar (~430). Dazu kommen „[Marke] Logo alt“-Seiten und Oldtimertreffen-Berichte, z. B. Kressbronn und Bodensee auf Position 1. Das ist ein Hobby- und Lexikonmodell, kein Dienstleister, und soll **nicht** kopiert werden. Übertragbar sind zwei Hebel:

1. **Modellnamen sichtbar machen (Aktualisierung, geringer Aufwand).** Die Bildbeschriftungen in den Portfolio-Auswahlen sind generisch („Hypercar · Exterieur“, „Klassiker · Messe“, „Showcar · Widebody“). Wo Modell, Baujahr oder Veranstaltung bekannt und freigegeben sind, gehören sie in Alt-Text, Bildunterschrift und Dateinamen. Das bringt Bildersuche-Traffic ohne neue URLs.
2. **Veranstaltungsberichte (neue Seiten, nur mit echtem Material).** Der Beitrag `oldtimer-veranstaltungen` ist ein allgemeiner Ansatz. Echte Berichte zu NRW-Treffen oder -Messen, die du fotografiert hast (Name, Datum, eigene Serie, Freigaben), treffen Event-Suchanfragen und passen zur Outreach-Liste (Classic Remise, Oldtimer Markt).

## 6. Technik (niedrigere Priorität)

Keine kritischen oder hohen Befunde auf den 100 gecrawlten URLs. Offene Punkte:

- **Performance:** Mobile-Lighthouse 73–86 in einer Stichprobe von 20 Seiten; kritische Netzwerkketten und render-blockierende Ressourcen auf allen 100 URLs, Cache-Policy auf 92, Bildauslieferung auf 55. Am niedrigsten liegen Dating (73/75), Landschaft Köln (73), Landschaft Oberhausen (74) und Gutschein (75).
- **Snippets:** 19 zu lange Meta-Descriptions, 3 zu lange Titles, 16 Seiten mit Title = H1.
- **Entity-Klarheit** im AI-Readiness-Score: Ø 54, keine Seite „ready“. `Person`/`LocalBusiness`-Schema mit `sameAs`, gleicher NAP-Angabe und Autorenhinweis im Journal ergänzen.
- **Backlinks:** Der Snapshot meldet 8 defekte Backlinks. Die Ziel-URLs mit einem Backlink-Snapshot ermitteln und per Redirect auffangen. Viele verweisende Domains sind Shortener oder Linklisten; Disavow ist nicht nötig, Hauptsache kein Linkkauf.
- **Vollständiger Audit:** Der nächste Crawl sollte mindestens 300 URLs abdecken (die Sitemap hat ~251 Seiten), damit Linkfluss und Indexierbarkeit belastbar sind.

## 7. Messung einrichten

1. **GSC mit Crawl Foundry verbinden** (Site `sit_rgqyhoj4p65k`). Ohne Page-Query-Daten sind die offenen Punkte aus dem Hub-Plan (Überlappung Auto/Fahrzeug, Sportwagen-Shooting/-Fotoshooting) nicht entscheidbar.
2. **Rank-Tracking** für eine Liste von ~25 Zielkeywords aus Abschnitt 2 und 3, wöchentlich, mobil, Budget ab 5 €/Monat. Baseline direkt nach dem Deploy aus Abschnitt 1 setzen.
3. Bar- und Clubrankings als eigene Gruppe „themenfremd“ führen.

## Priorisierte Reihenfolge

| # | Maßnahme | Art | Aufwand | Wirkung |
|---:|---|---|---|---|
| 1 | Fahrzeug-Plan-Änderungen vom 31.08. committen und deployen, live prüfen | Aktualisieren | klein | hoch (Voraussetzung) |
| 2 | GSC in Crawl Foundry verbinden, Tracking-Liste und Baseline | Messen | klein | hoch (Voraussetzung) |
| 3 | Low-/High-Key-Beitrag, alte URL umleiten | Neu | mittel | ~690 Suchen/Monat |
| 4 | Fotolabor-Seite auf „Fotolabor Düsseldorf“/„professioneller Fotodruck“ | Verbessern | klein | 320 Suchen/Monat, Position 15/24 |
| 5 | Actioncam-Motorrad-Beitrag (nur mit echtem Material), alte URL umleiten | Neu | mittel | 590 Suchen/Monat |
| 6 | Farbwirkungs-Beitrag, alte URL umleiten | Neu | mittel | 390 Suchen/Monat |
| 7 | Motorrad-Fotoshooting-Abschnitt auf dem Pillar; neue Seite nach GSC-Befund | Verbessern → ggf. neu | klein/mittel | 210 Suchen/Monat, Position 21 |
| 8 | Location-Scouting-Beitrag um geprüfte Auto-Spots erweitern | Verbessern | mittel | 130 Suchen/Monat, Position 11 |
| 9 | Modellnamen in Portfolio-Alt-Texten und Bildunterschriften | Aktualisieren | klein | Bildersuche |
| 10 | Performance (render-blocking, Bildauslieferung), Meta-Längen, Entity-Schema | Technik | mittel | indirekt |

**Bewusst nicht empfohlen:** keine weiteren Stadt- oder Synonymseiten (siehe Hub-Strategie), keine Logo- oder Lexikonseiten nach Wettbewerbervorbild, keine erfundenen Projekte oder Kundenstimmen.

## Potenzial grob geschätzt

Die 21 Fotografie-Suchgruppen, für die die Domain am 31.08. rankte (dedupliziert ~3.600 Suchen/Monat), bringen heute geschätzt ~30 Klicks/Monat. Erreichen alle Position 5, sind es grob **+150 Klicks/Monat**, bei Position 3 grob +330. Die neuen Ratgeber aus Abschnitt 2 sind darin enthalten, weil ihre Keywords schon ranken. Die Schätzung nutzt ein einfaches CTR-Modell ohne GSC-Daten und ist nur eine Größenordnung. Erst die GSC-Anbindung liefert echte Werte.

# Journal SEO Editorial Pipeline & Future-Content Blueprint (`matthiasramahi.de`)

Stand: 27. November 2026  
Geltungsbereich: `apps/web/content/journal-posts/*.json` (Astro + TinaCMS)  
Strategische Grundlage: `CLAUDE.md`, `matthias-ramahi.md`, `docs/JOURNAL_WORKFLOW.md`, `docs/redaktionskalender-2026-11-bis-2027-12.md` sowie die GSC-Auswertungen (3-Monats-Export `2026-08-26` bis `2026-11-25` & 16-Monats-Export `2025-07-26` bis `2026-11-25`).

---

## 1. Strategische Einordnung & Anti-AI-Slop-Leitplanken

Die 16-Monats-GSC-Analyse zeigt zwei zentrale Ursachen für den Sichtbarkeitsverlust seit Juni 2026:
1. **Verlust starker Fachartikel bei der Migration:** Sechs ehemals sehr erfolgreiche WordPress-Guides mit hohem Information Gain (u. a. *Retro-Looks*, *Mikrogesten & Hände*, *Oldtimer-Guide*, *Motorrad-Guide*, *Rechtliche Aspekte*, *Outdoor-Portraits*) wurden nicht in die neue `.html`-Struktur übernommen.
2. **Skalierungs- und CTR-Risiko:** Ein großer Teil der bestehenden 158 vorgeplanten Beiträge (`status: scheduled` bis Juni 2028) dreht sich um kleinteilige Automotive-Randthemen, während kommerziell starke Verticals (**Portrait/Dating/Männer**, **Personal Branding**, **Oldtimer**, **Motorrad**, **Fine-Art-Druck/Fotolabor**, **Videografie**) unterversorgt sind. Gleichzeitig weist `audit-journal-source.mjs` 41 mehrfach genutzte Hero-Bilder im Bestand aus.

Jeder künftige Journal-Beitrag muss deshalb die **5 Anti-AI-SEO-Prinzipien** erfüllen:

| Prinzip | Verbindlicher Standard für `matthiasramahi.de` |
| --- | --- |
| **1. Information Gain** | Jeder Artikel liefert mindestens ein echtes Praxis-Artefakt, das kein generischer KI-Text kopieren kann: eigene Vergleichstabelle (GFM-Markdown), konkrete Kamera-/Licht-Richtwerte, reale Set-Beobachtungen aus NRW oder eine direkt nutzbare Checkliste. |
| **2. Visual Semantics & Design Effort** | Keine generischen Stock- oder doppelt verwendeten Cover-Bilder. Jeder neue Beitrag erhält ein **eigenes, rechtegeklärtes Originalfoto** von Matthias Ramahi plus mindestens eine `imageSequence` mit konkreten Bildunterschriften (Motiv, Licht, Bildwirkung). |
| **3. User Behavior Signals (CTR & Verweildauer)** | `seo.title` (50–60 Zeichen) und `seo.description` (135–155 Zeichen) kommunizieren konkreten Praxisnutzen statt Keyword-Stapeln. Einstieg über `summary`-Block (Kurzantwort), klare Zwischenüberschriften, Tabellen für schnelles Scannen und kontextueller CTA zum passenden kommerziellen Pillar. |
| **4. Anti-Scaled-Content-Abuse** | Keine seriellen Stadt- oder Synonym-Beiträge. Jeder Artikel bedient eine eigenständige Suchintention und verweist ausschließlich auf **kanonische Pillar-URLs** (keine 308-Redirects, keine geprunten Stadt-Doorways). |
| **5. Anti-Duplicate & Anti-Cannibalization** | Vor dem Schreiben wird geprüft, ob bereits ein Artikel oder eine Leistungsseite auf dieselbe Intention zielt. Journal-Beiträge bedienen **informational / commercial-investigation** Intent und stärken den jeweiligen kommerziellen Pillar über interne Links. |

### Harte Fakten- und Markenregeln (`CLAUDE.md` & `matthias-ramahi.md`)
- **Keine erfundenen Belege:** Keine erfundenen Kunden, Testimonials, Auftragszahlen, Auszeichnungen oder Partnerschaften.
- **Klare Bereichstrennung:** Die 6 Fotografie-Pillars (Automobil, Sportwagen, Oldtimer, Motorrad, Portrait, Landschaft/Fine-Art-Prints) sind der Markenkern; Fotolabor/Druck, Großformat, Werbetechnik, Web/SEO und Videografie bleiben klar als **Zusatzleistungs- bzw. Partnerbereiche** gekennzeichnet.
- **Kanonische Money-URLs für interne Links (0 Redirects):**
  - `/autofotografie.html`, `/autofotografie-duesseldorf.html`, `/automobil-fotografie-nrw.html`, `/autohaus-fotografie.html`
  - `/sportwagen-fotografie.html`, `/sportwagen-fotografie-duesseldorf.html`, `/sportwagen-shooting-duesseldorf.html`, `/motorsport-fotografie.html`
  - `/oldtimer-fotografie.html`, `/oldtimer-fotografie-duesseldorf.html`, `/oldtimer-verkaufsfotos-duesseldorf.html`, `/sammlerfahrzeug-fotografie-duesseldorf.html`, `/vintage-fotoshooting.html`
  - `/motorrad-fotografie.html`, `/motorrad-fotografie-duesseldorf.html`, `/custom-bike-fotografie.html`, `/biker-portrait-duesseldorf.html`
  - `/portraitfotografie.html`, `/portraitfotografie-duesseldorf.html`, `/personal-branding-fotografie-duesseldorf.html`, `/dating-fotoshooting-duesseldorf.html`, `/fotoshooting-maenner.html`, `/musikerfotografie.html`
  - `/landschaftsfotografie.html`, `/landschaftsbilder-kaufen.html`, `/fine-art-prints-landschaft.html`, `/fotolabor-druck-duesseldorf.html`
  - `/videografie-duesseldorf.html`, `/contact.html`

---

## 2. Abstimmung mit dem bestehenden Redaktionskalender (`redaktionskalender-2026-11-bis-2027-12.md`)

- Der bestehende Kalender plant **158 kommerzielle Beiträge** (2×/Woche, Di & Fr 09:00 Uhr Europe/Berlin) bis Juni 2028; 28 allgemeine Kamera-/Buchrezensions-Artikel bleiben als `status: draft` geparkt.
- **Priorisierungsregel:** Die unten definierten **16 Pipeline-Beiträge (6× Priority A + 10× Priority B)** haben höheren erwarteten SEO- und Umsatzhebel als späte 2027/2028-Nischenartikel. Sobald Matthias das authentische Bild- und Erfahrungsmaterial für einen Priority-A- oder Priority-B-Artikel liefert, wird dieser **vorgezogen** (z. B. auf den nächsten freien Dienstags- oder Freitagstermin) und bei Veröffentlichung in `apps/web/src/lib/adoptedRoutes.ts` (`adoptedLegacyFiles`) registriert.
- **Hero-Bild-Bereinigung:** Vor dem Livegang bestehender `scheduled`-Artikel sollten mehrfach belegte `coverImage`-Pfade sukzessive durch eindeutige Originalaufnahmen ersetzt werden.

---

## 3. Priority A: Recovery-Briefs für die 6 verschwundenen WordPress-Top-Guides

Diese 6 Guides erzeugten in der 16-Monats-GSC-Historie zusammen über **117+ dokumentierte Klicks und >10.465 Impressionen** auf Seite-1-Positionen (Ø Pos. 8,3–12,6), existieren aber nicht mehr im aktuellen Bestand. Nach Veröffentlichung der neuen `.html`-Artikel sollten die jeweiligen alten WordPress-Pfade in `apps/web/src/lib/adoptedRoutes.ts` (`legacyPathRedirectTargets`) per 308 direkt auf den neuen Artikel umgeleitet werden.

### A1. Retro-Looks in der digitalen Fotografie
- **Target URL Slug:** `/blog-retro-looks-digitale-fotografie.html` (308 von `/portraitfotografie/retro-looks-in-der-digitalen-fotografie/`)
- **GSC-Historie (16M):** 44 Klicks | 4.645 Impressionen | Ø Pos. 8,95 (**stärkster verlorener Artikel**)
- **SEO Title (56 Zeichen):** `Retro-Look in der Fotografie: Licht, Farben & Film-Optik`
- **SEO Description (152 Zeichen):** `Retro-Looks digital glaubwürdig umsetzen: Lichtcharakter, Farbpalette, Kontrastkurve und Körnung für zeitlose Portraits und Oldtimer statt billiger Filter.`
- **Primary Keyword:** `retro look fotografie`
- **Secondary Keywords:** `vintage look fotos bearbeiten`, `film look digital fotografieren`, `analog look portraits`
- **Search Intent:** Informational / Commercial Investigation (Kunden und Fotografen, die authentische Retro-/Vintage-Optik suchen)
- **Unterstützter Pillar:** `/vintage-fotoshooting.html` & `/portraitfotografie-duesseldorf.html`
- **Authentisches Material von Matthias:**
  - 2–3 eigene Vorher/Nachher-Beispiele (neutrales RAW vs. fertiger Retro-Look) aus realen Portrait- oder Oldtimer-Serien
  - Konkrete Notizen zu Tonwertkurve, Hautton-Sicherung und Korn-Dosierung
- **Pflicht-Information-Gain:**
  - GFM-Vergleichstabelle: *Typische Retro-Ästhetiken (70er Warmton, 90er Editorial, Klassisches S/W)* nach Lichtart, Farbpalette, Schattenzeichnung und passendem Motiv
  - Checkliste: *5 Fehler, die digitale Retro-Bilder künstlich wirken lassen*
- **Interne Verlinkung:**
  - Outbound: `/vintage-fotoshooting.html`, `/portraitfotografie-duesseldorf.html`, `/blog-farbtheorie-fotografie.html`, `/contact.html`
  - Inbound: von `/vintage-fotoshooting.html`, `/blog-schwarz-weiss-portrait-licht.html`, `/blog-farbtheorie-fotografie.html`
- **Anti-Cannibalization Guardrail:** Fokus liegt auf **Bildsprache, Licht und digitaler Ausarbeitung** (How-to/Ästhetik) — kein Leistungsangebot-Duplikat zu `/vintage-fotoshooting.html` (Buchungs-/Angebotsseite) und keine Überlappung mit `oldtimer-auf-film-fotografieren.json` (echter Analogfilm).

---

### A2. Mikrogesten und Hände im Charakterportrait
- **Target URL Slug:** `/blog-mikrogesten-haende-portrait.html` (308 von `/portraitfotografie/mikrogesten-und-haende-im-charakterportraet...`)
- **GSC-Historie (16M):** 26 Klicks | 3.114 Impressionen | Ø Pos. 12,04
- **SEO Title (56 Zeichen):** `Hände & Mikrogesten im Portrait: Natürliche Körperhaltung`
- **SEO Description (149 Zeichen):** `Wohin mit den Händen beim Fotoshooting? Wie Mikrogesten, Schulterlinie und kleine Handlungen steife Posen im Charakter- und Businessportrait lösen.`
- **Primary Keyword:** `hände im portrait fotografieren`
- **Secondary Keywords:** `mikrogesten portraitfotografie`, `wohin mit den händen fotoshooting`, `natürliche posen portrait`
- **Search Intent:** Informational (Portrait-Kunden vor dem Shooting + Fotografen)
- **Unterstützter Pillar:** `/portraitfotografie-duesseldorf.html` & `/personal-branding-fotografie-duesseldorf.html`
- **Authentisches Material von Matthias:**
  - 2–3 eigene Portrait-Beispiele mit bewusster Handhaltung (z. B. Musikerportrait, Businessportrait, Charakterportrait)
  - Kurze Praxisnotizen aus der Regieführung am Set (welche konkreten Handlungsanweisungen entspannen)
- **Pflicht-Information-Gain:**
  - GFM-Tabelle: *Handhaltung & Mikrogeste -> Psychologische Wirkung -> Ideal für (Business / Dating / Künstler)*
  - Praxis-Checkliste: *5 einfache Bewegungsaufgaben statt „Lächle mal“*
- **Interne Verlinkung:**
  - Outbound: `/portraitfotografie-duesseldorf.html`, `/personal-branding-fotografie-duesseldorf.html`, `/blog-portraits-ohne-generische-posen.html`, `/contact.html`
  - Inbound: von `/blog-portraits-ohne-generische-posen.html`, `/blog-businessportraits-draussen.html`, `/blog-musiker-portraits.html`
- **Anti-Cannibalization Guardrail:** Tiefgang speziell auf **Hände, Fingerhaltung, Blickrichtung und Mikrogesten**; `blog-portraits-ohne-generische-posen.json` bleibt der übergeordnete Ablauf-/Regie-Artikel.

---

### A3. Oldtimerfotografie Guide (Komplett-Leitfaden)
- **Target URL Slug:** `/blog-oldtimerfotografie-guide.html` (308 von `/oldtimerfotografie-guide/`)
- **GSC-Historie (16M):** 19 Klicks | 718 Impressionen | Ø Pos. 11,41 (zusätzlich brach `oldtimer fotografie` von 324 auf 16 Imp ein)
- **SEO Title (55 Zeichen):** `Oldtimerfotografie Guide: Licht, Perspektive & Planung`
- **SEO Description (148 Zeichen):** `Der Praxis-Guide für Oldtimerfotografie: Brennweiten für klassische Proportionen, Chrom-Kontrolle, Location-Wahl und Bildserie für Sammlung & Verkauf.`
- **Primary Keyword:** `oldtimerfotografie guide`
- **Secondary Keywords:** `oldtimer fotografieren tipps`, `klassische autos fotografieren`, `oldtimer fotoshooting planen`
- **Search Intent:** Informational / Hub-Guide für Einsteiger, Sammler und Besitzer
- **Unterstützter Pillar:** `/oldtimer-fotografie.html` & `/oldtimer-fotografie-duesseldorf.html`
- **Authentisches Material von Matthias:**
  - 3–4 eigene Oldtimer-Aufnahmen (Gesamtansicht, Chrom-Detail, Cockpit, Location-Kontext) inklusive realer Brennweiten-/Lichtnotizen
- **Pflicht-Information-Gain:**
  - GFM-Tabelle: *Brennweite & Kamerahöhe nach Karosserieform (Vorkriegs-Roadster, 60er Coupé, 80er Youngtimer)*
  - Schritt-für-Schritt-Ablauf von Location-Auswahl bis Farbmanagement
- **Interne Verlinkung:**
  - Outbound: `/oldtimer-fotografie.html`, `/oldtimer-fotografie-duesseldorf.html`, `/blog-oldtimer-wertobjekt.html`, `/blog-oldtimer-veranstaltungen.html`, `/contact.html`
  - Inbound: von `/oldtimer-fotografie.html`, `/blog-oldtimer-wertobjekt.html`, `/blog-oldtimerfotograf-finden.html`
- **Anti-Cannibalization Guardrail:** Dient als **technisch-gestalterischer Gesamt-Guide** (Licht, Brennweite, Komposition, Ablauf). `blog-oldtimer-wertobjekt.json` bleibt auf Verkauf/Gutachten/Patina fokussiert; `/oldtimer-fotografie.html` bleibt die reine Leistungsseite.

---

### A4. Motorradfotografie Guide (Komplett-Leitfaden)
- **Target URL Slug:** `/blog-motorradfotografie-guide.html` (308 von `/motorradfotografie-guide/`)
- **GSC-Historie (16M):** 15 Klicks | 1.518 Impressionen | Ø Pos. 12,56 (stützt `motorradfotografie` pos 9,12 & `motorrad fotografie` pos 13,42)
- **SEO Title (56 Zeichen):** `Motorradfotografie Guide: Perspektive, Licht & Bildserie`
- **SEO Description (151 Zeichen):** `Motorrad richtig fotografieren: Kamerahöhe, Brennweite, Ständer-Seite, Lack- und Chromreflexe sowie Lichtfenster für beeindruckende Bike-Bildserien.`
- **Primary Keyword:** `motorradfotografie guide`
- **Secondary Keywords:** `motorrad fotografieren tipps`, `motorrad richtig fotografieren`, `motorrad bilder machen`
- **Search Intent:** Informational (Fahrer & Fotografen, die das eigene Bike hochwertig fotografieren oder planen wollen)
- **Unterstützter Pillar:** `/motorrad-fotografie.html` & `/motorrad-fotografie-duesseldorf.html`
- **Authentisches Material von Matthias:**
  - 3–4 eigene Motorrad-Aufnahmen (Seitenprofil, Schrägansicht von der Schokoladenseite, Detail, Fahrer-Integration) mit echten Brennweiten- und Lichtnotizen
- **Pflicht-Information-Gain:**
  - GFM-Tabelle: *5 Pflichtperspektiven beim Motorrad (Seitenprofil, 3/4-Front, 3/4-Heck, Cockpit, Detail)* mit optimaler Kamerahöhe, Brennweite und typischem Fehler (z. B. Seitenständer/Lenkereinschlag)
  - Kurz-Checkliste vor dem ersten Foto
- **Interne Verlinkung:**
  - Outbound: `/motorrad-fotografie.html`, `/motorrad-fotografie-duesseldorf.html`, `/blog-motorradfotografie-linien.html`, `/blog-motorrad-nachts-fotografieren.html`, `/blog-actioncam-motorrad.html`, `/contact.html`
  - Inbound: von `/motorrad-fotografie.html`, `/blog-motorrad-fotoshooting-checkliste.html`, `/blog-motorradfotografie-linien.html`
- **Anti-Cannibalization Guardrail:** Übergeordneter Technik- & Praxis-Guide. Überschneidet sich nicht mit den Spezialthemen `motorrad-nachts-fotografieren.json`, `actioncam-motorrad.json`, `motorrad-fotoshooting-sicherheit.json` oder `motorrad-fuer-verkauf-fotografieren.json`, sondern verlinkt gezielt dorthin (Hub-and-Spoke).

---

### A5. Motorrad-Fotografie: Rechtliche Aspekte in Deutschland
- **Target URL Slug:** `/blog-motorrad-fotografie-rechtliche-aspekte.html` (308 von `/motorradfotografie/motorrad-fotografie-rechtliche-aspekte/`)
- **GSC-Historie (16M):** 13 Klicks | 470 Impressionen | Ø Pos. 8,34 (**einzigartiges Nischen-Info-Gain!**)
- **SEO Title (57 Zeichen):** `Motorrad fotografieren & Recht: Kennzeichen, Orte & DSGVO`
- **SEO Description (152 Zeichen):** `Rechtliche Grundlagen für Motorradfotos in Deutschland: Kennzeichen, Personen im Hintergrund, Privatgelände, Panoramafreiheit und sichere Veröffentlichung.`
- **Primary Keyword:** `motorrad fotografieren recht`
- **Secondary Keywords:** `kennzeichen unkenntlich machen motorrad foto`, `motorrad fotos veröffentlichen dsgvo`, `fotografieren auf privatgelände motorrad`
- **Search Intent:** Informational (konkrete Rechts- und Praxisfragen vor Veröffentlichung oder Shooting)
- **Unterstützter Pillar:** `/motorrad-fotografie.html`
- **Authentisches Material von Matthias:**
  - Praxisbeispiele aus dem Shooting-Alltag (Umgang mit Kennzeichen-Retusche vs. Abdeckung, Freigabe-Praxis auf Parkplätzen/Werkstätten/Events) — **mit sauberem Hinweis, dass der Artikel Praxiserfahrung vermittelt und keine Rechtsberatung ersetzt**
- **Pflicht-Information-Gain:**
  - GFM-Entscheidungsmatrix: *Situation (Öffentliche Straße / Privatgelände / Treffen & Events / Fremdes Bike / Mitfahrer)* -> *Worauf achten* -> *Praktische Lösung am Set*
  - Checkliste vor dem Upload auf Instagram, Mobile.de oder Website
- **Interne Verlinkung:**
  - Outbound: `/motorrad-fotografie.html`, `/blog-motorrad-fotoshooting-sicherheit.html`, `/blog-fahrzeugfotos-kennzeichen-personen-datenschutz.html` (sobald ab 19.01.2027 live!), `/contact.html`
  - Inbound: von `/blog-motorrad-fotoshooting-sicherheit.html`, `/blog-motorrad-fotospots-nrw.html`, `/blog-motorrad-eventfotografie.html`
- **Anti-Cannibalization Guardrail:** Spezifisch auf **Motorrad-Praxis (Treffen, Helm/Visier, fremde Bikes, Ausfahrten, Rennstrecke)** zugeschnitten; `fahrzeugfotos-kennzeichen-personen-datenschutz.json` (geplant 19.01.2027) behandelt den allgemeinen Auto-/Händler-DSGVO-Kontext.

---

### A6. Outdoor-Portrait-Fotografie: Licht, Location & Planung
- **Target URL Slug:** `/blog-outdoor-portrait-fotografie.html`
- **GSC-Historie (16M/3M):** Recovery des fehlenden Outdoor-Portrait-Guides; stützt `portrait düsseldorf` (86 Imp, Pos. 13,14), `portraits düsseldorf` (77 Imp, Pos. 13,99) und `/portraitfotografie-duesseldorf.html` (262 Imp, Pos. 16,83)
- **SEO Title (56 Zeichen):** `Outdoor-Portraitfotografie: Licht, Location & Praxistipps`
- **SEO Description (150 Zeichen):** `Outdoor-Portraits natürlich fotografieren: Tageslicht lesen, ruhige Hintergründe finden, Brennweite wählen und entspannte Ausdrucksserien draußen planen.`
- **Primary Keyword:** `outdoor portrait fotografie`
- **Secondary Keywords:** `portraits draußen fotografieren`, `outdoor fotoshooting tipps`, `natürliches licht portrait`
- **Search Intent:** Informational / Commercial Investigation
- **Unterstützter Pillar:** `/portraitfotografie-duesseldorf.html` & `/portraitfotografie.html`
- **Authentisches Material von Matthias:**
  - 3–4 eigene Outdoor-Portraits (Park/Hofgarten, Architektur/Medienhafen, Abendlicht) mit kurzer Beschreibung der Lichtsituation vor Ort
- **Pflicht-Information-Gain:**
  - GFM-Vergleichstabelle: *4 Outdoor-Lichtsituationen (Direkte Sonne / Offener Schatten / Bedeckter Himmel / Goldene Stunde)* mit Positionierung, Belichtungstipp und Wirkung auf Hauttöne
  - Pack- & Vorbereitungs-Checkliste für Outdoor-Portrait-Kunden
- **Interne Verlinkung:**
  - Outbound: `/portraitfotografie-duesseldorf.html`, `/portraitfotografie.html`, `/blog-portraits-offener-schatten.html`, `/blog-portraitshooting-wetter.html`, `/blog-businessportraits-draussen.html`, `/contact.html`
  - Inbound: von `/portraitfotografie-duesseldorf.html`, `/blog-location-scouting-duesseldorf.html`, `/blog-portraits-offener-schatten.html`
- **Anti-Cannibalization Guardrail:** Übergeordneter Outdoor-Portrait-Guide (alle Lichtarten, Location-Wahl, Brennweite, Kunden-Vorbereitung). `portraits-offener-schatten.json` vertieft ausschließlich die Lichtkante im Schatten; `portraitshooting-wetter.json` behandelt Wetter-Notfallplanung; `businessportraits-draussen.json` adressiert gezielt Business-/Teamformate.

---

## 4. Priority B: 10 High-ROI GSC Striking-Distance & Commercial-Support-Artikel

Diese 10 Themen schließen konkrete Lücken aus den 3M/16M-GSC-Daten in umsatzstarken Bereichen, die im bisherigen Redaktionskalender kaum vorkommen.

### B1. Auto-Fotoshooting im Ruhrgebiet: Ablauf, Timing & Genehmigungen
- **Target URL Slug:** `/blog-auto-fotoshooting-ruhrgebiet.html`
- **GSC-Daten (3M):** `auto fotoshooting ruhrgebiet` (151 Imp, Pos. 8,74, 0 Klicks), `carshooting bochum` (119 Imp, Pos. 7,86), `carshooting ruhrgebiet` (110 Imp, Pos. 8,21), `auto fotoshooting dortmund` (107 Imp, Pos. 8,28)
- **SEO Title (56 Zeichen):** `Auto-Fotoshooting Ruhrgebiet: Ablauf, Licht & Spielregeln`
- **SEO Description (149 Zeichen):** `Auto-Fotoshooting im Ruhrgebiet realistisch planen: Industriekultur, Zufahrten für tiefe Fahrzeuge, Betreiber-Genehmigungen und beste Uhrzeiten.`
- **Primary Keyword:** `auto fotoshooting ruhrgebiet`
- **Secondary Keywords:** `carshooting ruhrgebiet`, `auto fotoshooting bochum dortmund`, `autofotograf ruhrgebiet`
- **Search Intent:** Commercial Investigation (Fahrzeughalter im Ruhrgebiet vor der Buchung)
- **Unterstützter Pillar:** `/automobil-fotografie-nrw.html` & `/autofotografie.html`
- **Information-Gain-Pflicht:** GFM-Tabelle zu *Anfahrt, Bodenfreiheit, Betreiber-Genehmigungsfristen & Ausweichflächen* für Industriekultur-Standorte (Bochum, Dortmund, Essen, Duisburg) + realistischer 2-Stunden-Ablaufplan.
- **Interne Verlinkung:** Outbound -> `/automobil-fotografie-nrw.html`, `/autofotografie.html`, `/blog-fotospots-autos-nrw.html`, `/contact.html`. Inbound <- `fotospots-autos-nrw.json`, `/automobil-fotografie-nrw.html`.
- **Anti-Cannibalization Guardrail:** Kein zweiter allgemeiner Spot-Katalog (`blog-fotospots-autos-nrw.html` bleibt die Spot-Übersicht); dieser Beitrag fokussiert auf **Shooting-Planung, Produktionslogistik und Genehmigungspraxis** im Ruhrgebiet und fängt den geprunten Bochum/Dortmund/Essen/Duisburg-Traffic sauber auf.

---

### B2. Sportwagen-Fotoshooting: Eigenes Fahrzeug vs. Miet-Sportwagen planen
- **Target URL Slug:** `/blog-sportwagen-fotoshooting-mieten-planung.html`
- **GSC-Daten (3M):** `sportwagen fotoshooting mieten` (100 Imp, Pos. 11,66, 0 Klicks)
- **SEO Title (56 Zeichen):** `Sportwagen fürs Fotoshooting mieten: Worauf du achtest`
- **SEO Description (150 Zeichen):** `Sportwagen für ein Fotoshooting mieten oder eigenes Fahrzeug ablichten? Mietbedingungen, Zeitfenster, Übergabe, Location-Distanz und sinnvolle Planung.`
- **Primary Keyword:** `sportwagen fotoshooting mieten`
- **Secondary Keywords:** `sportwagen shooting planen`, `supercar fotoshooting ablauf`, `sportwagen fotografieren lassen`
- **Search Intent:** Commercial Investigation
- **Unterstützter Pillar:** `/sportwagen-fotografie.html` & `/sportwagen-shooting-duesseldorf.html`
- **Information-Gain-Pflicht:** GFM-Vergleichstabelle (*Mietfahrzeug vs. eigenes Fahrzeug*: Kilometerbegrenzung, Kaution/Versicherung, Übergabezeiten vs. goldene Stunde, Reinigung vor Ort) + Checkliste für Fragen an den Vermieter (inkl. klarer Abgrenzung, dass Matthias die Fotografie produziert und keine Mietwagen verleiht).
- **Interne Verlinkung:** Outbound -> `/sportwagen-fotografie.html`, `/sportwagen-shooting-duesseldorf.html`, `/blog-sportwagen-vorbereitung.html`, `/contact.html`. Inbound <- `sportwagen-vorbereitung.json`, `/sportwagen-shooting-duesseldorf.html`.
- **Anti-Cannibalization Guardrail:** Klärt spezifisch die Miet-/Logistik-Intention, ohne `/sportwagen-fotografie.html` (Kernleistung) zu kannibalisieren.

---

### B3. Vintage-Fotoshooting planen: Styling, Licht & authentische Locations
- **Target URL Slug:** `/blog-vintage-fotoshooting-planen.html`
- **GSC-Daten (16M/3M):** `vintage-fotoshooting` (176 Imp, Pos. 23,03), `vintage fotograf` (97 Imp, Pos. 11,06), `vintage fotoshooting nrw` (16M: 14 Klicks, 165 Imp, Pos. 6,15 -> in 3M verloren!)
- **SEO Title (55 Zeichen):** `Vintage-Fotoshooting planen: Outfit, Licht & Kulissen`
- **SEO Description (150 Zeichen):** `Vintage-Fotoshooting ohne Kostüm-Look: Wie Kleidung, Location, weiches Tageslicht und ruhige Posen echte zeitlose Portraits oder Klassiker-Serien prägen.`
- **Primary Keyword:** `vintage fotoshooting planen`
- **Secondary Keywords:** `vintage fotoshooting outfit`, `vintage fotoshooting nrw`, `vintage portrait ideen`
- **Search Intent:** Commercial Investigation / Inspirational
- **Unterstützter Pillar:** `/vintage-fotoshooting.html`
- **Information-Gain-Pflicht:** GFM-Tabelle *Stil-Epoche / Stimmung -> Materialien & Farben -> Passende Location-Typen -> Typische Stolperfallen* + Kunden-Briefing-Checkliste.
- **Interne Verlinkung:** Outbound -> `/vintage-fotoshooting.html`, `/oldtimer-fotografie.html`, `/blog-retro-looks-digitale-fotografie.html` (sobald A1 live), `/contact.html`. Inbound <- `/vintage-fotoshooting.html`.
- **Anti-Cannibalization Guardrail:** Vorbereitungs- und Stil-Ratgeber; `/vintage-fotoshooting.html` bleibt die direkte Buchungs-/Angebotsseite, A1 behandelt die Bildbearbeitung/Lichttechnik.

---

### B4. Biker-Fotoshooting: Fahrer, Schutzkleidung und Maschine stimmig verbinden
- **Target URL Slug:** `/blog-biker-fotoshooting-planung.html`
- **GSC-Daten (3M):** `biker fotoshooting` (89 Imp, Pos. 9,54, 0 Klicks), `motorrad fotoshooting` (150 Imp, 2 Klicks, Pos. 17,93), `motorrad fotograf` (111 Imp, Pos. 10,08)
- **SEO Title (56 Zeichen):** `Biker-Fotoshooting: Fahrer, Helm & Bike authentisch zeigen`
- **SEO Description (151 Zeichen):** `Biker-Fotoshooting in NRW planen: Lederkombi oder Alltagskleidung, Visier-Reflexe, natürliche Haltung neben der Maschine und sichere Location-Wahl.`
- **Primary Keyword:** `biker fotoshooting`
- **Secondary Keywords:** `motorrad fotoshooting mit fahrer`, `biker portrait ideen`, `motorrad shooting kleidung`
- **Search Intent:** Commercial Investigation
- **Unterstützter Pillar:** `/biker-portrait-duesseldorf.html` & `/motorrad-fotografie.html`
- **Information-Gain-Pflicht:** GFM-Tabelle *4 Bildtypen im Biker-Shooting (Portrait mit Helm, Portrait ohne Helm, Fahrdynamik/Aufsitzen, Detail Handschuhe/Tank)* + Praxis-Tipps gegen Visier-Spiegelungen und steife Posen.
- **Interne Verlinkung:** Outbound -> `/biker-portrait-duesseldorf.html`, `/motorrad-fotografie.html`, `/motorrad-fotografie-duesseldorf.html`, `/contact.html`. Inbound <- `/biker-portrait-duesseldorf.html`, `motorrad-fotoshooting-checkliste.json`.
- **Anti-Cannibalization Guardrail:** `motorrad-mit-fahrer-fotografieren.json` (geplant 14.05.2027) ist ein technischer Fotografen-Artikel; dieser Beitrag richtet sich direkt an **Biker als Auftraggeber** (Vorbereitung, Outfit, Ablauf) — alternativ kann `motorrad-mit-fahrer-fotografieren.json` vorgezogen und gezielt auf `biker fotoshooting` geschärft werden, um Doppelung komplett auszuschließen!

---

### B5. Fotoshooting für Männer: Natürliche Haltung, Kleidung & Ablauf ohne Kitsch
- **Target URL Slug:** `/blog-fotoshooting-maenner-guide.html`
- **GSC-Daten (3M):** `männer portraits nrw` (97 Imp, Pos. 8,06, 0 Klicks), `fotoshooting männer nrw` (78 Imp, Pos. 7,83, 0 Klicks); stützt `/fotoshooting-maenner.html` (**Pos. 3,30, 116 Imp, 0 Klicks!**)
- **SEO Title (56 Zeichen):** `Fotoshooting für Männer: Outfit, Haltung & echte Portraits`
- **SEO Description (150 Zeichen):** `Entspannte Männerportraits ohne gestellte Posen: Welche Outfits funktionieren, wie ruhige Führung vor der Kamera hilft und wie ein Shooting in NRW abläuft.`
- **Primary Keyword:** `fotoshooting männer tipps`
- **Secondary Keywords:** `männer portraits nrw`, `posen für männer fotoshooting`, `natürliche männerfotos`
- **Search Intent:** Informational / Commercial Investigation (Männer mit Kamera-Unsicherheit vor der Buchung)
- **Unterstützter Pillar:** `/fotoshooting-maenner.html` & `/portraitfotografie-duesseldorf.html`
- **Information-Gain-Pflicht:** GFM-Tabelle *Outfit-Kombinationen nach Anlass (Casual/Dating, Smart Business, Charakter/S/W)* + 5-Punkte-Vorbereitungsliste (Passform, Bart/Frisur-Timing, Brillen-Reflexe).
- **Interne Verlinkung:** Outbound -> `/fotoshooting-maenner.html`, `/dating-fotoshooting-duesseldorf.html`, `/portraitfotografie-duesseldorf.html`, `/contact.html`. Inbound <- `/fotoshooting-maenner.html`, `/dating-fotoshooting-duesseldorf.html`.
- **Anti-Cannibalization Guardrail:** Reiner Vorbereitungs- und Orientierungs-Guide; `/fotoshooting-maenner.html` bleibt die kommerzielle Leistungsseite.

---

### B6. Dating-Profilbilder: Welche Bildserie wirklich authentisch wirkt
- **Target URL Slug:** `/blog-dating-profilbilder-bildserie.html`
- **GSC-Daten (3M):** `dating fotoshooting` (55 Imp, Pos. 14,71); stärkt die zweitstärkste Klick-URL der gesamten Website `/dating-fotoshooting-duesseldorf.html` (**31 Klicks, 10,47 % CTR!**)
- **SEO Title (55 Zeichen):** `Dating-Profilbilder: 5 Bildtypen für ein echtes Profil`
- **SEO Description (150 Zeichen):** `Authentische Fotos für Hinge, Bumble & Tinder: Welche 5 Bildtypen ein stimmiges Dating-Profil ausmachen, welche Fehler abschrecken und wie wir sie planen.`
- **Primary Keyword:** `dating profilbilder tipps`
- **Secondary Keywords:** `dating fotoshooting ablauf`, `gute tinder fotos machen lassen`, `authentische dating fotos`
- **Search Intent:** Informational / Commercial Investigation
- **Unterstützter Pillar:** `/dating-fotoshooting-duesseldorf.html`
- **Information-Gain-Pflicht:** GFM-Tabelle *Die 5-Bilder-Struktur für ein glaubwürdiges Profil (Offenes Hauptportrait, Alltag/Bewegung, Hobby/Kontext, Ganzkörper, Ruhiger Abend-Look)* + Liste häufiger Fehler (Spiegel-Selfies, harte Blitz-Studio-Optik, gleiche Kleidung auf allen Bildern).
- **Interne Verlinkung:** Outbound -> `/dating-fotoshooting-duesseldorf.html`, `/fotoshooting-maenner.html`, `/blog-portraits-ohne-generische-posen.html`, `/contact.html`. Inbound <- `/dating-fotoshooting-duesseldorf.html`, `location-scouting-duesseldorf.json`.
- **Anti-Cannibalization Guardrail:** Ratgeber zur Bildauswahl & Profil-Struktur; `/dating-fotoshooting-duesseldorf.html` bleibt alleinige Buchungsseite.

---

### B7. Personal-Branding-Fotoshooting: Konzept, Shotlist & Bildwelt planen
- **Target URL Slug:** `/blog-personal-branding-fotoshooting-konzept.html`
- **GSC-Daten (3M):** `personal branding fotograf düsseldorf` (71 Imp, Pos. 8,65, 0 Klicks), `personal branding niederrhein` (68 Imp, Pos. 13,51); stärkt `/personal-branding-fotografie-duesseldorf.html` (554 Imp, 4 Klicks, Pos. 17,64)
- **SEO Title (57 Zeichen):** `Personal-Branding-Fotoshooting: Konzept, Shotlist & Ablauf`
- **SEO Description (151 Zeichen):** `Personal-Branding-Fotos strategisch planen: Von der Bildwelt über Outfits und Locations bis zur Shotlist für Website, LinkedIn, Presse und Speaker-Profile.`
- **Primary Keyword:** `personal branding fotoshooting planen`
- **Secondary Keywords:** `personal branding fotos ideen`, `personal branding shotlist`, `business branding shooting`
- **Search Intent:** Commercial Investigation (Founder, Selbstständige, Coaches, Speaker)
- **Unterstützter Pillar:** `/personal-branding-fotografie-duesseldorf.html`
- **Information-Gain-Pflicht:** GFM-Shotlist-Matrix (*Website-Hero, About-Seite, LinkedIn-Beiträge, Speaker/Presse, Arbeitskontext*) mit Format, Bildsprache und Negativraum-Planung + 1-Seiten-Briefing-Checkliste.
- **Interne Verlinkung:** Outbound -> `/personal-branding-fotografie-duesseldorf.html`, `/portraitfotografie-duesseldorf.html`, `/blog-businessportraits-draussen.html`, `/contact.html`. Inbound <- `/personal-branding-fotografie-duesseldorf.html`, `businessportraits-draussen.json`.
- **Anti-Cannibalization Guardrail:** Strategische **Marken- & Content-Planung** (über reine Outdoor-Lichtführung in `businessportraits-draussen.json` hinaus); `/personal-branding-fotografie-duesseldorf.html` bleibt die Leistungsseite.

---

### B8. Fotolabor & Großformatdruck: Druckdaten, Papiermuster und Rahmung richtig abstimmen
- **Target URL Slug:** `/blog-fotolabor-druckdaten-papiermuster.html`
- **GSC-Daten (16M/3M):** `fotolabor düsseldorf` (531 Imp / 3 Klicks in 16M; 64 Imp in 3M, Pos. 13,33); stärkt `/fotolabor-druck-duesseldorf.html` (428 Imp, 6 Klicks, Pos. 17,41)
- **SEO Title (56 Zeichen):** `Fotolabor & Großformatdruck: Daten, Muster & Veredelung`
- **SEO Description (151 Zeichen):** `Vom Probedruck zum fertigen Großformat: Wie du Druckdaten fürs Fachlabor vorbereitest, Papiermuster prüfst und Kaschierung oder Rahmung sicher auswählst.`
- **Primary Keyword:** `fotolabor druckdaten vorbereiten`
- **Secondary Keywords:** `großformatdruck fotos tipps`, `fachlabor papiermuster prüfen`, `fine art print rahmung`
- **Search Intent:** Commercial Investigation (Privatkunden, Galerien, Praxen, Unternehmen)
- **Unterstützter Pillar:** `/fotolabor-druck-duesseldorf.html` (klar als Zusatzleistungsbereich gekennzeichnet!)
- **Information-Gain-Pflicht:** GFM-Tabelle *Veredelungsarten (Hahnemühle gerahmt mit Museumsglas / Alu-Dibond matt / Acrylglas / Leinwand)* nach Raumlicht, Pflegeaufwand, Gewicht und typischem Einsatzort (Praxis, Büro, Wohnraum).
- **Interne Verlinkung:** Outbound -> `/fotolabor-druck-duesseldorf.html`, `/landschaftsbilder-kaufen.html`, `/blog-fine-art-druck.html`, `/contact.html`. Inbound <- `/fotolabor-druck-duesseldorf.html`, `fine-art-druck.json`.
- **Anti-Cannibalization Guardrail:** `fine-art-druck.json` behandelt die fotografische Dateivorbereitung (Softproof, DPI, 16-Bit-Export); dieser Beitrag fokussiert auf **Labor-Ablauf, Bemusterung, Großformat-Kaschierung und Hängung**.

---

### B9. Foto und Video gemeinsam produzieren: Ablauf für Marken, Events & Fahrzeuge
- **Target URL Slug:** `/blog-foto-und-video-gemeinsam-planen.html`
- **GSC-Daten (3M):** `videograf düsseldorf` (126 Imp, Pos. 20,85); stärkt `/videografie-duesseldorf.html` (175 Imp, 4 Klicks, Pos. 18,13)
- **SEO Title (56 Zeichen):** `Foto & Video gemeinsam planen: Ablauf, Licht & Zeitplan`
- **SEO Description (150 Zeichen):** `Foto- und Videoproduktion an einem Drehtag kombinieren: Wie Zeitfenster, Lichtaufbau, Rollenverteilung und Formate für Website und Social Media greifen.`
- **Primary Keyword:** `foto und video gemeinsam produzieren`
- **Secondary Keywords:** `videograf und fotograf kombinieren`, `imagefilm und businessfotos planen`, `drehtag zeitplan`
- **Search Intent:** Commercial Investigation (Unternehmen, Personal Brands, Musiker, Automotive-Kunden)
- **Unterstützter Pillar:** `/videografie-duesseldorf.html` (klar als Partnernetzwerk-Zusatzleistung gemäß `matthias-ramahi.md` ausweisen!)
- **Information-Gain-Pflicht:** GFM-Tabelle *Konfliktpunkte am Kombi-Set (Blitz vs. Dauerlicht, Kameraposition, Tonaufnahme, Schnitt-Formate)* + realistische Zeitaufteilung für einen halben und ganzen Produktionstag.
- **Interne Verlinkung:** Outbound -> `/videografie-duesseldorf.html`, `/personal-branding-fotografie-duesseldorf.html`, `/musikerfotografie.html`, `/contact.html`. Inbound <- `/videografie-duesseldorf.html`, `musiker-portraits.json`.
- **Anti-Cannibalization Guardrail:** Breit auf **Marken-, Business- und Musiker-Produktionen** ausgerichtet; `sportwagen-foto-video-gemeinsam-planen.json` (geplant 25.04.2028) bleibt der reine Sportwagen-Spezialfall.

---

### B10. Fahrzeugfotografie im Vergleich: Privatverkauf, Autohaus-Bestand & Markenkampagne
- **Target URL Slug:** `/blog-fahrzeugfotografie-einsatzbereiche-vergleich.html`
- **GSC-Daten (3M):** Head-Terms `automobilfotografie` (655 Imp, Pos. 23,56), `autofotografie` (492 Imp, Pos. 34,13), `fahrzeugfotografie` (256 Imp, Pos. 27,87), `autofotograf` (144 Imp, Pos. 24,86)
- **SEO Title (57 Zeichen):** `Fahrzeugfotografie: Verkauf, Autohaus & Kampagne im Fokus`
- **SEO Description (152 Zeichen):** `Wann reicht eine kompakte Verkaufsserie, wann lohnt ein einheitlicher Händler-Workflow und was braucht eine Markenkampagne? Entscheidungshilfe mit Umfang.`
- **Primary Keyword:** `fahrzeugfotografie arten`
- **Secondary Keywords:** `automobilfotografie ablauf`, `autofotograf beauftragen`, `fahrzeugfotos kosten und umfang`
- **Search Intent:** Commercial Investigation (Entscheidungshilfe zwischen Privatshooting, Händlerbestand und Markenproduktion)
- **Unterstützter Pillar:** `/autofotografie.html` & `/autohaus-fotografie.html`
- **Information-Gain-Pflicht:** GFM-Entscheidungsmatrix nach *Ziel, Bildanzahl, Zeitaufwand am Set, Bildsprache, Lieferformaten und Nutzungsrechten* (strikt ohne erfundene Preisgarantien oder fiktive Kundenbeispiele).
- **Interne Verlinkung:** Outbound -> `/autofotografie.html`, `/autofotografie-duesseldorf.html`, `/autohaus-fotografie.html`, `/blog-auto-shooting-briefing.html`, `/blog-auto-fotoshooting-kostenfaktoren.html`, `/contact.html`. Inbound <- `auto-shooting-briefing.json`, `auto-fotoshooting-kostenfaktoren.json`.
- **Anti-Cannibalization Guardrail:** Strategische Orientierung zwischen den Einsatzbereichen; kein Duplikat zu `/autofotografie.html` (Service-Pillar) oder `auto-fotoshooting-kostenfaktoren.json` (reine Kostenlogik).

---

## 5. Produktions- und Veröffentlichungs-Checkliste pro neuem Artikel

Vor dem Livegang jedes Artikels aus dieser Pipeline (gemäß `docs/JOURNAL_WORKFLOW.md`):

1. **Authentisches Material sichern:** Mindestens 1 exklusives, ungenutztes `coverImage` + 2 echte Portfolio-/Praxisfotos in `imageSequence` mit konkreten Bildunterschriften.
2. **Struktur & Information Gain prüfen:**
   - `summary`-Block als Kurzantwort am Anfang
   - Mindestens 1 GFM-Vergleichstabelle oder Praxis-Checkliste im `textBlock`
   - 3–5 konkrete FAQ-Einträge (`faqBlock`) ohne Floskeln
   - Kontextueller `ctaBlock` + `linkList` ausschließlich auf **kanonische URLs** (0 Redirects)
3. **SEO-Metadaten prüfen:** `seo.title` 50–60 Zeichen, `seo.description` 135–155 Zeichen, sauberer `focusKeyword`, `canonicalUrl` und `legacyUrl`.
4. **Routing & Redirects:**
   - Neuen Dateinamen `blog-<slug>.html` in `apps/web/src/lib/adoptedRoutes.ts` (`adoptedLegacyFiles`) eintragen.
   - Bei Priority-A-Artikeln zusätzlich den alten WordPress-Pfad in `legacyPathRedirectTargets` per 308 auf die neue `.html`-URL legen.
5. **Automatisierte Audits (0 Failures):**
   ```powershell
   node tools/audit-journal-source.mjs
   corepack pnpm web:audit:tina-content -- --strict
   corepack pnpm web:build
   corepack pnpm seo:audit:strict
   ```

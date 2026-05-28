# Website-Strukturplan — Matthias Ramahi Fotografie

**Ziel:** Eine moderne, professionelle und SEO-starke Website für Fotografie, Portfolio, Blog, weitere Dienstleistungen und Kontakt. Die Seite soll hochwertig wirken, Kunden klar führen und intern sauber verlinkt sein — ohne verwirrende Doppelseiten oder falsche Navigation.

**Stand:** 2026-05-23  
**Primäre Plattform:** Responsive Web  
**Kontaktziel:** E-Mail-Anfrage an `info@matthiasramahi.de`  
**Bildquelle für kommende Motive:** `C:\Users\matth\Desktop\FotoWettbewerbLow\Converted9\Design`

---

## 1. Leitprinzipien für die gesamte Website

### 1.1 Strategisches Ziel

Die Website soll drei Dinge gleichzeitig leisten:

1. **Künstlerisch/professionell positionieren**  
   Matthias Ramahi soll nicht wie ein beliebiger Fotograf wirken, sondern wie ein visuell starker, kuratierender Fotograf mit eigenem Stil.

2. **SEO sauber abdecken**  
   Jede wichtige Leistung braucht eine eigene Seite mit eindeutigem Suchintent, klarer H1, lokalem Bezug und interner Verlinkung.

3. **Anfragen erzeugen**  
   Nutzer sollen schnell verstehen: Was wird angeboten? Für wen ist es? Wie läuft es ab? Wie kann ich per E-Mail anfragen?

### 1.2 Visuelle Basis aus bestehender Website

Die vorhandenen Dateien zeigen bereits eine starke Richtung:

- Dunkle, cineastische Grundfläche: `#020306`, `#07090d`, `#090b10`
- Helle Typografie: `#f3f5ef`, `#f5f7f1`
- Akzent: oxidiertes Rot `#cf392e` / `#c93a31`
- Sekundäre Atmosphäre: Stahlblau/Grau `#6d8da1`, `#dce2df`
- Typografie: sehr große, enge, uppercase Headlines + kleine Mono-Navigation
- Layout: Foto als Bühne, nicht als Standard-Galerie

**Empfehlung:** Diesen Stil beibehalten und systematisieren: dunkle Hero-Bühnen, helle Inhaltsflächen für SEO/Lesbarkeit, roter Akzent nur gezielt.

---

## 2. Empfohlene Hauptnavigation

Der Header soll auf allen Seiten identisch sein. Aktuell sind einige Seiten unterschiedlich aufgebaut; das sollte vereinheitlicht werden.

### 2.1 Desktop-Header

**Logo / Brandmarke**  
`Matthias Ramahi` → Link zu `index.html`

**Navigation:**

1. **Home** → `index.html`
2. **Fotografie** → Dropdown oder Mega-Dropdown
   - Automobil → `automobil-fotografie-duesseldorf.html`
   - Sportwagen → `sportwagen-fotografie-duesseldorf.html`
   - Oldtimer → `oldtimer-fotografie-duesseldorf.html`
   - Motorrad → `motorrad-fotografie-duesseldorf.html`
   - Portrait → `portraitfotografie-duesseldorf.html`
   - Landschaft → `landschaftsfotografie-duesseldorf.html`
3. **Portfolio** → `portfolio.html`
4. **Über mich** → `ueber-mich.html`
5. **Blog** → `blog.html`
6. **Weitere Dienstleistungen** → `leistungen.html`
7. **Kontakt** → `contact.html`

**CTA rechts:**  
`Projekt anfragen` → `contact.html#anfrage`

### 2.2 Mobile-Header

Mobile darf nicht nur eine geschrumpfte Desktop-Navigation sein.

**Empfehlung:**

- Kompakte Brandmarke links
- Menübutton rechts
- Vollflächiges dunkles Menü als Overlay oder Accordion
- Fotografie-Unterseiten als eigene Gruppe
- Kontakt/E-Mail als letzter, klarer Button

### 2.3 Aktive Zustände

Jede Seite markiert ihren Bereich aktiv:

- Fotografie-Unterseiten: `Fotografie` aktiv + jeweilige Unterseite hervorgehoben
- Portfolio: `Portfolio` aktiv
- Blog: `Blog` aktiv
- Services: `Weitere Dienstleistungen` aktiv
- Kontakt: `Kontakt` aktiv

---

## 3. Einheitlicher Footer

Der Footer soll ebenfalls auf allen Seiten identisch sein. Die vorhandene Footer-Richtung ist stark und sollte als Standardmodul verwendet werden.

### 3.1 Footer-Aufbau

1. **Große Brandmarke**
   - `Matthias Ramahi`
   - Link zu `index.html`

2. **Kurzes Statement**
   - Beispiel:  
     „Fotografie, die Räume öffnet. Portfolio, Aufträge und visuelle Produktion in Düsseldorf / NRW — klar kuratiert, technisch sauber und bereit für Print, Web und Kampagne.“

3. **Direkter Kontakt**
   - `info@matthiasramahi.de`
   - Telefon optional sekundär

4. **Primäre Links**
   - Home
   - Portfolio
   - Über mich
   - Blog
   - Leistungen
   - Kontakt

5. **Fotografie & Services Links**
   - Automobilfotografie
   - Sportwagenfotografie
   - Oldtimer-Fotografie
   - Motorrad-Fotografie
   - Portraitfotografie
   - Landschaftsfotografie
   - Fotolabor & Druck
   - Großformatdruck
   - Werbetechnik
   - Webdesign & SEO
   - Viola Musik
   - Videografie
   - Drucke & Sonderanfertigungen

6. **Legal**
   - Impressum
   - Datenschutz

---

## 4. Einheitliches Kontaktmodul für fast alle Seiten

Der Nutzer hat als Kontaktziel **E-Mail** gewählt. Deshalb sollte die Kontaktsektion überall gleich funktionieren.

### 4.1 Standard-Kontaktsektion

**Position:** Am Ende jeder wichtigen Seite direkt vor dem Footer.  
**Look:** Helle Papierfläche oder dunkler ruhiger Abschluss, aber gleiche Struktur.  
**Ziel:** Nutzer ohne Umweg zur Anfrage bringen.

**Aufbau:**

1. **Kicker:** `Anfrage`
2. **Headline:** seitenspezifisch, aber gleiche Logik
   - Automobil: „Automobil-Shooting anfragen.“
   - Sportwagen: „Sportwagen-Serie anfragen.“
   - Oldtimer: „Oldtimer-Shooting anfragen.“
   - Motorrad: „Motorrad-Shooting anfragen.“
   - Portrait: „Portrait-Shooting anfragen.“
   - Landschaft: „Landschaftsserie anfragen.“
   - Services: „Projekt anfragen.“
3. **Kurztext:** Was soll der Kunde in der Mail nennen?
4. **Formular oder Mailto-Komposition:**
   - Name
   - E-Mail
   - Telefon optional
   - Projektart / Fahrzeug / Ort / Nutzung
   - Nachricht
5. **Primärer Button:** `Anfrage per E-Mail senden`
6. **Sekundär:** direkte E-Mail sichtbar: `info@matthiasramahi.de`

### 4.2 Wichtige Regel

Das Modul darf inhaltlich leicht an die Seite angepasst sein, soll aber visuell und strukturell überall gleich bleiben. So entsteht Vertrauen und keine Seite fühlt sich wie ein anderes Projekt an.

---

## 5. Empfohlene Seitenstruktur / URL-Struktur

### 5.1 Kanonische Seiten

| Seitentyp | Empfohlene Datei | Status |
|---|---|---|
| Home | `index.html` | aktuell nur Weiterleitung, sollte echte Startseite werden |
| Automobilfotografie | `automobil-fotografie-duesseldorf.html` | existiert |
| Sportwagenfotografie | `sportwagen-fotografie-duesseldorf.html` | neu erstellen |
| Oldtimer-Fotografie | `oldtimer-fotografie-duesseldorf.html` | existiert |
| Motorrad-Fotografie | `motorrad-fotografie-duesseldorf.html` | existiert |
| Portraitfotografie | `portraitfotografie-duesseldorf.html` | existiert |
| Landschaftsfotografie | `landschaftsfotografie-duesseldorf.html` | existiert |
| Portfolio | `portfolio.html` | existiert |
| Über mich | `ueber-mich.html` | neu erstellen |
| Blog | `blog.html` | existiert und gefällt aktuell |
| Weitere Dienstleistungen | `leistungen.html` | existiert |
| Fotolabor & Druck | `fotolabor-druck-duesseldorf.html` | existiert |
| Großformatdruck | `grossformatdruck-duesseldorf.html` | existiert |
| Werbetechnik | `werbetechnik-duesseldorf.html` | existiert |
| Webdesign & SEO | `webdesign-seo-duesseldorf.html` | existiert |
| Viola Musik | `viola-musik-duesseldorf.html` | existiert |
| Videografie | `videografie-duesseldorf.html` | existiert |
| Drucke & Sonderanfertigungen | `drucke-sonderanfertigungen-duesseldorf.html` | existiert |
| Kontakt | `contact.html` | existiert |
| Impressum | `impressum.html` | existiert |
| Datenschutz | `datenschutz.html` | existiert |

### 5.2 Doppelte / ältere Seiten prüfen

Diese Dateien sollten später entweder integriert, weitergeleitet oder archiviert werden:

- `fotografie-landing-experience.html` → Inhalt wahrscheinlich in `index.html` übernehmen
- `blog-journal.html` → Duplikat zu `blog.html`
- `weitere-dienstleistungen.html` → Duplikat/ältere Variante zu `leistungen.html`
- `matthias-ramahi-portfolio.html` → ältere/alternative Portfolioseite
- `portraitfotografie-experience.html` → alternative Portraitseite; besten Ansatz in `portraitfotografie-duesseldorf.html` integrieren
- `radikale-fotografie-portfolio-konzepte.html`, `floating-archive.html`, `narrative-stage.html`, `experimental-lens.html` → Konzeptstudien, nicht als Hauptnavigation führen

---

# 6. Seitenplanung im Detail

## 6.1 Home — `index.html`

### Ziel der Seite

Die Home ist der klare Einstieg in die Welt von Matthias Ramahi. Sie soll sofort zeigen: hochwertige Fotografie, starker eigener Stil, klare Leistungsbereiche, einfache Anfrage.

### SEO-Fokus

- Primär: `Fotograf Düsseldorf`, `Fotografie Düsseldorf`, `Fotograf NRW`
- Sekundär: Automobilfotografie, Portraitfotografie, Landschaftsfotografie, Motorradfotografie, Oldtimer-Fotografie

### Empfohlene Sektionen

#### 1. Hero: „Fotografie als kuratierter Bildraum“

**Ziel:** Sofortige Positionierung. Keine generische Hero-Card, sondern eine visuelle Bühne.

**Aufbau:**

- Großes atmosphärisches Foto oder Bildkomposition
- Sehr große Headline, z. B.  
  `Fotografie, die Räume öffnet.`
- Subline:  
  „Automotive, Portrait, Landschaft und visuelle Produktionen in Düsseldorf / NRW — ruhig kuratiert, technisch sauber und bereit für Web, Print und Kampagne.“
- CTA 1: `Portfolio ansehen`
- CTA 2: `Projekt anfragen`
- Kleine Faktenzeile: `Automobil · Oldtimer · Motorrad · Portrait · Landschaft`

**Look:** Dunkel, cineastisch, mit rotem Akzent und leichter Bildbewegung.

#### 2. Fotografie-Bereiche als kuratierte Kapitel

**Ziel:** Nutzer verstehen sofort, welche Fotografie-Bereiche es gibt.

**Aufbau:** 6 große Kapitel, keine Standard-Cards:

1. Automobil
2. Sportwagen
3. Oldtimer
4. Motorrad
5. Portrait
6. Landschaft

Jedes Kapitel braucht:

- Großes Bild
- kurze künstlerische Beschreibung
- praktischen Nutzen
- Link zur Detailseite

#### 3. Kurzes Profil / Haltung

**Ziel:** Persönlichkeit und Professionalität vermitteln.

**Inhalt:**

- Warum diese Fotografie nicht nur „Bilder machen“ ist
- Arbeitsweise: Planung, Licht, Serie, Ausgabe
- Bezug zu Düsseldorf / NRW

#### 4. Ausgewählte Arbeiten / Portfolio-Teaser

**Ziel:** Beweis liefern, aber nicht alles zeigen.

**Aufbau:**

- 5–8 starke Motive aus unterschiedlichen Bereichen
- kein Masonry-Standardgrid
- eher horizontale Sequenz / Bildbühne / Kontaktbogen
- CTA: `Portfolio öffnen`

#### 5. Leistungen / Produktion

**Ziel:** zeigen, dass neben Fotografie auch Produktion, Druck, Web, Video etc. möglich sind.

**Aufbau:**

- Kurzer Hinweis auf weitere Dienstleistungen
- 3–4 Teaser: Fotolabor & Druck, Großformatdruck, Webdesign & SEO, Videografie
- Link zu `leistungen.html`

#### 6. Blog-/Journal-Teaser

**Ziel:** SEO und Expertise stärken.

**Aufbau:**

- 3 aktuelle oder wichtigste Beiträge
- nicht zu dominant
- CTA: `Blog lesen`

#### 7. Einheitliches Kontaktmodul

Siehe Kapitel 4.

---

## 6.2 Automobilfotografie — `automobil-fotografie-duesseldorf.html`

### Ziel der Seite

Automobilfotografie für private Fahrzeuge, Händler, Sammler, Werkstätten, Marken, Verkauf und Kampagnen präsentieren.

### SEO-Fokus

- `Automobilfotografie Düsseldorf`
- `Autofotograf Düsseldorf`
- `Fahrzeugfotografie NRW`
- später lokale Varianten: Köln, Essen, Dortmund etc.

### Empfohlene Sektionen

#### 1. Hero: „Fahrzeuge als Bildsystem“

**Aufbau:**

- starkes Hero-Fahrzeugbild
- Headline: `Automobilfotografie Düsseldorf`
- Subline: „Fahrzeuge, Reflexe, Linien und Details als präzise Bildserie für Verkauf, Marke, Sammlung oder Kampagne.“
- CTA: `Automobil-Shooting anfragen`
- Zweitlink: `Portfolio ansehen`
- Micro-Facts: `Showroom · Outdoor · Detailserie · Web/Print`

#### 2. Statement / Warum gute Autofotografie anders ist

**Inhalt:**

- Lack, Glas, Linien und Proportionen müssen kontrolliert werden
- Bilder sollen Wertigkeit, Zustand und Charakter zeigen
- Unterschied zwischen Verkauf, Editorial und Kampagne erklären

#### 3. Module / Bildpakete

Vier klare Module:

1. **Hero-Motiv** — Hauptbild mit starker Präsenz
2. **Linien & Details** — Lack, Felgen, Interieur, Embleme
3. **Verkaufsserie** — nachvollziehbare Ansichten, Zustand, Besonderheiten
4. **Kampagne / Social** — Hochformate, Teaser, Websitebanner

#### 4. Beispielsequenz / Galerie

- 6–10 Bilder als kuratierte Serie
- Mischung aus Außenaufnahme, Detail, Innenraum, Silhouette
- keine unendliche Galerie

#### 5. Ablauf

1. Ziel & Fahrzeug klären
2. Location und Licht planen
3. Shooting als Serie aufnehmen
4. Auswahl, Retusche, Exportformate

#### 6. Für wen geeignet?

- Autohäuser
- private Verkäufer
- Sammler
- Tuning-/Werkstattprojekte
- Marken / Kampagnen

#### 7. SEO-Textblock

Ein lesbarer Abschnitt mit Düsseldorf/NRW-Bezug, aber nicht keyword-gestopft.

#### 8. Verwandte Bereiche

Links zu:

- Sportwagen
- Oldtimer
- Motorrad
- Portfolio

#### 9. Einheitliches Kontaktmodul

Kontakttext spezifisch: Fahrzeug, Standort, gewünschte Nutzung, Zeitraum.

---

## 6.3 Sportwagenfotografie — `sportwagen-fotografie-duesseldorf.html`

### Ziel der Seite

Sportwagen als eigene Hauptseite positionieren, weil Suchintent und Bildsprache anders sind als allgemeine Automobilfotografie.

### SEO-Fokus

- `Sportwagen Fotograf Düsseldorf`
- `Sportwagenfotografie Düsseldorf`
- `Luxusauto Fotoshooting NRW`
- `Performance Car Photography Düsseldorf`

### Empfohlene Sektionen

#### 1. Hero: „Speed ohne Klischee“

**Aufbau:**

- dramatisches Bild mit Lichtkante / Reflektion / tiefem Standpunkt
- Headline: `Sportwagen-fotografie Düsseldorf`
- Subline: „Performance, Linien und Material so inszeniert, dass das Fahrzeug schnell wirkt, ohne laut werden zu müssen.“
- CTA: `Sportwagen-Serie anfragen`
- Micro-Facts: `Performance · Detail · Rolling optional · Kampagne`

#### 2. Haltung

**Inhalt:**

- Kein austauschbarer Auto-Content
- Fokus auf Form, Energie, Oberfläche, Exklusivität
- Bildserie muss Geschwindigkeit, Prestige und Kontrolle verbinden

#### 3. Bildlogik

Vier Module:

1. **Low stance / Hero** — tiefer Winkel, Linien, Präsenz
2. **Reflection control** — Lack, Glas, Lichtkante
3. **Performance details** — Bremsen, Felgen, Luftöffnungen, Interieur
4. **Launch assets** — Social, Website, Verkaufsunterlagen, Kampagne

#### 4. Szenarien

- Showroom / Garage
- Architektur / Urban Night
- Landschaft / Golden Hour
- Event / Trackday optional

#### 5. Ablauf

1. Fahrzeug und gewünschter Look
2. Location passend zur Marke
3. Shooting mit Hero + Details + Formaten
4. Ausgabe für Web, Social, Print

#### 6. Verwandte Bereiche

- Automobil
- Oldtimer
- Motorrad
- Portfolio

#### 7. Einheitliches Kontaktmodul

Abfragen: Fahrzeugmodell, Standort, gewünschte Wirkung, private/kommerzielle Nutzung.

---

## 6.4 Oldtimer-Fotografie — `oldtimer-fotografie-duesseldorf.html`

### Ziel der Seite

Oldtimer nicht nostalgisch, sondern wertig, sammlerhaft und ausstellungsfähig zeigen.

### SEO-Fokus

- `Oldtimer Fotograf Düsseldorf`
- `Oldtimer Fotoshooting NRW`
- `Classic Car Photography Düsseldorf`

### Empfohlene Sektionen

#### 1. Hero: „Der Oldtimer als Exponat“

- großes ruhiges Fahrzeugbild
- Headline: `Oldtimer-Fotografie Düsseldorf`
- Subline: „Form, Herkunft, Material und Geschichte als kuratierte Bildserie für Sammlung, Verkauf, Auktion oder Ausstellung.“
- CTA: `Oldtimer-Shooting anfragen`

#### 2. Statement

- Oldtimer brauchen Ruhe und Abstand
- Chrom, Leder, Lack, Patina und Historie werden bewusst geführt
- Ziel ist nicht Nostalgie-Kitsch, sondern Wertigkeit

#### 3. Module

1. **Exponatbild** — Hauptmotiv wie Ausstellung
2. **Provenance / Geschichte** — Embleme, Materialien, Spuren
3. **Verkaufs- und Auktionsbilder** — nachvollziehbare Zustandsbilder
4. **Print / Sammlung** — ausgewählte Motive als Wandbild oder Edition

#### 4. Bildsequenz

- Außenansicht
- Innenraum
- Chrom/Detail
- Material/Patina
- optional Besitzer/Umfeld

#### 5. Ablauf

1. Fahrzeug, Zustand, Ziel klären
2. Raum und Reflexe prüfen
3. Hauptserie + Details aufnehmen
4. Retusche und Ausgabe

#### 6. Verwandte Bereiche

- Automobil
- Sportwagen
- Portfolio
- Drucke & Sonderanfertigungen

#### 7. Einheitliches Kontaktmodul

Abfragen: Modell, Baujahr, Standort, Sammlung/Verkauf/Auktion/Privat.

---

## 6.5 Motorrad-Fotografie — `motorrad-fotografie-duesseldorf.html`

### Ziel der Seite

Motorräder energetisch, technisch und charakterstark zeigen — für Custom Bikes, Werkstätten, Händler, private Maschinen und Kampagnen.

### SEO-Fokus

- `Motorrad Fotograf Düsseldorf`
- `Motorrad Fotoshooting NRW`
- `Bike Fotoshooting Düsseldorf`

### Empfohlene Sektionen

#### 1. Hero: „Maschine mit Haltung“

- diagonale, dynamische Bildbühne
- Headline: `Motorrad-Fotografie Düsseldorf`
- Subline: „Silhouette, Mechanik und Haltung als kraftvolle Serie für Bike, Werkstatt, Marke oder private Maschine.“
- CTA: `Motorrad-Shooting anfragen`

#### 2. Statement

- Ein Motorrad muss auch im Stand Spannung tragen
- Fokus auf Winkel, Material, Mechanik, Fahrerbezug optional
- Einsatz: Social, Website, Verkauf, Werkstatt, Kampagne

#### 3. Module

1. **Silhouette** — klares Hero-Motiv
2. **Mechanik** — Motor, Tank, Reifen, Licht
3. **Werkstatt / Marke** — Kontext und Glaubwürdigkeit
4. **Vertical Cuts** — Social/Reels/Story-Formate mitdenken

#### 4. Galerie / Sequenz

- harte Perspektiven
- Details
- Umgebung
- optional Fahrerbild

#### 5. Ablauf

1. Bike und Ziel klären
2. Location wählen
3. Bildrhythmus aufnehmen
4. Ausgabe für Web/Social/Print

#### 6. Verwandte Bereiche

- Automobil
- Sportwagen
- Portfolio
- Videografie

#### 7. Einheitliches Kontaktmodul

Abfragen: Bike/Projekt, Standort, Fahrerbilder ja/nein, gewünschte Nutzung.

---

## 6.6 Portraitfotografie — `portraitfotografie-duesseldorf.html`

### Ziel der Seite

Portraits für Personal Branding, Künstler, Unternehmer, Teams, Bewerbungen, Presse und Websites zeigen.

### SEO-Fokus

- `Portraitfotograf Düsseldorf`
- `Business Portrait Düsseldorf`
- `Personal Branding Fotos Düsseldorf`
- `Künstlerportrait Düsseldorf`

### Empfohlene Sektionen

#### 1. Hero: „Nähe ohne Beliebigkeit“

- starkes Portraitbild, keine generische Locationoptik
- Headline: `Portraitfotografie Düsseldorf`
- Subline: „Portraits mit Haltung, Licht und Präsenz — für Menschen, Marken, Websites, Presse und persönliche Positionierung.“
- CTA: `Portrait-Shooting anfragen`

#### 2. Statement

- gutes Portrait braucht Haltung, Timing und Licht
- Natürlichkeit ohne Austauschbarkeit
- Person soll sichtbar werden, ohne überinszeniert zu wirken

#### 3. Module

1. **Signature Portrait** — ein starkes Hauptbild
2. **Mehrere Stimmungen** — nah, offen, editorial, ruhig
3. **Team-Konsistenz** — zusammengehörig, aber nicht steril
4. **Output** — Web, Presse, LinkedIn, Social, Print

#### 4. Beispielstrecke

- 6–8 Portraits
- Variation in Licht, Nähe, Ausschnitt
- keine Stock-/Headshot-Anmutung

#### 5. Ablauf

1. Ziel und Wirkung klären
2. Kleidung/Ort/Licht vorbereiten
3. Shooting mit Variationen
4. Auswahl und natürliche Retusche

#### 6. FAQ / Einwände

- „Ich bin nicht fotogen“
- „Wie lange dauert ein Shooting?“
- „Was soll ich anziehen?“
- „Kann ein Team einheitlich fotografiert werden?“

#### 7. Verwandte Bereiche

- Portfolio
- Webdesign & SEO
- Videografie

#### 8. Einheitliches Kontaktmodul

Abfragen: Person/Team, Nutzung, gewünschte Wirkung, Ort/Zeitraum.

---

## 6.7 Landschaftsfotografie — `landschaftsfotografie-duesseldorf.html`

### Ziel der Seite

Landschaft als ruhige, hochwertige Bildwelt für Wandbilder, Editorials, Websites, Markenräume und freie Serien zeigen.

### SEO-Fokus

- `Landschaftsfotograf Düsseldorf`
- `Landschaftsfotografie NRW`
- `Fine Art Landschaftsfotografie`
- `Wandbild Landschaft Düsseldorf`

### Empfohlene Sektionen

#### 1. Hero: „Landschaft als Bildraum“

- großes, ruhiges Landschaftsbild
- Headline: `Landschaftsfotografie Düsseldorf & NRW`
- Subline: „Licht, Wetter, Weite und Detail als kuratierte Bildserie für Räume, Websites, Editorials und hochwertige Prints.“
- CTA: `Landschaftsserie anfragen`

#### 2. Statement

- Landschaft muss nicht spektakulär sein, sondern präzise komponiert
- Licht, Distanz und Reduktion sind entscheidend
- Eignet sich für Räume, Editorials, Marken, freie Serien

#### 3. Module

1. **Weite** — großes Motiv für Raum/Web/Header
2. **Detail** — Textur, Lichtkante, Material
3. **Ort** — Stimmung und Kontext
4. **Printlogik** — Format, Papier, Großformat, Interior

#### 4. Galerie / Sequenz

- starke horizontale Motive
- Detail-Crops
- ruhige Übergänge
- optional Print-Mockups

#### 5. Ablauf

1. Motiv/Nutzung definieren
2. Tageszeit/Wetter planen
3. Aufnahme vor Ort
4. Auswahl und Print-/Web-Ausgabe

#### 6. Verwandte Bereiche

- Drucke & Sonderanfertigungen
- Großformatdruck
- Portfolio

#### 7. Einheitliches Kontaktmodul

Abfragen: Ort/Region, Nutzung, Format, Zeitraum.

---

## 6.8 Portfolio — `portfolio.html`

### Ziel der Seite

Das Portfolio soll alle Bereiche zusammenbringen und die Qualität beweisen. Es darf künstlerisch sein, muss aber klar bedienbar bleiben.

### SEO-Fokus

- Marken-/Portfolio-Suche
- interne Verlinkung auf alle Leistungsseiten
- Bild-SEO über Alt-Texte und sinnvolle Dateinamen

### Empfohlene Sektionen

#### 1. Hero: „Optical Gallery“ oder kuratierter Bildraum

- Headline: `Portfolio`
- Subline: „Ausgewählte Arbeiten aus Automobil, Sportwagen, Oldtimer, Motorrad, Portrait und Landschaft.“
- CTA: `Projekt anfragen`

#### 2. Filter / Kapitel-Navigation

Keine technischen Designer-Filter, sondern echte Nutzerführung:

- Alle
- Automobil
- Sportwagen
- Oldtimer
- Motorrad
- Portrait
- Landschaft

#### 3. Kuratierte Galerie

**Wichtig:** Nicht einfach Masonry-Grid.  
Besser: Kapitel mit 4–8 Bildern und kurzer Beschreibung.

Jedes Kapitel:

- Bereichstitel
- kurzer künstlerischer Kontext
- Bildsequenz
- Link zur passenden Leistungsseite

#### 4. Ausgewählte Projekte / Serien

Wenn später genug Material vorhanden ist:

- eigene Projektseiten pro Serie
- Beispiel: `projekt-porsche-night-study.html`, `projekt-oldtimer-showroom.html`

#### 5. Verlinkung

Jeder Portfolio-Bereich soll zurück auf die Leistungsseite linken:

- Automobil → Automobilseite
- Sportwagen → Sportwagenseite
- etc.

#### 6. Einheitliches Kontaktmodul

Text: „Wenn ein Motiv, Stil oder Bereich passt, kurz Projektart, Ort und Zeitraum schicken.“

---

## 6.9 Über mich — `ueber-mich.html`

### Ziel der Seite

Eine eigene „Über mich"-Seite, die Vertrauen aufbaut, Persönlichkeit und Arbeitsweise zeigt und einen klaren Anker für Suchanfragen wie „Matthias Ramahi Fotograf" liefert. Sie soll nicht generisch wirken, sondern wie ein eigenständiges Kapitel der Marke.

### SEO-Fokus

- `Matthias Ramahi Fotograf`
- `Fotograf Düsseldorf Portrait`
- `Über Matthias Ramahi`
- Marken-/Personensuche

### Empfohlene Sektionen

#### 1. Hero / Personenbühne

- großes Portrait oder Werkstattbild
- Headline: `Matthias Ramahi.` (oder `Hinter der Kamera.`)
- Subline: „Fotograf in Düsseldorf — Automobil, Portrait, Landschaft. Klare Bilder mit Haltung, Licht und Sorgfalt."
- Kicker: `Über mich`
- CTA: `Projekt anfragen`

#### 2. Statement / Haltung

- Was treibt die Arbeit an
- Warum Fotografie als Bildraum, nicht als Klick
- Bezug zu Düsseldorf/NRW

#### 3. Werdegang / Erfahrung

- Stationen, Ausbildung, Schwerpunkte
- bewusst kurz, kein Lebenslauf-Listing
- 3–5 Punkte als Kapitel, nicht als Aufzählung

#### 4. Arbeitsweise

- Wie ein Projekt abläuft: Briefing → Konzept → Shooting → Auswahl → Ausgabe
- Was Kunden erwarten dürfen
- Was wichtig ist: Vorbereitung, Licht, Material, Ausgabeformate

#### 5. Werte / Was nicht passiert

- keine austauschbaren Bilder
- keine generischen Filter
- keine Bilder ohne Plan
- Material, Format und Wirkung werden mitgedacht

#### 6. Persönliche Notiz / Bezug

- Bezug zu Musik (Viola), Druck, Sonderanfertigungen
- erklärt, warum die weiteren Dienstleistungen Sinn ergeben

#### 7. Verwandte Bereiche

- Portfolio
- Portrait
- Kontakt
- Blog

#### 8. Einheitliches Kontaktmodul

Standardmodul, Text: „Wenn ein Projekt, Shooting oder ein gemeinsamer Auftrag passt, kurz Ziel, Ort und Zeitraum schicken."

---

## 6.10 Blog — `blog.html`

### Ziel der Seite

Der Blog gefällt aktuell und sollte grundsätzlich bleiben. Er ist wichtig für SEO, Expertise und lokale Sichtbarkeit.

### SEO-Fokus

- Longtail-Fragen
- lokale Suchanfragen
- Ratgeber rund um Fotoshootings, Druck, Portfolio, Fahrzeugfotografie
- interne Links zu Leistungsseiten

### Empfohlene Sektionen

#### 1. Hero

- Headline: `Blog / Journal`
- Subline: „Gedanken zu Fotografie, Bildwirkung, Fahrzeugen, Portraits, Print und visueller Präsentation.“
- CTA: `Artikel ansehen`

#### 2. Featured Article

Ein starker Einstieg mit einem Hauptartikel.

#### 3. Artikelübersicht

Kategorien:

- Automotive
- Portrait
- Landschaft
- Print & Labor
- Web / SEO
- Hinter den Kulissen

#### 4. SEO-interne Links

Jeder Blogartikel sollte am Ende 2–4 passende Links enthalten:

- passende Leistungsseite
- Portfolio
- Kontakt

#### 5. Kontaktmodul

Kann kompakter sein als auf Leistungsseiten, aber gleicher Abschluss.

### Erste sinnvolle Blogthemen

- „Was macht gute Automobilfotografie aus?“
- „Wie bereite ich mein Auto auf ein Fotoshooting vor?“
- „Business Portrait in Düsseldorf: Was macht ein gutes Profilbild aus?“
- „Fine Art Print oder Fotobuch: Welche Präsentation passt zu welchem Motiv?“
- „Warum lokale SEO für Fotografen und Dienstleister wichtig ist“

---

## 6.11 Weitere Dienstleistungen — `leistungen.html`

### Ziel der Seite

Eine Übersichtsseite für ergänzende Leistungen, ohne die Fotografie-Hauptpositionierung zu verwässern.

### SEO-Fokus

- `Fotolabor Düsseldorf`
- `Großformatdruck Düsseldorf`
- `Werbetechnik Düsseldorf`
- `Webdesign SEO Düsseldorf`
- `Videografie Düsseldorf`
- plus interne Verlinkung

### Empfohlene Sektionen

#### 1. Hero

- Headline: `Weitere Dienstleistungen`
- Subline: „Druck, Präsentation, Web, Video und Sonderlösungen als Erweiterung starker Bildproduktion.“
- CTA: `Projekt anfragen`

#### 2. Leistungsübersicht

7 nummerierte Bereiche:

1. Fotolabor & Druck
2. Großformatdruck
3. Werbetechnik
4. Webdesign & SEO
5. Viola Musik
6. Videografie
7. Drucke & Sonderanfertigungen

Jeder Eintrag:

- kurze Beschreibung
- typischer Anwendungsfall
- Link zur Detailseite

#### 3. Warum alles zusammen Sinn ergibt

- Fotografie endet nicht bei der Datei
- Bilder müssen gedruckt, gezeigt, eingebunden oder bewegt werden
- Ein Ansprechpartner für visuelle Produktion

#### 4. Beispielpfade

- Foto → Fine Art Print
- Auto-Shooting → Website/Portfolio/Verkaufsmaterial
- Event → Videografie + Fotos + Webgalerie
- Unternehmen → Portraits + Website + SEO

#### 5. Einheitliches Kontaktmodul

Text: Projektart, Format, Menge, Material, Zeitrahmen.

---

# 7. Dienstleistungs-Unterseiten

## 7.1 Fotolabor & Druck — `fotolabor-druck-duesseldorf.html`

### Ziel

Hochwertige Drucke, Fotobücher, Fine-Art-Ausgaben, Papierberatung und Präsentationsformen erklären.

### Struktur

1. Hero: `Fotolabor & Druck Düsseldorf`
2. Statement: Warum Druck mehr ist als Datei ausgeben
3. Leistungen:
   - Fine Art Prints
   - Fotobücher
   - Leinwand / Spezialmaterial
   - Proof / Motivprüfung
4. Material-/Papierlogik
5. Beispiele / Bildstrecke
6. Ablauf: Motiv prüfen → Material wählen → Test/Proof → Produktion
7. Verwandte Seiten: Landschaft, Portfolio, Großformatdruck, Sonderanfertigungen
8. Kontaktmodul

---

## 7.2 Großformatdruck — `grossformatdruck-duesseldorf.html`

### Ziel

Große visuelle Präsentationen für Räume, Messe, Autohaus, Schaufenster und Ausstellungen.

### Struktur

1. Hero: `Großformatdruck Düsseldorf`
2. Statement: Wirkung entsteht durch Format, Abstand und Material
3. Anwendungen:
   - Banner
   - Poster
   - Acrylglas
   - Messewand
   - Schaufenster
4. Größen-/Materialberatung
5. Beispielräume / Mockups
6. Ablauf: Motiv/Format → Material → Datenprüfung → Produktion/Montage
7. Verwandte Seiten: Fotolabor, Werbetechnik, Landschaft, Automobil
8. Kontaktmodul

---

## 7.3 Werbetechnik — `werbetechnik-duesseldorf.html`

### Ziel

Schilder, Folien, Beschriftungen, Displays, Raumgrafik und Sichtbarkeit im physischen Raum.

### Struktur

1. Hero: `Werbetechnik Düsseldorf`
2. Statement: Fläche, Blickdistanz und Licht entscheiden
3. Leistungen:
   - Schaufensterbeklebung
   - Firmenschilder
   - Displays
   - Raumgrafik
   - Fahrzeug-/Objektbeschriftung optional
4. Einsatzbereiche
5. Ablauf: Briefing → Visualisierung → Material → Montage
6. Verwandte Seiten: Großformatdruck, Webdesign & SEO, Fotografie
7. Kontaktmodul

---

## 7.4 Webdesign & SEO — `webdesign-seo-duesseldorf.html`

### Ziel

Moderne Websites mit Bildsprache, Performance, Struktur und lokaler Sichtbarkeit.

### Struktur

1. Hero: `Webdesign & SEO Düsseldorf`
2. Statement: Starke Bilder brauchen starke Struktur
3. Leistungen:
   - Website-Konzept
   - Landingpages
   - lokale SEO-Struktur
   - Performance
   - Bild-/Content-Integration
4. Beispiel: ideale Seitenarchitektur
5. Prozess: Analyse → Struktur → Design → Umsetzung → SEO
6. Verwandte Seiten: Fotografie, Blog, Portfolio
7. Kontaktmodul

---

## 7.5 Viola Musik — `viola-musik-duesseldorf.html`

### Ziel

Musikalische Begleitung als eigenständiger, aber ruhig eingebundener Bereich.

### Struktur

1. Hero: `Viola Musik Düsseldorf`
2. Statement: Atmosphäre für Hochzeit, Event, Empfang, Firmenfeier
3. Anlässe:
   - Hochzeit
   - Empfang
   - Dinner
   - Firmenveranstaltung
   - Trauerfeier optional, falls passend
4. Repertoire / Stimmung
5. Ablauf: Anlass → Musikrichtung → Timing → Auftritt
6. Verwandte Seiten: Videografie, Fotografie, Kontakt
7. Kontaktmodul

---

## 7.6 Videografie — `videografie-duesseldorf.html`

### Ziel

Bewegtes Bild als Ergänzung zu Fotografie, Kampagne, Social Media und Event.

### Struktur

1. Hero: `Videografie Düsseldorf`
2. Statement: Bewegung, Rhythmus und Licht als kurze, starke Sequenz
3. Formate:
   - Imagefilm
   - Automotive-Video
   - Eventclip
   - Social/Reels
   - Website-Loop
4. Ablauf: Konzept → Dreh → Schnitt → Exportformate
5. Verwandte Seiten: Automobil, Motorrad, Webdesign & SEO, Portfolio
6. Kontaktmodul

---

## 7.7 Drucke & Sonderanfertigungen — `drucke-sonderanfertigungen-duesseldorf.html`

### Ziel

Individuelle Drucklösungen, Sonderformate, Geschenke, Interior, Editionen und Materialtests.

### Struktur

1. Hero: `Drucke & Sonderanfertigungen Düsseldorf`
2. Statement: Motive als Objekt, Edition oder Raumlösung
3. Möglichkeiten:
   - Sonderformate
   - Materialtests
   - Editionen
   - Geschenke
   - Interior-/Raumlösungen
4. Beratung: Format, Material, Ort, Wirkung
5. Ablauf: Idee → Motiv → Material → Prototyp/Proof → Fertigung
6. Verwandte Seiten: Fotolabor, Großformatdruck, Landschaft, Portfolio
7. Kontaktmodul

---

## 8. Kontaktseite — `contact.html`

### Ziel

Die Kontaktseite soll nicht kompliziert sein. Sie ist der klare Abschluss für alle Wege.

### SEO-Fokus

- Markenanfrage
- `Fotograf Kontakt Düsseldorf`
- lokale Vertrauenssignale

### Empfohlene Sektionen

#### 1. Hero / Kontaktbühne

- Headline: `Direkt anfragen.`
- Text: „Projektart, Ort und Zeitraum reichen für den ersten Schritt.“
- E-Mail prominent
- Telefon sekundär

#### 2. Kontaktformular

Felder:

- Name
- E-Mail
- Projektart
- Zeitraum
- Nachricht

Projektart-Auswahl:

- Automobil
- Sportwagen
- Oldtimer
- Motorrad
- Portrait
- Landschaft
- Portfolio / freie Arbeit
- Fotolabor & Druck
- Großformatdruck
- Werbetechnik
- Webdesign & SEO
- Viola Musik
- Videografie
- Sonderanfertigung

#### 3. Was in die Anfrage gehört

Kurzer Hilfeblock:

- Worum geht es?
- Wo findet es statt?
- Wann ungefähr?
- Wofür werden Bilder/Leistung gebraucht?
- Gibt es Stilreferenzen?

#### 4. Antwort-Erwartung

Optional: „Ich melde mich mit Rückfragen oder einem nächsten Schritt per E-Mail.“

---

# 9. Lokale SEO-Seiten später

Die lokalen Seiten sollten erst kommen, wenn die Hauptseiten sauber sind. Sonst entstehen viele dünne Seiten.

### 9.1 Städte

Geplante Städte:

- Düsseldorf
- Köln
- Essen
- Dortmund
- Duisburg
- Neuss
- Leverkusen
- Oberhausen
- Krefeld
- Wuppertal
- Mettmann

### 9.2 URL-Muster

Empfehlung:

- `automobil-fotografie-koeln.html`
- `sportwagen-fotografie-koeln.html`
- `oldtimer-fotografie-koeln.html`
- `motorrad-fotografie-koeln.html`
- `portraitfotografie-koeln.html`
- `landschaftsfotografie-nrw.html` oder städtespezifisch nur, wenn sinnvoll

### 9.3 Wichtig für lokale Seiten

Jede lokale Seite braucht echten Mehrwert:

- lokale Shooting-Orte / Einsatzszenarien
- Anfahrts-/Regionsbezug
- eigene Bilder oder passende Beispiele
- lokale FAQ
- interne Links zur Hauptseite
- Kontaktmodul mit vorausgewählter Stadt

### 9.4 Nicht machen

Keine automatisch kopierten Seiten mit nur ausgetauschtem Stadtnamen. Das wäre SEO-schwach und wirkt unseriös.

---

# 10. Bildstrategie

## 10.1 Bildquellen

Aktueller zusätzlicher Bildordner:

`C:\Users\matth\Desktop\FotoWettbewerbLow\Converted9\Design`

Darin liegen u. a. Motive aus:

- Portrait
- Natur / Landschaft
- Automotive / Details vermutlich je nach Datei
- Wettbewerbsbilder

## 10.2 Empfohlene Asset-Struktur im Projekt

```text
assets/
  photos/
    automotive/
    sportwagen/
    oldtimer/
    motorrad/
    portrait/
    landschaft/
    services/
    blog/
```

## 10.3 Dateibenennung

Besser für SEO und Pflege:

```text
automobilfotografie-duesseldorf-sportwagen-reflexion-01.webp
oldtimer-fotografie-duesseldorf-interieur-detail-01.webp
portraitfotografie-duesseldorf-kuenstlerportrait-01.webp
landschaftsfotografie-nrw-lichtstimmung-01.webp
```

## 10.4 Bildverwendung pro Seite

Jede Seite braucht:

- 1 starkes Hero-Bild
- 3–6 unterstützende Motive
- 1–2 Detail-/Atmosphäre-Bilder
- sinnvolle Alt-Texte
- keine rein dekorativen Bildnamen

---

# 11. SEO-Grundsystem

## 11.1 Pro Seite zwingend

- genau eine H1
- eindeutiger Title
- Meta Description
- sprechende interne Links
- gute Alt-Texte
- Kontakt-CTA
- strukturierter FAQ-Block, wo sinnvoll
- lokale Begriffe natürlich einbauen

## 11.2 Beispiel Title-Logik

```text
Automobilfotografie Düsseldorf — Matthias Ramahi
Sportwagenfotografie Düsseldorf — Matthias Ramahi
Portraitfotografie Düsseldorf — Matthias Ramahi
Großformatdruck Düsseldorf — Matthias Ramahi
```

## 11.3 Beispiel Meta-Description-Logik

```text
Automobilfotografie in Düsseldorf und NRW: hochwertige Fahrzeugbilder für Verkauf, Marke, Sammlung und Kampagne. Jetzt Projekt per E-Mail anfragen.
```

## 11.4 Interne Linkregeln

Jede Fotografie-Seite verlinkt auf:

- Portfolio
- Kontakt
- 2–3 verwandte Fotografie-Seiten
- ggf. passende Dienstleistung

Jede Service-Seite verlinkt auf:

- Leistungen-Übersicht
- Kontakt
- 2–3 verwandte Services
- ggf. passende Fotografie-Seite

Blogartikel verlinken auf:

- relevante Leistungsseite
- Portfolio
- Kontakt

---

# 12. Migrations- und Aufräumplan

## Phase 1 — Struktur festlegen

1. Diese Markdown-Datei als Blueprint verwenden.
2. Kanonische Seitenliste bestätigen.
3. Entscheiden, ob `index.html` zur echten Home wird.
4. Sportwagen-Seite neu einplanen.

## Phase 2 — Header/Footer vereinheitlichen

1. Einen globalen Header definieren.
2. Einen globalen Footer definieren.
3. Alle Hauptseiten auf dieselbe Navigation bringen.
4. Aktive Zustände korrekt setzen.
5. Doppelte Begriffe vereinheitlichen: `Leistungen` vs. `Weitere Dienstleistungen`.

**Empfehlung:** Im Header `Weitere Dienstleistungen`, im Footer kurz `Leistungen` ist okay. In URLs bleibt `leistungen.html`.

## Phase 3 — Seiten bereinigen

1. `index.html` nicht mehr nur als Weiterleitung nutzen.
2. `fotografie-landing-experience.html` in Home integrieren oder als alte Datei behalten, aber nicht aktiv verlinken.
3. `blog-journal.html` nicht mehr aktiv verlinken.
4. `weitere-dienstleistungen.html` nicht mehr aktiv verlinken.
5. `matthias-ramahi-portfolio.html` nicht mehr aktiv verlinken.
6. `portraitfotografie-experience.html` mit Portrait-Hauptseite abgleichen.

## Phase 4 — Fehlende Seite erstellen

1. `sportwagen-fotografie-duesseldorf.html` erstellen.
2. Header/Footer überall um Sportwagen ergänzen.
3. Portfolio um Sportwagen-Kapitel ergänzen.
4. Kontaktformular um Sportwagen ergänzen.

## Phase 5 — SEO und Inhalte schärfen

1. Titles/Meta Descriptions pro Seite prüfen.
2. H1/H2-Struktur prüfen.
3. Alt-Texte ergänzen.
4. FAQ-Blöcke für wichtige Seiten ergänzen.
5. Interne Links sauber setzen.

## Phase 6 — lokale SEO-Seiten später

Erst wenn die Hauptseiten fertig sind:

1. Stadt-Landing-Template definieren.
2. Pro Stadt nur echte, differenzierte Inhalte schreiben.
3. Priorität: Düsseldorf → Köln → Essen → Dortmund → Duisburg → Neuss/Leverkusen/Krefeld/Wuppertal/Mettmann.

---

# 13. Priorisierte To-do-Liste

## Sofort wichtig

- [ ] `index.html` als echte Home planen/umbauen statt Redirect.
- [ ] Einheitlichen Header für alle Seiten festlegen.
- [ ] Einheitlichen Footer für alle Seiten festlegen.
- [ ] Einheitliches Kontaktmodul definieren.
- [ ] `sportwagen-fotografie-duesseldorf.html` neu erstellen.
- [ ] Navigation um Sportwagen ergänzen.
- [ ] Doppelte Seiten aus aktiver Navigation entfernen.

## Danach

- [ ] Portfolio-Kapitel sauber nach Bereichen strukturieren.
- [ ] Blog behalten, aber Header/Footer und interne Links prüfen.
- [ ] Service-Seiten auf gleiche Struktur bringen.
- [ ] Bildordner systematisieren.
- [ ] Alt-Texte und Dateinamen verbessern.

## Später

- [ ] Lokale SEO-Seiten mit echtem lokalen Mehrwert erstellen.
- [ ] Projekt-/Case-Study-Seiten für besonders starke Serien anlegen.
- [ ] FAQ und Schema-Daten ergänzen.

---

# 14. Empfohlene finale Seitenhierarchie

```text
Home
├── Fotografie
│   ├── Automobilfotografie
│   ├── Sportwagenfotografie
│   ├── Oldtimer-Fotografie
│   ├── Motorrad-Fotografie
│   ├── Portraitfotografie
│   └── Landschaftsfotografie
├── Portfolio
├── Über mich
├── Blog
├── Weitere Dienstleistungen
│   ├── Fotolabor & Druck
│   ├── Großformatdruck
│   ├── Werbetechnik
│   ├── Webdesign & SEO
│   ├── Viola Musik
│   ├── Videografie
│   └── Drucke & Sonderanfertigungen
├── Kontakt
├── Impressum
└── Datenschutz
```

---

# 15. Kurzfazit

Die Website sollte nicht als Sammlung vieler einzelner Designs gebaut werden, sondern als ein klares System:

- **ein Header**
- **ein Footer**
- **ein Kontaktmodul**
- **eine visuelle Sprache**
- **eine saubere Seitenhierarchie**
- **eigene SEO-Seiten für jeden wichtigen Suchintent**

Der stärkste nächste Schritt ist: **Home + Header/Footer + Kontaktmodul als System finalisieren**, danach die Fotografie-Hauptseiten und die neue Sportwagen-Seite darauf angleichen.

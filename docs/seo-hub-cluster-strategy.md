# SEO Hub- und Cluster-Strategie MatthiasRamahi.de

Stand: 2026-07-28

## Entscheidung

Die Website braucht derzeit keine weitere Massenproduktion von Stadt- oder Keywordseiten. Sie braucht eine klarere Hierarchie, echte Projektbelege und eine datenbasierte Bereinigung naher Suchintentionen.

Die technische Indexierbarkeit ist weitgehend sauber:

- Live-Sitemap am 2026-07-28: 252 von 252 Seiten liefern indexierbare `200`-Antworten mit Self-Canonical.
- GSC-Export: 266 indexierte Seiten; 249 der damaligen 252 Sitemap-URLs sind im Export enthalten.
- Die 172 unter `Gecrawlt - zurzeit nicht indexiert` gemeldeten URLs sind Altbestand, nicht aktuelle `.html`-Seiten.
- Der lokale Stand enthält nach der Konsolidierung von `/fotografie-deutschland.html` 251 normale Sitemap-URLs.

Indexierbarkeit ist damit nicht mehr der zentrale Wachstumsengpass. Der nächste Engpass ist die Verteilung von Relevanz, Belegen und internen Links.

## Was bereits geplant war

Es gibt drei verwertbare, aber teilweise überholte Pläne:

- `docs/website-struktur-plan.md`: Grundnavigation, sechs Fotografie-Bereiche und gemeinsame Seitensysteme. Viele damalige Bauaufgaben sind inzwischen erledigt.
- `docs/seo-keyword-aktionsplan.md`: Bottom-of-Funnel-Keywords, Düsseldorf/Erkrath/Mettmann und Support-Content. Der Plan führte zu sehr vielen Varianten; weitere Expansion wird gestoppt.
- `docs/seo-indexing-action-plan.md`: technische Bereinigung, GSC-Klassifikation und aktuelle Wachstumsregeln. Das bleibt die Quelle für Indexierung und Alt-URLs.

Dieses Dokument ist ab jetzt die Quelle für Seitenrollen, Hub-/Cluster-Struktur und Wachstumsreihenfolge.

## Aktueller Architekturbefund

Der lokale Render-Crawl über 251 Sitemap-Seiten zeigt:

- `/fotografie.html` hat im Hauptinhalt anderer Seiten keinen eingehenden Link. Die Seite ist über globale Navigation erreichbar, wird aber in den lokalen Hubs nicht als übergeordnete Übersicht geführt.
- `/keyword-datenbank-seo.html` hat ebenfalls keinen eingehenden Hauptinhalts-Link.
- Die sechs Fotografie-Pillars erhalten viele Links, geben aber jeweils 35 bis 41 interne Hauptinhalts-Links aus.
- Viele lokale und keywordbasierte Seiten verlinken gleichzeitig alle Städte, alle Keywordgeschwister und alle anderen Fotografie-Familien. Das erzeugt ein flaches Seitennetz statt einer lesbaren Hierarchie.
- Die sieben Journalbeiträge sind bereits sinnvoll mit passenden Leistungsseiten verbunden.
- Die sechs Pillar-Datensätze enthalten je vier `proofPoints`, deren Text pro Seite viermal identisch ist. Das ist kein belastbarer Projektbeleg.
- Die CMS-Datei für `/fotografie-duesseldorf.html` enthält noch den alten Text „Diese Seite wurde verschoben“. Die aktuelle Landingpage entsteht nur durch Fallback- und Komponentenlogik.

## Zielarchitektur

```text
/
├── /fotografie.html
│   ├── /fotografie-duesseldorf.html
│   │   └── 6 Düsseldorfer Leistungsvarianten
│   ├── /fotografie-nrw.html
│   │   └── 6 NRW-Leistungsvarianten
│   └── 6 Fotografie-Pillars
│       ├── ausgewählte Bottom-of-Funnel-Seiten
│       ├── 1-2 echte Ratgeber
│       ├── Projekt-/Portfolio-Beleg
│       └── Kontakt
├── /portfolio.html
├── /blog.html
└── /leistungen.html
    ├── Webdesign & SEO
    └── Contextter Keyword-Datenbank-Fallstudie
```

Jede indexierbare Seite erhält genau eine primäre Rolle. Ein anderes Keyword oder ein anderer Ort reicht nicht als eigenständige Rolle.

## Cluster und Seitenrollen

### Automobil

**Pillar:** `/automobil-fotografie.html`

Klar getrennte Kinder:

- `/auto-fotoshooting.html`: privates Shooting und Erlebnis
- `/automotive-fotografie.html`: Marke, Agentur, Kampagne und Content-Produktion
- `/autohaus-fotografie.html`: wiederholbarer Händler- und Bestandsprozess
- `/autoverkauf-fotos-duesseldorf.html`: Inserat, Zustand, Ausstattung und Verkauf
- `/bilder-mit-auto.html`: Person plus Fahrzeug
- `/auto-fotografieren-tipps.html`: echter Ratgeber, keine Leistungsseiten-Kopie

**Prüfgruppe:** `/autofotografie.html`, `/fahrzeugfotografie.html` und `/fotoshooting-mit-auto.html`. Vor einer Zusammenlegung müssen GSC-Abfragen, Landingpage-Klicks, Links und Anfragen verglichen werden.

### Sportwagen

**Pillar:** `/sportwagen-fotografie.html`

Eigenständige Rollen können Motorsport, Performance, Exotic und Supersportwagen sein, wenn Portfolio und Anfrageprozess wirklich verschieden sind.

**Prüfgruppe:** `/sportwagen-shooting-duesseldorf.html` und `/sportwagen-fotoshooting-duesseldorf.html`. Das ist derzeit der offensichtlichste Kannibalisierungskandidat.

### Oldtimer

**Pillar:** `/oldtimer-fotografie.html`

Kinder:

- Classic Car: englischsprachiger bzw. internationaler Branchenbegriff
- Youngtimer: jüngere Sammlerfahrzeuge
- Sammlerfahrzeug: Dokumentation und Sammlung
- Verkaufsfotos: Verkauf und Auktion
- Shooting: privater Besitzer und Erlebnis

Die Seiten brauchen reale Fahrzeugserien, Angaben zu Patina, Material, Zustand, Bildliste und Verwendungszweck.

### Motorrad

**Pillar:** `/motorrad-fotografie.html`

Kinder:

- Custom Bike: Umbau, Teile und Werkstattbezug
- Verkaufsfotos: Zustand und Inserat
- Biker Portrait: Mensch und Maschine
- Motorrad Shooting: privater Shooting-Ablauf

**Prüfgruppe:** `/bike-fotografie.html`. Nur eigenständig halten, wenn die Seite andere Suchanfragen oder Nutzer als der Pillar erreicht.

### Portrait

**Pillar:** `/portraitfotografie.html`

Business-Untercluster:

- `/business-portrait-duesseldorf.html`: B2B-Hub
- `/headshot-fotograf-duesseldorf.html`: enge Profilaufnahme für berufliche Nutzung
- `/personal-branding-fotografie.html`: mehrteilige Personen- und Markengeschichte
- `/unternehmensportrait-duesseldorf.html`: Team, Führung und Arbeitsumfeld
- `/pressefoto-duesseldorf.html`: Pressekit und redaktionelle Nutzung

Privater Untercluster:

- Portrait-Fotoshooting
- Dating
- Paar/Familie
- Gutschein
- Preise
- Schwarz-Weiß

`/portraitfotografie-beleuchtung.html` wird zum echten Erfahrungsratgeber mit Setups, Lichtformern, Abständen, Fehlern und Beispielbildern.

### Landschaft und Prints

**Pillar:** `/landschaftsfotografie.html`

Kommerzielle Kinder:

- Landschaftsbilder kaufen
- Fine-Art-Prints
- Wandbilder
- Naturfotografie-Prints

Die vielen Stadtvarianten sind für einen lieferbaren Print weniger plausibel als bei einem Shooting. Keine weiteren Landschaft-Stadtseiten bauen. Bestehende Seiten zunächst stabil halten und nach einer Beobachtungsperiode anhand von Impressionen, Links und Anfragen prüfen.

## Seiten mit höchster Priorität

| Priorität | Seite oder Gruppe | Aktion |
|---:|---|---|
| 1 | `/fotografie-duesseldorf.html` | Redirect-Alttext im CMS durch echten lokalen Hub-Inhalt ersetzen; sechs Bereiche, Düsseldorfer Planung, Proof und klare Links |
| 2 | `/automobil-fotografie.html` | Wiederholte Proof-Texte durch reale Serien, Fahrzeuge, Nutzung und Ergebnisse ersetzen |
| 3 | `/portraitfotografie.html` und `/business-portrait-duesseldorf.html` | B2B- und Privatrollen trennen; echte Referenzen, Ablauf, Rechte und Lieferformate ergänzen |
| 4 | `/oldtimer-fotografie.html` | Sammlung, Verkauf, Auktion, Patina und Zustandsdokumentation konkretisieren |
| 5 | `/motorrad-fotografie.html` | Custom Bike, Fahrer, Sicherheit, Bewegung und Verkaufsbilder konkretisieren |
| 6 | `/sportwagen-fotografie.html` | Unterseitenrollen festlegen und Shooting/Fotoshooting-Überlappung messen |
| 7 | `/auto-fotografieren-tipps.html` | In einen erfahrungsbasierten Ratgeber mit Originalbildern und Verlinkung zum Automobil-Pillar umbauen |
| 8 | `/portraitfotografie-beleuchtung.html` | In einen erfahrungsbasierten Ratgeber mit konkreten Setups umbauen |
| 9 | `/keyword-datenbank-seo.html` | Nur aus dem Leistungen-/Webdesign-und-SEO-Bereich kontextuell verlinken; nicht in Fotografie-Cluster mischen |
| 10 | Landschaft-Stadtseiten | Expansion stoppen; Nutzen und GSC-Signale vor einer späteren Konsolidierung prüfen |

## Interne Linkregeln

1. Ein Hub verlinkt die wichtigsten Pillars oder lokalen Pillar-Varianten.
2. Ein Pillar zeigt maximal eine kuratierte Auswahl relevanter Kinder, nicht jede Stadt und jedes Synonym.
3. Ein Kind verlinkt zum Parent, zu einem passenden Beleg und zum Kontakt.
4. Ratgeber und Leistungsseite verlinken in beide Richtungen, wenn der Ratgeber eine echte Kauf- oder Planungsfrage beantwortet.
5. Portfolio und Case Study verlinken auf die Leistung, die sie belegen.
6. `/fotografie.html` muss aus den Düsseldorfer und NRW-Hubs im Hauptinhalt erreichbar sein.
7. Die Contextter-Fallstudie erhält Links aus `/leistungen.html` und/oder `/webdesign-seo-duesseldorf.html`, nicht aus Fotografie-Artikeln.

## Content- und Proof-Plan

Nicht zuerst zehn neue Ratgeber schreiben. Zuerst vier reale Projektbelege erstellen:

1. Automobil: ein konkretes Fahrzeug, Briefing, Licht, Location, Bildliste und Nutzung
2. Oldtimer: Zustand, Patina, Details, Sammlung oder Verkauf
3. Motorrad: Maschine, Fahrer, Sicherheit, Bewegung und Ausgabeformate
4. Business Portrait: Person oder Team, gewünschte Wirkung, Setups und Nutzungsrechte

Aus jedem Projekt können ohne neue Behauptungen entstehen:

- Portfolio-Sequenz
- Case Study
- 30- bis 90-sekündiges Video
- ausgewählte Bildposts
- Partnerbeitrag
- Kundenstimme mit Einwilligung
- kontextueller Leistungsseiten-Beleg

AI-Text darf beim Strukturieren helfen. Der veröffentlichte Text muss aber Matthias' reale Entscheidung, Erfahrung, Bildmaterial und Sprache enthalten. AI-Detektoren, künstliche Tippfehler oder Zeichensetzungsregeln sind keine Qualitätskontrolle.

## Autorität und Backlinks

Backlinks werden nicht als isolierter Einkauf geplant. Priorisiert werden:

- Autohäuser, Werkstätten, Aufbereiter, Folierer und Fahrzeugclubs
- Oldtimer- und Motorradvereine sowie Veranstalter
- Locations und Studios, die tatsächlich genutzt wurden
- lokale Wirtschafts- und Kulturpublikationen
- Agenturen, Designer, Druckpartner und Webpartner
- Interviews, Gastbeiträge und Projektfeatures mit echtem Fachbezug
- konsistente Branchen- und lokale Verzeichnisse

Jede Zusammenarbeit braucht einen realen Nutzen: Projektbericht, Bildstrecke, technische Erklärung, Interview oder gemeinsamer Guide. Reine Linktauschseiten, PBNs, gekaufte Follow-Links und erfundene Empfehlungen bleiben ausgeschlossen.

## 90-Tage-Plan

### Tage 1-30: Rollen und Linkfluss

- Düsseldorfer CMS-Hub bereinigen
- Kontextuelle Links zu `/fotografie.html` und der Contextter-Fallstudie ergänzen
- Pro Cluster Parent und Kinder verbindlich markieren
- Linklisten auf Pillars und Kindern kuratieren
- GSC-Seiten-/Query-Export für die vier Überlappungsgruppen sichern

#### Umsetzungsstand

- [x] `/fotografie-duesseldorf.html`: alten Redirect-Hinweis im CMS durch echten Hub-Inhalt ersetzt
- [x] `/fotografie.html`: aus Düsseldorf- und NRW-Hub im Hauptinhalt verlinkt
- [x] `/keyword-datenbank-seo.html`: aus `/webdesign-seo-duesseldorf.html` kontextuell verlinkt
- [x] Automobil-Pilot: Pillar, Düsseldorf-Hub, NRW-Verzeichnis, Stadtseiten, Intent-Seiten und Portfolio-Beleg hierarchisch verknüpft
- [x] Dieselbe Linkregel auf Sportwagen, Oldtimer, Motorrad, Portrait und Landschaft übertragen
- [x] Wiederholbaren GSC-Seiten-/Query-Analyzer für die vier Überlappungsgruppen angelegt
- [ ] Aktuellen echten GSC-Seiten-/Query-Export auswerten; im Repository liegt derzeit nur die Test-Fixture

Der Automobil-Pilot vom 2026-07-28 dient als technischer Prüfvertrag:

- `/automobil-fotografie.html` verlinkt sechs priorisierte Orte und alle neun bestehenden Intent-Kinder, solange die drei Überschneidungsseiten noch nicht datenbasiert konsolidiert sind.
- `/automobil-fotografie-nrw.html` bleibt das vollständige Verzeichnis für 22 Stadtseiten und hält dadurch alle vorhandenen lokalen Kinder erreichbar.
- Düsseldorf verlinkt den Parent, NRW, vier nahe Orte und sechs kaufnahe Intents.
- Eine normale Stadtseite verlinkt Parent, Düsseldorf, NRW, drei zentrale Intents, Portfolio-Beleg und Kontakt.
- Eine Intent-Seite verlinkt Parent, Düsseldorf, NRW, drei benachbarte Intents, Portfolio-Beleg und Kontakt.
- Die Portfolio-Auswahl `/portfolio/portfolio-auswahl-automobil` verlinkt zurück zur belegten Düsseldorfer Automobil-Leistung.
- Der Redirect `/automobil-fotografie-deutschland.html` wird nicht mehr intern verlinkt.

Gemessene Wirkung im gerenderten Hauptinhalt:

| Seitentyp | Vorher | Nachher |
|---|---:|---:|
| Automobil-Pillar | 52 Links | 34 Links |
| normale Stadtseite, Beispiel Mettmann | 57 Links | 25 Links |
| Intent-Seite, Beispiel Automotive | 57 Links | 25 Links |

Der NRW-Hub bleibt mit 54 Links bewusst umfangreicher, weil er die Funktion des vollständigen Ortsverzeichnisses übernimmt.

### Tage 31-60: Money Pages und Proof

- Automobil-, Portrait-, Oldtimer- und Motorrad-Pillar mit echten Belegen überarbeiten
- zwei reale Case Studies veröffentlichen
- Kontaktfragen und Conversion-Ereignisse pro Landingpage messen
- Bilddateien, Alt-Texte, Captions und Bild-Sitemap für die neuen Belege prüfen

#### Umsetzungsstand

- [x] Sechs Portfolio-Auswahlen als sichtbare `Projektbelege` eingeordnet und wechselseitig mit der jeweiligen Düsseldorfer Leistung verknüpft
- [x] Alle sechs Familienseiten führen aus Hero oder Portfolio-Bereich zum passenden Projektbeleg
- [x] Umami-Ereignisse um `page`, `pageFamily`, `pageRole` und `projectType` ergänzt
- [x] Asset- und Sitemap-Build geprüft: 233 von 233 referenzierten Assets vorhanden
- [ ] Zwei echte Kunden-Case-Studies veröffentlichen; dafür fehlen im Repository Briefing, Einwilligung, Nutzungsrechte und belegbare Ergebnisse
- [ ] Pillar-Proof-Texte mit realen Projektangaben ersetzen, sobald die Angaben aus dem Case-Study-Vertrag vorliegen

Die vorhandenen Bildstrecken sind ein visueller Projektbeleg, aber keine
Kunden-Case-Study. Es werden deshalb weder Auftraggeber noch Resultate,
Kundenstimmen oder Nutzungsrechte erfunden.

### Tage 61-90: Support und Autorität

- Auto-Tipps- und Portrait-Licht-Ratgeber umbauen
- zwei weitere Case Studies veröffentlichen
- fünf bis zehn reale Partner-/Publikationskontakte mit konkretem Asset ansprechen
- erste Konsolidierungsentscheidung nur für Seiten mit klarer Query-Überlappung und ohne eigene Conversion treffen

#### Umsetzungsstand

- [x] `/auto-fotografieren-tipps.html` um einen praktischen Fünf-Schritte-Leitfaden, Projektbeleg und korrektes `Article`-Schema ergänzt
- [x] `/portraitfotografie-beleuchtung.html` um einen praktischen Lichtleitfaden, Projektbeleg und korrektes `Article`-Schema ergänzt
- [x] Zehn fachlich passende Outreach-Ziele mit konkretem Asset und primärem Linkziel vorbereitet
- [x] Case-Study-Vertrag, Outreach-Brief und Vierwochen-Messrhythmus dokumentiert
- [ ] Zwei weitere echte Case Studies veröffentlichen; reales Material und Freigaben fehlen
- [ ] Outreach versenden; alle zehn Einträge stehen bewusst auf `nicht kontaktiert`
- [ ] Konsolidierungsentscheidungen treffen; erst nach echtem Page-Query-Export, 90 Tagen Messung, Conversion- und Linkprüfung

## Technischer Abschlussstand 2026-07-28

Die Umsetzung ist durch automatisierte und gerenderte Prüfungen abgesichert:

| Prüfung | Ergebnis |
|---|---|
| Astro Check und Produktions-Build | 122 Dateien, 0 Fehler, 0 Warnungen, 0 Hinweise |
| Tina SEO Live-Audit | 252 Dokumente, 219 Familienseiten, 251 Meta-Prüfungen, 0 Befunde |
| Sitemap-Audit | 251 eindeutige Sitemap-URLs, 0 fehlend, 0 Duplikate |
| Cluster-Contract | 30 Rollen-Seiten, 6 Projektbelege, 2 Guides, 0 Befunde |
| Release-Routing | 121 Redirects, 0 Fehler, 6 Sitemap-Dateien |
| GSC-Indexierungs-Fixture | 521 Alt-URLs: 206 Redirects, 143 `410`, 172 indexierbare `200`, 0 problematisch |
| Responsive Browser-QA | 1440 px und 390 px, kein Overflow, keine defekten Bilder, keine Browserfehler |

Der Cluster-Contract prüft je Familie Pillar, Düsseldorf-Hub, NRW-Hub,
normale Child-Seite und Intent-Seite. Normale Kinder führen zu Parent,
Düsseldorf, NRW, Projektbeleg und Kontakt. Nur Düsseldorf- und NRW-Hubs
erhalten den Cross-Family-Block. Interne Links zur jeweiligen
`*-deutschland.html`-Ortsseite sind ausgeschlossen.

Die lokale Laufzeit verwendete Node 24, während das Projekt Node 22 verlangt.
Der Build ist trotzdem grün; Release- und Produktionsprüfungen sollen mit der
in `package.json` festgelegten Node-22-Laufzeit erfolgen.

## Noch nicht durch Code lösbar

Diese Punkte bleiben offen, weil dafür externe Daten oder reale Handlungen
erforderlich sind:

1. aktueller GSC-Page-Query-Export und mindestens 90 Tage Beobachtung
2. reale Projektbriefings, Kundenfreigaben, Nutzungsrechte und Ergebnisse
3. tatsächliche Partneransprache und redaktionelle Rückmeldungen
4. qualifizierte Anfragen und Conversion-Daten nach dem Release
5. Backlinks und Erwähnungen, die aus echten Kooperationen entstehen

## Messung

Alle vier Wochen je Cluster erfassen:

- indexierte aktuelle Sitemap-URLs
- Impressionen, Klicks, Position und Query-Überlappung je Landingpage
- qualifizierte Anfragen und unterstützte Conversions
- Bild- und Video-Sichtbarkeit
- neue verweisende Domains und relevante Markenerwähnungen
- Seiten ohne Impressionen, Links, Anfragen oder eindeutige Rolle

Erfolg bedeutet nicht, dass jede vorhandene URL rankt. Erfolg bedeutet, dass die richtigen Seiten auffindbar sind, klar unterschiedliche Aufgaben erfüllen und qualifizierte Anfragen erzeugen.

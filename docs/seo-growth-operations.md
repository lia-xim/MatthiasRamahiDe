# SEO Growth Operations

Stand: 2026-07-28

Dieses Dokument setzt die Mess-, Case-Study- und Outreach-Schritte aus dem
90-Tage-Plan operativ um. Es ersetzt keine echten Search-Console-, Kunden- oder
Partnerdaten.

## Vierwochen-Rhythmus

### 1. Technische Basis

Nach jedem Release und danach mindestens alle vier Wochen:

```powershell
corepack pnpm seo:audit:sitemap-live
corepack pnpm seo:audit:gsc-live
corepack pnpm seo:audit:cluster-contract -- --base-url=https://matthiasramahi.de
```

Zu protokollieren:

- Anzahl normaler Sitemap-URLs
- indexierbare `200`-Seiten
- offene Status-, Canonical- oder `noindex`-Probleme
- offene alte GSC-URLs, getrennt nach Redirect, `410` und echtem Fehler
- Rollenlinks, Projektbelege, Guide-Schema und Analytics-Dimensionen

### 2. Page-Query-Leistung

Der benötigte Export enthält eine Zeile je Kombination aus Landingpage und
Suchanfrage. Mindestspalten:

```csv
page,query,clicks,impressions,ctr,position
```

Auswertung:

```powershell
corepack pnpm seo:analyze:gsc-overlap -- --input C:\Pfad\page-query.csv --report .tmp\seo\gsc-page-query-overlap.md
```

Der Report vergleicht:

1. Autofotografie, Fahrzeugfotografie und Fotoshooting mit Auto
2. Sportwagen Shooting und Sportwagen Fotoshooting Düsseldorf
3. Motorrad-Pillar und Bike-Fotografie
4. bestehende Landschaft-Stadtseiten

Kein Redirect wird allein aus Query-Overlap abgeleitet. Eine Konsolidierung
braucht zusätzlich mindestens 90 Tage Daten, Landingpage-Conversions,
vorhandene Links und eine manuelle Intent-Prüfung.

### 3. Landingpage-Conversions

`assets/analytics.js` übergibt die vorhandenen Umami-Ereignisse mit drei
stabilen Dimensionen:

- `page`: kanonischer Pfad der Landingpage
- `pageFamily`: `automobil`, `sportwagen`, `oldtimer`, `motorrad`, `portrait`,
  `landschaft`, `contextter` oder `other`
- `pageRole`: `pillar`, `local-hub`, `regional-hub`, `child`, `guide`,
  `proof`, `case-study` oder `other`

Wichtige Ereignisse:

| Ereignis | Bedeutung |
|---|---|
| `cta-view` | CTA oder Kontaktbereich wurde sichtbar |
| `cta-click` | Nutzer hat eine gemessene CTA angeklickt |
| `form-start` | Anfrageformular wurde begonnen |
| `form-submit-attempt` | Versand wurde versucht |
| `form-submit` | Anfrage wurde erfolgreich angenommen |
| `form-submit-mailto` | Mailprogramm-Fallback wurde geöffnet |
| `form-abandon` | Formular begonnen, aber nicht abgeschlossen |
| `outbound-link` | externer Link, unter anderem Contextter |
| `gallery-load-more` | vertiefte Portfolio-Nutzung |
| `faq-open` | fachliche Detailfrage geöffnet |

Es werden keine Namen, E-Mail-Adressen, Telefonnummern, Nachrichtentexte oder
vollständigen externen URLs an Umami übertragen. Kontakt- und externe
Linkereignisse enthalten nur abstrahierte Kanäle beziehungsweise Domains.

### 4. Snapshot je Cluster

Alle vier Wochen dieselben Felder erfassen:

| Feld | Quelle |
|---|---|
| indexierte aktuelle URLs | GSC Indexierung plus Sitemap-Abgleich |
| Klicks, Impressionen, CTR, Position | GSC Page-Query-Export |
| gemeinsame Queries der Prüfgruppen | Overlap-Report |
| `cta-view` bis `form-submit` | Umami |
| qualifizierte Anfragen | manuelle CRM-/Postfach-Klassifikation |
| Bild- und Videosuche | GSC Suchtyp Bild/Video |
| neue verweisende Domains | verifiziertes Linktool plus manueller Check |
| relevante Markenerwähnungen | manuelle Prüfung |

## Case-Study-Vertrag

Eine Seite darf erst als reale Case Study bezeichnet werden, wenn diese Felder
belegt und freigegeben sind:

1. Projektname oder anonymisierte, freigegebene Bezeichnung
2. Auftraggeber, Eigentümer oder porträtierte Person mit Einwilligung
3. Datum und tatsächlicher Ort
4. Ausgangslage und konkrete Nutzung der Bilder
5. fotografische Entscheidung zu Licht, Perspektive und Ablauf
6. tatsächlich gelieferte Bildtypen und Formate
7. Nutzungsrechte und veröffentlichbare Motive
8. messbares Ergebnis nur mit nachvollziehbarer Quelle
9. Kundenstimme nur mit ausdrücklicher Freigabe
10. Link zur passenden Düsseldorfer Leistung und zur Portfolio-Auswahl

Bis diese Angaben vorliegen, heißen die vorhandenen Seiten bewusst
`Projektbeleg` oder `Portfolio-Auswahl`. Die erste sinnvolle Reihenfolge bleibt:

1. Automobil
2. Oldtimer
3. Motorrad
4. Business Portrait

## Verifizierte Outreach-Zielliste

Status aller Einträge: **nicht kontaktiert**. Ein Kontakt ist erst sinnvoll,
wenn das genannte echte Asset und die erforderlichen Rechte vorliegen.

| Priorität | Ziel | Passendes Asset | Primäres Linkziel |
|---:|---|---|---|
| 1 | [Classic Remise Düsseldorf](https://remise.de/duesseldorf) | freigegebene Oldtimer- und Architekturstrecke mit konkreter Fahrzeuggeschichte | `/oldtimer-fotografie-duesseldorf.html` |
| 2 | [Renngemeinschaft Düsseldorf](https://rgduesseldorf.de/) | echter Rallye-/Clubbericht mit Bildauswahl und Teilnehmerfreigaben | `/sportwagen-fotografie-duesseldorf.html` |
| 3 | [Honda Düsseldorf Motorrad](https://motorrad.honda-duesseldorf.de/) | Händler- oder Modellserie mit klarer Bildliste für Web, Bestand und Social | `/motorrad-fotografie-duesseldorf.html` |
| 4 | [MOTORWORLD Köln Rheinland](https://motorworld.de/koeln-rheinland/) | redaktionelle Orts- und Fahrzeugstrecke nach vorheriger Aufnahmefreigabe | `/automobil-fotografie.html` |
| 5 | [Areal Böhler](https://areal-boehler.de/) | Industriearchitektur als reale Location-Fallstudie für Fahrzeug oder Business Portrait | `/fotografie-duesseldorf.html` |
| 6 | [Visit Düsseldorf Medienservice](https://www.visitduesseldorf.de/business/kontakt) | lokaler Fotoessay mit Motivliste, Rechten und veröffentlichungsfertigen Dateien | `/fotografie-duesseldorf.html` |
| 7 | [Koordinierungsstelle Fotografie Düsseldorf](https://www.duesseldorf.de/fotografie/) | kulturell passendes Fotoprojekt, Ausstellung oder dokumentierte lokale Serie | `/portfolio.html` |
| 8 | [OLDTIMER MARKT](https://www.oldtimer-markt.de/oldtimer-praxis/kontakt) | fachlicher Bildbeitrag zu Patina, Reflexkontrolle oder Zustandsdokumentation | `/oldtimer-fotografie.html` |
| 9 | [DJournal](https://djournal.de/) | lokale Personen- oder Unternehmensgeschichte mit freigegebener Portraitserie | `/business-portrait-duesseldorf.html` |
| 10 | [ZOO:M Düsseldorf](https://zoom-duesseldorf.net/) | lokale Fotografiegeschichte oder Interview mit konkreter Bildstrecke | `/portraitfotografie-duesseldorf.html` |

Die Liste ist keine Zusage auf Veröffentlichung oder Backlink. Sie priorisiert
inhaltliche Passung und reale redaktionelle Anknüpfung statt Linktausch.

## Outreach-Brief

Vor jedem Versand werden Ziel, Ansprechpartner, aktuelles Format und Rechte
erneut geprüft. Die Nachricht bleibt kurz:

```text
Betreff: Bildstrecke zu [konkretes Thema / Ort / Fahrzeug]

Guten Tag [Name],

ich habe eine freigegebene Bildstrecke zu [konkreter Gegenstand] produziert.
Sie umfasst [konkrete Motive und Formate] und könnte zu Ihrem Bereich
[konkrete Rubrik / Veranstaltung / Themenseite] passen.

Hier ist eine Vorschau mit Einordnung und Nutzungsrahmen:
[Projektbeleg oder Case Study]

Falls das Thema redaktionell passt, stelle ich gern die ausgewählten Dateien,
Bildunterschriften und Rechteangaben zusammen. Eine Erwähnung oder Verlinkung
ist keine Bedingung; entscheidend ist, dass die Strecke für Ihre Leser oder
Besucher einen echten Nutzen hat.

Viele Grüße
Matthias Ramahi
```

## Abschlusskriterien

Ein Vierwochen-Zyklus ist abgeschlossen, wenn:

- technische Audits gespeichert sind,
- der aktuelle Page-Query-Export ausgewertet ist,
- Conversions je Seitenrolle erfasst sind,
- neue Case-Study-Belege mit Freigabestatus dokumentiert sind,
- Outreach nur mit echtem Asset versendet und das Ergebnis protokolliert wurde,
- keine URL ohne Datenbasis konsolidiert wurde.

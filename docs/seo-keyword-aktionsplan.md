# SEO Keyword-Aktionsplan Matthias Ramahi

Stand: 2026-05-31  
Basis: CSV `2025-12-20_listkeywords_download_11a08 - Worksheet.csv`, bestehende lokale SEO-Struktur im Repo, Angebotsfokus Automobil/Sportwagen/Motorrad/Oldtimer, Portrait und Landschaft.  
Wichtige Rahmenbedingung: Ahrefs/Backlink-Performance ca. 42. Deshalb keine riesigen Shorthead-Angriffe, sondern kleinere, klare Suchintents mit starkem Angebotsfit.

## Kurzfazit

Die Keyword-Datei enthält viel Traffic, aber nicht alles davon ist wertvoll. Das größte Volumen liegt bei generischen Foto- und Portraitbegriffen. Für die Website lohnt sich aber nicht, blind nach Volumen zu gehen. Besser ist ein schlanker Plan aus wenigen Seiten und gezielten Verbesserungen bestehender Seiten.

Der stärkste SEO-Weg ist:

1. Bestehende Kernseiten verbessern, damit sie mehr Longtail-Suchen abdecken.
2. Wenige neue Seiten bauen, die einen klar anderen Suchintent haben.
3. Lokale Signale für Mettmann/Erkrath/Düsseldorf stärken.
4. Keine Seiten für falsche Anfragen erstellen, auch wenn Suchvolumen da ist.

## Umsetzungs-Checkliste Nach Worktree `codex/seo-cluster-pages`

Stand nach Umsetzung im Worktree: 2026-05-31
Technische Linie: keine neue Kategorie, sondern neue Keyword- und Ortsvarianten unter den bestehenden Fotografie-Familien. Die neuen Seiten erben Layout, Bilder, CSS und Motion der jeweiligen Hauptseite; geändert wurden Routen, Meta-Daten, Hero-/Anfragetexte, keywordindividuelle Mittel-Sektionen, lokale Abschnittstexte, Sitemap-Zuordnung und interne Clusterlinks.

### Bereits Angelegt Und Verlinkt

Diese Seiten sind im Astro-Routing vorhanden, bauen erfolgreich und sind in den passenden Clustern/Sitemaps sichtbar.

#### Automobil-Cluster

- [x] `auto-fotoshooting.html`
- [x] `auto-fotoshooting-duesseldorf.html`
- [x] `bilder-mit-auto.html`
- [x] `bilder-mit-auto-duesseldorf.html`
- [x] `fotoshooting-mit-auto.html`
- [x] `fotoshooting-mit-auto-duesseldorf.html`
- [x] `auto-fotografieren-tipps.html`
- [x] `auto-fotografieren-tipps-duesseldorf.html`
- [x] `automobil-fotografie-erkrath.html`
- [x] `automobil-fotografie-ratingen.html`

#### Sportwagen-Cluster

- [x] `motorsport-sportwagen-fotografie.html`
- [x] `motorsport-sportwagen-fotografie-duesseldorf.html`
- [x] `motorsport-fotografie.html`
- [x] `motorsport-fotografie-duesseldorf.html`
- [x] `sportwagen-fotografie-erkrath.html`
- [x] `sportwagen-fotografie-ratingen.html`

#### Portrait-Cluster

- [x] `portrait-fotoshooting.html`
- [x] `portrait-fotoshooting-duesseldorf.html`
- [x] `fotoshooting-gutschein.html`
- [x] `fotoshooting-gutschein-duesseldorf.html`
- [x] `fotoshooting-preise.html`
- [x] `fotoshooting-preise-duesseldorf.html`
- [x] `dating-fotoshooting.html`
- [x] `dating-fotoshooting-duesseldorf.html`
- [x] `portraitfotografie-beleuchtung.html`
- [x] `portraitfotografie-beleuchtung-duesseldorf.html`
- [x] `schwarz-weiss-portrait-fotografie.html`
- [x] `schwarz-weiss-portrait-fotografie-duesseldorf.html`
- [x] `paarshooting-familienshooting.html`
- [x] `paarshooting-familienshooting-duesseldorf.html`
- [x] `portraitfotografie-erkrath.html`
- [x] `portraitfotografie-ratingen.html`

#### Weitere Bestehende Fotografie-Familien Mit Neuer Lokalabdeckung

- [x] `oldtimer-fotografie-erkrath.html`
- [x] `oldtimer-fotografie-ratingen.html`
- [x] `motorrad-fotografie-erkrath.html`
- [x] `motorrad-fotografie-ratingen.html`
- [x] `landschaftsfotografie-erkrath.html`
- [x] `landschaftsfotografie-ratingen.html`

### Ebenfalls Erledigt

- [x] Neue Keyword-Prefixe in die bestehenden Familien eingehängt.
- [x] Interne Suchbegriff-Links auf Automobil-, Sportwagen- und Portrait-Hauptseiten erweitert.
- [x] Erkrath und Ratingen als lokale Zielorte in allen Familien ergänzt.
- [x] Automobil-, Sportwagen- und Portrait-Keywordseiten mit eigenen Abschnittstexten ausgestattet: Pull/Intro, Abschnittsheadlines, Karten, Galerie-/Ablauftexte und Related-Text.
- [x] Düsseldorf-Varianten der Keywordseiten erhalten zusätzlichen lokalen Kontext im Hero, damit generische und lokale Varianten nicht wortgleich starten.
- [x] Oldtimer-, Motorrad- und Landschaft-Lokalseiten erhalten ortsbezogene Mittel-Sektionen statt nur lokaler Hero-/Kontakttexte.
- [x] Sitemap-Klassifizierung für die neuen Local-SEO-Seiten erweitert.
- [x] Native Route-Coverage so angepasst, dass neue native Local-SEO-Seiten ohne alte Legacy-Referenz erlaubt sind.
- [x] Web-Build erfolgreich ausgeführt.
- [x] Native Route-Coverage erfolgreich ausgeführt.
- [x] Native Production Guard erfolgreich ausgeführt.

### Unique-Text-Status

| Bereich | Status | Was jetzt unique ist |
|---|---|---|
| Automobil-Keywordseiten | [x] umgesetzt | `auto-fotoshooting`, `bilder-mit-auto`, `fotoshooting-mit-auto`, `auto-fotografieren-tipps` haben eigene Pulltexte, Abschnittstitel, Featuretexte, Zielgruppen-Karten, Galerie-Headlines und Related-Texte. |
| Sportwagen-Keywordseiten | [x] umgesetzt | `motorsport-fotografie` und `motorsport-sportwagen-fotografie` haben eigene Statement-Texte, Shooting-Module, Galerie-/Audience-Texte und Related-Texte. |
| Portrait-Keywordseiten | [x] umgesetzt | `portrait-fotoshooting`, `dating-fotoshooting`, `fotoshooting-gutschein`, `fotoshooting-preise`, `portraitfotografie-beleuchtung`, `paarshooting-familienshooting`, `schwarz-weiss-portrait-fotografie` haben eigene Introtexte, Karten und Ablauf-Schritte. |
| Lokale Seiten Erkrath/Ratingen | [x] umgesetzt | Automobil, Sportwagen, Portrait, Oldtimer, Motorrad und Landschaft haben Ortsbezug in Hero, Kontakt, Clusterlinks und relevanten Mittel-Sektionen. |
| CMS-Feinschliff | [ ] offen | Inhalte sind technisch unique und SEO-tauglich vorbefüllt. Im CMS sollten Tonalität, konkrete Referenzen, Preise und echte Beispiele später noch fachlich finalisiert werden. |

### Duplicate-/Kannibalisierungs-Audit

Der detaillierte Tabellen-Audit liegt in `docs/seo-local-seiten-duplicate-audit.md`.

Kurzstatus nach technischem Check:

- [x] 219 lokale und keywordbasierte SEO-Seiten geprüft.
- [x] 0 doppelte Title gefunden.
- [x] 0 Canonical-Fehler gefunden.
- [x] 26 Seiten haben bereits ausgebaut unique Mittel-Sektionen.
- [ ] 40 Seiten sind noch hochriskant, weil sie zwar eigene URL/Title/Canonical haben, aber im Mittelteil noch zu stark nach Template bzw. Intent-Kopie aussehen.

Wichtigste offene Gruppen:

| Priorität | Gruppe | Warum kritisch | Nächste Aktion |
|---|---|---|---|
| 1 | Hauptseiten `automobil-fotografie.html`, `sportwagen-fotografie.html`, `oldtimer-fotografie.html`, `motorrad-fotografie.html`, `portraitfotografie.html`, `landschaftsfotografie.html` | Sie sind die Cluster-Zentren und dürfen nicht wie austauschbare Basisvarianten wirken. | Je Hauptseite 2-3 stärkere Kernsektionen, klare Abgrenzung zu Unterseiten, FAQ/Use-Cases. |
| 2 | Verkaufs-/Händlerseiten `autohaus-fotografie`, `autoverkauf-fotos`, `oldtimer-verkaufsfotos`, `motorrad-verkaufsfotos` | Sehr nah an bestehenden Fahrzeugseiten, aber anderer kommerzieller Intent. | Eigene Verkaufslogik: Zustand, Inserat, Auktion, Händler-Workflow, Bildliste. |
| 3 | Sportwagen-Varianten `sportwagen-shooting`, `sportwagen-fotoshooting`, `performance-car`, `exotic-car`, `supersportwagen` | Gefahr, dass mehrere Seiten um denselben Sportwagen-Intent konkurrieren. | Klare Rollen definieren oder einzelne Seiten noindex/zusammenlegen, wenn kein eigener Intent bleibt. |
| 4 | Portrait-Businessseiten `business-portrait`, `headshot`, `personal-branding`, `unternehmensportrait`, `pressefoto` | Wirtschaftlich wichtig, aber aktuell zu nah am Portrait-Template. | Eigene Module je Business-Intent, Zielgruppe, Ablauf, FAQ und interne Verlinkung. |
| 5 | Landschaft-/Printseiten `landschaftsbilder-kaufen`, `fine-art-prints`, `wandbilder`, `naturfotografie-prints` | Print-/Kauf-Intent ist anders als Landschaftsfotografie, braucht eigene Beratung. | Material, Format, Raumwirkung, Kaufberatung und Anfrageprozess ausbauen. |

### Noch Nicht Angelegt

Diese Punkte stehen noch offen oder wurden bewusst nicht als eigene Seite umgesetzt.

| Status | Seite / Thema | Empfehlung | Grund |
|---|---|---|---|
| [ ] | `fotograf-erkrath-mettmann.html` | Noch nicht bauen oder nur als sehr schlanke lokale Hubseite | User-Wunsch war: keine neue Kategorie. Stattdessen wurden Erkrath/Mettmann-nahe Seiten unter den bestehenden Familien gestärkt. |
| [ ] | `fotoshooting-duesseldorf.html` | Später als breiter Hub prüfen | Breiter Intent, mehr Konkurrenz. Erst sinnvoll, wenn die spezifischen Seiten Daten sammeln. |
| [ ] | `business-portrait-duesseldorf.html` | Bestehende Seite textlich nachschärfen | Seite existiert, wurde in diesem Worktree aber nicht tief redaktionell überarbeitet. |
| [ ] | `portraitfotografie-duesseldorf.html` | Bestehende Seite weiter ausbauen | Neue Portrait-Keywordseiten sind angelegt; die Hauptseite kann noch stärker als Verteiler arbeiten. |
| [ ] | `oldtimer-fotografie.html` / lokale Varianten | Bestehende Texte nachschärfen | Erkrath/Ratingen sind angelegt, aber Oldtimer-spezifische Copy kann noch stärker auf Sammler, Verkauf, Auktion und Patina gehen. |
| [ ] | `motorrad-fotografie.html` / lokale Varianten | Bestehende Texte nachschärfen | Erkrath/Ratingen sind angelegt, aber Motorrad-Copy kann noch stärker auf Custom Bikes, Biker Portrait und Verkaufsfotos gehen. |
| [ ] | Journal-Artikel `auto-fotografieren-tipps` | Optional später als Blogartikel ergänzen | Aktuell ist `auto-fotografieren-tipps.html` als Clusterseite angelegt, nicht als Journal-Artikel. |
| [ ] | Journal-Artikel `portraitfotografie-beleuchtung` | Optional später als Blogartikel ergänzen | Aktuell ist `portraitfotografie-beleuchtung.html` als Portrait-Clusterseite angelegt, nicht als Journal-Artikel. |
| [ ] | Preis-/Kosten-Ratgeber | Nur vorsichtig bauen | `fotoshooting-preise.html` ist angelegt; ein längerer Ratgeber sollte erst folgen, wenn Preispositionierung final ist. |

### Nächste Sinnvolle Reihenfolge

1. Die neuen Seiten live stellen und in der Google Search Console beobachten.
2. `auto-fotoshooting.html`, `bilder-mit-auto.html` und `fotoshooting-gutschein.html` nach ersten Impressionen weiter ausbauen.
3. `business-portrait-duesseldorf.html` und `portraitfotografie.html` redaktionell schärfen.
4. `oldtimer-fotografie.html` und `motorrad-fotografie.html` mit mehr fachlicher Angebots-Copy stärken.
5. Erst danach über `fotoshooting-duesseldorf.html` oder `fotograf-erkrath-mettmann.html` als breite Hubseiten entscheiden.

## Was Wir Nicht Machen Sollten

Diese Keyword-Bereiche haben Suchvolumen, passen aber nicht zum Angebot oder erzeugen falsche Anfragen:

| Bereich | Beispiele | Entscheidung |
|---|---:|---|
| Tattoo / Zeichnung | `portrait tattoo`, `tattoo portrait`, `scherenschnitt portrait` | Nicht verfolgen |
| Hochzeit / Standesamt / Feier | `fotograf hochzeit preise`, `standesamt fotograf`, `hochzeitsbilder fotograf` | Nicht verfolgen |
| Passfoto / Kita / Schule | `fotograf kita`, `grundschule fotograf`, Passfoto-Intent | Nicht verfolgen |
| Tiere | `katze portrait`, `hundeportraits`, `pferde fotografieren` | Nicht verfolgen |
| Ausbildung / Beruf / Gehalt | `fotograf als beruf`, `gehalt fotograf`, `ausbildung fotograf` | Nicht verfolgen |
| Lexikon / Geschichte | `seit wann gibt es fotografie`, `fotografie erfindung` | Höchstens ignorieren |
| Fremde Orte ohne Bezug | Wien, Sylt, Rodgau, Hennef usw. | Nicht verfolgen |

Warum: Diese Seiten würden zwar eventuell Impressionen bringen, aber sie schwächen die Positionierung und führen zu Anfragen, die du nicht willst.

## Priorität 1: Kleine, Passende SEO-Hebel

Diese Aufgaben passen gut zu einer Domain mit mittlerer Linkstärke und sind realistischer als Shorthead-Keywords.

### 1. Auto Fotoshooting / Bilder Mit Auto

Empfohlene URL: `auto-fotoshooting-duesseldorf.html`  
Status: Neu erstellen oder als sehr starke Unterseite aus dem bestehenden Automobil-Cluster ableiten.  
Cluster-Volumen aus Datei: ca. 2.710  
Wettbewerb: ca. 27 Prozent  
CPC: ca. 1,26 EUR  

Wichtige Keywords:

- `bilder mit autos`
- `bilder mit auto`
- `bilder von autos`
- `auto fotos`
- `fotograf autos`
- `auto fotografieren`
- `auto fotoshooting`
- `fotoshooting auto`
- `fotoshooting mit auto`
- `fotograf für autos`

Warum es sich lohnt:

Das ist sehr nah an deinem eigentlichen Schwerpunkt. Es ist nicht nur “Automobilfotografie” als professioneller Oberbegriff, sondern ein konkreter Suchintent: Menschen wollen Bilder mit oder von ihrem Auto. Das passt zu privaten Besitzern, Sportwagen, Sammlerfahrzeugen, Social Media, Verkauf und emotionalen Fahrzeugserien.

So sollte die Seite aufgebaut sein:

1. Hero: Auto Fotoshooting in Düsseldorf / NRW
2. Abschnitt: Auto alleine fotografieren
3. Abschnitt: Besitzer mit Auto
4. Abschnitt: Paarshooting mit Auto
5. Abschnitt: Sportwagen, Oldtimer, Motorrad als interne Weiterleitung
6. Abschnitt: Location-Ideen in NRW
7. FAQ: Was kostet ein Auto Fotoshooting? Wo findet es statt? Wie lange dauert es? Kann ich mein eigenes Auto mitbringen?
8. CTA: Auto-Shooting anfragen

Wichtig:

Diese Seite darf nicht wie eine generische Automobil-Seite klingen. Sie muss den Suchenden abholen, der “Bilder mit Auto” oder “Auto Fotoshooting” sucht.

### 2. Fotograf Erkrath / Mettmann / Nähe

Empfohlene URL: `fotograf-erkrath-mettmann.html`  
Status: Neue lokale Hubseite oder klare lokale Sektion auf Kontakt/Home plus Google Business Optimierung.  
Cluster-Volumen mit Near-me: ca. 7.580  
Wichtigstes Keyword: `fotograf in meiner nähe`

Warum es sich lohnt:

`fotograf in meiner nähe` hat in der Datei 7.350 Suchvolumen. Darauf rankt man nicht nur mit einer normalen Seite. Das läuft stark über lokale Signale: Google Business Profile, Standort, interne Verlinkung, NAP-Daten, LocalBusiness-Schema, Kontaktseite und echte regionale Relevanz.

Was konkret gemacht werden sollte:

1. Kontaktseite stärker auf Mettmann/Erkrath/Düsseldorf ausrichten.
2. LocalBusiness-Schema prüfen und sauber setzen.
3. Footer/Kontaktbereich mit Arbeitsgebiet Mettmann, Erkrath, Düsseldorf, NRW.
4. Eine glaubwürdige Seite `fotograf-erkrath-mettmann.html` bauen, aber nicht als Keyword-Spam.
5. Auf dieser Seite nicht alle Leistungen flach auflisten, sondern klar: Auto, Motorrad, Oldtimer, Portrait.
6. Google Business Profile mit exakt denselben Leistungsbegriffen stärken.
7. Lokale Bilder/Referenzen einbauen, wenn vorhanden.

Wichtig:

Keine 30 neuen `fotograf-stadt.html`-Seiten erstellen. Du hast schon viele lokale Leistungsseiten. Hier geht es um deinen echten Standort und Near-me-Signale.

### 3. Business Portrait / Personal Branding Bestehende Seite Stärken

Zielseite: `business-portrait-duesseldorf.html`  
Status: Existiert, sollte optimiert werden.  
Cluster-Volumen: ca. 2.300  
Wettbewerb: ca. 11,5 Prozent  
CPC: ca. 2,95 EUR  

Wichtige Keywords:

- `business portrait`
- `business-portrait fotos`
- `fotograf für unternehmen`
- `corporate fotografie`
- `personal brand fotograf`
- `headshot fotografie`
- `bewerbungsbild fotograf`
- `business fotograf in der nähe`

Warum es sich lohnt:

Das ist einer der wirtschaftlich besten Bereiche in der Datei. Der CPC ist hoch, die Konkurrenz laut CSV eher niedrig, und es passt zu hochwertigen Portrait-Shootings. Außerdem kann diese Seite mit relativ wenig neuer Content-Arbeit verbessert werden.

Konkrete Optimierung:

1. Title und H1 auf `Business Portrait Fotograf Düsseldorf` oder ähnlich schärfen.
2. Begriffe `Personal Branding`, `Corporate Fotografie`, `Headshots`, `Unternehmensportrait` sinnvoll integrieren.
3. Klare Abgrenzung: keine Passbilder, sondern professionelle Portraits für Website, LinkedIn, Presse, Team und Marke.
4. FAQ ergänzen:
   - Was ist der Unterschied zwischen Business Portrait und Bewerbungsfoto?
   - Können mehrere Personen fotografiert werden?
   - Gibt es Bilder für Website und LinkedIn?
   - Findet das Shooting outdoor, on location oder in ruhiger Umgebung statt?
5. Interne Links zu Portraitfotografie, Personal Branding, Headshot und Kontakt setzen.

### 4. Portrait Fotoshooting Bestehende Seite Stärken

Zielseite: `portraitfotografie-duesseldorf.html`  
Status: Existiert, sollte erweitert werden.  
Cluster-Volumen: ca. 4.840  
Wettbewerb: ca. 14,8 Prozent  
CPC: ca. 1,21 EUR  

Wichtige Keywords:

- `portrait fotos`
- `foto portrait`
- `portrait-fotoshooting`
- `portrait fotoshooting`
- `portrait shooting`
- `portrait photoshoot`
- `portrait von frauen`
- `fotografie frauen`
- `fotografie mann`
- `portrait outdoor`
- `portrait schwarz weiß`

Warum es sich lohnt:

Portrait ist in der Datei stark vertreten. Gleichzeitig ist viel Müll dabei, vor allem Tattoo, Tiere, Zeichen-/Stencil-Intent. Die bestehende Portraitseite sollte also nicht breiter werden, sondern präziser: echte Shootings, Menschen, ruhige Führung, Outdoor, Schwarz-Weiß, Vintage/Fine-Art, Paare, Familien nur begrenzt.

Konkrete Optimierung:

1. Abschnitt `Portrait Fotoshooting in Düsseldorf / NRW`.
2. Abschnitt `Outdoor Portraits`.
3. Abschnitt `Schwarz-Weiß, Vintage und Fine-Art Portraits`.
4. Abschnitt `Portraits für Frauen, Männer und Paare`.
5. FAQ mit klarer Abgrenzung:
   - Machst du Passbilder? Nein.
   - Machst du Gruppen? Nur begrenzt / nach Anfrage.
   - Kann das Shooting draußen stattfinden?
   - Wie läuft die Bildauswahl ab?
6. Interne Links zu Business Portrait, Dating-Fotoshooting und Kontakt.

### 5. Fotoshooting Gutschein

Empfohlene URL: `fotoshooting-gutschein.html`  
Status: Neu erstellen.  
Cluster-Volumen: ca. 1.850  
Wettbewerb: ca. 23 Prozent  
CPC: ca. 1,31 EUR  

Wichtige Keywords:

- `gutschein fotoshooting`
- `fotoshooting gutschein`
- `gutschein bilder`
- `foto gutschein`
- `fotoshooting geschenk`
- `geschenk fotograf`

Warum es sich lohnt:

Das ist ein klarer Kauf-/Geschenkintent. Die Seite kann saisonal funktionieren und muss nicht extrem lang sein. Sie kann auch mehrere deiner Leistungen bündeln: Portrait, Paar, Auto, Motorrad, Oldtimer.

So sollte die Seite aussehen:

1. Gutschein für Fotoshooting in Düsseldorf / NRW
2. Für welche Shootings geeignet: Portrait, Paar, Auto, Motorrad, Oldtimer
3. Ablauf: Anfrage, Gutschein, Terminabstimmung, Shooting, Bildauswahl
4. Preislogik oder “nach Umfang”
5. FAQ: Ist der Gutschein übertragbar? Wie lange gültig? Kann die beschenkte Person die Shooting-Art wählen?
6. CTA: Gutschein anfragen

Wichtig:

Nicht zu billig positionieren. Ein Gutschein kann hochwertig wirken, nicht wie ein Rabattprodukt.

## Priorität 2: Support-Content Mit Gutem Fit

Diese Inhalte sind nicht die ersten Money-Pages, aber sie helfen, thematische Autorität aufzubauen und interne Links zu stärken.

### 6. Portraitfotografie Beleuchtung

Empfohlene URL: `journal/portraitfotografie-beleuchtung.html`  
Cluster-Volumen: ca. 1.040  
Wettbewerb: ca. 7 Prozent  
CPC: ca. 0,15 EUR  

Wichtige Keywords:

- `portrait fotografie beleuchtung`
- `portrait hintergrund`
- `dokumentarisches portrait`
- `portrait in der dämmerung`

Warum:

Sehr niedrige Konkurrenz, guter Bezug zur Portraitseite, ideal für eigene Bildbeispiele. Das ist kein direkter Sales-Artikel, aber ein guter Support-Artikel.

Empfohlener Inhalt:

1. Natürliches Licht vs. kontrolliertes Licht
2. Warum ruhige Hintergründe Portraits stärker machen
3. Outdoor-Portraits in der Dämmerung
4. Schwarz-Weiß und Schatten
5. Interne Links: Portraitfotografie, Business Portrait, Kontakt

### 7. Auto Fotografieren Tipps

Empfohlene URL: `journal/auto-fotografieren-tipps.html`  
Cluster-Volumen: ca. 240  
Wettbewerb: ca. 19,3 Prozent  
CPC: ca. 0,89 EUR  

Wichtige Keywords:

- `auto fotografieren`
- `autos fotografieren tipps`
- `autos fotografieren`
- `oldtimer fotografieren`
- `professionelle auto fotografie`

Warum:

Das Volumen ist kleiner, aber der Bezug zu deinem Hauptfokus ist stark. Für eine junge Domain ist so ein Artikel realistischer als direkt auf große Fotografen-Keywords zu gehen.

Empfohlener Inhalt:

1. Location wählen
2. Reflexe kontrollieren
3. Licht und Tageszeit
4. Exterieur, Interieur, Details
5. Unterschied zwischen Verkaufsfotos und Editorial
6. CTA zu Auto-Fotoshooting, Oldtimer-Fotografie und Automobilfotografie

### 8. Schwarz-Weiß / Fine-Art Portrait

Empfohlene URL: `schwarz-weiss-portrait-fotografie.html` oder als starker Abschnitt auf Portraitseite  
Cluster-Volumen: ca. 810  
Wettbewerb: ca. 11,6 Prozent  

Warum:

Passt zu hochwertigen, künstlerischen Portraits und kann deine Bildsprache stärken. Es sollte aber nicht zu viele kleine Stilseiten geben. Besser eine starke Seite oder ein starker Abschnitt als mehrere dünne Seiten.

Empfehlung:

Erst als Abschnitt auf der Portraitseite testen. Wenn Google Search Console später Impressionen für Schwarz-Weiß / Vintage / Fine-Art zeigt, eigene Seite bauen.

### 9. Dating / Tinder Fotoshooting

Empfohlene URL: `dating-fotoshooting-duesseldorf.html`  
Cluster-Volumen: ca. 310  
Wettbewerb: ca. 13,5 Prozent  
CPC: ca. 1,55 EUR  

Warum:

Kleiner, aber klarer Intent. Kann gut zu natürlicher Portraitfotografie passen, solange es hochwertig formuliert wird.

Positionierung:

Nicht “Tinder-Bilder billig”, sondern natürliche Portraits für Dating-Profil, Social Media und persönliche Außenwirkung.

## Priorität 3: Bestehende Nischenseiten Nachschärfen

### 10. Oldtimer Fotografie

Zielseite: `oldtimer-fotografie-duesseldorf.html`  
Cluster-Volumen in der CSV: ca. 70  

Warum trotzdem wichtig:

Das Suchvolumen in dieser Datei ist klein, aber der Angebotsfit ist sehr hoch. Die Seite sollte nicht primär Traffic-Magnet sein, sondern Conversion- und Vertrauensseite für Sammler, Verkäufer und Besitzer.

Optimierung:

- `oldtimer fotos`
- `oldtimer fotografieren`
- `oldtimer verkaufsfotos`
- `sammlerfahrzeug`
- `patina`
- `interieur`
- `auktion`
- `inserat`

### 11. Motorrad Fotografie

Zielseite: `motorrad-fotografie-duesseldorf.html`  
Cluster-Volumen in der CSV: ca. 20  

Warum trotzdem wichtig:

Das Thema ist dein Kernangebot. Auch wenn die CSV wenig Volumen zeigt, lohnt sich die Seite strategisch.

Optimierung:

- `motorradfotografie` ohne Bindestrich
- `motorrad shooting`
- `paarshooting motorrad`
- `biker portrait`
- `custom bike fotografie`

### 12. Landschaft / Prints

Zielseite: `landschaftsbilder-kaufen.html`  
Cluster-Volumen: ca. 420  

Empfehlung:

Nicht als Hauptprojekt priorisieren. Bestehende Seiten verbessern, aber keine große Content-Offensive. Sinnvolle Begriffe: `leinwand`, `wandbild`, `fine-art-print`, `landschaft fotografieren`, `fotografie leinwand`.

## Der Richtige Umsetzungsplan

### Sprint 1: Bestehendes Stärken

Ziel: Mit wenig Risiko bessere Relevanz auf vorhandenen Seiten erzeugen.

1. `business-portrait-duesseldorf.html` optimieren.
2. `portraitfotografie-duesseldorf.html` optimieren.
3. `oldtimer-fotografie-duesseldorf.html` leicht nachschärfen.
4. `motorrad-fotografie-duesseldorf.html` leicht nachschärfen.
5. Kontakt/Footer/Schema lokal auf Mettmann/Erkrath/Düsseldorf prüfen.

Warum zuerst:

Diese Seiten existieren schon. Google muss keine komplett neue Struktur verstehen. Für eine Domain mit Backlink-Performance 42 ist das der sauberste erste Schritt.

### Sprint 2: Kleine Neue Seiten Mit Klarem Intent

Ziel: Neue Seiten nur dort, wo der Suchintent wirklich anders ist.

1. `auto-fotoshooting-duesseldorf.html`
2. `fotoshooting-gutschein.html`
3. `fotograf-erkrath-mettmann.html`

Warum:

Diese Seiten haben klare Anfragen-Logik und passen zum Angebot. Besonders Auto-Fotoshooting ist der beste Fit aus der ganzen Keyword-Datei.

### Sprint 3: Support-Artikel

Ziel: Interne Autorität aufbauen, ohne riesige Shorthead-Keywords anzugreifen.

1. `journal/auto-fotografieren-tipps.html`
2. `journal/portraitfotografie-beleuchtung.html`
3. Optional: `journal/fotoshooting-preise-fotograf-kosten.html`

Wichtig:

Jeder Artikel braucht interne Links zu passenden Money-Pages. Sonst ist es nur Blog-Traffic ohne geschäftlichen Effekt.

### Sprint 4: Breiter Hub, Aber Nicht Als Shorthead-Angriff

Empfohlene URL: `fotoshooting-duesseldorf.html`

Diese Seite kann sinnvoll sein, aber nicht mit der Erwartung, kurzfristig auf `fotoshooting` bundesweit zu ranken. Sie sollte als Verteilerseite funktionieren:

- Portrait Fotoshooting
- Auto Fotoshooting
- Motorrad Shooting
- Oldtimer Shooting
- Paarshooting
- Gutschein
- Preise / Ablauf
- Kontakt

Für Google ist das die Seite, die den allgemeinen Shooting-Intent aufnimmt und zu den spezifischen Leistungsseiten weiterführt.

## Empfohlene Reihenfolge

| Reihenfolge | Aufgabe | Typ | Erwartung |
|---:|---|---|---|
| 1 | Business Portrait optimieren | Bestehende Seite | Schnellster B2B-Hebel |
| 2 | Portraitseite optimieren | Bestehende Seite | Mehr Longtail-Abdeckung |
| 3 | Auto-Fotoshooting-Seite bauen | Neue Seite | Bester Angebotsfit |
| 4 | Lokale Mettmann/Erkrath-Signale stärken | Lokal SEO | Wichtig für Near-me |
| 5 | Fotoshooting-Gutschein bauen | Neue Seite | Guter Conversion-Intent |
| 6 | Auto-fotografieren-Tipps schreiben | Support-Artikel | Automotive-Autorität |
| 7 | Portrait-Beleuchtung schreiben | Support-Artikel | Portrait-Autorität |
| 8 | Oldtimer/Motorrad leicht nachschärfen | Bestehende Seiten | Kernangebot stärken |
| 9 | Fotoshooting-Hub bauen | Hub-Seite | Späterer breiter Verteiler |
| 10 | Preis-Artikel prüfen | Support/FAQ | Nur wenn hochwertig formulierbar |

## Wichtigste Entscheidung

Nicht die größten Keywords zuerst.

Für diese Website ist nicht `fotoshooting` der beste erste Angriff, obwohl es das größte Volumen hat. Der bessere erste Angriff ist:

1. `auto fotoshooting`
2. `bilder mit auto`
3. `fotograf autos`
4. `business portrait`
5. `portrait fotoshooting`
6. `fotograf erkrath / mettmann`
7. `fotoshooting gutschein`

Das sind kleinere, klarere Keywords mit besserem Fit. Genau dort kann die Seite schneller Vertrauen aufbauen.


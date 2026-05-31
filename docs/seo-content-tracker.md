# SEO Content Tracker

Quelle: gebaute Seiten (`apps/web/dist/client`) + CMS-Connection-Audit + Content-Scoring aus `apps/cms/content/local-seo-content.json`. Neu berechnen: `node tools/gen-seo-tracker.mjs`.

**Gesamt:** 220 Seiten · CMS-Doc (UPDATE): 158 · ohne Doc (CREATE): 62 · Content geschrieben (✍️): 213

## Scoring-Methodik
- **Q · SEO-Qualität (0–100):** Struktur (Intro 180–760 Z., 2 Statement-Absätze ≥110, ≥4 Audience-Cards, 4 FAQ ≥80) **+ thematische Abdeckung** (SEO-Title 30–70, Description 115–170, Fokus-Keyword im Intro, lokaler Ortsname im Intro bei Stadt-Seiten, echte W-Frage in den FAQ).
- **U · Content-Einzigartigkeit (0–100):** `100 × (1 − max. Prosa-Ähnlichkeit)` (Jaccard über Wort-Trigramme des Fließtexts gegen **alle** Seiten) → erkennt **Duplicate Content**.
- **K · Intent-Trennung / Anti-Kannibalisierung (0–100):** `100 × (1 − max. Ziel-Überlappung)`. Ziel = Title-/Keyword-Tokens **ohne** Marke, **ohne** generische Wörter (fotografie/foto/shooting…) und **ohne** den Ortsnamen — verglichen nur **innerhalb derselben Familie + desselben Ortes** (dort entsteht Kannibalisierung). Niedriges K = zwei Seiten zielen am selben Ort auf denselben Begriff.

**Interpretation — bei allen drei gilt: höher = besser (Skala 0–100).**
- **Qualität:** hoch = Seite ist inhaltlich vollständig + thematisch sauber (Keyword/Ort/FAQ abgedeckt). Niedrig = etwas fehlt oder ist zu kurz.
- **Einzigartigkeit:** hoch = der Text teilt fast nichts mit anderen Seiten (kein Duplicate Content). Niedrig = zu ähnlich zu einer anderen Seite.
- **Kannibalisierungs-Schutz:** hoch = die Seite zielt auf einen eigenen Suchbegriff. Niedrig = sie konkurriert mit einer Schwesterseite um dieselbe Suche (schlecht).
- **Richtwerte:** ≥90 sehr gut · 80–89 gut · 70–79 ok · <70 prüfen. Beim Kannibalisierungs-Schutz ist **<60 ein Warnsignal**.

## Bewertung (213 Seiten im CMS-Content)
- **Ø Qualität 98** · **Ø Einzigartigkeit 95** · **Ø Kannibalisierungs-Schutz 90**
- Qualität<80: 0 · Einzigartigkeit<70: 0 · **Kannibalisierungs-Verdacht (Schutz<60): 21**
- **Doppelte SEO-Titel: 0** ✅

| Familie | Seiten | Ø Qualität | Ø Einzigartigkeit | Ø Kannibalisierungs-Schutz | min Kanni.-Schutz |
|---|---|---|---|---|---|
| automobil | 41 | 97 | 96 | 90 | 0 |
| sportwagen | 36 | 99 | 94 | 84 | 0 |
| oldtimer | 32 | 97 | 95 | 92 | 0 |
| motorrad | 31 | 99 | 95 | 87 | 0 |
| portrait | 44 | 98 | 96 | 90 | 0 |
| landschaft | 29 | 97 | 96 | 94 | 50 |

### Kannibalisierungs-Check
Keine doppelten SEO-Titel. 
**Konkurrierende Paare (gleiche Familie+Ort, niedriges K):**

| Seite | K | konkurriert mit |
|---|---|---|
| `sportwagen-shooting-duesseldorf.html` | 0 | `sportwagen-fotografie-duesseldorf.html` |
| `sportwagen-fotografie-duesseldorf.html` | 0 | `sportwagen-shooting-duesseldorf.html` |
| `oldtimer-fotografie-duesseldorf.html` | 0 | `oldtimer-shooting-duesseldorf.html` |
| `motorrad-fotografie-duesseldorf.html` | 0 | `motorrad-shooting-duesseldorf.html` |
| `portraitfotografie-duesseldorf.html` | 0 | `portrait-fotoshooting-duesseldorf.html` |
| `auto-fotoshooting-duesseldorf.html` | 0 | `fotoshooting-mit-auto-duesseldorf.html` |
| `fotoshooting-mit-auto-duesseldorf.html` | 0 | `auto-fotoshooting-duesseldorf.html` |
| `sportwagen-fotoshooting-duesseldorf.html` | 0 | `sportwagen-shooting-duesseldorf.html` |
| `oldtimer-shooting-duesseldorf.html` | 0 | `oldtimer-fotografie-duesseldorf.html` |
| `motorrad-shooting-duesseldorf.html` | 0 | `motorrad-fotografie-duesseldorf.html` |
| `portrait-fotoshooting-duesseldorf.html` | 0 | `portraitfotografie-duesseldorf.html` |
| `business-portrait-duesseldorf.html` | 50 | `portraitfotografie-duesseldorf.html` |
| `oldtimer-verkaufsfotos-duesseldorf.html` | 50 | `oldtimer-fotografie-duesseldorf.html` |
| `motorrad-verkaufsfotos-duesseldorf.html` | 50 | `motorrad-fotografie-duesseldorf.html` |
| `fine-art-prints-landschaft.html` | 50 | `naturfotografie-prints.html` |

**Intent-Gruppen (Familie × Ort mit mehreren Seiten – jede Gruppe braucht klar getrennte Sub-Intents):**

| Gruppe | Seiten | Sub-Intents (Service) | Ø K |
|---|---|---|---|
| portrait · duesseldorf | 13 | Business Portrait, Headshot Fotograf, Unternehmensportrait, Pressefoto, Portrait Fotografie, Dating Fotoshooting, Fotoshooting Gutschein, Fotoshooting Preise, Paarshooting & Familienshooting, Personal Branding Fotografie, Portrait Fotoshooting, Portraitfotografie Beleuchtung, Schwarz-Weiß Portrait Fotografie | 76 |
| automobil · duesseldorf | 10 | Autohaus Fotografie, Autoverkauf Fotos, Automobil Fotografie, Auto fotografieren – Tipps, Auto-Fotoshooting, Autofotografie, Automotive Fotografie, Bilder mit Auto, Fahrzeugfotografie, Fotoshooting mit Auto | 72 |
| automobil · generic | 8 | Auto-Fotoshooting, Auto fotografieren – Tipps, Autofotografie, Autohaus Fotografie, Automotive Fotografie, Bilder mit Auto, Fahrzeugfotografie, Fotoshooting mit Auto | 83 |
| portrait · generic | 8 | Personal Branding Fotografie, Dating Fotoshooting, Fotoshooting Gutschein, Fotoshooting Preise, Paarshooting & Familienshooting, Portrait Fotoshooting, Portraitfotografie Beleuchtung, Schwarz-Weiß Portrait Fotografie | 86 |
| sportwagen · duesseldorf | 8 | Sportwagen Shooting, Sportwagen Fotografie, Exotic Car Fotografie, Motorsport Fotografie, Motorsport & Sportwagen Fotografie, Performance Car Fotografie, Sportwagen Fotoshooting, Supersportwagen Fotografie | 42 |
| oldtimer · duesseldorf | 6 | Oldtimer Verkaufsfotos, Oldtimer Fotografie, Classic Car Fotografie, Oldtimer Shooting, Sammlerfahrzeug Fotografie, Youngtimer Fotografie | 58 |
| motorrad · duesseldorf | 6 | Motorrad Verkaufsfotos, Motorrad Fotografie, Bike Fotografie, Biker Portrait, Custom Bike Fotografie, Motorrad Shooting | 42 |
| sportwagen · generic | 5 | Performance Car Fotografie, Exotic Car Fotografie, Motorsport Fotografie, Motorsport & Sportwagen Fotografie, Supersportwagen Fotografie | 79 |
| landschaft · generic | 4 | Landschaftsbilder kaufen, Fine-Art-Prints Landschaft, Wandbilder Landschaftsfotografie, Naturfotografie Prints | 66 |
| oldtimer · generic | 3 | Classic Car Fotografie, Sammlerfahrzeug Fotografie, Youngtimer Fotografie | 100 |
| landschaft · deutschland | 2 | Landschaftsfotografie, Landschaftsfotografie Print | 83 |
| motorrad · generic | 2 | Bike Fotografie, Custom Bike Fotografie | 75 |

_Grenze der Metrik: K erkennt gleiche/sehr ähnliche Titel-Ziele am selben Ort. Echte Synonym-Cluster (z. B. „Autofotografie" vs „Automobilfotografie") sind lexikalisch verschieden → über die Intent-Gruppen oben manuell prüfen; dort trennt der Sub-Intent (Shooting/Verkauf/Tipps/Print) die Seiten._

## Validierung der Metrik (Rohdaten / Kontrolltests)
Damit die Zahlen nachvollziehbar sind: berechnet aus echten Texten, jede Zahl reproduzierbar.

**Korpus:** 213 Seiten, zusammen 89.726 Wort-Trigramme (Ø 421/Seite).

**Ähnlichstes echtes Seitenpaar** (niedrigstes U im Korpus): `sportwagen-fotografie-duisburg.html` ↔ `sportwagen-fotografie-erkrath.html`
- `sportwagen-fotografie-duisburg.html`: 367 Trigramme · `sportwagen-fotografie-erkrath.html`: 290 Trigramme · **gemeinsam: 89** → Jaccard 0.157 → **U = 84**
- Beispiel gemeinsamer Trigramme: "lack linien und", "fur sammler handler", "sammler handler marke", "handler marke und", "marke und druck", "speed ohne klischee"

**Kontrolltest 1 — Templating-Erkennung:** Kopie von `automobil-fotografie-koeln.html`, bei der NUR der Ortsname (köln) durch „Stuttgart" ersetzt wurde →
- Ähnlichkeit zum Original 0.893 → **U = 11** (niedrig). Die echte Seite hat **U = 96**.
- ⇒ Wären die Seiten nur orts-getauschte Vorlagen, läge U bei ~11. Dass echte Seiten ~95 erreichen, zeigt: es ist **kein Templating**.

**Kontrolltest 2 — Qualität reagiert:** Eine Stub-Seite (1 Satz Intro, keine FAQ/Cards) bekommt **Q = 6** statt ~98.

**Q-Aufschlüsselung Beispielseite `business-portrait-duesseldorf.html`** (Summe der Teilpunkte = 100):
```
intro       16
statement   14
cards       14
faq         16
title       8
desc        8
kwIntro     8
geoIntro    8
faqIntent   8
```

> Inhalte im CMS (intro/statement/audienceCards/localFaq/seo), Code = Fallback.

## automobil (42)

| Seite | Prefix | Scope | Typ | Copy | FAQ | CMS | ✍️ | Qualität | Einzigartigkeit | Kannibalisierungs-Schutz | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `auto-fotografieren-tipps.html` | auto-fotografieren-tipps | überregional | keyword | rich | — | CREATE | ✅ | 96 | 98 | 83 | DONE |
| `auto-fotografieren-tipps-duesseldorf.html` | auto-fotografieren-tipps | duesseldorf | city | rich | — | CREATE | ✅ | 95 | 98 | 67 | DONE |
| `auto-fotoshooting.html` | auto-fotoshooting | überregional | keyword | rich | — | CREATE | ✅ | 96 | 96 | 67 | DONE |
| `auto-fotoshooting-duesseldorf.html` | auto-fotoshooting | duesseldorf | city | rich | — | CREATE | ✅ | 100 | 96 | 0 | DONE |
| `autofotografie.html` | autofotografie | überregional | keyword | gen | — | CREATE | ✅ | 96 | 98 | 75 | DONE |
| `autofotografie-duesseldorf.html` | autofotografie | duesseldorf | city | gen | — | UPDATE | ✅ | 95 | 97 | 100 | DONE |
| `autohaus-fotografie.html` | autohaus-fotografie | überregional | keyword | gen | — | CREATE | ✅ | 96 | 99 | 100 | DONE |
| `autohaus-fotografie-duesseldorf.html` | autohaus-fotografie | duesseldorf | city | gen | — | UPDATE | ✅ | 92 | 98 | 100 | DONE |
| `automobil-fotografie.html` | automobil-fotografie | Düsseldorf (Parent) | PARENT | gen | ja | CREATE | ⬜ | – | – | – | TODO |
| `automobil-fotografie-bergisch-gladbach.html` | automobil-fotografie | bergisch-gladbach | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `automobil-fotografie-bochum.html` | automobil-fotografie | bochum | city | gen | ja | UPDATE | ✅ | 100 | 96 | 100 | DONE |
| `automobil-fotografie-deutschland.html` | automobil-fotografie | deutschland | city | gen | ja | UPDATE | ✅ | 100 | 96 | 100 | DONE |
| `automobil-fotografie-dormagen.html` | automobil-fotografie | dormagen | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `automobil-fotografie-dortmund.html` | automobil-fotografie | dortmund | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `automobil-fotografie-duesseldorf.html` | automobil-fotografie | duesseldorf | city | gen | ja | UPDATE | ✅ | 100 | 97 | 100 | DONE |
| `automobil-fotografie-duisburg.html` | automobil-fotografie | duisburg | city | gen | ja | UPDATE | ✅ | 100 | 96 | 100 | DONE |
| `automobil-fotografie-erkrath.html` | automobil-fotografie | erkrath | city | gen | ja | CREATE | ✅ | 100 | 95 | 100 | DONE |
| `automobil-fotografie-essen.html` | automobil-fotografie | essen | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `automobil-fotografie-gelsenkirchen.html` | automobil-fotografie | gelsenkirchen | city | gen | ja | UPDATE | ✅ | 92 | 95 | 100 | DONE |
| `automobil-fotografie-hilden.html` | automobil-fotografie | hilden | city | gen | ja | UPDATE | ✅ | 92 | 95 | 100 | DONE |
| `automobil-fotografie-koeln.html` | automobil-fotografie | koeln | city | gen | ja | UPDATE | ✅ | 100 | 96 | 100 | DONE |
| `automobil-fotografie-krefeld.html` | automobil-fotografie | krefeld | city | gen | ja | UPDATE | ✅ | 92 | 96 | 100 | DONE |
| `automobil-fotografie-leverkusen.html` | automobil-fotografie | leverkusen | city | gen | ja | UPDATE | ✅ | 100 | 97 | 100 | DONE |
| `automobil-fotografie-mettmann.html` | automobil-fotografie | mettmann | city | gen | ja | UPDATE | ✅ | 95 | 96 | 100 | DONE |
| `automobil-fotografie-moenchengladbach.html` | automobil-fotografie | moenchengladbach | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `automobil-fotografie-moers.html` | automobil-fotografie | moers | city | gen | ja | UPDATE | ✅ | 92 | 96 | 100 | DONE |
| `automobil-fotografie-neuss.html` | automobil-fotografie | neuss | city | gen | ja | UPDATE | ✅ | 92 | 96 | 100 | DONE |
| `automobil-fotografie-nrw.html` | automobil-fotografie | nrw | city | gen | ja | UPDATE | ✅ | 95 | 96 | 100 | DONE |
| `automobil-fotografie-oberhausen.html` | automobil-fotografie | oberhausen | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `automobil-fotografie-ratingen.html` | automobil-fotografie | ratingen | city | gen | ja | CREATE | ✅ | 100 | 94 | 100 | DONE |
| `automobil-fotografie-remscheid.html` | automobil-fotografie | remscheid | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `automobil-fotografie-solingen.html` | automobil-fotografie | solingen | city | gen | ja | UPDATE | ✅ | 100 | 94 | 100 | DONE |
| `automobil-fotografie-wuppertal.html` | automobil-fotografie | wuppertal | city | gen | ja | UPDATE | ✅ | 95 | 96 | 100 | DONE |
| `automotive-fotografie.html` | automotive-fotografie | überregional | keyword | gen | — | CREATE | ✅ | 91 | 98 | 100 | DONE |
| `automotive-fotografie-duesseldorf.html` | automotive-fotografie | duesseldorf | city | gen | — | UPDATE | ✅ | 95 | 97 | 100 | DONE |
| `autoverkauf-fotos-duesseldorf.html` | autoverkauf-fotos | duesseldorf | city | gen | — | UPDATE | ✅ | 100 | 98 | 100 | DONE |
| `bilder-mit-auto.html` | bilder-mit-auto | überregional | keyword | rich | — | CREATE | ✅ | 96 | 97 | 67 | DONE |
| `bilder-mit-auto-duesseldorf.html` | bilder-mit-auto | duesseldorf | city | rich | — | CREATE | ✅ | 100 | 97 | 50 | DONE |
| `fahrzeugfotografie.html` | fahrzeugfotografie | überregional | keyword | gen | — | CREATE | ✅ | 96 | 97 | 100 | DONE |
| `fahrzeugfotografie-duesseldorf.html` | fahrzeugfotografie | duesseldorf | city | gen | — | UPDATE | ✅ | 95 | 97 | 100 | DONE |
| `fotoshooting-mit-auto.html` | fotoshooting-mit-auto | überregional | keyword | rich | — | CREATE | ✅ | 96 | 97 | 75 | DONE |
| `fotoshooting-mit-auto-duesseldorf.html` | fotoshooting-mit-auto | duesseldorf | city | rich | — | CREATE | ✅ | 100 | 97 | 0 | DONE |

## sportwagen (37)

| Seite | Prefix | Scope | Typ | Copy | FAQ | CMS | ✍️ | Qualität | Einzigartigkeit | Kannibalisierungs-Schutz | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `exotic-car-fotografie.html` | exotic-car-fotografie | überregional | keyword | gen | — | CREATE | ✅ | 88 | 98 | 67 | DONE |
| `exotic-car-fotografie-duesseldorf.html` | exotic-car-fotografie | duesseldorf | city | gen | — | UPDATE | ✅ | 100 | 97 | 67 | DONE |
| `motorsport-fotografie.html` | motorsport-fotografie | überregional | keyword | rich | — | CREATE | ✅ | 96 | 98 | 80 | DONE |
| `motorsport-fotografie-duesseldorf.html` | motorsport-fotografie | duesseldorf | city | rich | — | CREATE | ✅ | 100 | 98 | 50 | DONE |
| `motorsport-sportwagen-fotografie.html` | motorsport-sportwagen-fotografie | überregional | keyword | rich | — | CREATE | ✅ | 96 | 98 | 80 | DONE |
| `motorsport-sportwagen-fotografie-duesseldorf.html` | motorsport-sportwagen-fotografie | duesseldorf | city | rich | — | CREATE | ✅ | 100 | 98 | 50 | DONE |
| `performance-car-fotografie.html` | performance-car-fotografie | überregional | keyword | gen | — | CREATE | ✅ | 96 | 97 | 67 | DONE |
| `performance-car-fotografie-duesseldorf.html` | performance-car-fotografie | duesseldorf | city | gen | — | UPDATE | ✅ | 95 | 98 | 67 | DONE |
| `sportwagen-fotografie.html` | sportwagen-fotografie | Düsseldorf (Parent) | PARENT | gen | ja | CREATE | ⬜ | – | – | – | TODO |
| `sportwagen-fotografie-bergisch-gladbach.html` | sportwagen-fotografie | bergisch-gladbach | city | gen | ja | UPDATE | ✅ | 100 | 96 | 100 | DONE |
| `sportwagen-fotografie-bochum.html` | sportwagen-fotografie | bochum | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `sportwagen-fotografie-deutschland.html` | sportwagen-fotografie | deutschland | city | gen | ja | UPDATE | ✅ | 100 | 96 | 100 | DONE |
| `sportwagen-fotografie-dormagen.html` | sportwagen-fotografie | dormagen | city | gen | ja | UPDATE | ✅ | 100 | 90 | 100 | DONE |
| `sportwagen-fotografie-dortmund.html` | sportwagen-fotografie | dortmund | city | gen | ja | UPDATE | ✅ | 100 | 97 | 100 | DONE |
| `sportwagen-fotografie-duesseldorf.html` | sportwagen-fotografie | duesseldorf | city | gen | ja | UPDATE | ✅ | 100 | 93 | 0 | DONE |
| `sportwagen-fotografie-duisburg.html` | sportwagen-fotografie | duisburg | city | gen | ja | UPDATE | ✅ | 95 | 84 | 100 | DONE |
| `sportwagen-fotografie-erkrath.html` | sportwagen-fotografie | erkrath | city | gen | ja | CREATE | ✅ | 100 | 84 | 100 | DONE |
| `sportwagen-fotografie-essen.html` | sportwagen-fotografie | essen | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `sportwagen-fotografie-gelsenkirchen.html` | sportwagen-fotografie | gelsenkirchen | city | gen | ja | UPDATE | ✅ | 100 | 96 | 100 | DONE |
| `sportwagen-fotografie-hilden.html` | sportwagen-fotografie | hilden | city | gen | ja | UPDATE | ✅ | 100 | 94 | 100 | DONE |
| `sportwagen-fotografie-koeln.html` | sportwagen-fotografie | koeln | city | gen | ja | UPDATE | ✅ | 100 | 93 | 100 | DONE |
| `sportwagen-fotografie-krefeld.html` | sportwagen-fotografie | krefeld | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `sportwagen-fotografie-leverkusen.html` | sportwagen-fotografie | leverkusen | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `sportwagen-fotografie-mettmann.html` | sportwagen-fotografie | mettmann | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `sportwagen-fotografie-moenchengladbach.html` | sportwagen-fotografie | moenchengladbach | city | gen | ja | UPDATE | ✅ | 95 | 92 | 100 | DONE |
| `sportwagen-fotografie-moers.html` | sportwagen-fotografie | moers | city | gen | ja | UPDATE | ✅ | 100 | 92 | 100 | DONE |
| `sportwagen-fotografie-neuss.html` | sportwagen-fotografie | neuss | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `sportwagen-fotografie-nrw.html` | sportwagen-fotografie | nrw | city | gen | ja | UPDATE | ✅ | 100 | 94 | 100 | DONE |
| `sportwagen-fotografie-oberhausen.html` | sportwagen-fotografie | oberhausen | city | gen | ja | UPDATE | ✅ | 100 | 93 | 100 | DONE |
| `sportwagen-fotografie-ratingen.html` | sportwagen-fotografie | ratingen | city | gen | ja | CREATE | ✅ | 100 | 84 | 100 | DONE |
| `sportwagen-fotografie-remscheid.html` | sportwagen-fotografie | remscheid | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `sportwagen-fotografie-solingen.html` | sportwagen-fotografie | solingen | city | gen | ja | UPDATE | ✅ | 100 | 94 | 100 | DONE |
| `sportwagen-fotografie-wuppertal.html` | sportwagen-fotografie | wuppertal | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `sportwagen-fotoshooting-duesseldorf.html` | sportwagen-fotoshooting | duesseldorf | city | gen | — | UPDATE | ✅ | 100 | 96 | 0 | DONE |
| `sportwagen-shooting-duesseldorf.html` | sportwagen-shooting | duesseldorf | city | gen | — | UPDATE | ✅ | 95 | 98 | 0 | DONE |
| `supersportwagen-fotografie.html` | supersportwagen-fotografie | überregional | keyword | gen | — | CREATE | ✅ | 96 | 96 | 100 | DONE |
| `supersportwagen-fotografie-duesseldorf.html` | supersportwagen-fotografie | duesseldorf | city | gen | — | UPDATE | ✅ | 100 | 97 | 100 | DONE |

## oldtimer (33)

| Seite | Prefix | Scope | Typ | Copy | FAQ | CMS | ✍️ | Qualität | Einzigartigkeit | Kannibalisierungs-Schutz | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `classic-car-fotografie.html` | classic-car-fotografie | überregional | keyword | gen | — | CREATE | ✅ | 91 | 97 | 100 | DONE |
| `classic-car-fotografie-duesseldorf.html` | classic-car-fotografie | duesseldorf | city | gen | — | UPDATE | ✅ | 100 | 97 | 100 | DONE |
| `oldtimer-fotografie.html` | oldtimer-fotografie | Düsseldorf (Parent) | PARENT | gen | ja | CREATE | ⬜ | – | – | – | TODO |
| `oldtimer-fotografie-bergisch-gladbach.html` | oldtimer-fotografie | bergisch-gladbach | city | gen | ja | UPDATE | ✅ | 100 | 90 | 100 | DONE |
| `oldtimer-fotografie-bochum.html` | oldtimer-fotografie | bochum | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `oldtimer-fotografie-deutschland.html` | oldtimer-fotografie | deutschland | city | gen | ja | UPDATE | ✅ | 93 | 95 | 100 | DONE |
| `oldtimer-fotografie-dormagen.html` | oldtimer-fotografie | dormagen | city | gen | ja | UPDATE | ✅ | 100 | 94 | 100 | DONE |
| `oldtimer-fotografie-dortmund.html` | oldtimer-fotografie | dortmund | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `oldtimer-fotografie-duesseldorf.html` | oldtimer-fotografie | duesseldorf | city | gen | ja | UPDATE | ✅ | 100 | 92 | 0 | DONE |
| `oldtimer-fotografie-duisburg.html` | oldtimer-fotografie | duisburg | city | gen | ja | UPDATE | ✅ | 95 | 93 | 100 | DONE |
| `oldtimer-fotografie-erkrath.html` | oldtimer-fotografie | erkrath | city | gen | ja | CREATE | ✅ | 92 | 94 | 100 | DONE |
| `oldtimer-fotografie-essen.html` | oldtimer-fotografie | essen | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `oldtimer-fotografie-gelsenkirchen.html` | oldtimer-fotografie | gelsenkirchen | city | gen | ja | UPDATE | ✅ | 100 | 94 | 100 | DONE |
| `oldtimer-fotografie-hilden.html` | oldtimer-fotografie | hilden | city | gen | ja | UPDATE | ✅ | 100 | 94 | 100 | DONE |
| `oldtimer-fotografie-koeln.html` | oldtimer-fotografie | koeln | city | gen | ja | UPDATE | ✅ | 100 | 96 | 100 | DONE |
| `oldtimer-fotografie-krefeld.html` | oldtimer-fotografie | krefeld | city | gen | ja | UPDATE | ✅ | 93 | 95 | 100 | DONE |
| `oldtimer-fotografie-leverkusen.html` | oldtimer-fotografie | leverkusen | city | gen | ja | UPDATE | ✅ | 100 | 93 | 100 | DONE |
| `oldtimer-fotografie-mettmann.html` | oldtimer-fotografie | mettmann | city | gen | ja | UPDATE | ✅ | 100 | 90 | 100 | DONE |
| `oldtimer-fotografie-moenchengladbach.html` | oldtimer-fotografie | moenchengladbach | city | gen | ja | UPDATE | ✅ | 93 | 93 | 100 | DONE |
| `oldtimer-fotografie-moers.html` | oldtimer-fotografie | moers | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `oldtimer-fotografie-neuss.html` | oldtimer-fotografie | neuss | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `oldtimer-fotografie-nrw.html` | oldtimer-fotografie | nrw | city | gen | ja | UPDATE | ✅ | 100 | 97 | 100 | DONE |
| `oldtimer-fotografie-oberhausen.html` | oldtimer-fotografie | oberhausen | city | gen | ja | UPDATE | ✅ | 100 | 94 | 100 | DONE |
| `oldtimer-fotografie-ratingen.html` | oldtimer-fotografie | ratingen | city | gen | ja | CREATE | ✅ | 93 | 95 | 100 | DONE |
| `oldtimer-fotografie-remscheid.html` | oldtimer-fotografie | remscheid | city | gen | ja | UPDATE | ✅ | 93 | 94 | 100 | DONE |
| `oldtimer-fotografie-solingen.html` | oldtimer-fotografie | solingen | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `oldtimer-fotografie-wuppertal.html` | oldtimer-fotografie | wuppertal | city | gen | ja | UPDATE | ✅ | 93 | 94 | 100 | DONE |
| `oldtimer-shooting-duesseldorf.html` | oldtimer-shooting | duesseldorf | city | gen | — | UPDATE | ✅ | 95 | 98 | 0 | DONE |
| `oldtimer-verkaufsfotos-duesseldorf.html` | oldtimer-verkaufsfotos | duesseldorf | city | gen | — | UPDATE | ✅ | 100 | 98 | 50 | DONE |
| `sammlerfahrzeug-fotografie.html` | sammlerfahrzeug-fotografie | überregional | keyword | gen | — | CREATE | ✅ | 89 | 98 | 100 | DONE |
| `sammlerfahrzeug-fotografie-duesseldorf.html` | sammlerfahrzeug-fotografie | duesseldorf | city | gen | — | UPDATE | ✅ | 100 | 98 | 100 | DONE |
| `youngtimer-fotografie.html` | youngtimer-fotografie | überregional | keyword | gen | — | CREATE | ✅ | 96 | 97 | 100 | DONE |
| `youngtimer-fotografie-duesseldorf.html` | youngtimer-fotografie | duesseldorf | city | gen | — | UPDATE | ✅ | 95 | 97 | 100 | DONE |

## motorrad (32)

| Seite | Prefix | Scope | Typ | Copy | FAQ | CMS | ✍️ | Qualität | Einzigartigkeit | Kannibalisierungs-Schutz | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `bike-fotografie.html` | bike-fotografie | überregional | keyword | gen | — | CREATE | ✅ | 96 | 98 | 75 | DONE |
| `bike-fotografie-duesseldorf.html` | bike-fotografie | duesseldorf | city | gen | — | UPDATE | ✅ | 100 | 98 | 50 | DONE |
| `biker-portrait-duesseldorf.html` | biker-portrait | duesseldorf | city | gen | — | UPDATE | ✅ | 100 | 98 | 100 | DONE |
| `custom-bike-fotografie.html` | custom-bike-fotografie | überregional | keyword | gen | — | CREATE | ✅ | 91 | 98 | 75 | DONE |
| `custom-bike-fotografie-duesseldorf.html` | custom-bike-fotografie | duesseldorf | city | gen | — | UPDATE | ✅ | 95 | 97 | 50 | DONE |
| `motorrad-fotografie.html` | motorrad-fotografie | Düsseldorf (Parent) | PARENT | gen | ja | CREATE | ⬜ | – | – | – | TODO |
| `motorrad-fotografie-bergisch-gladbach.html` | motorrad-fotografie | bergisch-gladbach | city | gen | ja | UPDATE | ✅ | 100 | 96 | 100 | DONE |
| `motorrad-fotografie-bochum.html` | motorrad-fotografie | bochum | city | gen | ja | UPDATE | ✅ | 100 | 92 | 100 | DONE |
| `motorrad-fotografie-deutschland.html` | motorrad-fotografie | deutschland | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `motorrad-fotografie-dormagen.html` | motorrad-fotografie | dormagen | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `motorrad-fotografie-dortmund.html` | motorrad-fotografie | dortmund | city | gen | ja | UPDATE | ✅ | 100 | 96 | 100 | DONE |
| `motorrad-fotografie-duesseldorf.html` | motorrad-fotografie | duesseldorf | city | gen | ja | UPDATE | ✅ | 100 | 95 | 0 | DONE |
| `motorrad-fotografie-duisburg.html` | motorrad-fotografie | duisburg | city | gen | ja | UPDATE | ✅ | 100 | 93 | 100 | DONE |
| `motorrad-fotografie-erkrath.html` | motorrad-fotografie | erkrath | city | gen | ja | CREATE | ✅ | 100 | 96 | 100 | DONE |
| `motorrad-fotografie-essen.html` | motorrad-fotografie | essen | city | gen | ja | UPDATE | ✅ | 100 | 92 | 100 | DONE |
| `motorrad-fotografie-gelsenkirchen.html` | motorrad-fotografie | gelsenkirchen | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `motorrad-fotografie-hilden.html` | motorrad-fotografie | hilden | city | gen | ja | UPDATE | ✅ | 100 | 97 | 100 | DONE |
| `motorrad-fotografie-koeln.html` | motorrad-fotografie | koeln | city | gen | ja | UPDATE | ✅ | 100 | 92 | 100 | DONE |
| `motorrad-fotografie-krefeld.html` | motorrad-fotografie | krefeld | city | gen | ja | UPDATE | ✅ | 100 | 92 | 100 | DONE |
| `motorrad-fotografie-leverkusen.html` | motorrad-fotografie | leverkusen | city | gen | ja | UPDATE | ✅ | 100 | 97 | 100 | DONE |
| `motorrad-fotografie-mettmann.html` | motorrad-fotografie | mettmann | city | gen | ja | UPDATE | ✅ | 100 | 97 | 100 | DONE |
| `motorrad-fotografie-moenchengladbach.html` | motorrad-fotografie | moenchengladbach | city | gen | ja | UPDATE | ✅ | 100 | 92 | 100 | DONE |
| `motorrad-fotografie-moers.html` | motorrad-fotografie | moers | city | gen | ja | UPDATE | ✅ | 100 | 92 | 100 | DONE |
| `motorrad-fotografie-neuss.html` | motorrad-fotografie | neuss | city | gen | ja | UPDATE | ✅ | 100 | 94 | 100 | DONE |
| `motorrad-fotografie-nrw.html` | motorrad-fotografie | nrw | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `motorrad-fotografie-oberhausen.html` | motorrad-fotografie | oberhausen | city | gen | ja | UPDATE | ✅ | 100 | 93 | 100 | DONE |
| `motorrad-fotografie-ratingen.html` | motorrad-fotografie | ratingen | city | gen | ja | CREATE | ✅ | 100 | 97 | 100 | DONE |
| `motorrad-fotografie-remscheid.html` | motorrad-fotografie | remscheid | city | gen | ja | UPDATE | ✅ | 100 | 94 | 100 | DONE |
| `motorrad-fotografie-solingen.html` | motorrad-fotografie | solingen | city | gen | ja | UPDATE | ✅ | 100 | 92 | 100 | DONE |
| `motorrad-fotografie-wuppertal.html` | motorrad-fotografie | wuppertal | city | gen | ja | UPDATE | ✅ | 100 | 97 | 100 | DONE |
| `motorrad-shooting-duesseldorf.html` | motorrad-shooting | duesseldorf | city | gen | — | UPDATE | ✅ | 95 | 96 | 0 | DONE |
| `motorrad-verkaufsfotos-duesseldorf.html` | motorrad-verkaufsfotos | duesseldorf | city | gen | — | UPDATE | ✅ | 100 | 98 | 50 | DONE |

## portrait (46)

| Seite | Prefix | Scope | Typ | Copy | FAQ | CMS | ✍️ | Qualität | Einzigartigkeit | Kannibalisierungs-Schutz | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `business-portrait-duesseldorf.html` | business-portrait | duesseldorf | city | rich | ja | UPDATE | ✅ | 100 | 98 | 50 | DONE |
| `dating-fotoshooting.html` | dating-fotoshooting | überregional | keyword | rich | — | CREATE | ✅ | 96 | 98 | 100 | DONE |
| `dating-fotoshooting-duesseldorf.html` | dating-fotoshooting | duesseldorf | city | rich | — | CREATE | ✅ | 100 | 98 | 100 | DONE |
| `fotoshooting-gutschein.html` | fotoshooting-gutschein | überregional | keyword | rich | — | CREATE | ✅ | 96 | 97 | 100 | DONE |
| `fotoshooting-gutschein-duesseldorf.html` | fotoshooting-gutschein | duesseldorf | city | rich | — | CREATE | ✅ | 100 | 97 | 75 | DONE |
| `fotoshooting-preise.html` | fotoshooting-preise | überregional | keyword | rich | — | CREATE | ✅ | 88 | 98 | 67 | DONE |
| `fotoshooting-preise-duesseldorf.html` | fotoshooting-preise | duesseldorf | city | rich | — | CREATE | ✅ | 100 | 98 | 100 | DONE |
| `headshot-fotograf-duesseldorf.html` | headshot-fotograf | duesseldorf | city | rich | ja | UPDATE | ✅ | 100 | 98 | 100 | DONE |
| `paarshooting-familienshooting.html` | paarshooting-familienshooting | überregional | keyword | rich | — | CREATE | ✅ | 96 | 97 | 100 | DONE |
| `paarshooting-familienshooting-duesseldorf.html` | paarshooting-familienshooting | duesseldorf | city | rich | — | CREATE | ✅ | 100 | 97 | 100 | DONE |
| `personal-branding-fotografie.html` | personal-branding-fotografie | überregional | keyword | rich | ja | CREATE | ✅ | 91 | 98 | 100 | DONE |
| `personal-branding-fotografie-duesseldorf.html` | personal-branding-fotografie | duesseldorf | city | rich | ja | UPDATE | ✅ | 100 | 99 | 100 | DONE |
| `portrait-fotoshooting.html` | portrait-fotoshooting | überregional | keyword | rich | — | CREATE | ✅ | 96 | 95 | 67 | DONE |
| `portrait-fotoshooting-duesseldorf.html` | portrait-fotoshooting | duesseldorf | city | rich | — | CREATE | ✅ | 100 | 95 | 0 | DONE |
| `portraitfotografie.html` | portraitfotografie | Düsseldorf (Parent) | PARENT | gen | ja | CREATE | ⬜ | – | – | – | TODO |
| `portraitfotografie-bergisch-gladbach.html` | portraitfotografie | bergisch-gladbach | city | gen | ja | UPDATE | ✅ | 100 | 93 | 100 | DONE |
| `portraitfotografie-bochum.html` | portraitfotografie | bochum | city | gen | ja | UPDATE | ✅ | 95 | 92 | 100 | DONE |
| `portraitfotografie-deutschland.html` | portraitfotografie | deutschland | city | gen | ja | UPDATE | ✅ | 95 | 95 | 100 | DONE |
| `portraitfotografie-dormagen.html` | portraitfotografie | dormagen | city | gen | ja | UPDATE | ✅ | 100 | 96 | 100 | DONE |
| `portraitfotografie-dortmund.html` | portraitfotografie | dortmund | city | gen | ja | UPDATE | ✅ | 95 | 92 | 100 | DONE |
| `portraitfotografie-duesseldorf.html` | portraitfotografie | duesseldorf | city | gen | ja | UPDATE | ✅ | 100 | 94 | 0 | DONE |
| `portraitfotografie-duisburg.html` | portraitfotografie | duisburg | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `portraitfotografie-erkrath.html` | portraitfotografie | erkrath | city | gen | ja | CREATE | ✅ | 100 | 95 | 100 | DONE |
| `portraitfotografie-essen.html` | portraitfotografie | essen | city | gen | ja | UPDATE | ✅ | 100 | 98 | 100 | DONE |
| `portraitfotografie-experience.html` | portraitfotografie | überregional | keyword | gen | ja | CREATE | ⬜ | – | – | – | TODO |
| `portraitfotografie-gelsenkirchen.html` | portraitfotografie | gelsenkirchen | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `portraitfotografie-hilden.html` | portraitfotografie | hilden | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `portraitfotografie-koeln.html` | portraitfotografie | koeln | city | gen | ja | UPDATE | ✅ | 95 | 95 | 100 | DONE |
| `portraitfotografie-krefeld.html` | portraitfotografie | krefeld | city | gen | ja | UPDATE | ✅ | 95 | 95 | 100 | DONE |
| `portraitfotografie-leverkusen.html` | portraitfotografie | leverkusen | city | gen | ja | UPDATE | ✅ | 100 | 92 | 100 | DONE |
| `portraitfotografie-mettmann.html` | portraitfotografie | mettmann | city | gen | ja | UPDATE | ✅ | 100 | 97 | 100 | DONE |
| `portraitfotografie-moenchengladbach.html` | portraitfotografie | moenchengladbach | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `portraitfotografie-moers.html` | portraitfotografie | moers | city | gen | ja | UPDATE | ✅ | 100 | 93 | 100 | DONE |
| `portraitfotografie-neuss.html` | portraitfotografie | neuss | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `portraitfotografie-nrw.html` | portraitfotografie | nrw | city | gen | ja | UPDATE | ✅ | 100 | 94 | 100 | DONE |
| `portraitfotografie-oberhausen.html` | portraitfotografie | oberhausen | city | gen | ja | UPDATE | ✅ | 100 | 96 | 100 | DONE |
| `portraitfotografie-ratingen.html` | portraitfotografie | ratingen | city | gen | ja | CREATE | ✅ | 100 | 92 | 100 | DONE |
| `portraitfotografie-remscheid.html` | portraitfotografie | remscheid | city | gen | ja | UPDATE | ✅ | 100 | 96 | 100 | DONE |
| `portraitfotografie-solingen.html` | portraitfotografie | solingen | city | gen | ja | UPDATE | ✅ | 100 | 92 | 100 | DONE |
| `portraitfotografie-wuppertal.html` | portraitfotografie | wuppertal | city | gen | ja | UPDATE | ✅ | 100 | 94 | 100 | DONE |
| `portraitfotografie-beleuchtung.html` | portraitfotografie-beleuchtung | überregional | keyword | rich | — | CREATE | ✅ | 88 | 98 | 75 | DONE |
| `portraitfotografie-beleuchtung-duesseldorf.html` | portraitfotografie-beleuchtung | duesseldorf | city | rich | — | CREATE | ✅ | 100 | 99 | 100 | DONE |
| `pressefoto-duesseldorf.html` | pressefoto | duesseldorf | city | rich | ja | UPDATE | ✅ | 100 | 99 | 100 | DONE |
| `schwarz-weiss-portrait-fotografie.html` | schwarz-weiss-portrait-fotografie | überregional | keyword | rich | — | CREATE | ✅ | 96 | 98 | 75 | DONE |
| `schwarz-weiss-portrait-fotografie-duesseldorf.html` | schwarz-weiss-portrait-fotografie | duesseldorf | city | rich | — | CREATE | ✅ | 95 | 98 | 67 | DONE |
| `unternehmensportrait-duesseldorf.html` | unternehmensportrait | duesseldorf | city | rich | ja | UPDATE | ✅ | 100 | 99 | 100 | DONE |

## landschaft (30)

| Seite | Prefix | Scope | Typ | Copy | FAQ | CMS | ✍️ | Qualität | Einzigartigkeit | Kannibalisierungs-Schutz | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `fine-art-prints-landschaft.html` | fine-art-prints | überregional | keyword | gen | — | CREATE | ✅ | 91 | 98 | 50 | DONE |
| `landschaftsbilder-kaufen.html` | landschaftsbilder | überregional | keyword | gen | — | CREATE | ✅ | 88 | 98 | 75 | DONE |
| `landschaftsfotografie.html` | landschaftsfotografie | Düsseldorf (Parent) | PARENT | gen | ja | CREATE | ⬜ | – | – | – | TODO |
| `landschaftsfotografie-bergisch-gladbach.html` | landschaftsfotografie | bergisch-gladbach | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `landschaftsfotografie-bochum.html` | landschaftsfotografie | bochum | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `landschaftsfotografie-deutschland.html` | landschaftsfotografie | deutschland | city | gen | ja | UPDATE | ✅ | 100 | 96 | 83 | DONE |
| `landschaftsfotografie-dormagen.html` | landschaftsfotografie | dormagen | city | gen | ja | UPDATE | ✅ | 100 | 94 | 100 | DONE |
| `landschaftsfotografie-dortmund.html` | landschaftsfotografie | dortmund | city | gen | ja | UPDATE | ✅ | 92 | 97 | 100 | DONE |
| `landschaftsfotografie-duesseldorf.html` | landschaftsfotografie | duesseldorf | city | gen | ja | UPDATE | ✅ | 100 | 96 | 100 | DONE |
| `landschaftsfotografie-duisburg.html` | landschaftsfotografie | duisburg | city | gen | ja | UPDATE | ✅ | 95 | 97 | 100 | DONE |
| `landschaftsfotografie-erkrath.html` | landschaftsfotografie | erkrath | city | gen | ja | CREATE | ✅ | 100 | 99 | 100 | DONE |
| `landschaftsfotografie-essen.html` | landschaftsfotografie | essen | city | gen | ja | UPDATE | ✅ | 95 | 97 | 100 | DONE |
| `landschaftsfotografie-gelsenkirchen.html` | landschaftsfotografie | gelsenkirchen | city | gen | ja | UPDATE | ✅ | 100 | 96 | 100 | DONE |
| `landschaftsfotografie-hilden.html` | landschaftsfotografie | hilden | city | gen | ja | UPDATE | ✅ | 100 | 89 | 100 | DONE |
| `landschaftsfotografie-koeln.html` | landschaftsfotografie | koeln | city | gen | ja | UPDATE | ✅ | 100 | 97 | 100 | DONE |
| `landschaftsfotografie-krefeld.html` | landschaftsfotografie | krefeld | city | gen | ja | UPDATE | ✅ | 100 | 87 | 100 | DONE |
| `landschaftsfotografie-leverkusen.html` | landschaftsfotografie | leverkusen | city | gen | ja | UPDATE | ✅ | 100 | 95 | 100 | DONE |
| `landschaftsfotografie-mettmann.html` | landschaftsfotografie | mettmann | city | gen | ja | UPDATE | ✅ | 100 | 96 | 100 | DONE |
| `landschaftsfotografie-moenchengladbach.html` | landschaftsfotografie | moenchengladbach | city | gen | ja | UPDATE | ✅ | 100 | 96 | 100 | DONE |
| `landschaftsfotografie-moers.html` | landschaftsfotografie | moers | city | gen | ja | UPDATE | ✅ | 100 | 97 | 100 | DONE |
| `landschaftsfotografie-neuss.html` | landschaftsfotografie | neuss | city | gen | ja | UPDATE | ✅ | 100 | 97 | 100 | DONE |
| `landschaftsfotografie-nrw.html` | landschaftsfotografie | nrw | city | gen | ja | UPDATE | ✅ | 100 | 87 | 100 | DONE |
| `landschaftsfotografie-oberhausen.html` | landschaftsfotografie | oberhausen | city | gen | ja | UPDATE | ✅ | 100 | 96 | 100 | DONE |
| `landschaftsfotografie-ratingen.html` | landschaftsfotografie | ratingen | city | gen | ja | CREATE | ✅ | 95 | 96 | 100 | DONE |
| `landschaftsfotografie-remscheid.html` | landschaftsfotografie | remscheid | city | gen | ja | UPDATE | ✅ | 100 | 96 | 100 | DONE |
| `landschaftsfotografie-solingen.html` | landschaftsfotografie | solingen | city | gen | ja | UPDATE | ✅ | 92 | 97 | 100 | DONE |
| `landschaftsfotografie-wuppertal.html` | landschaftsfotografie | wuppertal | city | gen | ja | UPDATE | ✅ | 100 | 96 | 100 | DONE |
| `landschaftsfotografie-print-deutschland.html` | landschaftsfotografie-print | deutschland | city | gen | — | UPDATE | ✅ | 92 | 99 | 83 | DONE |
| `naturfotografie-prints.html` | naturfotografie-prints | überregional | keyword | gen | — | CREATE | ✅ | 96 | 97 | 50 | DONE |
| `wandbilder-landschaftsfotografie.html` | wandbilder-landschaftsfotografie | überregional | keyword | gen | — | CREATE | ✅ | 83 | 98 | 88 | DONE |


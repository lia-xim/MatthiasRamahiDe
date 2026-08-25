# Local-SEO Duplicate- und Kannibalisierungs-Audit

Stand: 2026-06-30

Ziel: Alle lokalen Seiten, Keyword-Zusatzseiten und bereits vorhandenen Local-SEO-Varianten werden darauf geprueft, ob sie nur URL-/Ortsvarianten sind oder ob Title, Canonical, H1, Sektionen und Textsignale klar genug auseinanderlaufen.

Quelle: gerenderte SSR-Seiten von `http://localhost:4321`.

## Kurzbefund

- Gepruefte Local-/Keyword-Seiten: 219
- Title-Duplikate: 6
- Canonical-Probleme: 6
- Seiten mit bereits ausgebauten Unique-Sektionen: 189
- Risikoverteilung: niedrig: 210, hoch: 6, mittel-niedrig: 3

Wichtig: Gleiche Layouts sind fuer Clusterseiten nicht automatisch ein Problem. Kritisch wird es erst, wenn Title/H1/Canonical und die sichtbaren Mittel-Sektionen nur minimal variieren. Die Tabelle trennt deshalb zwischen "gleiches Layout, lokale Mitteltexte" und "gleiches Layout + kaum eigene Mitteltexte".

## Sofortige SEO-Regeln

1. Jede indexierbare Seite braucht einen eigenen Canonical auf sich selbst.
2. Jede Seite braucht einen eigenen Title, idealerweise mit Intent und Ort nur dort, wo Ort wirklich der Intent ist.
3. H1 darf im Cluster aehnlich sein, sollte bei Keywordseiten aber mittelfristig den Suchintent nennen.
4. Prioritaetsseiten duerfen nicht nur andere URLs haben. Sie brauchen eigene Mittel-Sektionen, Zielgruppen, Ablauf-/FAQ-Logik und interne Links.
5. Lokale Seiten duerfen das gleiche Grundlayout nutzen, brauchen aber fuer Prioritaetsorte echte Orts-/Projekt-/Logistik-Abschnitte.

## Hohe Risiken Zuerst

| Seite | Familie | Scope | Status | To-do |
|---|---|---|---|---|
| `automobil-fotografie-deutschland.html` | undefined | unbekannt | HTML fehlt | Route/Build pruefen |
| `landschaftsfotografie-deutschland.html` | undefined | unbekannt | HTML fehlt | Route/Build pruefen |
| `motorrad-fotografie-deutschland.html` | undefined | unbekannt | HTML fehlt | Route/Build pruefen |
| `oldtimer-fotografie-deutschland.html` | undefined | unbekannt | HTML fehlt | Route/Build pruefen |
| `portraitfotografie-deutschland.html` | undefined | unbekannt | HTML fehlt | Route/Build pruefen |
| `sportwagen-fotografie-deutschland.html` | undefined | unbekannt | HTML fehlt | Route/Build pruefen |

## Automobil

| Seite | Familie | Scope | Title | Canonical | H1 | Sektionen/Text | Naehe zur Prefix-Basis | Risiko | To-do |
|---|---|---|---|---|---|---|---:|---|---|
| `auto-fotografieren-tipps-duesseldorf.html` | automobil | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 3% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `auto-fotografieren-tipps.html` | automobil | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `auto-fotoshooting-duesseldorf.html` | automobil | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 5% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `auto-fotoshooting.html` | automobil | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `autofotografie-duesseldorf.html` | automobil | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 5% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `autofotografie.html` | automobil | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `autohaus-fotografie-duesseldorf.html` | automobil | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 6% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `autohaus-fotografie.html` | automobil | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `automobil-fotografie-bergisch-gladbach.html` | automobil | Bergisch Gladbach | unique | ok | unique | eigene Sektionstexte | 3% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-bochum.html` | automobil | Bochum | unique | ok | unique | eigene Sektionstexte | 3% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-dormagen.html` | automobil | Dormagen | unique | ok | unique | eigene Sektionstexte | 3% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-dortmund.html` | automobil | Dortmund | unique | ok | unique | eigene Sektionstexte | 3% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-duesseldorf.html` | automobil | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 3% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-duisburg.html` | automobil | Duisburg | unique | ok | unique | eigene Sektionstexte | 3% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-erkrath.html` | automobil | Erkrath | unique | ok | unique | eigene Sektionstexte | 3% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-essen.html` | automobil | Essen | unique | ok | unique | eigene Sektionstexte | 3% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-gelsenkirchen.html` | automobil | Gelsenkirchen | unique | ok | unique | eigene Sektionstexte | 3% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-hilden.html` | automobil | Hilden | unique | ok | unique | eigene Sektionstexte | 3% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-koeln.html` | automobil | Koeln | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-krefeld.html` | automobil | Krefeld | unique | ok | unique | eigene Sektionstexte | 3% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-leverkusen.html` | automobil | Leverkusen | unique | ok | unique | eigene Sektionstexte | 3% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-mettmann.html` | automobil | Mettmann | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-moenchengladbach.html` | automobil | Moenchengladbach | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-moers.html` | automobil | Moers | unique | ok | unique | eigene Sektionstexte | 3% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-neuss.html` | automobil | Neuss | unique | ok | unique | eigene Sektionstexte | 3% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-nrw.html` | automobil | NRW | unique | ok | unique | eigene Sektionstexte | 3% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-oberhausen.html` | automobil | Oberhausen | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-ratingen.html` | automobil | Ratingen | unique | ok | unique | eigene Sektionstexte | 3% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-remscheid.html` | automobil | Remscheid | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-solingen.html` | automobil | Solingen | unique | ok | unique | eigene Sektionstexte | 3% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie-wuppertal.html` | automobil | Wuppertal | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automobil-fotografie.html` | automobil | parent-or-default | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `automotive-fotografie-duesseldorf.html` | automobil | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `automotive-fotografie.html` | automobil | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `autoverkauf-fotos-duesseldorf.html` | automobil | Duesseldorf | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `bilder-mit-auto-duesseldorf.html` | automobil | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 6% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `bilder-mit-auto.html` | automobil | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `fahrzeugfotografie-duesseldorf.html` | automobil | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 5% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `fahrzeugfotografie.html` | automobil | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `fotoshooting-mit-auto-duesseldorf.html` | automobil | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 5% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `fotoshooting-mit-auto.html` | automobil | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |

## Sportwagen

| Seite | Familie | Scope | Title | Canonical | H1 | Sektionen/Text | Naehe zur Prefix-Basis | Risiko | To-do |
|---|---|---|---|---|---|---|---:|---|---|
| `exotic-car-fotografie-duesseldorf.html` | sportwagen | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 15% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `exotic-car-fotografie.html` | sportwagen | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `motorsport-fotografie-duesseldorf.html` | sportwagen | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 17% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorsport-fotografie.html` | sportwagen | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `motorsport-sportwagen-fotografie-duesseldorf.html` | sportwagen | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 18% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorsport-sportwagen-fotografie.html` | sportwagen | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `performance-car-fotografie-duesseldorf.html` | sportwagen | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 13% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `performance-car-fotografie.html` | sportwagen | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `sportwagen-fotografie-bergisch-gladbach.html` | sportwagen | Bergisch Gladbach | unique | ok | unique | eigene Sektionstexte | 11% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-bochum.html` | sportwagen | Bochum | unique | ok | unique | eigene Sektionstexte | 10% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-dormagen.html` | sportwagen | Dormagen | unique | ok | unique | eigene Sektionstexte | 11% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-dortmund.html` | sportwagen | Dortmund | unique | ok | unique | eigene Sektionstexte | 11% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-duesseldorf.html` | sportwagen | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 12% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-duisburg.html` | sportwagen | Duisburg | unique | ok | unique | eigene Sektionstexte | 12% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-erkrath.html` | sportwagen | Erkrath | unique | ok | unique | eigene Sektionstexte | 12% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-essen.html` | sportwagen | Essen | unique | ok | unique | eigene Sektionstexte | 11% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-gelsenkirchen.html` | sportwagen | Gelsenkirchen | unique | ok | unique | eigene Sektionstexte | 11% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-hilden.html` | sportwagen | Hilden | unique | ok | unique | eigene Sektionstexte | 11% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-koeln.html` | sportwagen | Koeln | unique | ok | unique | eigene Sektionstexte | 11% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-krefeld.html` | sportwagen | Krefeld | unique | ok | unique | eigene Sektionstexte | 11% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-leverkusen.html` | sportwagen | Leverkusen | unique | ok | unique | eigene Sektionstexte | 11% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-mettmann.html` | sportwagen | Mettmann | unique | ok | unique | eigene Sektionstexte | 11% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-moenchengladbach.html` | sportwagen | Moenchengladbach | unique | ok | unique | eigene Sektionstexte | 11% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-moers.html` | sportwagen | Moers | unique | ok | unique | eigene Sektionstexte | 11% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-neuss.html` | sportwagen | Neuss | unique | ok | unique | eigene Sektionstexte | 11% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-nrw.html` | sportwagen | NRW | unique | ok | unique | eigene Sektionstexte | 10% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-oberhausen.html` | sportwagen | Oberhausen | unique | ok | unique | eigene Sektionstexte | 11% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-ratingen.html` | sportwagen | Ratingen | unique | ok | unique | eigene Sektionstexte | 11% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-remscheid.html` | sportwagen | Remscheid | unique | ok | unique | eigene Sektionstexte | 11% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-solingen.html` | sportwagen | Solingen | unique | ok | unique | eigene Sektionstexte | 11% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie-wuppertal.html` | sportwagen | Wuppertal | unique | ok | unique | eigene Sektionstexte | 10% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-fotografie.html` | sportwagen | parent-or-default | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `sportwagen-fotoshooting-duesseldorf.html` | sportwagen | Duesseldorf | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sportwagen-shooting-duesseldorf.html` | sportwagen | Duesseldorf | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `supersportwagen-fotografie-duesseldorf.html` | sportwagen | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 15% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `supersportwagen-fotografie.html` | sportwagen | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |

## Oldtimer

| Seite | Familie | Scope | Title | Canonical | H1 | Sektionen/Text | Naehe zur Prefix-Basis | Risiko | To-do |
|---|---|---|---|---|---|---|---:|---|---|
| `classic-car-fotografie-duesseldorf.html` | oldtimer | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 7% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `classic-car-fotografie.html` | oldtimer | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `oldtimer-fotografie-bergisch-gladbach.html` | oldtimer | Bergisch Gladbach | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-bochum.html` | oldtimer | Bochum | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-dormagen.html` | oldtimer | Dormagen | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-dortmund.html` | oldtimer | Dortmund | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-duesseldorf.html` | oldtimer | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 5% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-duisburg.html` | oldtimer | Duisburg | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-erkrath.html` | oldtimer | Erkrath | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-essen.html` | oldtimer | Essen | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-gelsenkirchen.html` | oldtimer | Gelsenkirchen | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-hilden.html` | oldtimer | Hilden | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-koeln.html` | oldtimer | Koeln | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-krefeld.html` | oldtimer | Krefeld | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-leverkusen.html` | oldtimer | Leverkusen | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-mettmann.html` | oldtimer | Mettmann | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-moenchengladbach.html` | oldtimer | Moenchengladbach | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-moers.html` | oldtimer | Moers | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-neuss.html` | oldtimer | Neuss | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-nrw.html` | oldtimer | NRW | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-oberhausen.html` | oldtimer | Oberhausen | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-ratingen.html` | oldtimer | Ratingen | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-remscheid.html` | oldtimer | Remscheid | unique | ok | unique | eigene Sektionstexte | 5% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-solingen.html` | oldtimer | Solingen | unique | ok | unique | eigene Sektionstexte | 5% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie-wuppertal.html` | oldtimer | Wuppertal | unique | ok | unique | eigene Sektionstexte | 5% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-fotografie.html` | oldtimer | parent-or-default | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `oldtimer-shooting-duesseldorf.html` | oldtimer | Duesseldorf | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `oldtimer-verkaufsfotos-duesseldorf.html` | oldtimer | Duesseldorf | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sammlerfahrzeug-fotografie-duesseldorf.html` | oldtimer | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 7% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `sammlerfahrzeug-fotografie.html` | oldtimer | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `youngtimer-fotografie-duesseldorf.html` | oldtimer | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `youngtimer-fotografie.html` | oldtimer | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |

## Motorrad

| Seite | Familie | Scope | Title | Canonical | H1 | Sektionen/Text | Naehe zur Prefix-Basis | Risiko | To-do |
|---|---|---|---|---|---|---|---:|---|---|
| `bike-fotografie-duesseldorf.html` | motorrad | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 10% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `bike-fotografie.html` | motorrad | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `biker-portrait-duesseldorf.html` | motorrad | Duesseldorf | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `custom-bike-fotografie-duesseldorf.html` | motorrad | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 11% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `custom-bike-fotografie.html` | motorrad | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `motorrad-fotografie-bergisch-gladbach.html` | motorrad | Bergisch Gladbach | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-bochum.html` | motorrad | Bochum | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-dormagen.html` | motorrad | Dormagen | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-dortmund.html` | motorrad | Dortmund | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-duesseldorf.html` | motorrad | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-duisburg.html` | motorrad | Duisburg | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-erkrath.html` | motorrad | Erkrath | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-essen.html` | motorrad | Essen | unique | ok | unique | eigene Sektionstexte | 7% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-gelsenkirchen.html` | motorrad | Gelsenkirchen | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-hilden.html` | motorrad | Hilden | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-koeln.html` | motorrad | Koeln | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-krefeld.html` | motorrad | Krefeld | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-leverkusen.html` | motorrad | Leverkusen | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-mettmann.html` | motorrad | Mettmann | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-moenchengladbach.html` | motorrad | Moenchengladbach | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-moers.html` | motorrad | Moers | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-neuss.html` | motorrad | Neuss | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-nrw.html` | motorrad | NRW | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-oberhausen.html` | motorrad | Oberhausen | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-ratingen.html` | motorrad | Ratingen | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-remscheid.html` | motorrad | Remscheid | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-solingen.html` | motorrad | Solingen | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie-wuppertal.html` | motorrad | Wuppertal | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-fotografie.html` | motorrad | parent-or-default | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `motorrad-shooting-duesseldorf.html` | motorrad | Duesseldorf | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `motorrad-verkaufsfotos-duesseldorf.html` | motorrad | Duesseldorf | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |

## Portrait

| Seite | Familie | Scope | Title | Canonical | H1 | Sektionen/Text | Naehe zur Prefix-Basis | Risiko | To-do |
|---|---|---|---|---|---|---|---:|---|---|
| `business-portrait-duesseldorf.html` | portrait | Duesseldorf | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `dating-fotoshooting-duesseldorf.html` | portrait | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 4% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `dating-fotoshooting.html` | portrait | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `fotoshooting-gutschein-duesseldorf.html` | portrait | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 9% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `fotoshooting-gutschein.html` | portrait | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `fotoshooting-preise-duesseldorf.html` | portrait | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 7% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `fotoshooting-preise.html` | portrait | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `headshot-fotograf-duesseldorf.html` | portrait | Duesseldorf | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `paarshooting-familienshooting-duesseldorf.html` | portrait | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `paarshooting-familienshooting.html` | portrait | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `personal-branding-fotografie-duesseldorf.html` | portrait | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 7% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `personal-branding-fotografie.html` | portrait | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `portrait-fotoshooting-duesseldorf.html` | portrait | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 9% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `portrait-fotoshooting.html` | portrait | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `portraitfotografie-beleuchtung-duesseldorf.html` | portrait | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 7% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `portraitfotografie-beleuchtung.html` | portrait | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `portraitfotografie-bergisch-gladbach.html` | portrait | Bergisch Gladbach | unique | ok | unique | gleiches Layout, lokale Mitteltexte | 3% | mittel-niedrig | vorerst okay, erst bei Impressionen weiter individualisieren |
| `portraitfotografie-bochum.html` | portrait | Bochum | unique | ok | unique | ausgebaute Mittel- und FAQ-Sektionen | 3% | niedrig | beobachten, spaeter CMS-Feinschliff |
| `portraitfotografie-dormagen.html` | portrait | Dormagen | unique | ok | unique | ausgebaute Mittel- und FAQ-Sektionen | 3% | niedrig | beobachten, spaeter CMS-Feinschliff |
| `portraitfotografie-dortmund.html` | portrait | Dortmund | unique | ok | unique | ausgebaute Mittel- und FAQ-Sektionen | 3% | niedrig | beobachten, spaeter CMS-Feinschliff |
| `portraitfotografie-duesseldorf.html` | portrait | Duesseldorf | unique | ok | unique | ausgebaute Mittel- und FAQ-Sektionen | 3% | niedrig | beobachten, spaeter CMS-Feinschliff |
| `portraitfotografie-duisburg.html` | portrait | Duisburg | unique | ok | unique | gleiches Layout, lokale Mitteltexte | 3% | mittel-niedrig | vorerst okay, erst bei Impressionen weiter individualisieren |
| `portraitfotografie-erkrath.html` | portrait | Erkrath | unique | ok | unique | ausgebaute Mittel- und FAQ-Sektionen | 2% | niedrig | beobachten, spaeter CMS-Feinschliff |
| `portraitfotografie-essen.html` | portrait | Essen | unique | ok | unique | ausgebaute Mittel- und FAQ-Sektionen | 3% | niedrig | beobachten, spaeter CMS-Feinschliff |
| `portraitfotografie-gelsenkirchen.html` | portrait | Gelsenkirchen | unique | ok | unique | ausgebaute Mittel- und FAQ-Sektionen | 3% | niedrig | beobachten, spaeter CMS-Feinschliff |
| `portraitfotografie-hilden.html` | portrait | Hilden | unique | ok | unique | ausgebaute Mittel- und FAQ-Sektionen | 3% | niedrig | beobachten, spaeter CMS-Feinschliff |
| `portraitfotografie-koeln.html` | portrait | Koeln | unique | ok | unique | ausgebaute Mittel- und FAQ-Sektionen | 3% | niedrig | beobachten, spaeter CMS-Feinschliff |
| `portraitfotografie-krefeld.html` | portrait | Krefeld | unique | ok | unique | ausgebaute Mittel- und FAQ-Sektionen | 3% | niedrig | beobachten, spaeter CMS-Feinschliff |
| `portraitfotografie-leverkusen.html` | portrait | Leverkusen | unique | ok | unique | ausgebaute Mittel- und FAQ-Sektionen | 2% | niedrig | beobachten, spaeter CMS-Feinschliff |
| `portraitfotografie-mettmann.html` | portrait | Mettmann | unique | ok | unique | ausgebaute Mittel- und FAQ-Sektionen | 3% | niedrig | beobachten, spaeter CMS-Feinschliff |
| `portraitfotografie-moenchengladbach.html` | portrait | Moenchengladbach | unique | ok | unique | ausgebaute Mittel- und FAQ-Sektionen | 3% | niedrig | beobachten, spaeter CMS-Feinschliff |
| `portraitfotografie-moers.html` | portrait | Moers | unique | ok | unique | gleiches Layout, lokale Mitteltexte | 3% | mittel-niedrig | vorerst okay, erst bei Impressionen weiter individualisieren |
| `portraitfotografie-neuss.html` | portrait | Neuss | unique | ok | unique | ausgebaute Mittel- und FAQ-Sektionen | 3% | niedrig | beobachten, spaeter CMS-Feinschliff |
| `portraitfotografie-nrw.html` | portrait | NRW | unique | ok | unique | ausgebaute Mittel- und FAQ-Sektionen | 3% | niedrig | beobachten, spaeter CMS-Feinschliff |
| `portraitfotografie-oberhausen.html` | portrait | Oberhausen | unique | ok | unique | ausgebaute Mittel- und FAQ-Sektionen | 3% | niedrig | beobachten, spaeter CMS-Feinschliff |
| `portraitfotografie-ratingen.html` | portrait | Ratingen | unique | ok | unique | ausgebaute Mittel- und FAQ-Sektionen | 2% | niedrig | beobachten, spaeter CMS-Feinschliff |
| `portraitfotografie-remscheid.html` | portrait | Remscheid | unique | ok | unique | ausgebaute Mittel- und FAQ-Sektionen | 3% | niedrig | beobachten, spaeter CMS-Feinschliff |
| `portraitfotografie-solingen.html` | portrait | Solingen | unique | ok | unique | ausgebaute Mittel- und FAQ-Sektionen | 3% | niedrig | beobachten, spaeter CMS-Feinschliff |
| `portraitfotografie-wuppertal.html` | portrait | Wuppertal | unique | ok | unique | ausgebaute Mittel- und FAQ-Sektionen | 3% | niedrig | beobachten, spaeter CMS-Feinschliff |
| `portraitfotografie.html` | portrait | parent-or-default | unique | ok | unique | ausgebaute Mittel- und FAQ-Sektionen | Basis | niedrig | beobachten, spaeter CMS-Feinschliff |
| `pressefoto-duesseldorf.html` | portrait | Duesseldorf | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `schwarz-weiss-portrait-fotografie-duesseldorf.html` | portrait | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 8% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `schwarz-weiss-portrait-fotografie.html` | portrait | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `unternehmensportrait-duesseldorf.html` | portrait | Duesseldorf | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |

## Landschaft

| Seite | Familie | Scope | Title | Canonical | H1 | Sektionen/Text | Naehe zur Prefix-Basis | Risiko | To-do |
|---|---|---|---|---|---|---|---:|---|---|
| `fine-art-prints-landschaft.html` | landschaft | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `landschaftsbilder-kaufen.html` | landschaft | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `landschaftsfotografie-bergisch-gladbach.html` | landschaft | Bergisch Gladbach | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-bochum.html` | landschaft | Bochum | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-dormagen.html` | landschaft | Dormagen | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-dortmund.html` | landschaft | Dortmund | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-duesseldorf.html` | landschaft | Duesseldorf | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-duisburg.html` | landschaft | Duisburg | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-erkrath.html` | landschaft | Erkrath | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-essen.html` | landschaft | Essen | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-gelsenkirchen.html` | landschaft | Gelsenkirchen | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-hilden.html` | landschaft | Hilden | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-koeln.html` | landschaft | Koeln | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-krefeld.html` | landschaft | Krefeld | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-leverkusen.html` | landschaft | Leverkusen | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-mettmann.html` | landschaft | Mettmann | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-moenchengladbach.html` | landschaft | Moenchengladbach | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-moers.html` | landschaft | Moers | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-neuss.html` | landschaft | Neuss | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-nrw.html` | landschaft | NRW | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-oberhausen.html` | landschaft | Oberhausen | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-print-deutschland.html` | landschaft | Deutschland | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-ratingen.html` | landschaft | Ratingen | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-remscheid.html` | landschaft | Remscheid | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-solingen.html` | landschaft | Solingen | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie-wuppertal.html` | landschaft | Wuppertal | unique | ok | unique | eigene Sektionstexte | 0% | niedrig | bei Impressionen 1 lokale Mini-Sektion oder FAQ weiter schaerfen |
| `landschaftsfotografie.html` | landschaft | parent-or-default | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `naturfotografie-prints.html` | landschaft | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |
| `wandbilder-landschaftsfotografie.html` | landschaft | standalone-keyword | unique | ok | unique | eigene Sektionstexte | Basis | niedrig | H1/Headline keywordgenauer setzen, Sektionstexte sind bereits unique |


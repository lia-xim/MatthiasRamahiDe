# Migrationsstrategie

Ziel: die bestehende HTML-Website kontrolliert in Payload ueberfuehren, ohne alte Dateien zu ueberschreiben oder SEO-Strukturen unbedacht zu verlieren.

## Grundregel

Alte URLs bleiben zunaechst 1:1 erreichbar. Eine neue CMS-Seite ersetzt eine Legacy-URL erst, wenn:

1. das Content-Modell fuer diesen Seitentyp stabil ist,
2. die echte Legacy-Kopie in Payload uebertragen wurde,
3. Astro visuell gegen die alte Seite geprueft wurde,
4. Canonical und Sitemap stimmen,
5. Preview und Published-Version funktionieren.

Redirects werden nur gesetzt, wenn eine URL wirklich konsolidiert werden soll. Standard ist URL-Erhalt, nicht pauschale Umleitung.

## Bestandsaufnahme

| Altbestand | Neuer CMS-Typ | Vorgehen |
|---|---|---|
| `index.html` | `site-pages` mit `pageType: home` | Inhalt und Bilddramaturgie als Home-Seite nachbauen. |
| `ueber-mich.html` | `site-pages` mit `pageType: about` | Text, Portrait/Arbeitsweise und Kontaktmodul uebertragen. |
| `contact.html` | `site-pages` mit `pageType: contact` | Kontaktinformationen und Anfragehinweise uebertragen. |
| `impressum.html`, `datenschutz.html` | `site-pages` mit `pageType: legal` | Juristische Texte manuell pruefen und uebertragen. |
| `portfolio.html` | Portfolio-Index + `portfolio-projects` | Erst Struktur, dann echte Serien als Projekte. |
| `floating-archive.html`, `narrative-stage.html`, `experimental-lens.html` | `portfolio-projects` oder Konzeptarchiv | Nur uebernehmen, wenn als echte Projekte gewollt. |
| `blog.html`, `blog-journal.html` | Journal-Index / `site-pages` | Index-Varianten pruefen, eine kanonische Uebersicht festlegen. |
| `blog-*.html` Detailseiten | `journal-posts` | Artikel werden importiert; Titel, Excerpt, Tags, Related Links und Content-Bloecke redaktionell pruefen. |
| `leistungen.html`, `weitere-dienstleistungen.html` | Services-Index / `site-pages` | Eine kanonische Uebersicht definieren. |
| Hauptleistungen, z. B. `automobil-fotografie-duesseldorf.html` | `service-pages` | Als kanonische Service-Seiten pflegen und alte URL als Canonical setzen. |
| Stadt-/Keyword-Seiten, z. B. `automobil-fotografie-koeln.html` | `local-seo-pages` | Erst nach stabilen Hauptseiten migrieren. |
| Bilddateien im Root und `assets/**` | `media` | Kuratieren, nicht blind massenhaft hochladen. |

## Priorisierte Migrationsliste

1. Globals: `site-settings`, `navigation`, `footer`, `global-ctas`.
2. Medien: 20-40 starke Bilder mit Alt-Texten und Moods.
3. Home, Portfolio-Index, Services-Index.
4. Fotografie-Uebersicht und sechs neutrale Fotografie-Hauptseiten: Automobil, Sportwagen, Oldtimer, Motorrad, Portrait, Landschaft.
5. Weitere Services: Fotolabor, Grossformatdruck, Werbetechnik, Webdesign/SEO, Viola, Videografie, Sonderanfertigungen.
6. About, Kontakt, Impressum, Datenschutz.
7. Erste 3-6 Portfolio-Projekte.
8. Journal-Detailseiten.
9. Lokale SEO-Cluster.

## Native-Komponenten-Status

Stand 2026-05-29:

| Seitentyp | Status | Naechster Schritt |
|---|---|---|
| Startseite | Native Astro-Komponente mit Payload-Textbasis und Legacy-Optik | Weiter schrittweise echte CMS-Felder fuer einzelne Teaser/Bildmodule verbinden. |
| Fotografie-Uebersicht | Native Astro-Komponente | Verbleibende drei Detailseiten als naechste Body-Zerlegung. |
| Portfolio-Uebersicht | Native Astro-Komponente | Portfolio-Projekte weiter aus Payload speisen, ohne die aktuelle Galerieoptik zu verlieren. |
| Leistungen-Uebersicht | Native Astro-Komponente | Service-Index mittelfristig aus `service-pages` sortieren. |
| Weitere Service-Seiten | Native Astro-Komponenten fuer sieben Seiten | Texte/Bilder koennen weiter ueber Payload-Dokumente gegen die statische Content-Basis ersetzt werden. |
| Journal-Uebersicht | Native Astro-Komponente mit Payload-Listing-Fallback | Weiter Design-Parity halten, waehrend `journal-posts` redaktionell wachsen. |
| Neue Journal-Routen `/journal/<slug>` | CMS-native Artikelkomponente | ENV `ASTRO_ENABLE_CMS_JOURNAL_ROUTES=true` setzen, wenn die Route live gebaut werden soll. |
| Neue Local-SEO-Routen | CMS-native Local-SEO-Komponente | Alte `.html`-Local-SEO-Routen erst per Opt-in auf dieses Template umlegen. |
| Alte Local-SEO-HTML-Seiten | Bewusste Legacy-Parity | Nach redaktioneller Pruefung optional `ASTRO_ENABLE_NATIVE_LOCAL_SEO_HTML_ROUTES=true`. |
| Sechs Haupt-Fotografie-Detailseiten | `automobil-fotografie.html`, `sportwagen-fotografie.html` und `oldtimer-fotografie.html` sind native Astro-Body-Templates mit Legacy-CSS/JS-Parity; Motorrad, Portrait und Landschaft bleiben noch Legacy-Parity. | Motorrad, Portrait und Landschaft nacheinander nativ extrahieren und per Visual Regression freigeben. |
| About, Kontakt, Legal | Legacy-Parity ueber Astro-Shell | Nach Fotografie-Detailseiten nativ zerlegen. |
| Bestehende `blog-*.html` Detailseiten | Legacy-Parity ueber Astro-Shell | Nach stabiler Journal-Komponente Seite fuer Seite extrahieren. |

## Eingefrorene visuelle Referenz

Die aktuellen Root-HTML-Dateien sind eingefrorene visuelle Wahrheit fuer die Migration. Sie enthalten die letzten Text-, CTA-, Hero-, SEO- und Bildperformance-Aenderungen und werden nicht geloescht oder ueberschrieben.

Der Manifest-Stand wird mit folgendem Befehl aktualisiert:

```powershell
corepack pnpm legacy:freeze
```

Das schreibt `docs/legacy-reference-manifest.json` mit Checksumme, Titel, Description, H1, Canonical, Dateigroesse und Seitentyp fuer alle Root-HTML-Dateien. Der Freeze ersetzt keine visuelle Abnahme, macht aber unbeabsichtigte Legacy-Aenderungen nachvollziehbar.

## Kontrollierter Import-Stand

`corepack pnpm --filter @matthias-ramahi/cms import:legacy` ist der vollstaendige Staging-Import fuer die bestehende Website. Er ueberschreibt keine alten HTML-Dateien, sondern erzeugt oder aktualisiert Payload-Dokumente anhand von Slugs.

Fuer die aktive Produktionsmigration gibt es zusaetzlich den begrenzten Import:

```powershell
corepack pnpm cms:import-adopted
```

Dieser importiert nur die aktuell adoptierten Kern- und Produktionsseiten. Das verhindert, dass lokale SEO-Cluster versehentlich als fertig gelten, bevor ihr Template und ihre redaktionelle Qualitaet stabil sind.

Aktuell werden importiert:

- Medien mit Legacy-Pfad, Alt-Text-Fallback, Kategorie, Mood, Verwendungszweck und Featured-Hinweis.
- `site-pages` fuer Home, Portfolio, Leistungen, About, Kontakt, Blog, Impressum und Datenschutz.
- `service-pages` fuer die kanonischen Leistungsseiten.
- `local-seo-pages` fuer Stadt-/Keyword-Seiten als Entwuerfe.
- `portfolio-categories` und `portfolio-projects` aus der bestehenden Portfolio-Uebersicht.
- `journal-posts` aus Blog-Detailseiten wie `blog-automotive-fotografie-duesseldorf.html`.

Nach jedem Import gilt: Inhalte sind eine Content-Basis, keine finale redaktionelle Freigabe. Der Status `legacy.migrationStatus` bleibt `seeded`, bis ein Mensch Text, Bildauswahl, Alt-Texte, Canonical und Layout-Parity geprueft hat.

Der Import legt bei Standardseiten, Service-Seiten und lokalen SEO-Seiten bereits strukturierte `blocks` aus Ueberschriften, Textabschnitten und Figuren an. Das ersetzt die Legacy-Ausgabe noch nicht automatisch, verhindert aber, dass die Migration langfristig bei grossen HTML-Fragmenten stecken bleibt.

Der aktuelle Freigabestand ist messbar mit:

```powershell
corepack pnpm cms:audit-readiness
corepack pnpm cms:audit-production -- --strict
```

Das Audit trennt Feld-Vollstaendigkeit von Produktionsreife. Ein Dokument ist erst produktionsbereit, wenn die Pflichtfelder vollstaendig sind, der Publish-Status passt und `legacy.migrationStatus` auf `reviewed`, `componentized` oder `live` steht.

Die aktive Produktionsgruppe kann mit einem bewusst engen Script freigegeben werden:

```powershell
corepack pnpm cms:review-adopted -- --write
```

Dieses Script markiert nur die definierte Produktionsseitenliste als `reviewed` und blockiert bei fehlenden Dokumenten, falscher Legacy-Quelle, fehlenden Pflichtfeldern oder nicht veroeffentlichten Inhalten. Stand 2026-05-28 sind 29/29 aktive Produktionsseiten reviewed und der Production-Audit meldet 0 Errors / 0 Warnings.

## URL-Erhalt

Aktuell bleiben alle alten Root-HTML-URLs 1:1 erreichbar. Die Migration ist aber nicht mehr ein Big Bang, sondern in zwei Gruppen geteilt:

- Adoptierte Kernseiten werden ueber `apps/web/src/middleware.ts` intern auf `/native/<slug>` rewritten. Die sichtbare URL bleibt z. B. `/fotografie.html`, `/portfolio.html` oder `/blog-serie-kuratieren.html`, aber Header, Footer, Head/SEO und Payload-Lookup laufen ueber Astro.
- Nicht adoptierte `.html`-Seiten bleiben als statischer Legacy-Fallback erreichbar. Sie sind damit sicher, bis ihr Seitentyp in Astro/Payload wirklich abgenommen ist.
- Neue Payload-Seiten ohne passende Root-HTML-Datei koennen ueber den generischen strukturierten Astro-Renderpfad laufen. Dieser Pfad ist fuer neue Seiten gedacht, nicht fuer ungepruefte 1:1-Ersetzungen.

Die rohe Legacy-Ausgabe ist Test-Baseline unter `/legacy-baseline/<slug>` und sollte nicht als oeffentliche Route verwendet werden.

Wichtig: Der Public-Asset-Sync kopiert keine Root-HTML-Dateien mehr nach `apps/web/public`. Die alten HTML-Dateien bleiben im Projekt-Root unangetastet, aber sie blockieren die Astro-Routen nicht als statische Public-Dateien. Adoptierte Dateien werden auch im Astro-Build nicht mehr ueber `src/pages/[slug].html.ts` prerendered, damit sie zur Laufzeit den Astro/Payload-Renderpfad verwenden.

Aktuell adoptierte oeffentliche URLs:

- `fotografie.html`
- `automobil-fotografie.html`
- `sportwagen-fotografie.html`
- `oldtimer-fotografie.html`
- `motorrad-fotografie.html`
- `portraitfotografie.html`
- `landschaftsfotografie.html`
- `portfolio.html`
- `leistungen.html`
- `contact.html`
- `ueber-mich.html`
- `blog.html`
- `impressum.html`
- `datenschutz.html`
- die sieben weiteren Service-Seiten: `fotolabor-druck-duesseldorf.html`, `grossformatdruck-duesseldorf.html`, `werbetechnik-duesseldorf.html`, `webdesign-seo-duesseldorf.html`, `videografie-duesseldorf.html`, `viola-musik-duesseldorf.html`, `drucke-sonderanfertigungen-duesseldorf.html`
- alle sieben `blog-*.html` Journal-Detailseiten

Fuer migrierte Seiten gilt:

- `seo.canonicalUrl` im CMS auf die bestehende Live-URL setzen, z. B. `https://matthiasramahi.de/automobil-fotografie-duesseldorf.html`.
- Sitemap soll die kanonische URL enthalten.
- Alte `.html`-Datei nicht ueberschreiben.
- Erst nach visueller Freigabe entscheidet man, ob Astro den Body-Abschnitt komplett aus CMS-Komponenten rendert oder ob die Legacy-Body-Struktur noch als Parity-Schicht erhalten bleibt.

Redirects sind nur sinnvoll bei echten Dubletten, z. B. wenn `blog.html` und `blog-journal.html` inhaltlich dasselbe Ziel haben.

Aktueller Redirect:

- `weitere-dienstleistungen.html` -> `/leistungen.html` mit `308`, weil die Leistungen-Uebersicht die kanonische Seite ist.

## Lokale SEO-Seiten

Lokale/keywordbasierte Seiten werden nicht blind als finale oeffentliche Inhalte behandelt. Fuer das aktuelle private Staging sind die importierten Seiten nach Audit freigegeben, damit sie online geprueft werden koennen. Vorgehen fuer weitere Pflege:

1. Haupt-Service-Seite stabilisieren.
2. Lokale Seite als `local-seo-pages` mit echter Stadt-/Regionslogik anlegen.
3. `canonicalServicePage` setzen, wenn die lokale Seite Cluster-Zugehoerigkeit hat.
4. Eigene lokale Einleitung, lokale Proof Points und FAQ pflegen.
5. Interne Links zur Hauptseite und verwandten Services setzen.

Qualitaetsregel: keine Seiten, bei denen nur der Stadtname getauscht wurde.

Technischer Gate:

- `ASTRO_ENABLE_LOCAL_SEO_ADOPTED_ROUTES=true` schaltet die lokale SEO-Familie fuer die Astro/Payload-Adoptionsschicht frei.
- `ASTRO_ENABLE_NATIVE_LOCAL_SEO_HTML_ROUTES=true` ersetzt alte Local-SEO-`.html`-URLs mit dem neuen nativen Local-SEO-Template. Standard bleibt aus, damit die freigegebene Legacy-Parity nicht unbemerkt kippt.
- `cms:approve-private-staging -- --collection=local-seo-pages --write` veroeffentlicht nur vollstaendige Local-SEO-Dokumente fuer privates Staging.
- `cms:audit-production -- --strict` stellt sicher, dass veroeffentlichte lokale SEO-Seiten `reviewed`, SEO-vollstaendig und frei von blockierenden Sprach-/Medienproblemen sind.

## Bildmigration

1. Bestehende Bilder sichten und Dubletten entfernen.
2. Pro Bild festlegen: Kategorie, Orientierung, Mood, Bildtyp, Verwendungszweck.
3. Alt-Text fachlich schreiben, nicht nur Dateiname.
4. Featured-Bilder markieren.
5. Erst danach Seiten mit Medien verknuepfen.

## Visuelle Freigabe

Die Legacy-Ausgabe ist weiterhin die visuelle Wahrheit. Fuer jede Ersetzung gilt:

1. Alte URL und adoptierte Astro-URL in `apps/web/scripts/visual-regression.mjs` aufnehmen.
2. Desktop und Mobile vergleichen.
3. Bekannte neue Soll-Abweichungen dokumentieren, aktuell: SEO-Anpassungen, Bildperformance/optimierte Bilder, groessere CTAs und zentralisiertes Formularsystem.
4. Erst danach eine CMS-Route als Live-Ersatz aktivieren.

Aktueller Pruefstand:

- `corepack pnpm --filter @matthias-ramahi/web test:legacy-routes` prueft alle Root-HTML-URLs auf Status 200, Titel, Header/Footer und kaputte Bilder.
- `corepack pnpm --filter @matthias-ramahi/web test:visual` vergleicht die wichtigsten Seiten gegen die rohe Legacy-Baseline auf Desktop und Mobile.
- Visual Regression nutzt 2% als Zielwert und 5% als harte Fail-Grenze. Ueberschreitungen des Zielwerts werden als Warnung ausgegeben, weil mehrere Legacy-Seiten dynamische JS-/Lazyload-Bildstrecken enthalten.
- Bekannte Soll-Ausnahmen bleiben die vom Nutzer gewuenschten Aenderungen: SEO-Anpassungen, Bildperformance/optimierte Bilder, groessere CTAs und zentralisiertes Formularsystem.
- Stand 2026-05-28: Web- und CMS-Build laufen. Die adoptierten Kernseiten werden nicht mehr als statische Legacy-Kopien prerendered, sondern sind fuer den Astro/Payload-Renderpfad reserviert.
- Stand 2026-05-28: Die aktive Produktionsgruppe ist reviewed, 157 lokale SEO-Seiten sind fuer privates Staging published/reviewed, der Production-Audit ist fehlerfrei, und `production:check` ist der zentrale Release-Befehl fuer die naechste Abnahme.
- Stand 2026-05-29: `automobil-fotografie.html`, `sportwagen-fotografie.html` und `oldtimer-fotografie.html` rendern als native Astro-Komponenten. Visual Regression gegen `/legacy-baseline/*`: Automobil Desktop 1.985%, Mobile 1.705%; Sportwagen Desktop 1.779%, Mobile 0.008%; Oldtimer Desktop 0.003%, Mobile 0.010%. Browser-Smoke: Lightbox und Konsole fehlerfrei; Sportwagen- und Oldtimer-Lightbox wurden durch gesetzte `src`-Attribute fuer `data-src`-Tiles gehaertet.

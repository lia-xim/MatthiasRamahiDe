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
4. Sechs Fotografie-Hauptseiten: Automobil, Sportwagen, Oldtimer, Motorrad, Portrait, Landschaft.
5. Weitere Services: Fotolabor, Grossformatdruck, Werbetechnik, Webdesign/SEO, Viola, Videografie, Sonderanfertigungen.
6. About, Kontakt, Impressum, Datenschutz.
7. Erste 3-6 Portfolio-Projekte.
8. Journal-Detailseiten.
9. Lokale SEO-Cluster.

## Kontrollierter Import-Stand

`corepack pnpm --filter @matthias-ramahi/cms import:legacy` ist jetzt der Staging-Import fuer die bestehende Website. Er ueberschreibt keine alten HTML-Dateien, sondern erzeugt oder aktualisiert Payload-Dokumente anhand von Slugs.

Aktuell werden importiert:

- Medien mit Legacy-Pfad, Alt-Text-Fallback, Kategorie, Mood, Verwendungszweck und Featured-Hinweis.
- `site-pages` fuer Home, Portfolio, Leistungen, About, Kontakt, Blog, Impressum und Datenschutz.
- `service-pages` fuer die kanonischen Leistungsseiten.
- `local-seo-pages` fuer Stadt-/Keyword-Seiten als Entwuerfe.
- `portfolio-categories` und `portfolio-projects` aus der bestehenden Portfolio-Uebersicht.
- `journal-posts` aus Blog-Detailseiten wie `blog-automotive-fotografie-duesseldorf.html`.

Nach jedem Import gilt: Inhalte sind eine Content-Basis, keine finale redaktionelle Freigabe. Der Status `legacy.migrationStatus` bleibt `seeded`, bis ein Mensch Text, Bildauswahl, Alt-Texte, Canonical und Layout-Parity geprueft hat.

Der aktuelle Freigabestand ist messbar mit:

```powershell
corepack pnpm cms:audit-readiness
```

Das Audit trennt Feld-Vollstaendigkeit von Produktionsreife. Ein Dokument ist erst produktionsbereit, wenn die Pflichtfelder vollstaendig sind, der Publish-Status passt und `legacy.migrationStatus` auf `reviewed`, `componentized` oder `live` steht.

## URL-Erhalt

Aktuell bleiben alle alten Root-HTML-URLs 1:1 erreichbar. Astro liefert sie aber nicht mehr roh aus, sondern rewritet sie ueber `apps/web/src/middleware.ts` intern auf die componentized Legacy-Schicht. Dadurch bleibt die sichtbare URL wie `/automobil-fotografie-duesseldorf.html` erhalten, waehrend Header, Footer, Head/SEO und Asset-Pfade zentral in Astro kontrolliert werden.

Die rohe Legacy-Ausgabe ist nur noch Test-Baseline unter `/legacy-baseline/<slug>` und sollte nicht als oeffentliche Route verwendet werden.

Wichtig: Der Public-Asset-Sync kopiert keine Root-HTML-Dateien mehr nach `apps/web/public`. Die alten HTML-Dateien bleiben im Projekt-Root unangetastet, aber sie blockieren die Astro-Routen nicht als statische Public-Dateien.

Fuer migrierte Seiten gilt:

- `seo.canonicalUrl` im CMS auf die bestehende Live-URL setzen, z. B. `https://matthiasramahi.de/automobil-fotografie-duesseldorf.html`.
- Sitemap soll die kanonische URL enthalten.
- Alte `.html`-Datei nicht ueberschreiben.
- Erst nach visueller Freigabe entscheidet man, ob Astro den Body-Abschnitt komplett aus CMS-Komponenten rendert oder ob die Legacy-Body-Struktur noch als Parity-Schicht erhalten bleibt.

Redirects sind nur sinnvoll bei echten Dubletten, z. B. wenn `blog.html` und `blog-journal.html` inhaltlich dasselbe Ziel haben.

Aktueller Redirect:

- `weitere-dienstleistungen.html` -> `/leistungen.html` mit `308`, weil die Leistungen-Uebersicht die kanonische Seite ist.

## Lokale SEO-Seiten

Nicht automatisch alle lokalen/keywordbasierten Seiten importieren. Vorgehen:

1. Haupt-Service-Seite stabilisieren.
2. Lokale Seite als `local-seo-pages` mit echter Stadt-/Regionslogik anlegen.
3. `canonicalServicePage` setzen, wenn die lokale Seite Cluster-Zugehoerigkeit hat.
4. Eigene lokale Einleitung, lokale Proof Points und FAQ pflegen.
5. Interne Links zur Hauptseite und verwandten Services setzen.

Qualitaetsregel: keine Seiten, bei denen nur der Stadtname getauscht wurde.

## Bildmigration

1. Bestehende Bilder sichten und Dubletten entfernen.
2. Pro Bild festlegen: Kategorie, Orientierung, Mood, Bildtyp, Verwendungszweck.
3. Alt-Text fachlich schreiben, nicht nur Dateiname.
4. Featured-Bilder markieren.
5. Erst danach Seiten mit Medien verknuepfen.

## Visuelle Freigabe

Die Legacy-Ausgabe ist weiterhin die visuelle Wahrheit. Fuer jede Ersetzung gilt:

1. Alte URL und componentized URL in `apps/web/scripts/visual-regression.mjs` aufnehmen.
2. Desktop und Mobile vergleichen.
3. Bekannte neue Soll-Abweichungen dokumentieren, aktuell: SEO-Anpassungen, Bildperformance/optimierte Bilder, groessere CTAs und zentralisiertes Formularsystem.
4. Erst danach eine CMS-Route als Live-Ersatz aktivieren.

Aktueller Pruefstand:

- `corepack pnpm --filter @matthias-ramahi/web test:legacy-routes` prueft alle 197 Root-HTML-URLs auf Status 200, Titel, Header/Footer und kaputte Bilder.
- `corepack pnpm --filter @matthias-ramahi/web test:visual` vergleicht die wichtigsten Seiten gegen die rohe Legacy-Baseline auf Desktop und Mobile.
- Bekannte Soll-Ausnahmen bleiben die vom Nutzer gewuenschten Aenderungen: SEO-Anpassungen, Bildperformance/optimierte Bilder, groessere CTAs und zentralisiertes Formularsystem.
- Stand 2026-05-27: Der Routen-Audit ist fuer 197/197 HTML-Routen gruen. Die Visual Regression liegt fuer alle getesteten Seiten unter der 2%-Schwelle; die Home-Baseline nutzt jetzt `/legacy-baseline/`, damit Legacy-JavaScript die Startseite korrekt erkennt.

# Migrationsstrategie

Ziel: die bestehende HTML-Website kontrolliert in Payload überführen, ohne alte Dateien zu überschreiben oder SEO-Strukturen unbedacht zu verlieren.

## Bestandsaufnahme

Im Root liegen aktuell viele statische `.html`-Dateien. Grobe Zuordnung:

| Altbestand | Neuer CMS-Typ | Vorgehen |
|---|---|---|
| `index.html` | `site-pages` mit `pageType: home` | Inhalt und Bilddramaturgie als Home-Seite nachbauen. |
| `ueber-mich.html` | `site-pages` mit `pageType: about` | Text, Portrait/Arbeitsweise und Kontaktmodul übertragen. |
| `contact.html` | `site-pages` mit `pageType: contact` | Kontaktinformationen und Anfragehinweise übertragen. |
| `impressum.html`, `datenschutz.html` | `site-pages` mit `pageType: legal` | Juristische Texte manuell prüfen und übertragen. |
| `portfolio.html` | `site-pages` oder Portfolio-Index + `portfolio-projects` | Erst Struktur, dann echte Serien als Projekte. |
| `floating-archive.html`, `narrative-stage.html`, `experimental-lens.html` | `portfolio-projects` oder Konzeptarchiv | Nur übernehmen, wenn als echte Projekte gewollt. |
| `blog.html`, `blog-journal.html`, `blog-automotive-fotografie-duesseldorf.html` | `journal-posts` | Duplikate prüfen, kanonischen Beitrag festlegen. |
| `leistungen.html`, `weitere-dienstleistungen.html` | `site-pages` oder Services-Index | Eine kanonische Übersicht definieren. |
| Hauptleistungen, z. B. `automobil-fotografie-duesseldorf.html` | `service-pages` | Als kanonische Service-Seiten pflegen. |
| Stadt-/Keyword-Seiten, z. B. `automobil-fotografie-koeln.html` | `local-seo-pages` | Erst nach stabilen Hauptseiten migrieren. |
| Bilddateien im Root und `assets/**` | `media` | Kuratieren, nicht blind massenhaft hochladen. |

## Priorisierte Migrationsliste

1. Globals: `site-settings`, `navigation`, `footer`, `global-ctas`.
2. Medien: 20-40 starke Bilder mit Alt-Texten und Moods.
3. Home, Portfolio-Index, Services-Index.
4. Sechs Fotografie-Hauptseiten: Automobil, Sportwagen, Oldtimer, Motorrad, Portrait, Landschaft.
5. Weitere Services: Fotolabor, Großformatdruck, Werbetechnik, Webdesign/SEO, Viola, Videografie, Sonderanfertigungen.
6. About, Kontakt, Impressum, Datenschutz.
7. Erste 3-6 Portfolio-Projekte.
8. Journal.
9. Lokale SEO-Cluster.

## URL-Erhalt

Die Astro-App rendert Service-Seiten zusätzlich über Root-Slugs, z. B.:

```text
/portraitfotografie-duesseldorf
/automobil-fotografie-duesseldorf
```

Damit können alte `.html`-URLs später serverseitig auf die slashlosen Astro-Routen weitergeleitet werden.

Empfohlene Redirects:

```text
/portraitfotografie-duesseldorf.html -> /portraitfotografie-duesseldorf
/portfolio.html -> /portfolio
/blog.html -> /journal
/contact.html -> /kontakt
```

Bei Seiten, die im Suchindex bereits stark sind, Redirects erst nach manueller Inhaltsprüfung setzen.

## Lokale SEO-Seiten

Nicht automatisch alle 167 lokalen/keywordbasierten Seiten importieren. Vorgehen:

1. Haupt-Service-Seite stabilisieren.
2. Lokale Seite als `local-seo-pages` mit echter Stadt-/Regionslogik anlegen.
3. `canonicalServicePage` setzen.
4. Eigene lokale Einleitung, lokale Proof Points und FAQ pflegen.
5. Interne Links zur Hauptseite und verwandten Services setzen.

Qualitätsregel: keine Seiten, bei denen nur der Stadtname getauscht wurde.

## Bildmigration

1. Bestehende Bilder sichten und Dubletten entfernen.
2. Pro Bild festlegen: Kategorie, Orientierung, Mood, Bildtyp, Verwendungszweck.
3. Alt-Text fachlich schreiben, nicht nur Dateiname.
4. Featured-Bilder markieren.
5. Erst danach Seiten mit Medien verknüpfen.

## Import-Script erst später

Ein automatischer HTML-Import ist erst sinnvoll, wenn diese drei Dinge stabil sind:

- finale Collections/Felder,
- finale URL-Strategie,
- mindestens ein manuell migriertes Beispiel pro Seitentyp.

Bis dahin ist manuelle Migration sicherer.

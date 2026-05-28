# CMS Editor Hardening

Stand: 2026-05-28

## Editor-Erlebnis

- Seiten, Portfolio, Journal und lokale SEO-Seiten sind in Basis, Bilder, Inhalt und Advanced organisiert.
- Die Payload-Seitenleiste folgt der Website-Struktur: Website, Portfolio, Journal, SEO, Medien, globale Inhalte und System.
- Technische API-URLs sind in den Edit-Views ausgeblendet; die Listen sind auf redaktionelle Suchfelder wie Titel, Slug, Kategorie, SEO-Daten, Tags und Legacy-Quelle erweitert.
- Globale Inhalte sind in Tabs gegliedert: Navigation nach Header/Fotografie-Menue/Weitere Links, Site Settings nach Basis/Kontakt/SEO Defaults, CTAs nach Button/Kontaktmodul und Footer nach Basis/Linkspalten/Social & Rechtliches.
- Bildwechsel liegen bewusst im Bilder-Tab; Media-Beziehungen erlauben Create/Edit im Drawer.
- Medien sind in Basis, Advanced und Technik organisiert. Uploads setzen Titel, Alt-Text, Kategorie und Standard-Verwendungszweck automatisch vor.
- Listenansichten zeigen relevantere Spalten wie Cover/Hero, Slug, Status, Kategorie und Update-Datum.
- Preview-URLs werden pro relevanter Collection aus `PREVIEW_SECRET` gebaut.
- Publish wird serverseitig blockiert, wenn Pflichtfelder fehlen.
- SEO-Titel, Meta-Beschreibung, Canonical, Social-Bild, Journal-Datum, Lesezeit und einige redaktionelle Defaults werden beim Speichern automatisch ergaenzt, solange kein manueller Override gesetzt ist.
- URL-Slugs normalisieren deutsche Umlaute redaktionell lesbar, z. B. `Ueber mich` zu `ueber-mich`.

## Publish-Regeln

Vor dem Publish muessen diese Felder gefuellt sein:

- Titel
- Slug
- SEO-Titel
- Meta-Beschreibung
- je nach Collection: Cover/Hero, Kategorie, Intro, Excerpt oder Published Date
- bei Medien: Bildtitel und Alt-Text

Entwuerfe duerfen unvollstaendig bleiben. Die harte Pruefung greift erst bei `_status: published`.

## Bildsystem

- Payload erzeugt fuer neue Uploads WebP- und AVIF-Derivate.
- Crop und Focal Point sind aktiv.
- Lokale Uploads werden um Orientierung, dominante Farbe und Blur/LQIP-Placeholder ergaenzt.
- Neue Uploads koennen sofort als Ersatzbilder genutzt werden; Titel und Alt-Text werden aus dem Dateinamen vorbelegt und koennen danach redaktionell verfeinert werden.
- Bildfelder in Seiten, Services, lokalen SEO-Seiten, Portfolio und Journal liegen gesammelt im Bilder-Tab. Galerie- und Sequenzbilder nutzen dieselbe Media-Auswahl mit klarer Rolle und Caption.
- Der SEO/Image-Audit prueft OG-Bild, Hero/Cover/Teaser, Portfolio-Galerien und Image-Sequence-Bloecke auf Alt-Text, Blur/LQIP und Focal Point.
- `ResponsiveImage` rendert ein `<picture>` mit AVIF/WebP, `srcset`, `sizes`, Lazy Loading und Focal-Point-Position.
- Das Frontend faellt nicht mehr automatisch auf Originaldateien zurueck.
- `LoadMoreGallery` begrenzt grosse Galerien initial und laedt weitere Bilder per Button nach.

## SEO und Preview

- `robots.txt` wird erzeugt und sperrt `/preview/`.
- `sitemap.xml` kombiniert Legacy-HTML-URLs und veroeffentlichte Payload-Dokumente.
- `sitemap-images.xml` nimmt CMS-Bilder aus OG, Hero/Cover/Teaser, Portfolio-Galerien und Image-Sequence-Bloecken auf.
- Canonicals kommen aus `seo.canonicalUrl`; relative Canonicals werden absolut gemacht.
- Slug, SEO-Titel, Meta-Beschreibung, Canonical, Social-Bild, Fokus-Keyword, Suchintention und interne Anchor-Ideen koennen automatisch vorbelegt werden.
- Linkfelder normalisieren interne Links, erkennen eigene Domain-URLs, unterstuetzen `nofollow`, `sponsored`, `ugc` und setzen externe Links im Frontend mit sicheren `target`/`rel`-Attributen.
- JSON-LD ist vorbereitet fuer LocalBusiness, Breadcrumbs, Article und Service.
- Preview ist immer `noindex` und zeigt eine Toolbar mit Draft/Published-Status und Live-Link.

## Audits und SEO-Harness

- `corepack pnpm cms:audit-readiness` prueft redaktionelle Pflichtfelder.
- `corepack pnpm cms:audit-seo` prueft SEO-Laengen, Canonicals, interne/externe Links und Bild-Metadaten.
- `corepack pnpm cms:suggest-seo -- --collection=service-pages --slug=...` erzeugt SEO-Vorschlaege als Dry-Run. Mit `--write` wird gespeichert, mit `--overwrite` werden bestehende Felder ersetzt.
- Der Harness laeuft ohne LLM deterministisch. Optional kann ein OpenAI-kompatibler Endpoint (`SEO_LLM_BASE_URL`, `SEO_LLM_API_KEY`, `SEO_LLM_MODEL`) oder ein lokales CLI (`SEO_LLM_COMMAND`, `SEO_LLM_ARGS`) JSON-Vorschlaege liefern.
- Die Audit-Scripts schreiben nicht in die DB. Wenn Code und Datenbankschema auseinanderlaufen, melden sie einen klaren Schema-Hinweis statt eines langen Stacktraces.

## Schema und Migrationen

- `PAYLOAD_DB_PUSH=false` bleibt der sichere Standard fuer bestehende Datenbanken.
- Nach Feld-/Collection-Aenderungen muessen zuerst Payload-Migrationen bzw. ein geplanter Schema-Sync laufen, danach Audits gegen die echte Content-DB.
- Neue Scripts: `corepack pnpm cms:migrate:create -- seo-links-images`, `corepack pnpm cms:migrate:status`, `corepack pnpm cms:migrate`.
- Die erzeugte Migrationsdatei muss vor dem Live-Lauf in Staging geprueft und mit den tatsaechlichen Schema-Aenderungen befuellt werden.
- Fuer lokale Wegwerf-Tests kann eine frische SQLite-Datei mit `PAYLOAD_DB_PUSH=true` genutzt werden. Nicht gegen eine bestehende Content-DB blind pushen.

## Legacy-Content-Basis

- `import:legacy` importiert die bestehenden HTML-Seiten als redaktionelle Startbasis.
- Journal-Detailseiten werden als `journal-posts` mit Cover, Excerpt, Tags, Related Links, Lesezeit, SEO und Content-Bloecken angelegt.
- Der Legacy-Tab speichert Quelle, alte URL, extrahierte Ueberschriften, Bildpfade und Text als Kontrollbasis.
- Importierte Dokumente bleiben fachlich zu pruefen; der Import ersetzt keine visuelle Freigabe.
- Oeffentliche Legacy-URLs werden in Astro ueber die componentized Legacy-Schicht gerendert; die rohe Ausgabe dient nur noch als Visual-Regression-Baseline.
- Der Route-Audit `test:legacy-routes` prueft alle alten `.html`-URLs auf Status, Head, Header/Footer und defekte Bilder.

## Deployment-Dateien

- `deploy/production.env.example`
- `deploy/compose.hetzner.yml`
- `deploy/Caddyfile.example`
- `deploy/backup-postgres-media.sh`
- `deploy/rebuild-astro.sh`
- `deploy/rebuild-webhook.mjs`
- `apps/cms/Dockerfile`
- `apps/web/Dockerfile`

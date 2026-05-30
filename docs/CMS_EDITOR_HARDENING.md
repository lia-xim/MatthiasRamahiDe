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
- Publish wird zusaetzlich blockiert, wenn verknuepfte Hero-, Cover-, OG-, Galerie- oder Bildsequenz-Medien keinen Alt-Text haben.
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
- `corepack pnpm cms:audit-production -- --strict` prueft die aktive Produktionsgruppe und alle veroeffentlichten Release-Dokumente: published, reviewed, Legacy-Quelle, Render-Quelle, Canonical/SEO, Medienpflichtfelder und Studio-Sprachreste.
- `corepack pnpm cms:audit-seo` prueft SEO-Laengen, Canonicals, interne/externe Links und Bild-Metadaten.
- `corepack pnpm cms:review-adopted -- --write` markiert nur die aktiv adoptierten, feldvollstaendigen Kernseiten als `reviewed`.
- `corepack pnpm cms:review-portfolio` markiert die strukturierten Portfolio-Basisprojekte und Kategorien als `reviewed` / `structured-blocks`.
- `corepack pnpm cms:harden-seo` staerkt kurze SEO-Basistexte fuer Portfolio, Kategorien und zentrale Uebersichts-/Legal-Seiten.
- `corepack pnpm cms:sanitize-studio-language` bereinigt alte Studio-Sprache in Globals und importierten Dokumenten.
- `corepack pnpm cms:approve-private-staging -- --collection=local-seo-pages` prueft Draft-Gruppen als Dry-Run; mit `--write` werden nur vollstaendige, auditierbare Dokumente fuer privates Staging veroeffentlicht.
- `corepack pnpm cms:schema-push-local` repariert bekannte lokale SQLite-Schema-Drifts. Nicht fuer Postgres/Produktion verwenden.
- `corepack pnpm production:check` fuehrt den kombinierten Release-Check fuer CMS-Audit, SEO-Audit, Web/CMS-Build, eigene Astro-Preview, Legacy-Routen und Visual Regression aus.
- `cms:build` blockiert, wenn lokal noch ein Payload/Next-Server auf Port 3000 laeuft. Das verhindert stale `.next`-Assets und den typischen Admin-ohne-CSS-Zustand nach einem Build im laufenden Dev-Server.
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
- Oeffentliche alte `.html`-URLs werden in Astro ueber native Komponenten, den Local-SEO-Family-Renderer oder strukturierte CMS-Renderer ausgegeben. Die rohe Ausgabe dient nur noch als externe Visual-Regression-Referenz aus `legacy-reference/html` und ist kein App-Renderpfad mehr.
- Der Route-Audit `test:legacy-routes` prueft alle alten `.html`-URLs auf Status, Head, Header/Footer und defekte Bilder.
- Neue Payload-Seiten ohne Legacy-Datei koennen ueber `ASTRO_ENABLE_CMS_DYNAMIC_ROUTES` bereits nativ aus strukturierten Feldern rendern.
- Lokale SEO-Seiten koennen mit `ASTRO_ENABLE_LOCAL_SEO_ADOPTED_ROUTES=true` kontrolliert in die Astro/Payload-Adoptionsschicht wechseln. Fuer das aktuelle private Staging ist dieser Schalter aktiv; fuer oeffentliche Launches kann er wieder auf `false` gesetzt werden, bis einzelne Seiten final gegenlesen sind.

## Deployment-Dateien

- `deploy/production.env.example`
- `deploy/compose.hetzner.yml`
- `deploy/Caddyfile.example`
- `deploy/backup-postgres-media.sh`
- `deploy/rebuild-astro.sh`
- `deploy/rebuild-webhook.mjs`
- `apps/cms/Dockerfile`
- `apps/web/Dockerfile`

# Journal: Source of Truth und Publishing

## Eine Quelle fuer Tina, Agenten und Website

Jeder Beitrag liegt als strukturierte JSON-Datei unter
`apps/web/content/journal-posts/*.json`. Diese Dateien sind die einzige
redaktionelle Source of Truth. Tina bearbeitet dieselben Dokumente; die Website
liest Titel, Textbloecke, Bilder, SEO-Felder, Tags, Datum und Links direkt daraus.
Es gibt keine zweite handgeschriebene Artikelkopie in TypeScript oder HTML.

Ein Agent kann deshalb einen Beitrag lokal aendern, die Audits ausfuehren und die
Datei normal committen. Alternativ kann Matthias denselben Beitrag im Tina-Bereich
`Journal` bearbeiten. Der Tina-Publish-Button synchronisiert die Content-Dateien
in den Git-Branch `main`; der anschliessende Vercel-Deploy veroeffentlicht sie.

## Lokal bearbeiten

1. Eine vorhandene JSON-Datei unter `apps/web/content/journal-posts` bearbeiten
   oder fuer einen neuen Beitrag kopieren.
2. Fuer sichtbare Inhalte typisierte `blocks` verwenden: `textBlock`,
   `imageSequence`, `quoteBlock`, `faqBlock`, `linkList` oder `ctaBlock`.
3. Hero und Social-Bild bewusst waehlen. Bilder im Artikel gehoeren in
   `imageSequence`; Bildunterschriften beschreiben das konkrete Motiv.
4. `relatedPages` verbindet den Beitrag mit der passenden Leistung. Weitere
   Journal-Empfehlungen berechnet die Website automatisch aus Kategorie und Tags.
5. Den Wert aus `seo.legacyUrl` in `apps/web/src/lib/adoptedRoutes.ts` unter
   `adoptedLegacyFiles` registrieren. Erst dadurch wird die `.html`-URL von der
   nativen Journal-Route erkannt und in die Sitemap aufgenommen.
6. Pruefen:

   ```powershell
   corepack pnpm journal:audit
   corepack pnpm web:audit:tina-content -- --strict
   corepack pnpm web:build
   corepack pnpm seo:audit:strict
   ```

## Publikationsstatus und Datum

- `status: "draft"` blendet einen Beitrag aus.
- `status: "scheduled"` plant eine automatische Freischaltung. Setze `publishedAt`
  auf den genauen Zeitpunkt mit Zeitzone, zum Beispiel `2026-11-09T08:00:00Z`.
  Der Beitrag bleibt bis dahin aus Journal, Startseite, internen Empfehlungen,
  Artikelroute und Sitemap ausgeblendet. Nach dem Zeitpunkt wird er beim naechsten
  Seitenaufruf sichtbar; ein eigener Deploy pro Beitrag ist nicht erforderlich.
- `status: "published"` macht einen Beitrag sofort sichtbar, sofern `publishedAt`
  nicht in der Zukunft liegt.
- `publishedAt` bestimmt Reihenfolge und sichtbares Publikationsdatum. Fuer geplante
  Beitraege sollte `updatedAt` ebenfalls auf den geplanten Zeitpunkt gesetzt werden,
  damit Sitemap und IndexNow die Freischaltung als aktuelle Aenderung erkennen.
- Der geplante Redaktionsrhythmus ist alle zwei Tage um 09:00 Uhr Europe/Berlin.
  Im Winter entspricht das 08:00 UTC; speichere daher den eindeutigen UTC-Zeitpunkt
  im JSON statt einer zeitzonenlosen Uhrzeit. Der konkrete Abstand zwischen zwei
  Beitraegen ergibt sich aus `publishedAt`.
- Tina verwaltet und speichert die Terminfelder `status` und `publishedAt`; die
  Website prueft `publishedAt` bei der Anfrage und blendet den Beitrag erst ab
  diesem Zeitpunkt ein. Tina selbst fuehrt in diesem Projekt keinen separaten
  Publishing-Cron aus.
- Tina Publish synchronisiert die JSON-Datei in den Git-Branch `main`; der Deploy
  muss die geplanten Inhalte und die Datumsfreigabe einmal enthalten. Danach reicht
  der serverseitige Zeitvergleich fuer die woechentliche Freischaltung.
- Rueckdatierung aendert nicht, wann Google eine URL erstmals crawlt.

## Redaktioneller Standard

- Der Einstieg beantwortet eine echte Frage oder benennt ein konkretes Problem.
- Abschnittszahl und Absatzlaenge folgen dem Thema; keine feste Siebener-Schablone.
- Bilder unterbrechen und belegen den Text. Sie sind keine austauschbare Dekoration.
- Keine erfundenen Projekte, Kundenresultate, Orte oder persoenlichen Anekdoten.
- Jeder Beitrag unterstuetzt einen kommerziellen Fotografie-Cluster und verweist
  auf eine passende Leistungs- oder Anfrage-Seite.
- Kategorien bleiben wenige stabile Journal-Filter. Tags erzeugen keine
  indexierbaren Archivseiten.

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
5. Pruefen:

   ```powershell
   corepack pnpm journal:audit
   corepack pnpm web:audit:tina-content -- --strict
   corepack pnpm web:build
   corepack pnpm seo:audit:strict
   ```

## Publikationsstatus und Datum

- `status: "draft"` blendet einen Beitrag aus.
- `status: "published"` macht ihn beim naechsten Deploy sofort sichtbar.
- `publishedAt` sortiert die Ausgabe und wird als Publikationsdatum ausgegeben.
  Es ist derzeit kein Scheduler. Ein Datum in der Zukunft wartet nicht automatisch
  auf diesen Zeitpunkt; fuer echte Terminpublikation bleibt der Status bis zum
  gewuenschten Deploy auf `draft`.
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

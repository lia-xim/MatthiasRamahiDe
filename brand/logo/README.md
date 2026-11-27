# Matthias Ramahi – Wortmarke

Nachbau des Header-Logos von matthiasramahi.de als echte Vektor-Outlines (keine Schrift nötig).

## Spezifikation (wie live auf der Website)
- Schrift: Archivo (Variable Font, SIL OFL), Gewicht 700, Breite 75 % (Condensed)
- Laufweite: −0,005 em, Zeilenabstand 0,82, Versalien, linksbündig, zwei Zeilen
- Farben: Hell `#f3f5ef` · Dunkel/Hintergrund `#020306`

## Dateien
- `vektor/*.svg` – öffnet in Illustrator, Affinity, Figma, Inkscape
- `vektor/*.pdf` – Vektor-PDF (Illustrator öffnet es direkt, auch als .ai speicherbar)
- `png/*-1000px.png`, `png/*-3000px.png` – Rastergrafiken
  - `hell` = helle Schrift, transparenter Hintergrund (für dunkle Flächen)
  - `dunkel` = dunkle Schrift, transparenter Hintergrund (für helle Flächen)
  - `hell-auf-schwarz` = helle Schrift auf #020306 mit Rand

## Neu erzeugen
`quelle/build_logo.py <pfad-zu-mr-display-latin-normal.woff2> <ausgabeordner>`
(benötigt: fonttools, brotli, uharfbuzz, freetype-py, pillow, reportlab)

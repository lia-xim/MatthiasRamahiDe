# Bildstrategie

Die Website ist fotografiegetrieben. Bilder sind keine Dekoration, sondern das zentrale Inhaltsobjekt.

## Payload Media

Pflichtpflege:

- Bildtitel
- Alt-Text
- Caption, wenn redaktionell sinnvoll
- Kategorie
- Tags
- Orientierung
- Bildtyp / Motiv
- Bildstimmung
- Verwendungszweck
- Featured/Favorit bei starken Motiven

## Größen

Payload erzeugt:

- `thumb`: Admin und schnelle Auswahl
- `mobile`: kleine Viewports
- `card`: Übersichten und Teaser
- `hero`: große Bühnen
- `wide`: breite Editorial- und Hero-Flächen

Astro nutzt `srcset` und `sizes`. Templates sollen nicht direkt Originale ausliefern, solange eine passende Größe existiert.

## Galerie-Regeln

- Portfolio-Projekte kuratieren, nicht alles hochladen.
- Große Serien in sinnvolle Sequenzen teilen.
- Auf Übersichtsseiten nur Cover/Teaser laden.
- Detailseiten dürfen mehr Bilder laden, aber nicht komplette Roharchive.

## Formate

Viele bestehende Assets sind bereits WebP. Für neue Uploads:

- WebP oder AVIF bevorzugen, wenn der Workflow es sauber erzeugt.
- JPEG nur für Quell-/Originalqualität oder wenn nötig.
- Keine 30-MB-Originale direkt als Seitenmotiv verwenden.

## Object Storage

Für Produktion empfohlen:

- Cloudflare R2 oder Hetzner Object Storage.
- S3-ENV in `apps/cms/.env` setzen.
- Medien-URLs per CDN ausliefern.
- Datenbank und Bucket gemeinsam sichern.

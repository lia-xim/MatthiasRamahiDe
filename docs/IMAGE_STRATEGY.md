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

Beim Upload setzt Payload bereits technische und redaktionelle Defaults: Titel und Alt-Text fallen auf den lesbar gemachten Dateinamen zurueck, Kategorie und Verwendungszweck werden grob aus Dateiname/Titel abgeleitet. Das ist als kostenloser Sicherheitsgurt gedacht, ersetzt aber keine finale redaktionelle Kontrolle bei wichtigen Hero-, Portfolio- und SEO-Bildern.

## Responsive Derivate

Neue Uploads erzeugen in Payload:

- `thumb` / `thumbAvif`: Admin und schnelle Auswahl
- `mobile` / `mobileAvif`: kleine Viewports
- `card` / `cardAvif`: Uebersichten und Teaser
- `hero` / `heroAvif`: grosse Buehnen
- `wide` / `wideAvif`: breite Editorial- und Hero-Flaechen

Astro nutzt `ResponsiveImage` mit `<picture>`, AVIF/WebP, `srcset`, `sizes`, Lazy Loading und festen Dimensionen. Templates sollen nicht direkt Originale ausliefern, solange eine passende Groesse existiert.

## Focal Point, Crop und Placeholder

- Payload Media hat Crop und Focal Point aktiv.
- Lokale Uploads bekommen automatisch eine Orientierung.
- Lokale Uploads bekommen `dominantColor` und `blurDataUrl` als LQIP-Placeholder.
- Im Frontend wird der Focal Point als `object-position` gesetzt, wenn Payload `focalX/focalY` liefert.

Die Startseiten-Hero-Slideshow kann ueber eine `Bildsequenz` im Startseiten-Dokument gepflegt werden. Ein interner Titel mit `hero`, `intro` oder `start` wird als Hero-Sequenz erkannt; die Reihenfolge der Bilder im CMS ist die sichtbare Reihenfolge im Hero.

## Galerie-Regeln

- Portfolio-Projekte kuratieren, nicht alles hochladen.
- Grosse Serien in sinnvolle Sequenzen teilen.
- Auf Uebersichtsseiten nur Cover/Teaser laden.
- Detailseiten nutzen `LoadMoreGallery`, damit nicht sofort komplette Roharchive sichtbar geladen werden.

## Formate

Viele bestehende Assets sind bereits WebP. Fuer neue Uploads:

- WebP ist der robuste Standard-Fallback.
- AVIF wird parallel erzeugt, wo Browser es unterstuetzen.
- JPEG bleibt Quell-/Originalformat, wird aber nicht direkt in CMS-Templates ausgeliefert.
- Keine grossen Originale direkt als Seitenmotiv verwenden.

## Object Storage

Fuer Produktion empfohlen:

- Cloudflare R2 oder Hetzner Object Storage.
- S3-ENV in `apps/cms/.env` setzen.
- Medien-URLs per CDN ausliefern.
- Datenbank und Bucket gemeinsam sichern.
- Bei S3/R2 wird die lokale LQIP-Erzeugung uebersprungen; dann kann spaeter ein separater Worker oder Import-Job die Platzhalter ergaenzen.

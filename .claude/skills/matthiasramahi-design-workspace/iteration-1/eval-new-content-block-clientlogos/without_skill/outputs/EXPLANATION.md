# clientLogosStrip — visual decisions

## Was hinzugefügt wurde

**CMS** (`apps/cms/src/fields/contentBlocks.ts`) — neuer Block `clientLogosStrip` mit:

- `eyebrow` (Text, Default `"Kunden & Magazine"`) — Mono-Kicker, knapp.
- `note` (Text, optional) — Mikro-Metadaten rechts, Stil wie `Location · Location · Detail`.
- `tone` (Select: `surface` | `paper`) — passt sich an dunkle oder helle Sektionen an.
- `items[]` (Logo-Relation `media`, `name` (alt/title, required), optional `href`).
- Admin-Description erklärt: 4–12 Einträge, SVG/transparente PNGs, monochrome Darstellung.

**Astro** (`apps/web/src/components/ContentBlocks.astro`) — Renderer + scoped `<style>`.

## Wie es ins System passt

Die Leiste folgt dem Gesetz, das `04-content-blocks.md` und `tokens.css` setzen: **keine Karten, keine Schatten, keine bunten Hover-Effekte, keine Rundungen.** Sie liest sich als editorialer Credits-Streifen, nicht als „brand showcase".

**Typografie & Layout.** Header oben ist die identische Mono-Eyebrow-Linie, die der Rest der Site benutzt (`.eyebrow`, `700 10px/1.4 var(--font-mono)`, uppercase, `var(--muted)`). Eyebrow links, optionale Note rechts — gleiche Logik wie der `topic-spread` Header. Logos darunter in einer einzigen `flex`-Reihe mit grosszügigem `column-gap: clamp(36px, 5vw, 72px)` und `row-gap` für den Mehrzeilenfall. Kein Grid mit harten Linien — die Leiste soll ruhig fliessen, nicht segmentieren.

**Rahmung.** Eine 1px Hairline oben *und* unten (`var(--border)` dunkel, `color-mix(... paper-ink 14%)` hell) — derselbe Trick, mit dem `stack-list` Struktur ohne Karten herstellt. Die Hairlines verankern die Logos zwischen den umgebenden Sektionen, ohne sie zu „rahmen".

**Logo-Tönung.** Das ist der entscheidende Punkt: Logos werden monochrom gestellt. Auf dunklem Grund: `filter: grayscale(1) brightness(0) invert(1)` → reines Weiss bei 72 % Opazität. Auf hellem Grund: `grayscale(1) brightness(0)` → reines Schwarz bei 58 %. Damit liest sich die Reihe als einheitliche Typografie-Linie, nicht als bunter Klebezettel-Salat — exakt das, was die Voice-Anti-Pattern in `07-copy-voice-and-anti-patterns.md` fordert („kuratiert · sauber · ruhig"). Hover/`:focus-visible` hebt die Opazität auf 100 %, ohne Farbe oder Bewegung — die einzige Interaktion, die mit dem Rest der Site harmoniert (vgl. `.button:hover` ist auch nur Opacity/Border).

**Höhe.** Logos sind auf `height: clamp(22px, 2.4vw, 34px)`, `width: auto`, `object-fit: contain` normalisiert. Verschiedene Logo-Proportionen lesen sich dadurch als eine Linie — der gleiche Stillstand wie der Kontaktbogen aus gleich grossen Fotos.

**Spacing.** Section-Padding `clamp(40px, 6vw, 88px)` — kompakter als ein `textBlock` (das volle `clamp(58px, 8vw, 120px)` rüber-und-runter bekommt), weil eine Logo-Leiste eine Übergangs-Geste ist, kein Inhalts-Schwerpunkt.

**Anti-Patterns vermieden:** Keine Hover-Scales, keine bunten Original-Farben, keine Schatten, keine Border-Radien, kein „As seen in"-Marketing-Sprech (der Default-Kicker ist „Kunden & Magazine", neutral und beschreibend).

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const contentDir = path.join(process.cwd(), 'apps', 'web', 'content', 'journal-posts')

const visuals = {
  'auto-shooting-briefing': [
    ['/uploads/payload/_DSC2831%20(1).webp', 'Gesamtansicht als Ausgangspunkt einer geplanten Fahrzeugserie'],
    ['/uploads/payload/_DSC3023.webp', 'Detailaufnahme als eigene Bildebene innerhalb der Shotlist'],
  ],
  'autohaus-showroomlicht': [
    ['/uploads/payload/_DSC3086.webp', 'Fahrzeugaufnahme im Showroom mit kontrollierter Umgebung'],
    ['/uploads/payload/_DSC3072.webp', 'Cockpit und Innenraum als Teil einer vollständigen Händler-Serie'],
  ],
  'automobilfotografie-im-regen': [
    ['/uploads/payload/_DSC3046_genErase%20(1).webp', 'Dunkle Fahrzeugaufnahme mit gerichteten Reflexen'],
    ['/uploads/payload/_DSC2999_genErase.webp', 'Fahrzeugmotiv mit Bewegungswirkung und reduziertem Umfeld'],
  ],
  'automotive-markenstorytelling': [
    ['/uploads/payload/_DSC3032_genErase.webp', 'Exterieuraufnahme als ruhiges Leitmotiv einer Automotive-Serie'],
    ['/uploads/payload/_DSC2983.webp', 'Innenraumaufnahme als zweite Erzählebene der Bildstrecke'],
  ],
  'farbharmonie-fahrzeugfotografie': [
    ['/uploads/payload/_DSC3004.webp', 'Dunkles Fahrzeugmotiv mit reduzierter Farbpalette'],
    ['/uploads/payload/_DSC2924.webp', 'Fahrzeug bei Tageslicht mit natürlicher Farbwiedergabe'],
  ],
  'lightpainting-fahrzeuge': [
    ['/uploads/payload/_DSC3046_genErase%20(1).webp', 'Nachtaufnahme mit gezielt gesetzten Lichtkanten'],
    ['/uploads/payload/_DSC3017.webp', 'Karosserielinien als Grundlage für einen kontrollierten Lichtaufbau'],
  ],
  'sportwagen-vorbereitung': [
    ['/uploads/payload/_DSC2841.webp', 'Sportwagenaufnahme mit ruhigem Bildrahmen'],
    ['/uploads/payload/_DSC3058.webp', 'Nahes Fahrzeugdetail, auf dem kleine Spuren deutlich sichtbar werden'],
  ],
  'oldtimer-veranstaltungen': [
    ['/uploads/payload/20250418-DSC00660.webp', 'Klassisches Fahrzeug als Motiv einer zusammenhängenden Veranstaltungsserie'],
    ['/assets/optimized/assets-photos-oldtimer-stage-1920.webp', 'Oldtimer in einer kontrollierten, dunklen Lichtsituation'],
  ],
  'oldtimer-wertobjekt': [
    ['/uploads/payload/20250418-DSC006552-1920x1280.webp', 'Klassisches Fahrzeug mit sichtbarer Form und Materialwirkung'],
    ['/assets/optimized/assets-photos-oldtimer-stage-1920.webp', 'Inszenierte Oldtimeraufnahme als Ergänzung zur sachlichen Dokumentation'],
  ],
  'motorrad-eventfotografie': [
    ['/uploads/payload/_DSC6968.webp', 'Motorrad als klares Hauptmotiv innerhalb einer Veranstaltung'],
    ['/uploads/payload/_DSC7026.webp', 'Zweite Perspektive für eine abwechslungsreiche Eventserie'],
  ],
  'motorrad-fotoshooting-checkliste': [
    ['/uploads/payload/_DSC6982-1.webp', 'Gesamtansicht eines Motorrads als Pflichtmotiv der Shotlist'],
    ['/uploads/payload/_DSC6979.webp', 'Engere Perspektive für Material und charakteristische Details'],
  ],
  'motorrad-fotoshooting-sicherheit': [
    ['/uploads/payload/_DSC7025.webp', 'Stehendes Motorrad in einer kontrollierbaren Aufnahmesituation'],
    ['/uploads/payload/_DSC7039.webp', 'Motorradmotiv mit sicherem Abstand und klarer Umgebung'],
  ],
  'motorrad-studiofotografie': [
    ['/assets/optimized/assets-photos-motorrad-ninja-studio-1920.webp', 'Motorrad unter kontrolliertem Licht im Studio'],
    ['/uploads/payload/_DSC6982-1.webp', 'Material und Silhouette als zwei Ebenen einer Studioserie'],
  ],
  'motorradfotografie-im-regen': [
    ['/assets/optimized/assets-photos-motorrad-ninja-road-1920.webp', 'Motorradmotiv mit kühler, wetterbetonter Lichtstimmung'],
    ['/uploads/payload/_DSC6979.webp', 'Nahes Motorradmotiv, bei dem Oberflächen und Reflexe sichtbar werden'],
  ],
  'motorradfotografie-linien': [
    ['/assets/optimized/assets-photos-motorrad-duke-1920.webp', 'Motorrad vor klarer Architektur und geraden Linien'],
    ['/uploads/payload/_DSC7026.webp', 'Silhouette und Haltung aus einer zweiten Perspektive'],
  ],
  'rolling-shots-motorrad': [
    ['/assets/optimized/assets-photos-motorrad-ninja-road-1920.webp', 'Motorrad auf der Straße als Vorbereitung einer Bewegungsszene'],
    ['/uploads/payload/_DSC6968.webp', 'Ruhige Referenzaufnahme für Form und Fahrzeugzustand'],
  ],
  'businessportraits-draussen': [
    ['/assets/portraits/20260823-khan-levi-dsc8571.webp', 'Ruhiges Outdoor-Portrait im urbanen Raum'],
    ['/assets/portraits/20260823-khan-levi-dsc8557.webp', 'Editoriales Portrait vor moderner Architektur'],
  ],
  'lichtformer-portraitfotografie': [
    ['/assets/portraits/_DSC0470-Enhanced-NR.webp', 'Warm inszeniertes Portrait mit gerichtetem Licht'],
    ['/assets/portfolio/_DSC9301-Enhanced-NR.webp', 'Reduziertes Portrait mit weicherer Lichtwirkung'],
  ],
  'musiker-portraits': [
    ['/assets/portraits/20250605-DSC03756.webp', 'Ganzkörperportrait einer Musikerin mit Instrument'],
    ['/assets/portraits/20250605-DSC04020.webp', 'Nähere Portraitperspektive als Ergänzung der Musiker-Serie'],
  ],
  'portraits-offener-schatten': [
    ['/assets/portraits/20260823-khan-levi-dsc8733.webp', 'Urbanes Portrait in offenem Schatten'],
    ['/assets/portraits/20260823-khan-levi-dsc8759.webp', 'Portrait im Gegenlicht mit ruhigem Hintergrund'],
  ],
  'portraits-ohne-generische-posen': [
    ['/assets/portraits/20260823-khan-levi-dsc8797.webp', 'Ganzkörperportrait mit bewusst gewählter Rahmung'],
    ['/assets/portraits/20260823-khan-levi-dsc8585.webp', 'Portrait mit natürlicher Haltung statt festem Posing-Schema'],
  ],
  'portraitshooting-wetter': [
    ['/assets/portraits/20260823-khan-levi-dsc8549.webp', 'Outdoor-Portrait unter weichem, bedecktem Himmel'],
    ['/assets/portraits/20260823-khan-levi-dsc8481.webp', 'Zweite Portraitsituation als Wetter- und Locationvariante'],
  ],
  'schwarz-weiss-portrait-licht': [
    ['/assets/portfolio/_DSC9321-Enhanced-NR.webp', 'Nahes Portrait mit klarer grafischer Wirkung'],
    ['/assets/portfolio/_DSC9301-Enhanced-NR.webp', 'Reduziertes Portrait, das über Licht und Ausdruck funktioniert'],
  ],
  'fine-art-druck': [
    ['/assets/optimized/assets-photos-landschaft-1920.webp', 'Landschaftsmotiv als Ausgangspunkt für einen Fine-Art-Print'],
    ['/assets/services/fea8218e-7546-48ef-8581-2b99bb3cdefe_centered_reduced.webp', 'Fotobücher und Druckprodukte als unterschiedliche Ausgabeformen'],
  ],
  'location-scouting-duesseldorf': [
    ['/assets/optimized/assets-photos-landschaft-1920.webp', 'Offene Landschaft mit Tiefe und ruhigem Horizont'],
    ['/assets/optimized/assets-photos-automobil-sunset-1920.webp', 'Fahrzeuglocation mit gerichtetem Abendlicht'],
  ],
  'serie-kuratieren': [
    ['/uploads/payload/_DSC3032_genErase.webp', 'Breites Fahrzeugmotiv als möglicher Einstieg einer Serie'],
    ['/uploads/payload/_DSC2983.webp', 'Innenraumdetail als bewusster Rhythmuswechsel'],
    ['/assets/portraits/20260823-khan-levi-dsc8733.webp', 'Portraitmotiv als Beispiel für eine andere Bildrolle'],
  ],
}

const commercialPages = {
  automotive: ['/automobil-fotografie.html', 'Automobilfotografie'],
  'sports-car': ['/sportwagen-fotografie.html', 'Sportwagenfotografie'],
  'classic-car': ['/oldtimer-fotografie.html', 'Oldtimerfotografie'],
  motorcycle: ['/motorrad-fotografie.html', 'Motorradfotografie'],
  portrait: ['/portraitfotografie.html', 'Portraitfotografie'],
  'landscape-print': ['/landschaftsfotografie.html', 'Landschaftsfotografie und Prints'],
  process: ['/fotografie.html', 'Fotografie und Arbeitsweise'],
}

const coverAlt = {
  'auto-shooting-briefing': 'Ferrari in einem Ausstellungsraum als geplantes Hauptmotiv einer Fahrzeugserie',
  'autohaus-showroomlicht': 'Dunkler Sportwagen unter farbigem Showroomlicht',
  'automobilfotografie-im-regen': 'Schwarzes Fahrzeug neben einer Pfuetze nach einem Regenschauer',
  'automotive-fotografie-duesseldorf': 'Automobil in neonartigem Licht',
  'automotive-markenstorytelling': 'Sportwagenprofil als ruhiges Leitmotiv einer zusammenhaengenden Automotive-Bildserie',
  'businessportraits-draussen': 'Businessportrait eines Mannes vor moderner Architektur in Duesseldorf',
  'farbharmonie-fahrzeugfotografie': 'Sportwagen im warmen Abendlicht mit abgestimmten Lack- und Umgebungsfarben',
  'fine-art-druck': 'Fotobuecher und Druckprodukte',
  'lichtformer-portraitfotografie': 'Inszeniertes Portrait einer Frau mit warmem, gerichtetem Studiolicht',
  'lightpainting-fahrzeuge': 'Automobil mit kontrolliertem farbigem Licht in einer dunklen Umgebung',
  'location-scouting-duesseldorf': 'Landschaftsmotiv mit starker Tiefe',
  'motorrad-eventfotografie': 'Motorrad als Teil einer atmosphaerischen Eventreportage',
  'motorrad-fotoshooting-checkliste': 'Schwarzes Motorrad bei einem geplanten Fotoshooting im Abendlicht',
  'motorrad-fotoshooting-sicherheit': 'Stehendes schwarzes Motorrad am Rand einer ruhigen Strasse im Abendlicht',
  'motorrad-studiofotografie': 'Motorrad mit kontrollierter Lichtsetzung in einer dunklen Studioumgebung',
  'motorradfotografie-im-regen': 'Motorrad an einer Strasse mit kuehler, wetterbetonter Lichtstimmung',
  'motorradfotografie-linien': 'Motorrad vor Architektur',
  'musiker-portraits': 'Musikerin mit Violine in einer weit komponierten Outdoor-Aufnahme',
  'oldtimer-veranstaltungen': 'Historischer roter Rennwagen in einer Sammlung',
  'oldtimer-wertobjekt': 'Oldtimer in Buehnenlicht',
  'portraits-offener-schatten': 'Natuerliches Maennerportrait im offenen Schatten vor ruhigem urbanem Hintergrund',
  'portraits-ohne-generische-posen': 'Portrait in warmem Licht',
  'portraitshooting-wetter': 'Outdoor-Portrait eines Mannes in einer urbanen Szene unter bedecktem Himmel',
  'rolling-shots-motorrad': 'Motorrad in dynamischer Perspektive als sichere Alternative zum Rolling Shot',
  'schwarz-weiss-portrait-licht': 'Enges Portrait eines laechelnden Mannes vor einem zurueckhaltenden Hintergrund',
  'serie-kuratieren': 'Oldtimer-Szene in dunklem Licht',
  'sportwagen-vorbereitung': 'Nahaufnahme einer Fahrzeugseite mit sauber lesbarer Lackkante und Spiegelung',
}

const bridgeSections = {
  'auto-shooting-briefing': [1, 4],
  'autohaus-showroomlicht': [2],
  'automobilfotografie-im-regen': [1, 5],
  'automotive-markenstorytelling': [3],
  'businessportraits-draussen': [2, 5],
  'farbharmonie-fahrzeugfotografie': [2, 5],
  'lichtformer-portraitfotografie': [1, 5],
  'lightpainting-fahrzeuge': [1, 5],
  'motorrad-eventfotografie': [2],
  'motorrad-fotoshooting-checkliste': [3],
  'motorrad-fotoshooting-sicherheit': [2, 5],
  'motorrad-studiofotografie': [1, 5],
  'motorradfotografie-im-regen': [2, 5],
  'musiker-portraits': [2, 5],
  'oldtimer-veranstaltungen': [3],
  'portraits-offener-schatten': [4],
  'portraitshooting-wetter': [4],
  'rolling-shots-motorrad': [4],
  'schwarz-weiss-portrait-licht': [3],
  'sportwagen-vorbereitung': [4],
}

const files = (await fs.readdir(contentDir)).filter((file) => file.endsWith('.json')).sort()
let changed = 0

for (const file of files) {
  const filePath = path.join(contentDir, file)
  const document = JSON.parse(await fs.readFile(filePath, 'utf8'))
  const blocks = Array.isArray(document.blocks) ? document.blocks : []
  let dirty = false

  for (const block of blocks) {
    if (block?._template === 'textBlock' && /^\d{1,2}$/.test(String(block.eyebrow || ''))) {
      delete block.eyebrow
      dirty = true
    }
  }

  const textBlocks = blocks.filter((block) => block?._template === 'textBlock')
  for (const [index, block] of textBlocks.entries()) {
    const nextStyle = bridgeSections[document.slug]?.includes(index) ? 'bridge' : undefined
    if (nextStyle && block.style !== nextStyle) {
      block.style = nextStyle
      dirty = true
    }
  }

  if (!blocks.some((block) => block?._template === 'imageSequence') && visuals[document.slug]) {
    const textCount = blocks.filter((block) => block?._template === 'textBlock').length
    const insertAt = Math.max(1, Math.min(blocks.length, Math.floor(textCount / 2) + (document.slug.length % 3) - 1))
    blocks.splice(insertAt, 0, {
      headline: 'Bildnotizen aus dem Portfolio',
      layout: visuals[document.slug].length > 2 ? 'triptych' : 'editorial-pair',
      items: visuals[document.slug].map(([image, caption]) => ({ image, caption, cropIntent: 'editorial' })),
      _template: 'imageSequence',
    })
    dirty = true
  }

  if ((!Array.isArray(document.relatedPages) || document.relatedPages.length === 0) && commercialPages[document.category]) {
    const [href, label] = commercialPages[document.category]
    document.relatedPages = [{ label, href, seoPurpose: 'commercial-support', rel: 'follow', openInNewTab: false }]
    dirty = true
  }

  if (!document.coverAlt && coverAlt[document.slug]) {
    document.coverAlt = coverAlt[document.slug]
    dirty = true
  }

  if (dirty) {
    document.blocks = blocks
    document.updatedAt = new Date().toISOString()
    await fs.writeFile(filePath, `${JSON.stringify(document, null, 2)}\n`)
    changed += 1
  }
}

console.log(`Journal visuals enriched: ${changed} document(s) changed.`)

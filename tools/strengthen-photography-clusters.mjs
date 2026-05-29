import './assert-legacy-reference-write-allowed.mjs'
import fs from 'node:fs'

const scopes = [
  ['Düsseldorf', 'duesseldorf'],
  ['Köln', 'koeln'],
  ['Essen', 'essen'],
  ['Dortmund', 'dortmund'],
  ['Duisburg', 'duisburg'],
  ['Bochum', 'bochum'],
  ['Wuppertal', 'wuppertal'],
  ['Leverkusen', 'leverkusen'],
  ['Oberhausen', 'oberhausen'],
  ['Krefeld', 'krefeld'],
  ['Mönchengladbach', 'moenchengladbach'],
  ['Moers', 'moers'],
  ['Gelsenkirchen', 'gelsenkirchen'],
  ['Bergisch Gladbach', 'bergisch-gladbach'],
  ['Solingen', 'solingen'],
  ['Remscheid', 'remscheid'],
  ['Mettmann', 'mettmann'],
  ['Hilden', 'hilden'],
  ['Dormagen', 'dormagen'],
  ['Neuss', 'neuss'],
  ['NRW', 'nrw'],
  ['Deutschland', 'deutschland'],
].map(([place, slug]) => ({ place, slug }))

const scopeBySlug = new Map(scopes.map((scope) => [scope.slug, scope]))
const dusseldorf = scopeBySlug.get('duesseldorf')

const categories = [
  {
    key: 'automobil',
    file: 'automobil-fotografie-duesseldorf.html',
    slug: 'automobil-fotografie',
    label: 'Automobil',
    seoTitle: 'Automobilfotografie',
    schemaTitle: 'Automobil Fotografie',
    hero: (place) =>
      `Automobilfotografie in ${place}: Exterieur, Interieur, Details und Cinematic werden als kuratierte Bildserie geplant — für Marke, Showroom, Verkauf, Kampagne und hochwertige private Fahrzeuge.`,
    keywords: [
      ['automotive-fotografie-duesseldorf.html', 'Automotive Fotografie'],
      ['automotive-fotografie.html', 'Automotive Fotografie'],
      ['autofotografie-duesseldorf.html', 'Autofotografie'],
      ['autofotografie.html', 'Autofotografie'],
      ['fahrzeugfotografie-duesseldorf.html', 'Fahrzeugfotografie'],
      ['fahrzeugfotografie.html', 'Fahrzeugfotografie'],
      ['autohaus-fotografie-duesseldorf.html', 'Autohaus Fotografie'],
      ['autohaus-fotografie.html', 'Autohaus Fotografie'],
      ['autoverkauf-fotos-duesseldorf.html', 'Autoverkauf Fotos'],
    ],
  },
  {
    key: 'sportwagen',
    file: 'sportwagen-fotografie-duesseldorf.html',
    slug: 'sportwagen-fotografie',
    label: 'Sportwagen',
    seoTitle: 'Sportwagenfotografie',
    schemaTitle: 'Sportwagen Fotografie',
    hero: (place) =>
      `Sportwagenfotografie in ${place}: Performance, Form, Innenraum und Details werden mit kontrollierten Reflexen und ruhiger Dramaturgie sichtbar — für Sammler, Händler, Marke, Verkauf und Druck.`,
    keywords: [
      ['sportwagen-shooting-duesseldorf.html', 'Sportwagen Shooting'],
      ['sportwagen-fotoshooting-duesseldorf.html', 'Sportwagen Fotoshooting'],
      ['performance-car-fotografie-duesseldorf.html', 'Performance Car Fotografie'],
      ['performance-car-fotografie.html', 'Performance Car Fotografie'],
      ['exotic-car-fotografie-duesseldorf.html', 'Exotic Car Fotografie'],
      ['exotic-car-fotografie.html', 'Exotic Car Fotografie'],
      ['supersportwagen-fotografie-duesseldorf.html', 'Supersportwagen Fotografie'],
      ['supersportwagen-fotografie.html', 'Supersportwagen Fotografie'],
    ],
  },
  {
    key: 'oldtimer',
    file: 'oldtimer-fotografie-duesseldorf.html',
    slug: 'oldtimer-fotografie',
    label: 'Oldtimer',
    seoTitle: 'Oldtimer-Fotografie',
    schemaTitle: 'Oldtimer Fotografie',
    hero: (place) =>
      `Oldtimer-Fotografie in ${place}: Herkunft, Material, Lack, Chrom, Leder und Patina werden ruhig dokumentiert — für Sammlung, Verkauf, Auktion, Ausstellung und Fahrzeuge mit Geschichte.`,
    keywords: [
      ['classic-car-fotografie-duesseldorf.html', 'Classic Car Fotografie'],
      ['classic-car-fotografie.html', 'Classic Car Fotografie'],
      ['oldtimer-shooting-duesseldorf.html', 'Oldtimer Shooting'],
      ['youngtimer-fotografie-duesseldorf.html', 'Youngtimer Fotografie'],
      ['youngtimer-fotografie.html', 'Youngtimer Fotografie'],
      ['sammlerfahrzeug-fotografie-duesseldorf.html', 'Sammlerfahrzeug Fotografie'],
      ['sammlerfahrzeug-fotografie.html', 'Sammlerfahrzeug Fotografie'],
      ['oldtimer-verkaufsfotos-duesseldorf.html', 'Oldtimer Verkaufsfotos'],
    ],
  },
  {
    key: 'motorrad',
    file: 'motorrad-fotografie-duesseldorf.html',
    slug: 'motorrad-fotografie',
    label: 'Motorrad',
    seoTitle: 'Motorradfotografie',
    schemaTitle: 'Motorrad Fotografie',
    hero: (place) =>
      `Motorradfotografie in ${place}: Silhouette, Mechanik, Haltung, Detail und Fahrerbezug werden als kraftvolle Serie geplant — für Custom Bikes, Händler, Werkstätten und private Maschinen.`,
    keywords: [
      ['motorrad-shooting-duesseldorf.html', 'Motorrad Shooting'],
      ['bike-fotografie-duesseldorf.html', 'Bike Fotografie'],
      ['bike-fotografie.html', 'Bike Fotografie'],
      ['custom-bike-fotografie-duesseldorf.html', 'Custom Bike Fotografie'],
      ['custom-bike-fotografie.html', 'Custom Bike Fotografie'],
      ['motorrad-verkaufsfotos-duesseldorf.html', 'Motorrad Verkaufsfotos'],
      ['biker-portrait-duesseldorf.html', 'Biker Portrait'],
    ],
  },
  {
    key: 'portrait',
    file: 'portraitfotografie-duesseldorf.html',
    slug: 'portraitfotografie',
    label: 'Portrait',
    seoTitle: 'Portraitfotografie',
    schemaTitle: 'Portrait Fotografie',
    hero: (place) =>
      `Portraitfotografie in ${place}: Blick, Licht, Distanz und Haltung werden auf Nutzung und Persönlichkeit abgestimmt — für Personal Branding, Business Portraits, Team, Presse und Editorial.`,
    keywords: [
      ['business-portrait-duesseldorf.html', 'Business Portrait'],
      ['headshot-fotograf-duesseldorf.html', 'Headshot Fotograf'],
      ['personal-branding-fotografie-duesseldorf.html', 'Personal Branding Fotografie'],
      ['personal-branding-fotografie.html', 'Personal Branding Fotografie'],
      ['unternehmensportrait-duesseldorf.html', 'Unternehmensportrait'],
      ['pressefoto-duesseldorf.html', 'Pressefoto'],
    ],
  },
  {
    key: 'landschaft',
    file: 'landschaftsfotografie-duesseldorf.html',
    slug: 'landschaftsfotografie',
    label: 'Landschaft',
    seoTitle: 'Landschaftsfotografie',
    schemaTitle: 'Landschaftsfotografie',
    hero: (place) =>
      `Landschaftsfotografie für ${place}: Licht, Weite, Material und Raumwirkung werden kuratiert — als Fine-Art-Print, Wandbild, Edition oder großformatige Arbeit für Räume mit Ruhe.`,
    keywords: [
      ['landschaftsbilder-kaufen.html', 'Landschaftsbilder kaufen'],
      ['fine-art-prints-landschaft.html', 'Fine-Art-Prints Landschaft'],
      ['wandbilder-landschaftsfotografie.html', 'Wandbilder Landschaftsfotografie'],
      ['naturfotografie-prints.html', 'Naturfotografie Prints'],
      ['landschaftsfotografie-print-deutschland.html', 'Landschaftsfotografie Print'],
    ],
  },
]

const categoryBySlug = new Map(categories.map((category) => [category.slug, category]))

const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const attr = (value) => esc(value).replace(/"/g, '&quot;')

function categoryHref(category, scope) {
  if (scope.slug === 'duesseldorf') return category.file
  return `${category.slug}-${scope.slug}.html`
}

function overviewHref(scope) {
  if (scope.slug === 'nrw' || scope.slug === 'deutschland') return `fotografie-${scope.slug}.html`
  return 'fotografie-duesseldorf.html'
}

function categoryFromFile(file) {
  for (const category of categories) {
    if (file === category.file) return { category, scope: dusseldorf, keyword: false }

    const prefix = `${category.slug}-`
    if (file.startsWith(prefix) && file.endsWith('.html')) {
      const scopeSlug = file.slice(prefix.length, -'.html'.length)
      const scope = scopeBySlug.get(scopeSlug)
      if (scope) return { category, scope, keyword: false }
    }

    if (category.keywords.some(([keywordFile]) => keywordFile === file)) {
      return { category, scope: file.includes('-duesseldorf.html') ? dusseldorf : scopeBySlug.get('deutschland'), keyword: true }
    }
  }

  return null
}

function filesToUpdate() {
  const files = new Set()
  for (const category of categories) {
    files.add(category.file)
    for (const scope of scopes) files.add(categoryHref(category, scope))
    for (const [keywordFile] of category.keywords) files.add(keywordFile)
  }
  return [...files].filter((file) => fs.existsSync(file)).sort((a, b) => a.localeCompare(b))
}

function placeDescriptor(scope, category) {
  if (scope.slug === 'nrw') {
    return category.key === 'landschaft'
      ? 'NRW bündelt hier Nachfrage nach Fine-Art-Prints, Wandbildern und Editionen; Auswahl, Material und Lieferung werden passend zum Raum geplant.'
      : 'NRW verbindet Rheinland, Ruhrgebiet, Niederrhein und Bergisches Land; die Produktion bleibt lokal auffindbar und wird von Düsseldorf aus sauber geplant.'
  }
  if (scope.slug === 'deutschland') {
    return category.key === 'landschaft'
      ? 'Deutschlandweit zählt vor allem die passende Motivwahl, Druckqualität, Materialität und Wirkung im Raum.'
      : 'Deutschlandweite Produktionen werden über Motiv, Nutzung, Reise, Lichtfenster und Output geplant; Düsseldorf bleibt der organisatorische Ausgangspunkt.'
  }
  if (scope.slug === 'duesseldorf') {
    return 'Düsseldorf ist der lokale Standort- und Planungsanker; Wege, Lichtfenster, Location und Ausgabeformat lassen sich dadurch präzise abstimmen.'
  }
  return `${scope.place} wird als lokaler Suchraum mit klarer Planung, passendem Lichtfenster und sauberer Nutzung der Bildserie geführt.`
}

function h1For(category, scope) {
  const place = esc(scope.place)
  switch (category.key) {
    case 'automobil':
      return `<h1 class="pd-title">\n          <span class="line"><span class="word">Automobil</span></span>\n          <span class="line"><span class="word">Fotografie ${place}.</span></span>\n        </h1>`
    case 'sportwagen':
      return `<h1 class="tri-title">\n        <span class="line"><span class="word">Sportwagen</span></span>\n        <span class="line"><span class="word">Fotografie ${place}.</span></span>\n      </h1>`
    case 'oldtimer':
      return `<h1 class="hero-mp__title"><span>Oldtimer-Fotografie</span><em>${place}.</em></h1>`
    case 'motorrad':
      return `<h1 class="hero-mr__title" id="heroMrTitle">\n        <span class="line"><span class="word">Motorrad</span></span>\n        <span class="line"><span class="word">Fotografie ${place}</span></span>\n      </h1>`
    case 'portrait':
      return `<h1 class="hero-pt__title">Portraitfotografie <em>${place}.</em></h1>`
    case 'landschaft':
      return `<h1 class="hero-ls__title">\n        <span class="l"><span class="w">Landschaft</span></span>\n        <span class="l"><span class="w">Fotografie ${place}.</span></span>\n      </h1>`
    default:
      throw new Error(`Unknown category: ${category.key}`)
  }
}

function replaceHero(html, category, scope, keyword) {
  if (keyword) return html

  const copy = `${category.hero(scope.place)} ${placeDescriptor(scope, category)}`
  const safe = esc(copy)
  html = html.replace(/<section\b([^>]*?)aria-label="[^"]*"/, (match, before) => {
    if (!/hero-|class="(?:hero|tri|pd|hero-mp|hero-mr|hero-pt|hero-ls)/.test(match)) return match
    return `<section${before}aria-label="${attr(`${category.seoTitle} ${scope.place}`)}"`
  })

  switch (category.key) {
    case 'automobil':
      return html
        .replace(/<h1 class="pd-title">[\s\S]*?<\/h1>/, h1For(category, scope))
        .replace(/<p class="pd-sub">[\s\S]*?<\/p>/, `<p class="pd-sub">${safe}</p>`)
    case 'sportwagen':
      return html
        .replace(/<h1 class="tri-title">[\s\S]*?<\/h1>/, h1For(category, scope))
        .replace(/<p class="tri-sub">[\s\S]*?<\/p>/, `<p class="tri-sub">${safe}</p>`)
    case 'oldtimer':
      return html
        .replace(/<h1 class="hero-mp__title">[\s\S]*?<\/h1>/, h1For(category, scope))
        .replace(/<p class="hero-mp__sub">[\s\S]*?<\/p>/, `<p class="hero-mp__sub">${safe}</p>`)
    case 'motorrad':
      return html
        .replace(/<h1 class="hero-mr__title" id="heroMrTitle">[\s\S]*?<\/h1>/, h1For(category, scope))
        .replace(/<p class="hero-mr__lede">[\s\S]*?<\/p>/, `<p class="hero-mr__lede">${safe}</p>`)
    case 'portrait':
      return html
        .replace(/<h1 class="hero-pt__title">[\s\S]*?<\/h1>/, h1For(category, scope))
        .replace(/<p class="hero-pt__sub">[\s\S]*?<\/p>/, `<p class="hero-pt__sub">${safe}</p>`)
    case 'landschaft':
      return html
        .replace(/<h1 class="hero-ls__title">[\s\S]*?<\/h1>/, h1For(category, scope))
        .replace(/<p class="hero-ls__sub">[\s\S]*?<\/p>/, `<p class="hero-ls__sub">${safe}</p>`)
    default:
      return html
  }
}

function clusterSection(current, scope) {
  const siblingLinks = categories
    .filter((category) => category.key !== current.key)
    .map(
      (category) =>
        `        <a class="mr-cities__cell" href="${categoryHref(category, scope)}">${esc(category.seoTitle)} ${esc(scope.place)}</a>`,
    )
    .join('\n')

  return `

  <!-- FOTOGRAFIE-CLUSTER -->
  <section class="mr-cities mr-photo-cluster" data-header-theme="light" data-theme="light" aria-label="Fotografie-Cluster ${attr(scope.place)}">
    <div class="mr-cities__inner">
      <div class="mr-cities__head">
        <h2>Weitere Fotografie-Bereiche <em>${esc(scope.place)}.</em></h2>
        <p class="mr-cities__copy">Diese Kategorie ist Teil eines bewusst getrennten Fotografie-Clusters: Fahrzeug, Mensch und Raum bleiben eigenständige Suchintentionen, sind aber intern so verbunden, dass Nutzer schnell in den passenden Bildbereich wechseln können.</p>
      </div>
      <nav class="mr-cities__grid" aria-label="Verwandte Fotografie-Bereiche">
        <a class="mr-cities__cell" href="${overviewHref(scope)}">Fotografie Übersicht</a>
${siblingLinks}
      </nav>
    </div>
  </section>
  <!-- /FOTOGRAFIE-CLUSTER -->
`
}

function removeExistingCluster(html) {
  return html.replace(/\n?\s*<!-- FOTOGRAFIE-CLUSTER -->[\s\S]*?<!-- \/FOTOGRAFIE-CLUSTER -->\s*/g, '\n')
}

function insertCluster(html, current, scope) {
  const section = clusterSection(current, scope)
  const citySection = html.search(/\n\s*<section class="mr-cities"/)
  if (citySection !== -1) return `${html.slice(0, citySection)}${section}${html.slice(citySection)}`

  const contactSection = html.search(/\n\s*<section\s+id="anfrage"/)
  if (contactSection !== -1) return `${html.slice(0, contactSection)}${section}${html.slice(contactSection)}`

  return html.replace(/<\/main>/, `${section}</main>`)
}

function writeFileWithRetry(file, content) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      fs.writeFileSync(file, content, 'utf8')
      return
    } catch (error) {
      if (attempt === 3) throw error
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 150)
    }
  }
}

let changed = 0

for (const file of filesToUpdate()) {
  const info = categoryFromFile(file)
  if (!info) continue

  const before = fs.readFileSync(file, 'utf8')
  let html = before
  html = replaceHero(html, info.category, info.scope, info.keyword)
  html = insertCluster(removeExistingCluster(html), info.category, info.scope)

  if (html !== before) {
    writeFileWithRetry(file, html)
    changed += 1
  }
}

console.log(JSON.stringify({ checked: filesToUpdate().length, changed }, null, 2))

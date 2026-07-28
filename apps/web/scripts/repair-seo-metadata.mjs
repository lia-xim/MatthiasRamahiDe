import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import path from 'node:path'

const webRoot = process.cwd()
const contentRoot = path.join(webRoot, 'content')
const outputDir = path.join(webRoot, '.cms-parity')
const outputPath = path.join(outputDir, 'seo-metadata-audit.json')
const write = process.argv.includes('--write')
const refreshDerived = process.argv.includes('--refresh-derived')

const siteUrl = 'https://matthiasramahi.de'
const defaultOgImage = '/assets/optimized/assets-photos-automobil-sunset-1920.webp'

const collectionDirs = {
  pages: 'pages',
  servicePages: 'service-pages',
  localSeoPages: 'local-seo-pages',
  portfolioProjects: 'portfolio-projects',
  journalPosts: 'journal-posts',
}

const pageKeywordBySlug = {
  home: 'Matthias Ramahi Fotografie',
  fotografie: 'Fotografie Bereiche Düsseldorf',
  portfolio: 'Portfolio Matthias Ramahi Fotografie',
  leistungen: 'Fotografie Leistungen Düsseldorf',
  blog: 'Fotografie Journal Matthias Ramahi',
  contact: 'Kontakt Matthias Ramahi Fotografie Düsseldorf',
  'ueber-mich': 'Matthias Ramahi Fotograf Düsseldorf',
  impressum: 'Impressum Matthias Ramahi Fotografie',
  datenschutz: 'Datenschutz Matthias Ramahi Fotografie',
}

const defaultOgByHint = [
  [/sportwagen|performance|supercar|exotic/i, '/assets/optimized/assets-portfolio-dsc3879-1920.webp'],
  [/oldtimer|youngtimer|sammlerfahrzeug/i, '/assets/optimized/assets-photos-oldtimer-stage-1920.webp'],
  [/motorrad/i, '/assets/optimized/assets-photos-motorrad-1920.webp'],
  [/portrait|personal-branding|unternehmensportrait|pressefoto|paarshooting|familienshooting/i, '/assets/portraits/_DSC0470-Enhanced-NR.webp'],
  [/landschaft|natur|wandbilder|print/i, '/assets/optimized/assets-photos-landschaft-1920.webp'],
  [/webdesign|seo/i, '/assets/optimized/assets-photos-automobil-sunset-1920.webp'],
  [/druck|fotolabor|grossformat|großformat|sonderanfertigung/i, '/assets/services/portfolio_webp_full_006-1.webp'],
  [/werbetechnik/i, '/assets/services/Catoir_Ramahi-1-32-768x512-1.webp'],
  [/video|videografie/i, '/assets/services/portfolio_webp_full_057-1.webp'],
  [/viola|musik/i, '/assets/services/portfolio_webp_full_004-2.webp'],
  [/automobil|automotive|auto/i, '/assets/optimized/assets-photos-automobil-sunset-1920.webp'],
]

const wordMap = new Map(
  Object.entries({
    ae: 'ä',
    oe: 'ö',
    ue: 'ü',
    duesseldorf: 'Düsseldorf',
    koeln: 'Köln',
    moenchengladbach: 'Mönchengladbach',
    grossformatdruck: 'Großformatdruck',
    grossformat: 'Großformat',
    fotolabor: 'Fotolabor',
    druck: 'Druck',
    drucke: 'Drucke',
    sonderanfertigungen: 'Sonderanfertigungen',
    werbetechnik: 'Werbetechnik',
    webdesign: 'Webdesign',
    seo: 'SEO',
    videografie: 'Videografie',
    viola: 'Viola',
    musik: 'Musik',
    fotografie: 'Fotografie',
    fotograf: 'Fotograf',
    fotografieren: 'Fotografieren',
    tipps: 'Tipps',
    shooting: 'Shooting',
    fotoshooting: 'Fotoshooting',
    verkaufsfotos: 'Verkaufsfotos',
    automobil: 'Automobil',
    automotive: 'Automotive',
    auto: 'Auto',
    sportwagen: 'Sportwagen',
    oldtimer: 'Oldtimer',
    youngtimer: 'Youngtimer',
    motorrad: 'Motorrad',
    portraitfotografie: 'Portraitfotografie',
    portrait: 'Portrait',
    landschaftsfotografie: 'Landschaftsfotografie',
    landschaftsbilder: 'Landschaftsbilder',
    landschaft: 'Landschaft',
    naturfotografie: 'Naturfotografie',
    personal: 'Personal',
    branding: 'Branding',
    pressefoto: 'Pressefoto',
    unternehmensportrait: 'Unternehmensportrait',
    schwarz: 'Schwarz',
    weiss: 'Weiss',
    beleuchtung: 'Beleuchtung',
    motorsport: 'Motorsport',
    supersportwagen: 'Supersportwagen',
    performance: 'Performance',
    car: 'Car',
    sammlerfahrzeug: 'Sammlerfahrzeug',
    paarshooting: 'Paarshooting',
    familienshooting: 'Familienshooting',
    kaufen: 'kaufen',
    prints: 'Prints',
    wandbilder: 'Wandbilder',
    deutschland: 'Deutschland',
    nrw: 'NRW',
  }),
)

function posix(value) {
  return value.replaceAll(path.sep, '/').replaceAll('\\', '/')
}

function relative(filePath) {
  return posix(path.relative(webRoot, filePath))
}

function isBlank(value) {
  return value == null || String(value).trim() === ''
}

function cleanKeyword(value) {
  return String(value || '')
    .replace(/\s*\|\s*(?:\u00dcbersicht|Uebersicht)\s*$/i, '')
    .replace(/\s*[|—–-]\s*Matthias Ramahi(?:\s+Fotografie)?\s*$/i, '')
    .replace(/\s*\|\s*Matthias Ramahi.*$/i, '')
    .replace(/\s+Fotograf(?:ie)?\s*$/i, (match) => match)
    .replace(/[.\s]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function keywordFromSlug(slug) {
  return String(slug || '')
    .split('-')
    .filter(Boolean)
    .map((word) => wordMap.get(word.toLowerCase()) || `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function inferKeyword(collectionName, doc) {
  const slug = doc.slug || ''
  if (collectionName === 'pages' && pageKeywordBySlug[slug]) return pageKeywordBySlug[slug]
  if (collectionName === 'localSeoPages') {
    return cleanKeyword(doc.targetKeyword || doc.title || doc.seo?.focusKeyword || doc.seo?.title || [doc.service, keywordFromSlug(doc.city)].filter(Boolean).join(' '))
  }
  if (collectionName === 'servicePages' && slug === 'keyword-datenbank-seo') return 'Keyword-Datenbank'
  if (collectionName === 'servicePages') return cleanKeyword(doc.seo?.title || doc.title || doc.serviceType || keywordFromSlug(slug))
  if (collectionName === 'journalPosts') return cleanKeyword(doc.seo?.title || doc.title || doc.tags?.[0] || doc.category || keywordFromSlug(slug))
  if (collectionName === 'portfolioProjects') return cleanKeyword(doc.seo?.title || doc.title || doc.excerpt || keywordFromSlug(slug))
  return cleanKeyword(doc.seo?.title || doc.title || keywordFromSlug(slug))
}

function intentFor(collectionName, doc, keyword) {
  const slug = String(doc.slug || '')
  if (collectionName === 'localSeoPages') {
    if (/tipps|ratgeber|beleuchtung|kaufen|prints|wandbilder/i.test(slug)) {
      return `Informationssuche: Nutzer suchen Orientierung, Beispiele und Entscheidungshilfe zu ${keyword}.`
    }
    return `Lokale Dienstleistungsanfrage: Nutzer suchen einen passenden Fotografen, Ablauf und Kontaktmöglichkeit für ${keyword}.`
  }

  if (collectionName === 'servicePages') {
    if (slug === 'keyword-datenbank-seo') {
      return 'Fallstudie und Produktinformation: Nutzer möchten verstehen, wie die Contextter Keyword-Datenbank entstanden ist und zum aktuellen Produkt wechseln.'
    }
    return `Dienstleistungsvergleich und Anfrage: Nutzer prüfen Angebot, Ablauf, Bildstil und Kontaktmöglichkeit für ${keyword}.`
  }

  if (collectionName === 'portfolioProjects') {
    return `Referenzprüfung: Nutzer möchten Bildstil, Qualität und Einsatzmöglichkeiten der Serie ${keyword} einschätzen.`
  }

  if (collectionName === 'journalPosts') {
    return `Informationssuche: Nutzer suchen Fachwissen, Beispiele und Einordnung zu ${keyword}.`
  }

  const pageIntents = {
    home: 'Brand- und Leistungsnavigation: Nutzer suchen Matthias Ramahi Fotografie und den Einstieg in Portfolio, Leistungen oder Kontakt.',
    fotografie: 'Themenübersicht: Nutzer wählen zwischen Fotografie-Bereichen und lokalen Schwerpunkten.',
    portfolio: 'Portfolio-Prüfung: Nutzer möchten Bildstil, Referenzen und Projektbeispiele sehen.',
    leistungen: 'Leistungsübersicht: Nutzer vergleichen ergänzende Leistungen und suchen den passenden Einstieg.',
    blog: 'Informationssuche: Nutzer suchen Fachbeiträge, Einblicke und Arbeitsweise.',
    contact: 'Kontaktanfrage: Nutzer wollen ein Projekt anfragen oder Kontaktdaten finden.',
    'ueber-mich': 'Vertrauensaufbau: Nutzer möchten Fotograf, Arbeitsweise und Hintergrund einschätzen.',
    impressum: 'Rechtliche Navigation: Nutzer suchen Anbieterkennzeichnung und Pflichtangaben.',
    datenschutz: 'Rechtliche Navigation: Nutzer suchen Datenschutzinformationen.',
  }
  return pageIntents[doc.slug] || `Seitennavigation: Nutzer suchen Informationen zu ${keyword}.`
}

function routeFor(collectionName, doc) {
  if (doc.seo?.canonicalUrl) return doc.seo.canonicalUrl
  if (collectionName === 'portfolioProjects') return `${siteUrl}/portfolio/${doc.slug}`
  if (doc.slug === 'home') return `${siteUrl}/`
  return `${siteUrl}/${doc.slug}.html`
}

function collectImageCandidates(value, candidates = []) {
  if (!value || typeof value !== 'object') return candidates
  if (Array.isArray(value)) {
    for (const item of value) collectImageCandidates(item, candidates)
    return candidates
  }

  for (const [key, item] of Object.entries(value)) {
    if (typeof item === 'string' && /(?:^|\.)(?:image|ogImage|coverImage|heroImage|teaserImage|fullImage)$/i.test(key)) {
      if (/^\/(?:assets|uploads)\//i.test(item)) candidates.push(item)
    } else if (item && typeof item === 'object' && key !== 'legacy') {
      collectImageCandidates(item, candidates)
    }
  }
  return candidates
}

function defaultOgFor(doc, keyword) {
  const hint = [doc.slug, doc.title, doc.service, doc.serviceType, keyword].filter(Boolean).join(' ')
  return defaultOgByHint.find(([pattern]) => pattern.test(hint))?.[1] || defaultOgImage
}

function inferOgImage(doc, keyword) {
  return collectImageCandidates(doc).find((candidate) => !candidate.includes('/admin/')) || defaultOgFor(doc, keyword)
}

function ensureSeo(doc) {
  if (!doc.seo || typeof doc.seo !== 'object' || Array.isArray(doc.seo)) doc.seo = {}
}

async function walk(dir) {
  if (!fsSync.existsSync(dir)) return []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const filePath = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(filePath)))
    else if (entry.isFile() && entry.name.endsWith('.json')) files.push(filePath)
  }
  return files
}

function repairDocument(collectionName, doc) {
  ensureSeo(doc)
  const changes = []
  const keyword = inferKeyword(collectionName, doc)

  if (collectionName === 'localSeoPages' && isBlank(doc.targetKeyword) && keyword) {
    doc.targetKeyword = keyword
    changes.push('targetKeyword')
  }

  if ((isBlank(doc.seo.focusKeyword) || (refreshDerived && doc.seo.focusKeyword !== keyword)) && keyword) {
    doc.seo.focusKeyword = keyword
    changes.push('seo.focusKeyword')
  }

  const searchIntent = keyword ? intentFor(collectionName, doc, keyword) : ''
  if ((isBlank(doc.seo.searchIntent) || (refreshDerived && doc.seo.searchIntent !== searchIntent)) && searchIntent) {
    doc.seo.searchIntent = searchIntent
    changes.push('seo.searchIntent')
  }

  if (isBlank(doc.seo.canonicalUrl) && doc.slug) {
    doc.seo.canonicalUrl = routeFor(collectionName, doc)
    changes.push('seo.canonicalUrl')
  }

  if (isBlank(doc.seo.ogImage)) {
    doc.seo.ogImage = inferOgImage(doc, keyword)
    changes.push('seo.ogImage')
  }

  if (doc.seo.noIndex == null) {
    doc.seo.noIndex = false
    changes.push('seo.noIndex')
  }

  return changes
}

async function main() {
  const summary = {
    mode: write ? 'write' : 'dry-run',
    documents: 0,
    changedDocuments: 0,
    changesByField: {},
    missingAfter: {},
  }
  const changed = []

  for (const [collectionName, dirName] of Object.entries(collectionDirs)) {
    const files = await walk(path.join(contentRoot, dirName))
    summary.missingAfter[collectionName] = {
      documents: files.length,
      seoFocusKeyword: 0,
      seoSearchIntent: 0,
      seoCanonicalUrl: 0,
      seoOgImage: 0,
      targetKeyword: collectionName === 'localSeoPages' ? 0 : undefined,
    }

    for (const file of files) {
      summary.documents += 1
      const original = await fs.readFile(file, 'utf8')
      const doc = JSON.parse(original)
      const changes = repairDocument(collectionName, doc)

      if (changes.length > 0) {
        summary.changedDocuments += 1
        for (const field of changes) summary.changesByField[field] = (summary.changesByField[field] || 0) + 1
        changed.push({ collection: collectionName, file: relative(file), slug: doc.slug || path.basename(file, '.json'), changes })
        if (write) await fs.writeFile(file, `${JSON.stringify(doc, null, 2)}\n`)
      }

      const current = write ? doc : JSON.parse(JSON.stringify(doc))
      const missing = summary.missingAfter[collectionName]
      if (isBlank(current.seo?.focusKeyword)) missing.seoFocusKeyword += 1
      if (isBlank(current.seo?.searchIntent)) missing.seoSearchIntent += 1
      if (isBlank(current.seo?.canonicalUrl)) missing.seoCanonicalUrl += 1
      if (isBlank(current.seo?.ogImage)) missing.seoOgImage += 1
      if (collectionName === 'localSeoPages' && isBlank(current.targetKeyword)) missing.targetKeyword += 1
    }
  }

  const settingsPath = path.join(contentRoot, 'globals', 'site-settings', 'site-settings.json')
  if (fsSync.existsSync(settingsPath)) {
    const settingsOriginal = await fs.readFile(settingsPath, 'utf8')
    const settings = JSON.parse(settingsOriginal)
    const settingsChanges = []
    if (isBlank(settings.defaultMetaTitle)) {
      settings.defaultMetaTitle = 'Matthias Ramahi Fotografie Düsseldorf'
      settingsChanges.push('defaultMetaTitle')
    }
    if (isBlank(settings.defaultMetaDescription)) {
      settings.defaultMetaDescription =
        'Matthias Ramahi Fotografie in Düsseldorf und NRW: Automobil, Sportwagen, Oldtimer, Motorrad, Portrait und Landschaft für Marke, Verkauf, Print und Kampagne.'
      settingsChanges.push('defaultMetaDescription')
    }
    if (isBlank(settings.defaultOgImage)) {
      settings.defaultOgImage = defaultOgImage
      settingsChanges.push('defaultOgImage')
    }
    if (settingsChanges.length > 0) {
      changed.push({ collection: 'siteSettings', file: relative(settingsPath), slug: 'site-settings', changes: settingsChanges })
      summary.changedDocuments += 1
      for (const field of settingsChanges) summary.changesByField[`siteSettings.${field}`] = 1
      if (write) await fs.writeFile(settingsPath, `${JSON.stringify(settings, null, 2)}\n`)
    }
  }

  await fs.mkdir(outputDir, { recursive: true })
  await fs.writeFile(outputPath, `${JSON.stringify({ summary, changed }, null, 2)}\n`)
  console.log(JSON.stringify({ ...summary, changedSample: changed.slice(0, 12), outputPath: relative(outputPath) }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

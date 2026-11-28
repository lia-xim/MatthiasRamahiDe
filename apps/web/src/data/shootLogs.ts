export type RegionalHubKey = 'duesseldorf' | 'koeln' | 'nrw-ruhrgebiet'

export type ShootLogImage = {
  /** Rights-cleared image path registered in portfolio-media-registry.json or public/assets. */
  src: string
  alt: string
  width: number
  height: number
  caption?: string
}

export type ShootLogEntry = {
  id: string
  city: string
  regionHub: RegionalHubKey
  title: string
  vehicleCategory: 'Automobil' | 'Sportwagen' | 'Oldtimer' | 'Motorrad'
  locationContext: string
  lightingWindow: string
  challengeAndApproach: string
  deliverables: string[]
  images: ShootLogImage[]
  ctaHref: string
  /** Optional link to the full portfolio series of this shoot. */
  projectHref?: string
  /** Only entries with verified: true and at least one verified image render on live pages. */
  verified: boolean
}

export type RegionalPowerHubSpec = {
  key: RegionalHubKey
  /** Sichtbare Überschrift der Regionen-Sektion. */
  title: string
  /** Ein Satz zum Einsatzgebiet, ersetzt die frühere Chip-Liste. */
  coverageSentence: string
  eyebrow: string
  headline: string
  emphasis: string
  lead: string
  coverageLabel: string
  coverageAreas: string[]
  settings: Array<{
    title: string
    text: string
  }>
  siblingHubs: Array<{
    href: string
    label: string
    note: string
  }>
}

export const regionalPowerHubs: Record<RegionalHubKey, RegionalPowerHubSpec> = {
  duesseldorf: {
    key: 'duesseldorf',
    title: 'Düsseldorf und Erkrath.',
    coverageSentence: 'Unterwegs in Düsseldorf, Erkrath, Neuss, Ratingen, Hilden und Mettmann.',
    eyebrow: 'Düsseldorf · Basis Erkrath',
    headline: 'Autofotografie in',
    emphasis: 'Düsseldorf & Erkrath.',
    lead: 'Von meiner Basis in Erkrath aus sind Medienhafen und Rheinufer nah, ebenso Autohäuser, Werkstätten und private Stellplätze in Düsseldorf und Umgebung.',
    coverageLabel: 'Einsatzraum Düsseldorf & direktes Umfeld',
    coverageAreas: ['Düsseldorf', 'Erkrath', 'Neuss', 'Ratingen', 'Hilden', 'Mettmann'],
    settings: [
      {
        title: 'Medienhafen',
        text: 'Glasfassaden spiegeln sich geordnet im Lack, wenn der Standpunkt stimmt. Einer meiner liebsten Spots ist das Hyatt am Hafenbecken: dunkle Fassade, Backstein im Hintergrund.',
      },
      {
        title: 'Rheinufer',
        text: 'Offener Himmel und die Brücken als Kulisse, am schönsten zum Sonnenuntergang. Passt für Seitenansichten und Serien mit Fahrer.',
      },
      {
        title: 'Beim Händler oder zu Hause',
        text: 'Termine im Showroom, auf dem Händlerhof oder am privaten Stellplatz, ohne lange Anfahrt von Erkrath aus.',
      },
    ],
    siblingHubs: [
      {
        href: '/automobil-fotografie-koeln.html',
        label: 'Automobilfotografie Köln & Rheinland',
        note: 'Rheinauhafen, Gewerbehöfe & Rheinland',
      },
      {
        href: '/automobil-fotografie-nrw.html',
        label: 'Automobilfotografie NRW & Ruhrgebiet',
        note: 'Dortmund, Marl, Duisburg, Krefeld & Ruhrgebiet',
      },
      {
        href: '/autofotografie.html',
        label: 'Autofotografie Übersicht',
        note: 'Alle Fahrzeugtypen, Ablauf & Vorbereitung',
      },
    ],
  },

  koeln: {
    key: 'koeln',
    title: 'Köln und Rheinland.',
    coverageSentence: 'Unterwegs in Köln, Leverkusen, Bergisch Gladbach und Dormagen.',
    eyebrow: 'Köln · Rheinland',
    headline: 'Automobilfotografie in',
    emphasis: 'Köln & im Rheinland.',
    lead: 'Für Privatkunden, Autohäuser und Marken in Köln plane ich ruhige Kulissen abseits vom Innenstadtverkehr, abgestimmt auf Fahrzeugfarbe, Tageszeit und spätere Nutzung.',
    coverageLabel: 'Einsatzraum Köln & Rheinland',
    coverageAreas: ['Köln', 'Leverkusen', 'Bergisch Gladbach', 'Dormagen', 'Rheinland'],
    settings: [
      {
        title: 'Schlosshöfe und historische Fassaden',
        text: 'Ruhige, symmetrische Architektur wie am Schloss Bensberg gibt Sportwagen und Klassikern eine Bühne, die nicht mit dem Auto konkurriert.',
      },
      {
        title: 'Gewerbehöfe und Showrooms',
        text: 'Für Verkaufsinserate, Händlerbestände und Vermietungen zählen neutrale Hintergründe und wiederholbares Licht statt unruhiger Wahrzeichen.',
      },
      {
        title: 'Abendlicht und blaue Stunde',
        text: 'Weiches Spätnachmittagslicht hält Kontraste auf dunklen und hellen Lacken sauber; zur Dämmerung werden Lichtsignaturen Teil der Serie.',
      },
    ],
    siblingHubs: [
      {
        href: '/autofotografie-duesseldorf.html',
        label: 'Autofotografie Düsseldorf',
        note: 'Basis Erkrath, Medienhafen & Rheinufer',
      },
      {
        href: '/automobil-fotografie-nrw.html',
        label: 'Automobilfotografie NRW & Ruhrgebiet',
        note: 'Dortmund, Marl, Duisburg, Krefeld & Ruhrgebiet',
      },
      {
        href: '/autofotografie.html',
        label: 'Autofotografie Übersicht',
        note: 'Alle Fahrzeugtypen, Ablauf & Vorbereitung',
      },
    ],
  },

  'nrw-ruhrgebiet': {
    key: 'nrw-ruhrgebiet',
    title: 'Ruhrgebiet und NRW.',
    coverageSentence: 'Unterwegs in Dortmund, Marl, Duisburg, Krefeld, Essen, Bochum und im Bergischen Land.',
    eyebrow: 'NRW · Ruhrgebiet & Niederrhein',
    headline: 'Automobilfotografie im',
    emphasis: 'Ruhrgebiet & ganz NRW.',
    lead: 'Neben Düsseldorf und Köln fotografiere ich regelmäßig im Raum Dortmund und Marl sowie rund um Duisburg und Krefeld, von Industriekulissen bis direkt beim Händler oder Sammler.',
    coverageLabel: 'Schwerpunkte in NRW & Ruhrgebiet',
    coverageAreas: ['Dortmund', 'Marl', 'Duisburg', 'Krefeld', 'Essen', 'Bochum', 'Bergisches Land'],
    settings: [
      {
        title: 'Dortmund und Marl',
        text: 'Industrielle Kanten, moderne Gewerbeflächen und weitläufige Areale rund um Dortmund und Marl bieten viel Platz für saubere Perspektiven, Detailserien und Händlerbestände.',
      },
      {
        title: 'Duisburg und Krefeld',
        text: 'Zwischen Ruhr- und Hafenstruktur in Duisburg sowie ruhigen Flächen rund um Krefeld entstehen kontrastreiche Exterieur-Serien und ehrliche Verkaufsdokumentationen.',
      },
      {
        title: 'Zollverein und Bergisches Land',
        text: 'Backstein und Stahl im Ruhrgebiet oder weiches Licht an Waldrändern im Bergischen Land: Die Region richten wir nach Fahrzeugcharakter und Zweck aus.',
      },
    ],
    siblingHubs: [
      {
        href: '/autofotografie-duesseldorf.html',
        label: 'Autofotografie Düsseldorf',
        note: 'Basis Erkrath, Medienhafen & Rheinufer',
      },
      {
        href: '/automobil-fotografie-koeln.html',
        label: 'Automobilfotografie Köln & Rheinland',
        note: 'Rheinauhafen, Gewerbehöfe & Rheinland',
      },
      {
        href: '/autofotografie.html',
        label: 'Autofotografie Übersicht',
        note: 'Alle Fahrzeugtypen, Ablauf & Vorbereitung',
      },
    ],
  },
}

/**
 * Verified Shoot-Logs (Case Studies).
 *
 * Strictly verified real shoots only, leave empty until Matthias supplies real
 * shoot details and rights-cleared media from portfolio-media-registry.json.
 * See docs/local-proof-playbook.md for the Lokal-Beweis-Regel and fill-in template.
 */
export const verifiedShootLogs: ShootLogEntry[] = [
  {
    id: 'duesseldorf-alpina-b8-medienhafen-rhein',
    city: 'Düsseldorf',
    regionHub: 'duesseldorf',
    title: 'BMW Alpina B8 zwischen Medienhafen, Hyatt und Rheinufer',
    vehicleCategory: 'Automobil',
    locationContext:
      'Drei Spots an einem Tag: Glasfassaden im Medienhafen, das Hyatt am Hafenbecken und zum Schluss das Rheinufer mit Brückenkulisse.',
    lightingWindow: 'Nachmittag bis Sonnenuntergang',
    challengeAndApproach:
      'Dunkelgrüner Lack schluckt Licht. Im Medienhafen haben die hellen Fassaden als Reflexfläche gearbeitet, am Rhein der Abendhimmel. Die tiefe Kamera hält die Linien des Gran Coupés ruhig.',
    deliverables: ['Exterieur an drei Spots', 'Interieur mit Cognac-Leder', 'Felgen, Details und Motorraum'],
    images: [
      { src: '/assets/portfolio/automobil-bmw-alpina-b8-medienhafen-duesseldorf-dsc0728.webp', alt: 'BMW Alpina B8 vor dem Hyatt im Düsseldorfer Medienhafen', width: 1920, height: 1080, caption: 'Hyatt, Medienhafen' },
      { src: '/assets/portfolio/automobil-bmw-alpina-b8-medienhafen-duesseldorf-dsc0427.webp', alt: 'BMW Alpina B8 zwischen Glasfassaden im Medienhafen Düsseldorf', width: 1920, height: 1280, caption: 'Glasfassaden, Medienhafen' },
      { src: '/assets/portfolio/automobil-bmw-alpina-b8-medienhafen-duesseldorf-dsc0743.webp', alt: 'BMW Alpina B8 am Rheinufer in Düsseldorf zum Sonnenuntergang', width: 1920, height: 1200, caption: 'Rheinufer, Sonnenuntergang' },
    ],
    ctaHref: '#anfrage',
    projectHref: '/portfolio/bmw-alpina-b8-medienhafen-duesseldorf',
    verified: true,
  },
  {
    id: 'koeln-porsche-911-schloss-bensberg',
    city: 'Bergisch Gladbach',
    regionHub: 'koeln',
    title: 'Porsche 911 Carrera 4S vor Schloss Bensberg',
    vehicleCategory: 'Sportwagen',
    locationContext:
      'Schlosshof des Althoff Grandhotel Schloss Bensberg in Bergisch Gladbach bei Köln.',
    lightingWindow: 'März 2026, wechselhaft bewölkt',
    challengeAndApproach:
      'Silberlack spiegelt die ganze Umgebung. Die Standpunkte sind so gewählt, dass Himmel und Schlossfassade geordnet in den Flanken liegen, viele Motive entstehen aus tiefer Perspektive.',
    deliverables: ['Exterieur aus allen Perspektiven', 'Cockpit, Instrumente und Sitze', 'Leuchten, Felgen und Schriftzüge'],
    images: [
      { src: '/assets/portfolio/automobil-porsche-911-schloss-bensberg-dsc5761.webp', alt: 'Silberner Porsche 911 Carrera 4S vor Schloss Bensberg', width: 1920, height: 1280, caption: 'Schlosshof Bensberg' },
      { src: '/assets/portfolio/automobil-porsche-911-schloss-bensberg-dsc5873.webp', alt: 'Rückleuchte am silbernen Porsche 911', width: 1920, height: 1280, caption: 'Detail Heck' },
      { src: '/assets/portfolio/automobil-porsche-911-schloss-bensberg-dsc6027.webp', alt: 'Cockpit des Porsche 911 mit Blick auf Schloss Bensberg', width: 1920, height: 1280, caption: 'Cockpit mit Schlossblick' },
    ],
    ctaHref: '#anfrage',
    projectHref: '/portfolio/porsche-911-schloss-bensberg',
    verified: true,
  },
]

export function getRegionalHubKeyForSlug(legacyFile: string): RegionalHubKey | null {
  const normalized = legacyFile.replace(/^\/+/, '').toLowerCase()
  if (normalized === 'autofotografie-duesseldorf.html') return 'duesseldorf'
  if (normalized === 'automobil-fotografie-koeln.html') return 'koeln'
  if (normalized === 'automobil-fotografie-nrw.html') return 'nrw-ruhrgebiet'
  return null
}

export function getVerifiedShootLogsForHub(hub: RegionalHubKey): ShootLogEntry[] {
  return verifiedShootLogs.filter(
    (entry) => entry.verified && entry.regionHub === hub && entry.images.length > 0,
  )
}

export type LocalSeoLayoutFamily = 'automobil' | 'sportwagen' | 'oldtimer' | 'motorrad' | 'portrait' | 'landschaft'

export const localSeoFamilyPrefixMap: Array<{ family: LocalSeoLayoutFamily; prefixes: string[] }> = [
  {
    family: 'automobil',
    prefixes: [
      'automobil-fotografie',
      'auto-fotoshooting',
      'auto-fotografieren-tipps',
      'automotive-fotografie',
      'autofotografie',
      'autohaus-fotografie',
      'autoverkauf-fotos',
      'bilder-mit-auto',
      'fahrzeugfotografie',
      'fotoshooting-mit-auto',
    ],
  },
  {
    family: 'sportwagen',
    prefixes: [
      'motorsport-fotografie',
      'motorsport-sportwagen-fotografie',
      'sportwagen-fotografie',
      'sportwagen-shooting',
      'sportwagen-fotoshooting',
      'performance-car-fotografie',
      'exotic-car-fotografie',
      'supersportwagen-fotografie',
    ],
  },
  {
    family: 'oldtimer',
    prefixes: [
      'oldtimer-fotografie',
      'oldtimer-shooting',
      'oldtimer-verkaufsfotos',
      'classic-car-fotografie',
      'youngtimer-fotografie',
      'sammlerfahrzeug-fotografie',
    ],
  },
  {
    family: 'motorrad',
    prefixes: [
      'motorrad-fotografie',
      'motorrad-shooting',
      'motorrad-verkaufsfotos',
      'bike-fotografie',
      'custom-bike-fotografie',
      'biker-portrait',
    ],
  },
  {
    family: 'portrait',
    prefixes: [
      'portraitfotografie',
      'portrait-fotoshooting',
      'portraitfotografie-beleuchtung',
      'business-portrait',
      'dating-fotoshooting',
      'fotoshooting-gutschein',
      'fotoshooting-preise',
      'headshot-fotograf',
      'paarshooting-familienshooting',
      'personal-branding-fotografie',
      'schwarz-weiss-portrait-fotografie',
      'unternehmensportrait',
      'pressefoto',
    ],
  },
  {
    family: 'landschaft',
    prefixes: [
      'landschaftsfotografie',
      'landschaftsfotografie-print',
      'landschaftsbilder',
      'fine-art-prints',
      'wandbilder-landschaftsfotografie',
      'naturfotografie-prints',
    ],
  },
]

export const localSeoPrefixes = localSeoFamilyPrefixMap.flatMap(({ prefixes }) => prefixes)

export const localSeoCityTokens = [
  'bergisch-gladbach',
  'bochum',
  'deutschland',
  'dormagen',
  'dortmund',
  'duesseldorf',
  'duisburg',
  'erkrath',
  'essen',
  'gelsenkirchen',
  'hilden',
  'koeln',
  'krefeld',
  'leverkusen',
  'mettmann',
  'moenchengladbach',
  'moers',
  'neuss',
  'nrw',
  'oberhausen',
  'ratingen',
  'remscheid',
  'solingen',
  'wuppertal',
]

export const localSeoParentLegacyFiles: Record<LocalSeoLayoutFamily, string> = {
  automobil: 'automobil-fotografie.html',
  sportwagen: 'sportwagen-fotografie.html',
  oldtimer: 'oldtimer-fotografie.html',
  motorrad: 'motorrad-fotografie.html',
  portrait: 'portraitfotografie.html',
  landschaft: 'landschaftsfotografie.html',
}

export function normalizeLocalSeoSlug(value?: string | null) {
  return (value || '')
    .trim()
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/^\/+/, '')
    .replace(/\.html$/i, '')
    .toLowerCase()
}

export function localSeoLayoutFamilyForSlug(value?: string | null): LocalSeoLayoutFamily | null {
  const slug = normalizeLocalSeoSlug(value)
  if (!slug) return null

  return localSeoFamilyPrefixMap.find(({ prefixes }) => prefixes.some((prefix) => slug.startsWith(prefix)))?.family || null
}

export function localSeoLayoutFamilyForDoc(doc?: { service?: string | null; slug?: string | null; seo?: { legacyUrl?: string | null }; legacy?: { sourceFile?: string | null } } | null) {
  return (
    localSeoLayoutFamilyForSlug(doc?.legacy?.sourceFile) ||
    localSeoLayoutFamilyForSlug(doc?.seo?.legacyUrl) ||
    localSeoLayoutFamilyForSlug(doc?.slug) ||
    localSeoLayoutFamilyForSlug(doc?.service)
  )
}

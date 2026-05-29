import type { PayloadDoc } from './payload'
import {
  type LocalSeoLayoutFamily,
  localSeoCityTokens,
  localSeoFamilyPrefixMap,
  localSeoParentLegacyFiles,
  normalizeLocalSeoSlug,
} from './localSeoLayoutFamilies'

export type LocalSeoScope = {
  generic?: boolean
  label: string
  slug: string
}

export type VisualItem = {
  alt: string
  className?: string
  fullImage?: string
  height: number
  image: string
  label?: string
  title?: string
  text?: string
  width: number
}

type LinkItem = {
  href: string
  label: string
}

export type LocalSeoFamilyContent = {
  baseSlug: string
  contactLead: (scope: LocalSeoScope, serviceLabel: string) => string
  contactNoun: string
  family: LocalSeoLayoutFamily
  gallery: VisualItem[]
  heroImages: VisualItem[]
  introHeadline: string
  introParagraphs: string[]
  label: string
  moduleHeadline: string
  moduleLead: string
  modules: VisualItem[]
  parentLegacyFile: string
  related: VisualItem[]
  searchLinks: LinkItem[]
  seoTitle: string
  serviceLabel: string
}

const scopeLabels: Record<string, string> = {
  'bergisch-gladbach': 'Bergisch Gladbach',
  bochum: 'Bochum',
  deutschland: 'Deutschland',
  dormagen: 'Dormagen',
  dortmund: 'Dortmund',
  duesseldorf: 'Düsseldorf',
  duisburg: 'Duisburg',
  essen: 'Essen',
  gelsenkirchen: 'Gelsenkirchen',
  hilden: 'Hilden',
  koeln: 'Köln',
  krefeld: 'Krefeld',
  leverkusen: 'Leverkusen',
  mettmann: 'Mettmann',
  moenchengladbach: 'Mönchengladbach',
  moers: 'Moers',
  neuss: 'Neuss',
  nrw: 'NRW',
  oberhausen: 'Oberhausen',
  remscheid: 'Remscheid',
  solingen: 'Solingen',
  wuppertal: 'Wuppertal',
}

export const localSeoScopes: LocalSeoScope[] = [
  'duesseldorf',
  ...localSeoCityTokens.filter((slug) => slug !== 'duesseldorf'),
].map((slug) => ({
  label: scopeLabels[slug] || slug,
  slug,
}))

const keywordLabels: Record<string, string> = {
  'autohaus-fotografie': 'Autohaus Fotografie',
  autofotografie: 'Autofotografie',
  'autoverkauf-fotos': 'Autoverkauf Fotos',
  'automobil-fotografie': 'Automobil Fotografie',
  'automotive-fotografie': 'Automotive Fotografie',
  'bike-fotografie': 'Bike Fotografie',
  'biker-portrait': 'Biker Portrait',
  'business-portrait': 'Business Portrait',
  'classic-car-fotografie': 'Classic Car Fotografie',
  'custom-bike-fotografie': 'Custom Bike Fotografie',
  'exotic-car-fotografie': 'Exotic Car Fotografie',
  fahrzeugfotografie: 'Fahrzeugfotografie',
  'fine-art-prints': 'Fine-Art-Prints Landschaft',
  'headshot-fotograf': 'Headshot Fotograf',
  landschaftsbilder: 'Landschaftsbilder kaufen',
  landschaftsfotografie: 'Landschaftsfotografie',
  'landschaftsfotografie-print': 'Landschaftsfotografie Print',
  'motorrad-fotografie': 'Motorrad Fotografie',
  'motorrad-shooting': 'Motorrad Shooting',
  'motorrad-verkaufsfotos': 'Motorrad Verkaufsfotos',
  naturfotografie: 'Naturfotografie Prints',
  'oldtimer-fotografie': 'Oldtimer Fotografie',
  'oldtimer-shooting': 'Oldtimer Shooting',
  'oldtimer-verkaufsfotos': 'Oldtimer Verkaufsfotos',
  'performance-car-fotografie': 'Performance Car Fotografie',
  'personal-branding-fotografie': 'Personal Branding Fotografie',
  portraitfotografie: 'Portraitfotografie',
  pressefoto: 'Pressefoto',
  sammlerfahrzeug: 'Sammlerfahrzeug Fotografie',
  'sportwagen-fotografie': 'Sportwagen Fotografie',
  'sportwagen-fotoshooting': 'Sportwagen Fotoshooting',
  'sportwagen-shooting': 'Sportwagen Shooting',
  supersportwagen: 'Supersportwagen Fotografie',
  unternehmensportrait: 'Unternehmensportrait',
  wandbilder: 'Wandbilder Landschaftsfotografie',
  youngtimer: 'Youngtimer Fotografie',
}

const normalizedPrefixEntries = localSeoFamilyPrefixMap.flatMap(({ family, prefixes }) =>
  prefixes.map((prefix) => ({ family, prefix, label: keywordLabels[prefix] || keywordLabels[prefix.split('-')[0]] })),
)

const standaloneKeywordSlugs = new Set([
  'autofotografie',
  'autohaus-fotografie',
  'automotive-fotografie',
  'bike-fotografie',
  'classic-car-fotografie',
  'custom-bike-fotografie',
  'exotic-car-fotografie',
  'fahrzeugfotografie',
  'fine-art-prints-landschaft',
  'landschaftsbilder-kaufen',
  'naturfotografie-prints',
  'performance-car-fotografie',
  'personal-branding-fotografie',
  'sammlerfahrzeug-fotografie',
  'supersportwagen-fotografie',
  'wandbilder-landschaftsfotografie',
  'youngtimer-fotografie',
])

const visual = (
  image: string,
  alt: string,
  width: number,
  height: number,
  extra: Pick<VisualItem, 'className' | 'label' | 'title' | 'text'> = {},
): VisualItem => ({ image, alt, width, height, ...extra })

const previewImages: Record<string, Pick<VisualItem, 'height' | 'image' | 'width'>> = {
  '/assets/optimized/assets-photos-automobil-neon-1920.webp': { image: '/assets/optimized/assets-photos-automobil-neon-960.webp', width: 960, height: 640 },
  '/assets/optimized/assets-photos-automobil-sunset-1920.webp': { image: '/assets/optimized/assets-photos-automobil-sunset-960.webp', width: 960, height: 640 },
  '/assets/optimized/assets-photos-landschaft-1920.webp': { image: '/assets/optimized/assets-photos-landschaft-720.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-photos-motorrad-1920.webp': { image: '/assets/optimized/assets-photos-motorrad-720.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-photos-motorrad-duke-1920.webp': { image: '/assets/optimized/assets-photos-motorrad-duke-720.webp', width: 720, height: 1280 },
  '/assets/optimized/assets-photos-motorrad-ninja-road-1920.webp': { image: '/assets/optimized/assets-photos-motorrad-ninja-road-720.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-photos-oldtimer-stage-1920.webp': { image: '/assets/optimized/assets-photos-oldtimer-stage-960.webp', width: 960, height: 640 },
  '/assets/photos/portrait-blue.webp': { image: '/assets/optimized/assets-photos-portrait-blue-720.webp', width: 720, height: 900 },
  '/assets/photos/portrait-warm.webp': { image: '/assets/optimized/assets-photos-portrait-warm-720.webp', width: 720, height: 1152 },
  '/assets/optimized/assets-portfolio-20250327-dsc01550-1920.webp': { image: '/assets/portfolio/thumbs/20250327-DSC01550.webp', width: 720, height: 1090 },
  '/assets/optimized/assets-portfolio-20250414-dsc00341-1920.webp': { image: '/assets/portfolio/thumbs/20250414-DSC00341.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-portfolio-20250605-dsc03756-1920.webp': { image: '/assets/portfolio/thumbs/20250605-DSC03756.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-portfolio-20250605-dsc03978-1920.webp': { image: '/assets/portfolio/thumbs/20250605-DSC03978.webp', width: 720, height: 960 },
  '/assets/optimized/assets-portfolio-20250605-dsc04020-1920.webp': { image: '/assets/portfolio/thumbs/20250605-DSC04020.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-portfolio-dsc2986-1920.webp': { image: '/assets/portfolio/thumbs/_DSC2986.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp': { image: '/assets/portfolio/thumbs/_DSC3032_genErase (1).webp', width: 720, height: 480 },
  '/assets/optimized/assets-portfolio-dsc3878-1920.webp': { image: '/assets/portfolio/thumbs/_DSC3878.webp', width: 720, height: 480 },
  '/assets/optimized/assets-portfolio-dsc3879-1920.webp': { image: '/assets/portfolio/thumbs/_DSC3879.webp', width: 720, height: 480 },
  '/assets/optimized/assets-portfolio-dsc3892-1920.webp': { image: '/assets/portfolio/thumbs/_DSC3892.webp', width: 720, height: 480 },
  '/assets/optimized/assets-portfolio-dsc3982-1920.webp': { image: '/assets/portfolio/thumbs/_DSC3982.webp', width: 720, height: 480 },
  '/assets/optimized/assets-portfolio-dsc8032-1920.webp': { image: '/assets/portfolio/thumbs/_DSC8032.webp', width: 720, height: 900 },
  '/assets/optimized/assets-portfolio-wettberwerb-foto10-wunder-der-natur-1920.webp': { image: '/assets/portfolio/thumbs/Wettberwerb_Foto10_Wunder_der_natur.webp', width: 720, height: 448 },
  '/assets/optimized/assets-portfolio-wettberwerb-foto5-wunder-der-natur2-1920.webp': { image: '/assets/portfolio/thumbs/Wettberwerb_Foto5_Wunder_der_Natur2.webp', width: 720, height: 471 },
  '/assets/optimized/assets-portfolio-wettberwerb-foto6-wunder-der-natur-1920.webp': { image: '/assets/portfolio/thumbs/Wettberwerb_Foto6_Wunder_der_Natur.webp', width: 720, height: 520 },
  '/assets/optimized/assets-portraits-20250327-dsc01550-1920.webp': { image: '/assets/portfolio/thumbs/20250327-DSC01550.webp', width: 720, height: 1090 },
  '/assets/optimized/assets-portraits-20250605-dsc04020-1920.webp': { image: '/assets/portfolio/thumbs/20250605-DSC04020.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-portraits-dsc2310-1920.webp': { image: '/assets/portfolio/thumbs/_DSC2310.webp', width: 720, height: 480 },
  '/assets/optimized/assets-portraits-dsc2358-1920.webp': { image: '/assets/portfolio/thumbs/_DSC2358.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-portraits-dsc2744-1920.webp': { image: '/assets/portfolio/thumbs/_DSC2744.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-portraits-dsc2986-1920.webp': { image: '/assets/portfolio/thumbs/_DSC2986.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-portraits-dsc3878-1920.webp': { image: '/assets/portfolio/thumbs/_DSC3878.webp', width: 720, height: 480 },
  '/assets/optimized/assets-portraits-dsc3908-1920.webp': { image: '/assets/portfolio/thumbs/_DSC3908.webp', width: 720, height: 480 },
  '/assets/portfolio/_DSC0470-Enhanced-NR.webp': { image: '/assets/portfolio/thumbs/_DSC0470-Enhanced-NR.webp', width: 720, height: 1152 },
  '/assets/portfolio/_DSC9301-Enhanced-NR.webp': { image: '/assets/portfolio/thumbs/_DSC9301-Enhanced-NR.webp', width: 720, height: 900 },
  '/assets/portfolio/_DSC9321-Enhanced-NR.webp': { image: '/assets/portfolio/thumbs/_DSC9321-Enhanced-NR.webp', width: 720, height: 1080 },
  '/assets/portraits/_DSC0470-Enhanced-NR.webp': { image: '/assets/portfolio/thumbs/_DSC0470-Enhanced-NR.webp', width: 720, height: 1152 },
  '/assets/portraits/_DSC9301-Enhanced-NR.webp': { image: '/assets/portfolio/thumbs/_DSC9301-Enhanced-NR.webp', width: 720, height: 900 },
  '/assets/portraits/_DSC9321-Enhanced-NR.webp': { image: '/assets/portfolio/thumbs/_DSC9321-Enhanced-NR.webp', width: 720, height: 1080 },
}

export function localSeoPreviewVisual(item: VisualItem): VisualItem {
  const preview = previewImages[item.image]
  return preview ? { ...item, ...preview, fullImage: item.fullImage || item.image } : item
}

export const localSeoFamilyContent: Record<LocalSeoLayoutFamily, LocalSeoFamilyContent> = {
  automobil: {
    baseSlug: 'automobil-fotografie',
    contactLead: (scope, service) =>
      `Schreibe kurz, welches Fahrzeug fuer ${service} in ${scope.label} fotografiert werden soll, wo es steht, welche Wirkung die Bilder tragen sollen und ob die Serie privat, kommerziell oder als Kampagne genutzt wird. Wir klaeren Location, Licht und Ablauf gemeinsam vor dem ersten Klick.`,
    contactNoun: 'Automobil',
    family: 'automobil',
    gallery: [
      visual('/assets/optimized/assets-portfolio-dsc3879-1920.webp', 'Ferrari F12 Berlinetta als Exterieur-Motiv', 1920, 1280, { className: 'bg-t-hero', label: '01 / Showroom' }),
      visual('/assets/portfolio/_DSC9301-Enhanced-NR.webp', 'Cockpit und Materialdetail im Fahrzeug', 2048, 2560, { className: 'bg-t-a', label: '02 / Interieur' }),
      visual('/assets/optimized/assets-portfolio-dsc3892-1920.webp', 'Lack- und Linien-Detail', 1920, 1280, { className: 'bg-t-b', label: '03 / Detail' }),
      visual('/assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp', 'Cineastische Fahrzeugaufnahme', 1920, 1280, { className: 'bg-t-c', label: '04 / Cinematic' }),
    ],
    heroImages: [
      visual('/assets/optimized/assets-portfolio-dsc3879-1920.webp', 'Automobil Exterieur', 1920, 1280),
      visual('/assets/optimized/assets-portfolio-dsc2986-1920.webp', 'Automobil Interieur', 1707, 2560),
      visual('/assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp', 'Automobil Cinematic', 1920, 1280),
    ],
    introHeadline: 'Vom Inserat bis zur Kampagne.',
    introParagraphs: [
      'Klare Ansichten, kontrollierte Reflexe und eine Bildserie, die fuer Verkauf, Website, Social, Print und Kampagne funktioniert.',
      'Die lokale Seite nutzt die gleiche Art Direction wie die Automobil-Hauptseite und passt Text, Anfrage und SEO-Kontext auf den Ort an.',
    ],
    label: 'Automobil',
    moduleHeadline: 'Ein Bildsatz, vier Blickwinkel.',
    moduleLead: 'Exterieur, Interieur, Details und Cinematic greifen ineinander, damit aus dem Fahrzeug kein einzelnes Hero-Bild, sondern ein nutzbarer Bildsatz wird.',
    modules: [
      visual('/assets/optimized/assets-portfolio-dsc3879-1920.webp', 'Automobil Exterieur', 1920, 1280, { title: 'Exterieur', text: 'Ruhige Linien, klare Flächen, kontrollierte Spiegelungen.' }),
      visual('/assets/portfolio/_DSC9321-Enhanced-NR.webp', 'Automobil Interieur', 1707, 2560, { title: 'Interieur', text: 'Cockpit, Material, Farbe und Nutzung bleiben lesbar.' }),
      visual('/assets/optimized/assets-portfolio-dsc3892-1920.webp', 'Automobil Detail', 1920, 1280, { title: 'Details', text: 'Sicken, Felgen, Embleme und Oberflächen erzählen den Wert.' }),
      visual('/assets/optimized/assets-photos-automobil-neon-1920.webp', 'Automobil mit Lichtstimmung', 1920, 1280, { title: 'Cinematic', text: 'Stimmung für Kampagne, Editorial und Markenbild.' }),
    ],
    parentLegacyFile: localSeoParentLegacyFiles.automobil,
    related: [
      visual('/assets/optimized/assets-photos-automobil-neon-1920.webp', 'Automobilfotografie', 1920, 1280, { title: 'Automobil', label: '/automobil-fotografie.html' }),
      visual('/assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp', 'Sportwagenfotografie', 1920, 1280, { title: 'Sportwagen', label: '/sportwagen-fotografie.html' }),
      visual('/assets/optimized/assets-photos-oldtimer-stage-1920.webp', 'Oldtimerfotografie', 1920, 1280, { title: 'Oldtimer', label: '/oldtimer-fotografie.html' }),
      visual('/assets/optimized/assets-photos-motorrad-1920.webp', 'Motorradfotografie', 1707, 2560, { title: 'Motorrad', label: '/motorrad-fotografie.html' }),
    ],
    searchLinks: [
      { href: '/automotive-fotografie.html', label: 'Automotive Fotografie' },
      { href: '/autofotografie.html', label: 'Autofotografie' },
      { href: '/fahrzeugfotografie.html', label: 'Fahrzeugfotografie' },
      { href: '/autohaus-fotografie.html', label: 'Autohaus Fotografie' },
      { href: '/autoverkauf-fotos-duesseldorf.html', label: 'Autoverkauf Fotos' },
    ],
    seoTitle: 'Automobilfotografie',
    serviceLabel: 'Automobil Fotografie',
  },
  sportwagen: {
    baseSlug: 'sportwagen-fotografie',
    contactLead: (scope, service) =>
      `Schreibe kurz, welcher Sportwagen fuer ${service} in ${scope.label} fotografiert werden soll, ob die Bilder fuer Verkauf, Sammlung, Marke oder Social genutzt werden und welches Zeitfenster moeglich ist. Wir planen Licht, Ort und Ablauf gemeinsam.`,
    contactNoun: 'Sportwagen',
    family: 'sportwagen',
    gallery: [
      visual('/assets/optimized/assets-portfolio-dsc3879-1920.webp', 'Sportwagen Exterieur', 1920, 1280, { className: 't1', label: '01 / Exterieur' }),
      visual('/assets/portfolio/_DSC9321-Enhanced-NR.webp', 'Sportwagen Cockpit', 1707, 2560, { className: 't2', label: '02 / Interieur' }),
      visual('/assets/optimized/assets-portfolio-dsc3982-1920.webp', 'Sportwagen Detail', 1920, 1280, { className: 't3', label: '03 / Detail' }),
      visual('/assets/optimized/assets-photos-automobil-neon-1920.webp', 'Sportwagen Cinematic', 1920, 1280, { className: 't6', label: '04 / Cinematic' }),
    ],
    heroImages: [
      visual('/assets/optimized/mpixih9c-dsc3982-1920.webp', 'Sportwagen Detail', 1920, 1280, { className: 'detail' }),
      visual('/assets/optimized/mpixi92f-dsc3032-generase-1-1920.webp', 'Sportwagen Ganzansicht', 1920, 1280, { className: 'full' }),
      visual('/assets/optimized/mpixhlgk-dsc2986-1920.webp', 'Sportwagen Interieur', 1707, 2560, { className: 'interior' }),
    ],
    introHeadline: 'Bilder mit Druckqualität.',
    introParagraphs: [
      'Sportwagen brauchen Präzision statt Effektfeuerwerk: niedrige Blickachsen, kontrollierte Reflexe und Details, die Leistung sichtbar machen.',
      'Die lokale Variante bleibt Teil derselben visuellen Familie und setzt nur Ort, Suchintention und Anfrage-Kontext gezielt um.',
    ],
    label: 'Sportwagen',
    moduleHeadline: 'Das Auto, aus jedem Winkel.',
    moduleLead: 'Performance, Form, Innenraum und Details werden mit ruhiger Dramaturgie sichtbar.',
    modules: [
      visual('/assets/optimized/assets-portfolio-dsc3982-1920.webp', 'Sportwagen Exterieur', 1920, 1280, { title: 'Exterieur', text: 'Vollformatige Außenaufnahmen mit sauberer Linienführung.' }),
      visual('/assets/portfolio/_DSC9321-Enhanced-NR.webp', 'Sportwagen Interieur', 1707, 2560, { title: 'Interieur', text: 'Cockpit, Sitze, Material und Atmosphäre.' }),
      visual('/assets/portfolio/_DSC9301-Enhanced-NR.webp', 'Sportwagen Detail', 2048, 2560, { title: 'Details', text: 'Emblem, Bremse, Sicke, Felge und Material.' }),
      visual('/assets/optimized/assets-photos-automobil-neon-1920.webp', 'Sportwagen Cinematic', 1920, 1280, { title: 'Cinematic', text: 'Bilder mit Filmcharakter für Kampagne und Magazin.' }),
    ],
    parentLegacyFile: localSeoParentLegacyFiles.sportwagen,
    related: [
      visual('/assets/optimized/assets-photos-automobil-neon-1920.webp', 'Automobilfotografie', 1920, 1280, { title: 'Automobil', label: '/automobil-fotografie.html' }),
      visual('/assets/optimized/assets-photos-oldtimer-stage-1920.webp', 'Oldtimerfotografie', 1920, 1280, { title: 'Oldtimer', label: '/oldtimer-fotografie.html' }),
      visual('/assets/optimized/assets-photos-motorrad-1920.webp', 'Motorradfotografie', 1707, 2560, { title: 'Motorrad', label: '/motorrad-fotografie.html' }),
      visual('/assets/portfolio/thumbs/_DSC3879.webp', 'Portfolio', 720, 480, { title: 'Portfolio', label: '/portfolio.html' }),
    ],
    searchLinks: [
      { href: '/sportwagen-shooting-duesseldorf.html', label: 'Sportwagen Shooting' },
      { href: '/sportwagen-fotoshooting-duesseldorf.html', label: 'Sportwagen Fotoshooting' },
      { href: '/performance-car-fotografie.html', label: 'Performance Car Fotografie' },
      { href: '/exotic-car-fotografie.html', label: 'Exotic Car Fotografie' },
      { href: '/supersportwagen-fotografie.html', label: 'Supersportwagen Fotografie' },
    ],
    seoTitle: 'Sportwagenfotografie',
    serviceLabel: 'Sportwagen Fotografie',
  },
  oldtimer: {
    baseSlug: 'oldtimer-fotografie',
    contactLead: (scope, service) =>
      `Schreibe kurz, welcher Oldtimer fuer ${service} in ${scope.label} fotografiert werden soll - Modell, Baujahr, Standort und ob die Bilder fuer Sammlung, Auktion, Verkauf oder privat genutzt werden. Wir klaeren Raum, Licht und Ablauf gemeinsam.`,
    contactNoun: 'Oldtimer',
    family: 'oldtimer',
    gallery: [
      visual('/assets/portfolio/_DSC0470-Enhanced-NR.webp', 'Oldtimer Exponat', 1600, 2560, { className: 't1', label: '01 / Exponat' }),
      visual('/assets/portfolio/_DSC9321-Enhanced-NR.webp', 'Oldtimer Cockpit', 1707, 2560, { className: 't2', label: '02 / Cockpit' }),
      visual('/assets/optimized/assets-portfolio-dsc3892-1920.webp', 'Oldtimer Material', 1920, 1280, { className: 't3', label: '03 / Material' }),
      visual('/assets/optimized/assets-photos-oldtimer-stage-1920.webp', 'Oldtimer Bühne', 1920, 1280, { className: 't6', label: '04 / Bühne' }),
    ],
    heroImages: [
      visual('/assets/optimized/assets-photos-oldtimer-stage-1920.webp', 'Oldtimer Bühne', 1920, 1280),
      visual('/assets/portfolio/_DSC0470-Enhanced-NR.webp', 'Oldtimer Portrait', 1600, 2560),
      visual('/assets/optimized/assets-portfolio-dsc3892-1920.webp', 'Oldtimer Detail', 1920, 1280),
    ],
    introHeadline: 'Charakter mit Nostalgie.',
    introParagraphs: [
      'Oldtimer brauchen Ruhe und Abstand. Lack, Chrom, Leder und Patina werden bewusst geführt, ohne Effekt-Pose.',
      'Die Serie kann Sammlung, Auktion, Verkauf oder Ausstellung tragen und bleibt lokal auffindbar.',
    ],
    label: 'Oldtimer',
    moduleHeadline: 'Vier Spuren einer Geschichte.',
    moduleLead: 'Material, Patina, Embleme und Innenraum greifen ineinander und dokumentieren Herkunft und Zustand.',
    modules: [
      visual('/assets/portfolio/_DSC0470-Enhanced-NR.webp', 'Oldtimer Exponat', 1600, 2560, { title: 'Exponat', text: 'Hauptmotiv wie eine Ausstellung.' }),
      visual('/assets/optimized/assets-portfolio-dsc3892-1920.webp', 'Oldtimer Patina', 1920, 1280, { title: 'Patina', text: 'Material und Alterung ehrlich sichtbar.' }),
      visual('/assets/optimized/assets-portfolio-dsc2986-1920.webp', 'Oldtimer Innenraum', 1707, 2560, { title: 'Innenraum', text: 'Cockpit, Leder, Holz und Armaturen.' }),
      visual('/assets/portfolio/_DSC9321-Enhanced-NR.webp', 'Oldtimer Provenance', 1707, 2560, { title: 'Provenance', text: 'Details für Auktion, Versicherung und Verkauf.' }),
    ],
    parentLegacyFile: localSeoParentLegacyFiles.oldtimer,
    related: [
      visual('/assets/optimized/assets-photos-automobil-neon-1920.webp', 'Automobilfotografie', 1920, 1280, { title: 'Automobil', label: '/automobil-fotografie.html' }),
      visual('/assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp', 'Sportwagenfotografie', 1920, 1280, { title: 'Sportwagen', label: '/sportwagen-fotografie.html' }),
      visual('/assets/optimized/assets-portfolio-dsc8032-1920.webp', 'Drucke', 1920, 2400, { title: 'Drucke', label: '/drucke-sonderanfertigungen-duesseldorf.html' }),
      visual('/assets/portfolio/_DSC0470-Enhanced-NR.webp', 'Portfolio', 1600, 2560, { title: 'Portfolio', label: '/portfolio.html' }),
    ],
    searchLinks: [
      { href: '/classic-car-fotografie.html', label: 'Classic Car Fotografie' },
      { href: '/oldtimer-shooting-duesseldorf.html', label: 'Oldtimer Shooting' },
      { href: '/youngtimer-fotografie.html', label: 'Youngtimer Fotografie' },
      { href: '/sammlerfahrzeug-fotografie.html', label: 'Sammlerfahrzeug Fotografie' },
      { href: '/oldtimer-verkaufsfotos-duesseldorf.html', label: 'Oldtimer Verkaufsfotos' },
    ],
    seoTitle: 'Oldtimer-Fotografie',
    serviceLabel: 'Oldtimer Fotografie',
  },
  motorrad: {
    baseSlug: 'motorrad-fotografie',
    contactLead: (scope, service) =>
      `Schreibe kurz, welches Bike fuer ${service} in ${scope.label} fotografiert werden soll - Modell, Standort, ob Fahrerbilder gewuenscht sind und wofuer die Bilder genutzt werden. Wir klaeren Licht, Location und Ablauf gemeinsam.`,
    contactNoun: 'Motorrad',
    family: 'motorrad',
    gallery: [
      visual('/assets/optimized/assets-photos-motorrad-1920.webp', 'Motorrad Hero-Motiv', 1707, 2560, { className: 't1', label: '01 / Silhouette' }),
      visual('/assets/optimized/assets-portfolio-dsc3892-1920.webp', 'Motorrad Detail', 1920, 1280, { className: 't2', label: '02 / Detail' }),
      visual('/assets/optimized/assets-photos-motorrad-duke-1920.webp', 'Motorrad mit Fahrerbezug', 1920, 3413, { className: 't3', label: '03 / Haltung' }),
      visual('/assets/optimized/assets-portfolio-dsc3878-1920.webp', 'Motorrad Cinematic', 1920, 1280, { className: 't6', label: '04 / Cinematic' }),
    ],
    heroImages: [
      visual('/assets/optimized/assets-photos-motorrad-ninja-road-1920.webp', 'Motorrad Straße', 1920, 2880),
      visual('/assets/optimized/assets-photos-motorrad-duke-1920.webp', 'Motorrad Duke', 1920, 3413),
      visual('/assets/optimized/assets-photos-motorrad-1920.webp', 'Motorrad Detail', 1707, 2560),
    ],
    introHeadline: 'Geschwindigkeit und Leidenschaft auf Bildern.',
    introParagraphs: [
      'Ein Motorrad muss auch im Stand Spannung tragen: Mechanik, Material, Silhouette und Haltung werden als kraftvolle Serie geplant.',
      'Die lokale Seite bleibt im Motorrad-Layout und passt Standort, Suchintention und Anfrage sauber an.',
    ],
    label: 'Motorrad',
    moduleHeadline: 'Vom Detail bis zur Kurve.',
    moduleLead: 'Stand, Detail, Fahrerbezug, Bewegung und Social-Formate werden je nach Maschine und Nutzung kombiniert.',
    modules: [
      visual('/assets/optimized/assets-photos-motorrad-ninja-road-1920.webp', 'Motorrad Stand und Silhouette', 1920, 2880, { title: 'Stand & Silhouette', text: 'Bike pur: Proportionen, Linienführung, Haltung.' }),
      visual('/assets/optimized/assets-portfolio-dsc3892-1920.webp', 'Motorrad Detail', 1920, 1280, { title: 'Detail', text: 'Tank, Motor, Felge, Lenker und Material.' }),
      visual('/assets/optimized/assets-photos-motorrad-duke-1920.webp', 'Motorrad mit Fahrer', 1920, 3413, { title: 'Mit Fahrer', text: 'Mensch und Maschine als Haltung.' }),
      visual('/assets/optimized/assets-portfolio-dsc2986-1920.webp', 'Motorrad Cinematic', 1707, 2560, { title: 'Cinematic', text: 'Werkhalle, Asphalt, Dämmerung, Editorial.' }),
    ],
    parentLegacyFile: localSeoParentLegacyFiles.motorrad,
    related: [
      visual('/assets/optimized/assets-photos-automobil-neon-1920.webp', 'Automobilfotografie', 1920, 1280, { title: 'Automobil', label: '/automobil-fotografie.html' }),
      visual('/assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp', 'Sportwagenfotografie', 1920, 1280, { title: 'Sportwagen', label: '/sportwagen-fotografie.html' }),
      visual('/assets/optimized/assets-portfolio-dsc8032-1920.webp', 'Videografie', 1920, 2400, { title: 'Videografie', label: '/videografie-duesseldorf.html' }),
      visual('/assets/optimized/assets-portfolio-dsc3879-1920.webp', 'Portfolio', 1920, 1280, { title: 'Portfolio', label: '/portfolio.html' }),
    ],
    searchLinks: [
      { href: '/motorrad-shooting-duesseldorf.html', label: 'Motorrad Shooting' },
      { href: '/bike-fotografie.html', label: 'Bike Fotografie' },
      { href: '/custom-bike-fotografie.html', label: 'Custom Bike Fotografie' },
      { href: '/motorrad-verkaufsfotos-duesseldorf.html', label: 'Motorrad Verkaufsfotos' },
      { href: '/biker-portrait-duesseldorf.html', label: 'Biker Portrait' },
    ],
    seoTitle: 'Motorradfotografie',
    serviceLabel: 'Motorrad Fotografie',
  },
  portrait: {
    baseSlug: 'portraitfotografie',
    contactLead: (scope, service) =>
      `Schreibe kurz, wofuer die Portraits fuer ${service} in ${scope.label} gedacht sind - Personal Branding, Editorial, Team, Presse oder Bewerbung. Wichtig sind Person oder Team, gewuenschte Wirkung, Ort und Zeitraum. Stil und Licht klaeren wir vor dem ersten Klick.`,
    contactNoun: 'Portrait',
    family: 'portrait',
    gallery: [
      visual('/assets/portraits/_DSC0470-Enhanced-NR.webp', 'Portrait Hauptmotiv', 1600, 2560, { className: 't-hero', label: '01 / Portrait' }),
      visual('/assets/portraits/_DSC9321-Enhanced-NR.webp', 'Portrait Editorial', 1707, 2560, { className: 't-a', label: '02 / Editorial' }),
      visual('/assets/optimized/assets-portraits-dsc3908-1920.webp', 'Portrait Team', 1920, 1280, { className: 't-b', label: '03 / Team' }),
      visual('/assets/optimized/assets-portraits-20250605-dsc04020-1920.webp', 'Portrait Konzept', 1707, 2560, { className: 't-f', label: '04 / Konzept' }),
    ],
    heroImages: [
      visual('/assets/portraits/_DSC0470-Enhanced-NR.webp', 'Portrait warm', 1600, 2560),
      visual('/assets/portraits/_DSC9301-Enhanced-NR.webp', 'Portrait Profil', 2048, 2560),
      visual('/assets/portraits/_DSC9321-Enhanced-NR.webp', 'Portrait Editorial', 1707, 2560),
      visual('/assets/optimized/assets-portraits-20250327-dsc01550-1920.webp', 'Portrait Konzept', 1691, 2560),
    ],
    introHeadline: 'Nähe ohne Beliebigkeit.',
    introParagraphs: [
      'Portraits sollen professionell wirken, ohne Menschen glattzubügeln. Licht, Distanz und Blickführung werden auf Nutzung und Persönlichkeit abgestimmt.',
      'Die lokale Variante folgt dem Portrait-Layout und bleibt in der Bildsprache konsistent.',
    ],
    label: 'Portrait',
    moduleHeadline: 'Verschiedene Perspektiven.',
    moduleLead: 'Vom Personal Brand bis zur redaktionellen Strecke bekommt jedes Portrait einen klaren Zweck.',
    modules: [
      visual('/assets/portraits/_DSC0470-Enhanced-NR.webp', 'Founder Portrait', 1600, 2560, { title: 'Founder & Speaker', text: 'Bilder, die wirken, ohne sich aufzudrängen.' }),
      visual('/assets/optimized/assets-portraits-dsc3908-1920.webp', 'Team Portrait', 1920, 1280, { title: 'Agentur & Kanzlei', text: 'Konsistente Bildsprache ohne Charakterverlust.' }),
      visual('/assets/optimized/assets-portraits-20250605-dsc04020-1920.webp', 'Editorial Portrait', 1707, 2560, { title: 'Magazin & Strecke', text: 'Portraits mit Haltung und Erzählung.' }),
      visual('/assets/portraits/_DSC9321-Enhanced-NR.webp', 'Headshot und Profil', 1707, 2560, { title: 'Headshot & Profil', text: 'Klare Bilder für professionelle Auftritte.' }),
    ],
    parentLegacyFile: localSeoParentLegacyFiles.portrait,
    related: [
      visual('/assets/optimized/assets-portfolio-wettberwerb-foto5-wunder-der-natur2-1920.webp', 'Landschaftsfotografie', 1920, 1280, { title: 'Landschaft', label: '/landschaftsfotografie.html' }),
      visual('/assets/optimized/assets-photos-automobil-neon-1920.webp', 'Automobilfotografie', 1920, 1280, { title: 'Automobil', label: '/automobil-fotografie.html' }),
      visual('/assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp', 'Videografie', 1920, 1280, { title: 'Videografie', label: '/videografie-duesseldorf.html' }),
      visual('/assets/portraits/_DSC9321-Enhanced-NR.webp', 'Portfolio', 1707, 2560, { title: 'Portfolio', label: '/portfolio.html' }),
    ],
    searchLinks: [
      { href: '/business-portrait-duesseldorf.html', label: 'Business Portrait' },
      { href: '/headshot-fotograf-duesseldorf.html', label: 'Headshot Fotograf' },
      { href: '/personal-branding-fotografie.html', label: 'Personal Branding Fotografie' },
      { href: '/unternehmensportrait-duesseldorf.html', label: 'Unternehmensportrait' },
      { href: '/pressefoto-duesseldorf.html', label: 'Pressefoto' },
    ],
    seoTitle: 'Portraitfotografie',
    serviceLabel: 'Portrait Fotografie',
  },
  landschaft: {
    baseSlug: 'landschaftsfotografie',
    contactLead: (scope, service) =>
      `Schreibe kurz, wofuer ${service} in ${scope.label} eingesetzt werden soll - Fine-Art-Print, Innenraum, Editorial, Website oder Markenbild. Wichtig sind gewuenschte Atmosphaere, Format, Material und Zeitraum.`,
    contactNoun: 'Landschaft',
    family: 'landschaft',
    gallery: [
      visual('/assets/portfolio/thumbs/Wettberwerb_Foto5_Wunder_der_Natur2.webp', 'Landschaft Hauptmotiv', 720, 471, { className: 't-hero', label: '01 / Ruhe' }),
      visual('/assets/portfolio/thumbs/Wettberwerb_Foto6_Wunder_der_Natur.webp', 'Landschaft Fine Art', 720, 520, { className: 't-a', label: '02 / Fine Art' }),
      visual('/assets/portfolio/thumbs/Wettberwerb_Foto10_Wunder_der_natur.webp', 'Landschaft Atmosphäre', 720, 448, { className: 't-b', label: '03 / Atmosphäre' }),
      visual('/assets/portfolio/thumbs/20250605-DSC04020.webp', 'Landschaft Cinema', 720, 1080, { className: 't-c', label: '04 / Raum' }),
    ],
    heroImages: [
      visual('/assets/optimized/assets-portfolio-wettberwerb-foto5-wunder-der-natur2-1920.webp', 'Landschaft Wasser', 1920, 1280),
      visual('/assets/optimized/assets-portfolio-20250605-dsc04020-1920.webp', 'Landschaft Wald', 1707, 2560),
      visual('/assets/optimized/assets-portfolio-wettberwerb-foto10-wunder-der-natur-1920.webp', 'Landschaft Licht', 1920, 1194),
    ],
    introHeadline: 'Bilder, die einen Raum verändern.',
    introParagraphs: [
      'Landschaft steht hier weniger für lokales Shooting als für kuratierte Bildauswahl, Fine-Art-Prints, Wandbilder und großformatige Arbeiten.',
      'Die lokale Variante macht regionale Nachfrage auffindbar, ohne die Bildsprache zu verwässern.',
    ],
    label: 'Landschaft',
    moduleHeadline: 'Vier Ausführungen.',
    moduleLead: 'Jedes Motiv wird nach Raum, Material, Größe und Wirkung geplant.',
    modules: [
      visual('/assets/optimized/assets-portfolio-wettberwerb-foto6-wunder-der-natur-1920.webp', 'Fine-Art Landschaft', 1920, 1387, { title: 'Fine-Art', text: 'Papier, Tonwert und Oberfläche passend zum Motiv.' }),
      visual('/assets/optimized/assets-portfolio-wettberwerb-foto10-wunder-der-natur-1920.webp', 'Aluminium Landschaft', 1920, 1194, { title: 'Aluminium', text: 'Klare Fläche für Praxis, Hotel und Büro.' }),
      visual('/assets/optimized/assets-portfolio-20250414-dsc00341-1920.webp', 'Acrylglas Landschaft', 1707, 2560, { title: 'Acrylglas', text: 'Tiefe und Kontrast für repräsentative Räume.' }),
      visual('/assets/optimized/assets-portfolio-20250327-dsc01550-1920.webp', 'Landschaft Edition', 1691, 2560, { title: 'Edition', text: 'Limitierte Auswahl mit sauberer Fertigung.' }),
    ],
    parentLegacyFile: localSeoParentLegacyFiles.landschaft,
    related: [
      visual('/assets/photos/portrait-blue.webp', 'Portraitfotografie', 2048, 2560, { title: 'Portrait', label: '/portraitfotografie.html' }),
      visual('/assets/optimized/assets-photos-oldtimer-stage-1920.webp', 'Oldtimerfotografie', 1920, 1280, { title: 'Oldtimer', label: '/oldtimer-fotografie.html' }),
      visual('/assets/optimized/assets-portfolio-20250605-dsc03978-1920.webp', 'Drucke', 1707, 2560, { title: 'Drucke', label: '/drucke-sonderanfertigungen-duesseldorf.html' }),
      visual('/assets/optimized/assets-portfolio-wettberwerb-foto10-wunder-der-natur-1920.webp', 'Portfolio', 1920, 1194, { title: 'Portfolio', label: '/portfolio.html' }),
    ],
    searchLinks: [
      { href: '/landschaftsbilder-kaufen.html', label: 'Landschaftsbilder kaufen' },
      { href: '/fine-art-prints-landschaft.html', label: 'Fine-Art-Prints Landschaft' },
      { href: '/wandbilder-landschaftsfotografie.html', label: 'Wandbilder Landschaftsfotografie' },
      { href: '/naturfotografie-prints.html', label: 'Naturfotografie Prints' },
      { href: '/landschaftsfotografie-print-deutschland.html', label: 'Landschaftsfotografie Print Deutschland' },
    ],
    seoTitle: 'Landschaftsfotografie',
    serviceLabel: 'Landschaftsfotografie',
  },
}

export function scopeFromSlug(value?: string | null): LocalSeoScope {
  const slug = normalizeLocalSeoSlug(value)
  const token = localSeoCityTokens.find((city) => slug.endsWith(`-${city}`) || slug.includes(`-${city}-`))

  if (token) return { label: scopeLabels[token] || token, slug: token }
  if (slug.includes('deutschland')) return { label: 'Deutschland', slug: 'deutschland' }
  if (slug.includes('nrw')) return { label: 'NRW', slug: 'nrw' }
  if (standaloneKeywordSlugs.has(slug)) return { generic: true, label: 'Überregional', slug: 'generic' }

  return { label: 'Düsseldorf', slug: 'duesseldorf' }
}

export function serviceLabelFromSlug(value: string | null | undefined, familyContent: LocalSeoFamilyContent) {
  const slug = normalizeLocalSeoSlug(value)
  const match = normalizedPrefixEntries
    .filter((entry) => entry.family === familyContent.family)
    .sort((a, b) => b.prefix.length - a.prefix.length)
    .find((entry) => slug.startsWith(entry.prefix))

  return match?.label || familyContent.serviceLabel
}

export function titleForLocalSeoPage(doc: PayloadDoc | null | undefined, serviceLabel: string, scope: LocalSeoScope) {
  if (!doc?.title && scope.generic) return `${serviceLabel} | Matthias Ramahi`
  return doc?.title || `${serviceLabel} ${scope.label}`
}

export function placeDescriptor(scope: LocalSeoScope, family: LocalSeoLayoutFamily) {
  if (scope.slug === 'nrw') {
    return family === 'landschaft'
      ? 'NRW bündelt die Nachfrage nach Fine-Art-Prints, Wandbildern und Editionen; Auswahl, Material und Lieferung werden passend zum Raum geplant.'
      : 'NRW verbindet Rheinland, Ruhrgebiet, Niederrhein und Bergisches Land; die Produktion bleibt lokal auffindbar und wird von Düsseldorf aus sauber geplant.'
  }

  if (scope.slug === 'deutschland') {
    return family === 'landschaft'
      ? 'Deutschlandweit zählt vor allem die passende Motivwahl, Druckqualität, Materialität und Wirkung im Raum.'
      : 'Deutschlandweite Produktionen werden über Motiv, Nutzung, Reise, Lichtfenster und Output geplant; Düsseldorf bleibt der organisatorische Ausgangspunkt.'
  }

  if (scope.slug === 'duesseldorf') {
    return 'Düsseldorf ist der lokale Standort- und Planungsanker; Wege, Lichtfenster, Location und Ausgabeformat lassen sich dadurch präzise abstimmen.'
  }

  return `${scope.label} wird als lokaler Suchraum mit klarer Planung, passendem Lichtfenster und sauberer Nutzung der Bildserie geführt.`
}

export function heroCopyForLocalSeoPage(
  doc: PayloadDoc | null | undefined,
  familyContent: LocalSeoFamilyContent,
  serviceLabel: string,
  scope: LocalSeoScope,
) {
  if (doc?.intro) return doc.intro

  if (scope.generic) {
    return familyContent.family === 'landschaft'
      ? `${serviceLabel}: Motivwahl, Druckqualität, Material und Raumwirkung werden als Fine-Art-Print, Wandbild, Edition oder großformatige Arbeit kuratiert.`
      : `${serviceLabel}: Bildsprache, Licht, Details und Nutzung werden als kuratierte Serie geplant - vom ersten Motiv bis zur Ausgabe für Verkauf, Marke, Editorial oder Kampagne.`
  }

  const descriptor = placeDescriptor(scope, familyContent.family)
  const base =
    familyContent.family === 'landschaft'
      ? `${serviceLabel} für ${scope.label}: Licht, Weite, Material und Raumwirkung werden kuratiert - als Fine-Art-Print, Wandbild, Edition oder großformatige Arbeit.`
      : `${serviceLabel} in ${scope.label}: Bildsprache, Licht, Details und Nutzung werden als kuratierte Serie geplant.`

  return `${base} ${descriptor}`
}

export function cityLinksForFamily(familyContent: LocalSeoFamilyContent) {
  return localSeoScopes.map((scope) => ({
    href: scope.slug === 'duesseldorf' ? `/${familyContent.baseSlug}.html` : `/${familyContent.baseSlug}-${scope.slug}.html`,
    label: scope.label,
  }))
}

export function siblingFamilyLinks(scope: LocalSeoScope, currentFamily: LocalSeoLayoutFamily) {
  return Object.values(localSeoFamilyContent)
    .filter((item) => item.family !== currentFamily)
    .map((item) => ({
      href: scope.slug === 'duesseldorf' || scope.generic ? `/${item.baseSlug}.html` : `/${item.baseSlug}-${scope.slug}.html`,
      label: scope.generic ? item.seoTitle : `${item.seoTitle} ${scope.label}`,
    }))
}

import { localResponsiveImage } from './localResponsiveThumbs'
import { versionStaticAssetUrl } from '../lib/cache'
import type { RegionalHubKey } from './shootLogs'

/**
 * Bildsätze für die Automobil-Seiten.
 *
 * Jede Region zeigt Arbeiten aus verschiedenen Shootings statt einer einzelnen
 * Serie. Ortsgebundene Motive (Medienhafen, Rheinufer, Schloss Bensberg)
 * erscheinen nur auf der Seite der Region, in der sie entstanden sind.
 */

type Shot = { src: string; alt: string; width: number; height: number }

const P = '/assets/portfolio/'
const shot = (file: string, alt: string, width = 1920, height = 1280): Shot => ({ src: P + file, alt, width, height })

const bensberg = {
  front: shot('automobil-porsche-911-schloss-bensberg-dsc5761.webp', 'Silberner Porsche 911 Carrera 4S vor Schloss Bensberg'),
  side: shot('automobil-porsche-911-schloss-bensberg-dsc5746.webp', 'Porsche 911 in der Seitenansicht vor Schloss Bensberg', 1920, 1277),
  rear: shot('automobil-porsche-911-schloss-bensberg-dsc6202.webp', 'Porsche 911 in der Heckansicht im Schlosshof Bensberg'),
  light: shot('automobil-porsche-911-schloss-bensberg-dsc5873.webp', 'Rückleuchte am silbernen Porsche 911'),
  cockpit: shot('automobil-porsche-911-schloss-bensberg-dsc6027.webp', 'Cockpit des Porsche 911 mit Blick auf Schloss Bensberg'),
}
const alpina = {
  hyatt: shot('automobil-bmw-alpina-b8-medienhafen-duesseldorf-dsc0728.webp', 'BMW Alpina B8 vor dem Hyatt im Düsseldorfer Medienhafen', 1920, 1080),
  sunset: shot('automobil-bmw-alpina-b8-medienhafen-duesseldorf-dsc0743.webp', 'BMW Alpina B8 am Rheinufer in Düsseldorf zum Sonnenuntergang', 1920, 1200),
  glass: shot('automobil-bmw-alpina-b8-medienhafen-duesseldorf-dsc0427.webp', 'BMW Alpina B8 zwischen Glasfassaden im Medienhafen'),
  interior: shot('automobil-bmw-alpina-b8-medienhafen-duesseldorf-dsc0911.webp', 'Cockpit und Cognac-Leder im Alpina B8'),
  engine: shot('automobil-bmw-alpina-b8-medienhafen-duesseldorf-dsc0961.webp', 'Motorraum des Alpina B8', 1536, 1920),
}
const archive = {
  p993front: shot('serie-automobil-porsche-993-front.webp', 'Porsche 993 in der Frontansicht'),
  p993rear: shot('serie-automobil-porsche-993-heck.webp', 'Heck eines Porsche 993'),
  p993cockpit: shot('serie-automobil-porsche-993-cockpit.webp', 'Cockpit eines Porsche 993'),
  brabus: shot('automobil-brabus-sunset.webp', 'Schwarzes SUV vor Industriekulisse im Abendlicht'),
  widebody: shot('automobil-bmw-widebody.webp', 'BMW mit Widebody-Umbau', 1920, 1263),
  m3: shot('automobil-bmw-m3-showcar.webp', 'BMW M3 als Showcar'),
  klassiker: shot('automobil-bmw-klassiker.webp', 'Klassischer BMW im Detail', 1920, 1547),
  mercedesInterior: shot('automobil-mercedes-interieur-tilt.webp', 'Mercedes-Interieur aus schräger Perspektive', 1707, 2560),
  r8: shot('serie-sportwagen-audi-r8.webp', 'Audi R8 in der Seitenansicht', 1920, 1246),
  viper: shot('serie-sportwagen-dodge-viper.webp', 'Dodge Viper im Detail'),
  rennsport: shot('serie-sportwagen-porsche-911-rennsport-look.webp', 'Porsche 911 im Rennsport-Look', 1920, 1281),
  jesko: shot('automobil-oldtimer-supersportwagen-messe-bruessel-dsc3879.webp', 'Koenigsegg Jesko in Lila im Messelicht'),
  pagani: shot('automobil-oldtimer-supersportwagen-messe-bruessel-dsc3963.webp', 'Blauer Pagani im Messelicht', 1920, 1248),
  bugatti: shot('serie-oldtimer-bugatti-type-35.webp', 'Bugatti Type 35 im Hochformat', 1200, 1920),
  spokes: shot('automobil-oldtimer-supersportwagen-messe-bruessel-dsc3813.webp', 'Speichenrad eines Vorkriegs-Oldtimers', 1280, 1920),
}

// Reihenfolge passt zu den Kachelformaten der Galerie:
// hero (groß), a (hoch), b, c (breiter Streifen), d, e, f, g (breit), h (hoch)
const gallerySets: Record<RegionalHubKey | 'default', Shot[]> = {
  koeln: [bensberg.rear, archive.mercedesInterior, archive.p993front, bensberg.side, archive.jesko, bensberg.light, archive.brabus, archive.r8, archive.spokes],
  duesseldorf: [alpina.glass, alpina.engine, archive.p993rear, alpina.sunset, archive.widebody, alpina.interior, archive.m3, archive.viper, archive.mercedesInterior],
  'nrw-ruhrgebiet': [archive.brabus, archive.bugatti, archive.p993front, archive.rennsport, archive.p993cockpit, archive.klassiker, archive.pagani, archive.r8, archive.mercedesInterior],
  default: [archive.brabus, archive.mercedesInterior, archive.p993front, archive.r8, archive.jesko, archive.p993cockpit, archive.widebody, archive.rennsport, archive.bugatti],
}

const heroSets: Partial<Record<RegionalHubKey, Shot[]>> = {
  koeln: [bensberg.front, archive.p993front, archive.jesko, bensberg.rear, archive.r8, archive.brabus],
  'nrw-ruhrgebiet': [archive.brabus, archive.rennsport, archive.p993front, archive.viper, archive.jesko, archive.widebody],
}

const tileClasses = ['bg-t-hero', 'bg-t-a', 'bg-t-b', 'bg-t-c', 'bg-t-d', 'bg-t-e', 'bg-t-f', 'bg-t-g', 'bg-t-h']

export function automobilGalleryTiles(hub: RegionalHubKey | null) {
  const set = gallerySets[hub ?? 'default']
  return set.map((item, index) => {
    const r = localResponsiveImage(item.src, item.width, item.height)
    const full = versionStaticAssetUrl(item.src)
    return {
      className: tileClasses[index],
      alt: item.alt,
      src: r.src,
      mobile: r.mobile,
      srcset: r.srcset ? `${r.srcset}, ${full} ${item.width}w` : '',
      avifSrcset: '',
      full,
      width: item.width,
      height: item.height,
    }
  })
}

export function automobilHeroSlidesFor(hub: RegionalHubKey | null): Array<{ src: string; mobile?: string }> | null {
  const set = hub ? heroSets[hub] : undefined
  if (!set) return null
  return set.map((item) => ({ src: item.src }))
}

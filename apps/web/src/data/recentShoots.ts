import { localResponsiveImage } from './localResponsiveThumbs'

/**
 * Die neuesten Shootings mit eigener Projektseite, neuestes zuerst.
 * Genutzt im Portfolio und im Journal; neue Projekte oben ergänzen.
 */
export type RecentShoot = {
  href: string
  image: string
  alt: string
  meta: string
  title: string
  text: string
}

const recentShootEntries: RecentShoot[] = [
  {
    href: '/portfolio/bmw-alpina-b8-medienhafen-duesseldorf',
    image: '/assets/portfolio/automobil-bmw-alpina-b8-medienhafen-duesseldorf-dsc0728.webp',
    alt: 'BMW Alpina B8 vor dem Hyatt im Düsseldorfer Medienhafen',
    meta: 'Düsseldorf · Automobil',
    title: 'BMW Alpina B8 zwischen Medienhafen und Rhein',
    text: 'Glasfassaden, das Hyatt am Hafenbecken und ein Sonnenuntergang am Rheinufer.',
  },
  {
    href: '/portfolio/porsche-911-schloss-bensberg',
    image: '/assets/portfolio/automobil-porsche-911-schloss-bensberg-dsc5761.webp',
    alt: 'Silberner Porsche 911 Carrera 4S vor Schloss Bensberg',
    meta: 'Bergisch Gladbach · Sportwagen',
    title: 'Porsche 911 vor Schloss Bensberg',
    text: 'Ein Elfer im Schlosshof, fotografiert aus jeder Perspektive bis ins Cockpit.',
  },
  {
    href: '/portfolio/oldtimer-supersportwagen-messe-bruessel',
    image: '/assets/portfolio/automobil-oldtimer-supersportwagen-messe-bruessel-dsc3892.webp',
    alt: 'Koenigsegg Jesko in Lila auf der Interclassic Brüssel',
    meta: 'Interclassic Brüssel · Januar 2026',
    title: 'Interclassic Brüssel 2026',
    text: 'Vom Vorkriegs-Bentley bis zum lila Koenigsegg Jesko unter Messescheinwerfern.',
  },
]

export function getRecentShoots(limit = 3) {
  return recentShootEntries.slice(0, limit).map((item) => ({ ...item, visual: localResponsiveImage(item.image, 1920, 1280) }))
}

export type ConceptCard = {
  body: string
  href: string
  label: string
  title: string
  variant: 'archive' | 'lens' | 'stage'
}

export type ConceptScene = {
  body: string
  id: string
  label: string
  title: string
}

export type ConceptArchivePage = {
  backHref?: string
  backLabel?: string
  cards?: ConceptCard[]
  description: string
  eyebrow: string
  file: string
  heroBody: string
  heroTitle: string
  kind: 'index' | 'archive' | 'stage' | 'lens'
  metaTitle: string
  ogImage: string
  panels?: Array<{ body: string; label: string; title: string }>
  scenes?: ConceptScene[]
}

export const conceptArchivePages: Record<string, ConceptArchivePage> = {
  'radikale-fotografie-portfolio-konzepte.html': {
    file: 'radikale-fotografie-portfolio-konzepte.html',
    kind: 'index',
    eyebrow: 'Konzeptsystem / responsive web / drei Experiences',
    heroTitle: 'Portfolio als kuratierter Erlebnisraum.',
    heroBody:
      'Keine Galerie, kein Masonry, kein Slider. Drei eigenständige Art-Directions für dieselbe Fotografie-Marke: ruhig, theatralisch und optisch-experimentell.',
    metaTitle: 'Radikale Fotografie Portfolio Konzepte | Matthias Ramahi',
    description:
      'Portfolio als kuratierter Erlebnisraum: kuratierte Fotografie-Serien von Matthias Ramahi aus Düsseldorf für Portfolio, Marke, Print und digitale Nutzung.',
    ogImage: '/assets/optimized/assets-photos-automobil-sunset-1920.webp',
    cards: [
      {
        label: 'Floating Archive',
        title: 'The Floating Archive',
        body: 'Ein räumliches Gedächtnis aus Bildern, Kontaktspuren, Koordinaten und Fragmenten. Navigation über Nähe, Fokus und Tiefenebenen.',
        href: 'floating-archive.html',
        variant: 'archive',
      },
      {
        label: 'Narrative Stage',
        title: 'The Narrative Stage',
        body: 'Fotoserien treten wie Akte auf: Enthuellung, Gegenüberstellung, Licht/Schatten, dramaturgische Kapitel statt Standardseiten.',
        href: 'narrative-stage.html',
        variant: 'stage',
      },
      {
        label: 'Experimental Lens',
        title: 'The Experimental Lens',
        body: 'Das Interface leitet sich aus Fokus, Belichtung, Kontaktbogen und Glaslagen ab: untersuchen statt bloss ansehen.',
        href: 'experimental-lens.html',
        variant: 'lens',
      },
    ],
  },
  'floating-archive.html': {
    file: 'floating-archive.html',
    kind: 'archive',
    backHref: 'radikale-fotografie-portfolio-konzepte.html',
    backLabel: 'Konzepte',
    eyebrow: 'Floating Archive',
    heroTitle: 'Das Gedächtnis des Fotografen als begehbarer Raum.',
    heroBody:
      'Startseite: kein Hero, sondern ein kontrolliertes Schweben. Serien, Notizen und Bildfragmente organisieren sich durch Scrolltiefe und Mausnähe.',
    metaTitle: 'Floating Archive | Matthias Ramahi',
    description:
      'Das Gedächtnis des Fotografen als begehbarer Raum: Fotografie und visuelle Produktion von Matthias Ramahi in Düsseldorf, NRW und Deutschland.',
    ogImage: '/assets/optimized/assets-photos-automobil-sunset-1920.webp',
    panels: [
      {
        label: 'Navigation',
        title: 'Visuelle Spuren statt Menüs.',
        body: 'Nutzer nähern sich visuellen Spuren; Fokus öffnet Kapitel statt Menüs. Auf Mobile werden die Fundstücke zu vertikalen Karten in einer Archivbox.',
      },
      {
        label: 'Projektseite',
        title: 'Kapitel entfalten sich wie Erinnerungsschichten.',
        body: 'Tiefe Z-Ebenen, freie aber kuratierte Positionen, Koordinaten, Randnotizen und langsame Parallax-Verschiebung machen Portfolio nicht suchbar, sondern entdeckbar.',
      },
    ],
  },
  'narrative-stage.html': {
    file: 'narrative-stage.html',
    kind: 'stage',
    backHref: 'radikale-fotografie-portfolio-konzepte.html',
    backLabel: 'Konzepte',
    eyebrow: 'Narrative Stage',
    heroTitle: 'Jede Serie betritt die Bühne anders.',
    heroBody:
      'Startseite: keine Galerie. Drei Akte führen in die Bildwelt ein, mit Licht, Gegenlicht und choreografierten Enthuellungen.',
    metaTitle: 'Narrative Stage | Matthias Ramahi',
    description:
      'Jede Serie betritt die Bühne anders: Fotografie und visuelle Produktion von Matthias Ramahi in Düsseldorf, NRW und Deutschland.',
    ogImage: '/assets/optimized/assets-photos-automobil-sunset-1920.webp',
    scenes: [
      {
        id: 'arrival',
        label: 'Akt I / Arrival',
        title: 'Navigation über Akte, nicht über Seiten.',
        body: 'Die Startseite führt wie ein Auftaktbild in die Bildwelt: Öffnung, Gegenbild und Nachhall ersetzen den Standard-Slider.',
      },
      {
        id: 'friction',
        label: 'Akt II / Friction',
        title: 'Serien sind performative Momente.',
        body: 'Jede Serie erhält eine eigene Bühnensprache: Duett, Solo, Chor, Blackout. Das System bleibt kohärent, die Präsentation nie schematisch.',
      },
      {
        id: 'afterimage',
        label: 'Akt III / Afterimage',
        title: 'Ein Kapitel wie eine Szene im Theater.',
        body: 'Projektseiten arbeiten mit Auftaktbild, Gegenbild, Sequenz und Nachhall. About, Clients und Kontakt erscheinen als Rollen im Stück.',
      },
    ],
  },
  'experimental-lens.html': {
    file: 'experimental-lens.html',
    kind: 'lens',
    backHref: 'radikale-fotografie-portfolio-konzepte.html',
    backLabel: 'Konzepte',
    eyebrow: 'Experimental Lens',
    heroTitle: 'Das Werk wird optisch untersucht.',
    heroBody:
      'Startseite: ein lebender Sucher statt Hero. Fokus, Belichtung und Ausschnitt werden zur Navigation: präzise, mutig, aber benutzbar.',
    metaTitle: 'Experimental Lens | Matthias Ramahi',
    description:
      'Das Werk wird optisch untersucht: Fotografie und visuelle Produktion von Matthias Ramahi in Düsseldorf, NRW und Deutschland.',
    ogImage: '/assets/optimized/assets-photos-automobil-sunset-1920.webp',
    panels: [
      {
        label: 'Projektseite',
        title: 'Kontaktbogen als dekonstruierter Leuchttisch.',
        body: 'Seriendetails öffnen wie Glasplatten: Vordergrundbild, Negativraum, Notizlayer und technische Mikrodetails. Mobile übersetzt die Linse in vertikale Inspect-Cards.',
      },
      {
        label: 'About / Clients / Kontakt',
        title: 'Reduziert auf Haltung und Arbeitsweise.',
        body: 'Keine Bio-Wand und keine Logo-Wand: Arbeitsweise, Auftrag und Kontakt werden als klare Prüfstreifen sichtbar.',
      },
    ],
  },
}

export const conceptArchiveFiles = Object.keys(conceptArchivePages)

export function getConceptArchivePage(fileName?: string | null) {
  return conceptArchivePages[(fileName || '').replace(/^\/+/, '').toLowerCase()]
}

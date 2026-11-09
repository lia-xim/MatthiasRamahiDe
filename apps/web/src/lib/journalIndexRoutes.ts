// Crawlbare Journal-Uebersicht: feste Seiten- und Themen-URLs statt eines
// "Mehr laden"-Buttons. Jede Uebersichtsseite verlinkt ihre Beitraege als echte
// <a href>-Links, damit Suchmaschinen alle Artikel ueber hoechstens wenige
// Klicks erreichen:
//   /blog.html                       Seite 1, alle Themen
//   /journal/seite/2                 Seite 2, alle Themen
//   /journal/thema/automotive        Seite 1 eines Themas
//   /journal/thema/automotive/seite/2

export const JOURNAL_PAGE_SIZE = 24

export type JournalTopic = {
  /** URL-Segment unter /journal/thema/ */
  slug: string
  /** Wert aus journalClusterProfiles[...].filter */
  filter: string
  label: string
  title: string
  intro: string
}

export const journalTopics: JournalTopic[] = [
  {
    slug: 'automotive',
    filter: 'automotive',
    label: 'Automotive',
    title: 'Automotive-Fotografie',
    intro: 'Licht, Location, Reflexe und Bildserien für Autos – vom privaten Shooting bis zum Händlerbestand.',
  },
  {
    slug: 'sportwagen',
    filter: 'sportwagen',
    label: 'Sportwagen',
    title: 'Sportwagen-Fotografie',
    intro: 'Performance Cars im Stand und in Bewegung: Rolling Shots, Trackday, Cockpit und Detail.',
  },
  {
    slug: 'oldtimer',
    filter: 'oldtimer',
    label: 'Oldtimer',
    title: 'Oldtimer-Fotografie',
    intro: 'Classic Cars und Youngtimer: Patina, Provenienz und Bilder für Verkauf, Auktion und Archiv.',
  },
  {
    slug: 'motorrad',
    filter: 'motorrad',
    label: 'Motorrad',
    title: 'Motorrad-Fotografie',
    intro: 'Bikes, Fahrer und Werkstätten: Linien, Bewegung, Nachtaufnahmen und Custom-Details.',
  },
  {
    slug: 'portrait',
    filter: 'portrait',
    label: 'Portrait',
    title: 'Portraitfotografie',
    intro: 'Business- und private Portraits: Licht, Führung vor der Kamera und Bildauswahl.',
  },
  {
    slug: 'prozess',
    filter: 'prozess',
    label: 'Prozess',
    title: 'Fotoproduktion & Workflow',
    intro: 'Briefing, Location Scouting, Bildauswahl und alles, was vor und nach dem Auslösen passiert.',
  },
  {
    slug: 'druck',
    filter: 'print',
    label: 'Landschaft & Druck',
    title: 'Landschaft & Fine-Art-Druck',
    intro: 'Landschaftsbilder als Print und Wandbild: Material, Format und Farbmanagement.',
  },
]

export const journalTopicBySlug = (slug?: string) => journalTopics.find((topic) => topic.slug === slug)

export function journalIndexPath(topic?: JournalTopic | null, page = 1): string {
  if (topic) return page > 1 ? `/journal/thema/${topic.slug}/seite/${page}` : `/journal/thema/${topic.slug}`
  return page > 1 ? `/journal/seite/${page}` : '/blog.html'
}

/** Seitenzahl aus dem URL-Segment; null bei allem, was keine ganze Zahl >= 1 ist. */
export function parseJournalPage(value?: string): number | null {
  if (!value || !/^[1-9]\d{0,3}$/.test(value)) return null
  return Number(value)
}

/** Kompakte Seitenliste mit Auslassungen: 1 … 4 5 6 … 12 */
export function journalPageWindow(current: number, total: number): Array<number | 'gap'> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)
  const pages = new Set([1, total, current - 1, current, current + 1].filter((page) => page >= 1 && page <= total))
  const sorted = [...pages].sort((left, right) => left - right)
  const result: Array<number | 'gap'> = []
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) result.push('gap')
    result.push(page)
  })
  return result
}

const dateFormatter = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Berlin' })

export function formatJournalDate(value?: string): string {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : dateFormatter.format(date)
}

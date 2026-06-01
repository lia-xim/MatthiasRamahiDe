export function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat('de-DE', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Europe/Berlin',
    }).format(new Date(date))
  } catch {
    return date
  }
}

export function firstName(name: string) {
  return (name || '').split(/\s+/)[0] || 'zusammen'
}

// Kurze Referenz aus der UUID fuer den Mono-"Credit" (z. B. ANFR-7C8D6116).
export function refCode(id: string) {
  return 'ANFR-' + (id || '').replace(/-/g, '').slice(0, 8).toUpperCase()
}

// Marken-Tokens — reinweisser Grund, dunkle Karte mit heller Schrift.
// Sichtbarer Akzent = Stahl/Salbei; Oxid-Rot NUR als winzige Punktuation.
export const brand = {
  mat: '#ffffff', // reinweisser Seitengrund
  card: '#0f1217', // dunkle innere Karte
  inset: '#171b22', // leicht abgesetzter Nachrichten-Block
  border: 'rgba(15,18,23,0.10)', // Kartenkante auf Weiss
  fg: '#f4f6f0', // helle Schrift (hoher Kontrast)
  muted: '#aab0a8', // gedaempfter Fliesstext
  faint: '#787e77', // Labels / Metadaten
  steel: '#c5ccc4', // sichtbarer Akzent (Em-Wort)
  red: '#cf392e', // nur Mikro-Punktuation
  hair: 'rgba(244,246,240,0.12)',
  hairStrong: 'rgba(244,246,240,0.20)',
  display: "'Neue Haas Grotesk Display','Sohne','Helvetica Neue','Helvetica',Arial,sans-serif",
  mono: "'JetBrains Mono','IBM Plex Mono','SFMono-Regular',ui-monospace,Menlo,Consolas,monospace",
  email: 'info@matthiasramahi.de',
  phone: '+49 176 42 44 98 58',
  phoneHref: '+4917642449858',
  instagram: 'https://www.instagram.com/mathewspictures/',
  instagramHandle: '@mathewspictures',
  studio: 'Fotografie · Düsseldorf / NRW',
}

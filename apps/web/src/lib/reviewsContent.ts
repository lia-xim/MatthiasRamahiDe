// Echte Kundenrezensionen (Google), zentral gepflegt.
// Diese Datei ist die EINZIGE Quelle für das On-Page-Bewertungs-Widget
// (NativeReviews.astro) und das schema.org Review/aggregateRating-Markup.
//
// WICHTIG — Ehrlichkeit/Google-Policy:
//  * Nur echte, tatsächlich abgegebene Bewertungen eintragen. Nichts erfinden,
//    keine Anzahl/Sterne aufblähen. Das Markup wird sonst zu Spam und riskiert
//    eine manuelle Abstrafung.
//  * Das Widget rendert nur dort, wo es im HTML sichtbar ist — Markup und
//    sichtbarer Inhalt bleiben deckungsgleich (Google-Vorgabe).
//
// Solange `reviews` leer ist, rendert die Komponente NICHTS und es wird kein
// Markup ausgegeben. Sobald hier echte Einträge stehen, erscheint das Widget
// automatisch auf Startseite, allen 6 Fotografie-Hauptseiten und allen
// lokalen / Suchbegriff-Seiten.

// Google-Bewertungslink (g.page) — Ziel für alle „Auf Google bewerten"-CTAs.
export const googleReviewUrl = 'https://g.page/r/CX0tbKvX5WvpEBM/review'

export type Review = {
  /** Anzeigename oder Initialen, z. B. "Sebastian K." */
  author: string
  /** Sternebewertung 1–5 (deine sind alle 5) */
  rating: number
  /** Wortlaut der Rezension */
  text: string
  /** Datum als "YYYY-MM" oder "YYYY-MM-DD" (für datePublished) */
  date: string
  /** Optional: Ort des Kunden, z. B. "Düsseldorf" */
  location?: string
  /** Quelle der Bewertung, Default "Google" */
  source?: string
}

// === HIER die 5 echten Google-Rezensionen eintragen ===========================
// Beispielzeile (auskommentiert) zeigt das Format:
// {
//   author: 'Sebastian K.',
//   rating: 5,
//   text: 'Absolut professionelles Shooting, die Bilder sind ein Traum …',
//   date: '2025-04',
//   location: 'Düsseldorf',
//   source: 'Google',
// },
export const reviews: Review[] = [
  // <- noch leer: warten auf den echten Wortlaut der 5 Bewertungen
]
// =============================================================================

const round1 = (value: number) => Math.round(value * 10) / 10

/** Aggregat (Schnitt + Anzahl) aus den echten Einträgen — nicht manuell setzen. */
export const reviewsAggregate = (() => {
  if (reviews.length === 0) return null
  const sum = reviews.reduce((total, review) => total + review.rating, 0)
  return {
    ratingValue: round1(sum / reviews.length),
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1,
  }
})()

/** Komma-formatierter Schnitt für die deutsche Anzeige, z. B. "5,0". */
export const formattedAverage = reviewsAggregate
  ? reviewsAggregate.ratingValue.toFixed(1).replace('.', ',')
  : ''

export const hasReviews = reviews.length > 0

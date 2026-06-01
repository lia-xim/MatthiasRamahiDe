// Schlanke, entkoppelte Datenform fuer die E-Mail-Templates. ContactRequest
// (lib/contact/email.ts) ist strukturell ein Obermenge davon und kann direkt
// uebergeben werden — so bleibt das emails-Modul frei von Server-Importen.
export type InquiryEmailData = {
  id: string
  subject?: string
  name: string
  contact: string
  message?: string
  intentLabel?: string
  lastCta?: string
  pageTitle?: string
  pageUrl?: string
  source?: string
  createdAt: string
}

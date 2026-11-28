import type { CmsCta } from './cmsContentContract'

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const clean = (value?: string) => (typeof value === 'string' ? value.trim() : '')

/**
 * Maps a CMS call-to-action (headline, text, emailSubject) onto the
 * data-contact-* props of ContactSlot, so CMS-driven pages render the same
 * inquiry form as every other page. The last word of the headline gets the
 * same <em> accent as the default "Projekt <em>anfragen.</em>".
 */
export function contactSlotProps(cta?: CmsCta | null): Record<string, string> {
  const props: Record<string, string> = {}
  const headline = clean(cta?.headline)
  if (headline) {
    const safe = escapeHtml(headline)
    const lastSpace = safe.lastIndexOf(' ')
    props['data-contact-headline'] = lastSpace > 0 ? `${safe.slice(0, lastSpace)} <em>${safe.slice(lastSpace + 1)}</em>` : `<em>${safe}</em>`
  }
  const text = clean(cta?.text)
  if (text) props['data-contact-lead'] = escapeHtml(text)
  const subject = clean(cta?.emailSubject)
  if (subject) props['data-contact-subject'] = subject
  return props
}

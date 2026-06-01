import type { APIContext } from 'astro'

import { renderAdminEmail, renderConfirmationEmail } from '../../emails'

export const prerender = false

const sample = {
  id: '7c8d6116-130d-4bd4-99f3-a0d551c21b34',
  name: 'Marie Schäfer',
  contact: 'marie@example.com',
  message:
    'Hallo Matthias, ich hätte gern eine ruhige Bildserie für meinen Oldtimer — schöne Details, Lack, Patina. Würde mich über eine Rückmeldung freuen.',
  subject: 'Oldtimer Shooting',
  intentLabel: 'Oldtimer',
  lastCta: 'Hero / Projekt anfragen / #anfrage',
  pageTitle: 'Oldtimer Fotografie Düsseldorf',
  pageUrl: 'https://matthiasramahi.de/oldtimer-fotografie-duesseldorf.html',
  source: '/oldtimer-fotografie-duesseldorf.html',
  createdAt: '2026-06-01T09:30:00.000Z',
}

export async function GET({ url }: APIContext) {
  // Nur lokale Entwicklungs-Vorschau — in Produktion nicht erreichbar.
  if (import.meta.env.PROD) return new Response('Not found', { status: 404 })
  const which = url.searchParams.get('t') === 'admin' ? 'admin' : 'confirm'
  const { html } = which === 'admin' ? await renderAdminEmail(sample) : await renderConfirmationEmail(sample)
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } })
}

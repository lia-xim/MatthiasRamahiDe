/** @jsxImportSource react */
import { Heading, Hr, Link, Section, Text } from '@react-email/components'
import type { CSSProperties } from 'react'

import { brand, formatDate, refCode } from './format'
import {
  EmailShell,
  Footer,
  Kicker,
  Masthead,
  MessagePanel,
  MetaGrid,
  hairlineRule,
  panelBody,
  panelEmpty,
  sectionLabel,
} from './shell'
import type { InquiryEmailData } from './types'

function isEmail(value: string) {
  return /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(value || '')
}

export function InquiryAdminEmail({ data, delayed = false }: { data: InquiryEmailData; delayed?: boolean }) {
  const message = (data.message || '').trim()
  const meta: Array<[string, string]> = [
    ['Themenbereich', data.intentLabel || 'Allgemein'],
    ['Leistung', data.projectType || '—'],
    ['Projekt / Motiv', data.project || '—'],
    ['Zeitraum', data.date || '—'],
    ['Nutzung', data.use || '—'],
    ['Telefon', data.phone || '—'],
    ['Letzter CTA', data.lastCta || '—'],
    ['Seite', data.pageTitle || '—'],
    ['URL', data.pageUrl || '—'],
    ['Quelle', data.source || '—'],
    ['Eingang', formatDate(data.createdAt)],
    ['Referenz', refCode(data.id)],
  ]

  return (
    <EmailShell preview={`Neue Anfrage von ${data.name}.`}>
      <Masthead right="Website · Anfrage" />

      <Section style={{ padding: '38px 34px 4px' }}>
        <Kicker>{delayed ? 'Nachgeliefert' : 'Neue Anfrage'}</Kicker>
        <Heading style={heroName}>{data.name}</Heading>
        <Text style={contactLineWrap}>
          {isEmail(data.contact) ? (
            <Link href={`mailto:${data.contact}`} style={contactLink}>
              {data.contact}
            </Link>
          ) : (
            <span style={contactLink}>{data.contact}</span>
          )}
        </Text>
        <Text style={subjectLine}>{data.subject || 'Projektanfrage'}</Text>
      </Section>

      <MessagePanel label="Nachricht">
        {message ? (
          <Text style={panelBody}>{message}</Text>
        ) : (
          <Text style={panelEmpty}>Keine Nachricht hinterlassen — bitte direkt zurückmelden.</Text>
        )}
      </MessagePanel>

      <Section style={{ padding: '14px 34px 6px' }}>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td style={replyHint}>
                Direkt antworten an <strong style={{ color: brand.fg }}>{data.contact}</strong> — diese Mail ist als Reply-To gesetzt.
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section style={{ padding: '12px 34px 30px' }}>
        <Hr style={hairlineRule} />
        <Text style={sectionLabel}>Kontext &amp; Tracking</Text>
        <MetaGrid rows={meta} />
      </Section>

      <Footer />
    </EmailShell>
  )
}

const heroName: CSSProperties = {
  margin: '0 0 6px',
  fontFamily: brand.display,
  fontSize: 34,
  fontWeight: 800,
  lineHeight: 1.04,
  letterSpacing: '-0.02em',
  color: brand.fg,
}
const contactLineWrap: CSSProperties = { margin: '0 0 10px' }
const contactLink: CSSProperties = { color: brand.steel, textDecoration: 'none', fontFamily: brand.mono, fontSize: 13, letterSpacing: '0.01em' }
const subjectLine: CSSProperties = {
  margin: 0,
  color: brand.faint,
  fontFamily: brand.mono,
  fontSize: 10,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
}
const replyHint: CSSProperties = {
  padding: '14px 16px',
  background: brand.inset,
  border: `1px solid ${brand.hair}`,
  color: brand.muted,
  fontFamily: brand.display,
  fontSize: 13,
  lineHeight: 1.5,
}

InquiryAdminEmail.PreviewProps = {
  data: {
    id: '7c8d6116-130d-4bd4-99f3-a0d551c21b34',
    subject: 'Sportwagen Shooting',
    name: 'Marie Beispiel',
    contact: 'marie@example.com',
    message: 'Hallo, ich suche eine Bildserie für meinen 911 — Showroom und Social. Zeitraum ist flexibel.',
    intentLabel: 'Sportwagen',
    projectType: 'Sportwagen-Fotografie',
    lastCta: 'Hero / Projekt anfragen / #anfrage',
    pageTitle: 'Sportwagen Fotografie',
    pageUrl: 'https://matthiasramahi.de/sportwagen-fotografie.html',
    source: '/sportwagen-fotografie.html',
    createdAt: '2026-06-01T09:30:00.000Z',
  } satisfies InquiryEmailData,
  delayed: false,
} as { data: InquiryEmailData; delayed?: boolean }

export default InquiryAdminEmail

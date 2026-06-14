/** @jsxImportSource react */
import { Heading, Hr, Section, Text } from '@react-email/components'
import type { CSSProperties } from 'react'

import { brand, firstName, formatDate, refCode } from './format'
import {
  ContactRows,
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

export function InquiryConfirmationEmail({ data }: { data: InquiryEmailData }) {
  const message = (data.message || '').trim()
  const rows: Array<[string, string]> = [
    ['Eingang', formatDate(data.createdAt)],
    ['Referenz', refCode(data.id)],
    ['Themenbereich', data.intentLabel || 'Allgemein'],
  ]
  if (data.projectType) rows.push(['Leistung', data.projectType])
  if (data.project) rows.push(['Projekt / Motiv', data.project])
  if (data.date) rows.push(['Zeitraum', data.date])
  if (data.use) rows.push(['Nutzung', data.use])

  return (
    <EmailShell preview="Deine Anfrage ist bei Matthias Ramahi angekommen.">
      <Masthead right="Eingangsbestätigung" />

      <Section style={{ padding: '42px 34px 4px' }}>
        <Kicker>Anfrage · eingegangen</Kicker>
        <Heading style={heroHeadline}>Danke, {firstName(data.name)}.</Heading>
        <Text style={heroSub}>Deine Anfrage ist angekommen.</Text>
        <Text style={lead}>
          Ich habe deine Nachricht erhalten und schaue sie mir persönlich an. Du hörst von mir — in der Regel innerhalb von 24&nbsp;Stunden,
          werktags. Wenn es dringend ist, erreichst du mich direkt über die Wege unten.
        </Text>
      </Section>

      <MessagePanel label="Deine Nachricht">
        {message ? (
          <Text style={panelBody}>{message}</Text>
        ) : (
          <Text style={panelEmpty}>Ohne weitere Nachricht übermittelt — das genügt. Ich melde mich.</Text>
        )}
      </MessagePanel>

      <Section style={{ padding: '16px 34px 6px' }}>
        <MetaGrid rows={rows} />
      </Section>

      <Section style={{ padding: '22px 34px 6px' }}>
        <Hr style={hairlineRule} />
        <Text style={sigName}>Matthias Ramahi</Text>
        <Text style={sigRole}>{brand.studio}</Text>
      </Section>

      <Section style={{ padding: '10px 34px 30px' }}>
        <Text style={sectionLabel}>Direkter Kontakt</Text>
        <ContactRows />
      </Section>

      <Footer />
    </EmailShell>
  )
}

const heroHeadline: CSSProperties = {
  margin: '0 0 8px',
  fontFamily: brand.display,
  fontSize: 42,
  fontWeight: 800,
  lineHeight: 1.0,
  letterSpacing: '-0.022em',
  color: brand.fg,
}
const heroSub: CSSProperties = {
  margin: '0 0 18px',
  fontFamily: brand.display,
  fontSize: 19,
  fontWeight: 500,
  lineHeight: 1.2,
  letterSpacing: '-0.01em',
  color: brand.steel,
}
const lead: CSSProperties = { margin: 0, color: brand.muted, fontSize: 15, lineHeight: 1.72, fontFamily: brand.display }
const sigName: CSSProperties = { margin: '0 0 4px', color: brand.fg, fontFamily: brand.display, fontSize: 16, fontWeight: 600, letterSpacing: '0.01em' }
const sigRole: CSSProperties = {
  margin: 0,
  color: brand.faint,
  fontFamily: brand.mono,
  fontSize: 10,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
}

InquiryConfirmationEmail.PreviewProps = {
  data: {
    id: '7c8d6116-130d-4bd4-99f3-a0d551c21b34',
    subject: 'Sportwagen Shooting',
    name: 'Marie Beispiel',
    contact: 'marie@example.com',
    message: 'Hallo, ich suche eine Bildserie für meinen 911 — Showroom und Social. Zeitraum ist flexibel.',
    intentLabel: 'Sportwagen',
    projectType: 'Sportwagen-Fotografie',
    createdAt: '2026-06-01T09:30:00.000Z',
  } satisfies InquiryEmailData,
} as { data: InquiryEmailData }

export default InquiryConfirmationEmail

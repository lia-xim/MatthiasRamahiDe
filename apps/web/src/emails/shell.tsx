/** @jsxImportSource react */
import { Body, Column, Container, Head, Html, Link, Preview, Row, Section, Text } from '@react-email/components'
import type { CSSProperties, ReactNode } from 'react'

import { brand } from './format'

// ---- White page, dark card with light text --------------------------------

export function EmailShell({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html lang="de">
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={bodyStyle}>
        <Section style={matStyle}>
          <Container style={cardStyle}>{children}</Container>
          <Text style={matCaption}>Matthias Ramahi · Fotografie</Text>
        </Section>
      </Body>
    </Html>
  )
}

const bodyStyle: CSSProperties = {
  margin: 0,
  padding: 0,
  background: brand.mat,
  color: brand.fg,
  fontFamily: brand.display,
  WebkitTextSizeAdjust: '100%',
}
const matStyle: CSSProperties = { background: brand.mat, padding: '44px 18px' }
const cardStyle: CSSProperties = {
  maxWidth: 600,
  margin: '0 auto',
  background: brand.card,
  border: `1px solid ${brand.border}`,
  boxShadow: '0 24px 60px rgba(15,18,23,0.14)',
}
const matCaption: CSSProperties = {
  maxWidth: 600,
  margin: '20px auto 0',
  textAlign: 'center',
  color: '#aeb2ab',
  fontFamily: brand.mono,
  fontSize: 9,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
}

// ---- Masthead -------------------------------------------------------------

export function Masthead({ right }: { right: string }) {
  return (
    <Section style={mastheadStyle}>
      <Row>
        <Column style={mastheadMark}>MATTHIAS RAMAHI</Column>
        <Column style={mastheadRight}>{right}</Column>
      </Row>
    </Section>
  )
}

const mastheadStyle: CSSProperties = { padding: '22px 34px', borderBottom: `1px solid ${brand.hair}` }
const mastheadMark: CSSProperties = {
  fontFamily: brand.display,
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: '0.34em',
  textTransform: 'uppercase',
  color: brand.fg,
}
const mastheadRight: CSSProperties = {
  textAlign: 'right',
  fontFamily: brand.mono,
  fontSize: 10,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: brand.faint,
}

// ---- Mono kicker with the single oxidized-red punctuation bar -------------

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <table role="presentation" cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse', margin: '0 0 18px' }}>
      <tbody>
        <tr>
          <td style={{ width: 24, height: 2, background: brand.red, fontSize: 1, lineHeight: '2px' }}>&nbsp;</td>
          <td style={kickerText}>{children}</td>
        </tr>
      </tbody>
    </table>
  )
}

const kickerText: CSSProperties = {
  paddingLeft: 12,
  color: brand.muted,
  fontFamily: brand.mono,
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.26em',
  textTransform: 'uppercase',
  verticalAlign: 'middle',
}

// ---- Message panel (inset block inside the dark card) ---------------------

export function MessagePanel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Section style={{ padding: '14px 34px 6px' }}>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ background: brand.inset, border: `1px solid ${brand.hair}` }}>
        <tbody>
          <tr>
            <td style={panelCell}>
              <Text style={panelLabel}>{label}</Text>
              {children}
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  )
}

const panelCell: CSSProperties = { padding: '20px 22px', background: brand.inset, borderLeft: `2px solid ${brand.steel}` }
const panelLabel: CSSProperties = {
  margin: '0 0 10px',
  color: brand.faint,
  fontFamily: brand.mono,
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: '0.24em',
  textTransform: 'uppercase',
}
export const panelBody: CSSProperties = {
  margin: 0,
  color: brand.fg,
  fontFamily: brand.display,
  fontSize: 16,
  lineHeight: 1.62,
  whiteSpace: 'pre-wrap',
}
export const panelEmpty: CSSProperties = {
  margin: 0,
  color: brand.muted,
  fontFamily: brand.display,
  fontSize: 14,
  lineHeight: 1.6,
  fontStyle: 'italic',
}

// ---- Mono metadata grid ---------------------------------------------------

export function MetaGrid({ rows }: { rows: Array<[string, string]> }) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
      <tbody>
        {rows.map(([key, value]) => (
          <tr key={key}>
            <td style={metaKey}>{key}</td>
            <td style={metaVal}>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const metaKey: CSSProperties = {
  padding: '6px 16px 6px 0',
  color: brand.faint,
  fontFamily: brand.mono,
  fontSize: 10,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  verticalAlign: 'top',
  width: 128,
}
const metaVal: CSSProperties = {
  padding: '6px 0',
  color: brand.muted,
  fontFamily: brand.mono,
  fontSize: 11,
  lineHeight: 1.5,
  wordBreak: 'break-word',
}

// ---- Direct-contact rows --------------------------------------------------

export function ContactRows() {
  const rows: Array<[string, string, string]> = [
    ['E-Mail', brand.email, `mailto:${brand.email}`],
    ['Telefon', brand.phone, `tel:${brand.phoneHref}`],
    ['Instagram', brand.instagramHandle, brand.instagram],
  ]
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
      <tbody>
        {rows.map(([label, value, href], i) => (
          <tr key={label}>
            <td style={{ ...contactKey, borderTop: i === 0 ? `1px solid ${brand.hair}` : undefined }}>{label}</td>
            <td style={{ ...contactValCell, borderTop: i === 0 ? `1px solid ${brand.hair}` : undefined }}>
              <Link href={href} style={contactLink}>
                {value}
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const contactKey: CSSProperties = {
  padding: '9px 16px 9px 0',
  color: brand.faint,
  fontFamily: brand.mono,
  fontSize: 9,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  verticalAlign: 'middle',
  width: 96,
  borderBottom: `1px solid ${brand.hair}`,
}
const contactValCell: CSSProperties = { padding: '9px 0', verticalAlign: 'middle', borderBottom: `1px solid ${brand.hair}` }
const contactLink: CSSProperties = { color: brand.fg, textDecoration: 'none', fontFamily: brand.mono, fontSize: 12, letterSpacing: '0.02em' }

// ---- Footer ---------------------------------------------------------------

export function Footer() {
  return (
    <Section style={footerStyle}>
      <Text style={footerText}>
        MATTHIAS RAMAHI · FOTOGRAFIE · DÜSSELDORF / NRW
        <br />
        {brand.email} · {brand.phone}
      </Text>
    </Section>
  )
}

const footerStyle: CSSProperties = { padding: '20px 34px 26px', borderTop: `1px solid ${brand.hair}` }
const footerText: CSSProperties = {
  margin: 0,
  color: brand.faint,
  fontFamily: brand.mono,
  fontSize: 9,
  lineHeight: 1.8,
  letterSpacing: '0.1em',
}

// ---- Shared text atoms ----------------------------------------------------

export const hairlineRule: CSSProperties = { border: 'none', borderTop: `1px solid ${brand.hair}`, margin: '0 0 18px' }
export const sectionLabel: CSSProperties = {
  margin: '0 0 10px',
  color: brand.faint,
  fontFamily: brand.mono,
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
}

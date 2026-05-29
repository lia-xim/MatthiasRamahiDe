import { toAbsoluteSiteUrl } from './payload'
import type { JsonLd } from './seo'

export type LegalLegacyFile = 'impressum.html' | 'datenschutz.html'

export type LegalContentItem =
  | { type: 'paragraph'; html: string; small?: boolean }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'card'; title: string; paragraphs: string[] }
  | { type: 'metaGrid'; items: Array<{ label: string; value: string; note?: string }> }

export type LegalContent = {
  canonicalPath: `/${LegalLegacyFile}`
  description: string
  hero: {
    kicker: string
    title: string
    lead: string
  }
  legacyFile: LegalLegacyFile
  seoTitle: string
  sections: Array<{
    id?: string
    items: LegalContentItem[]
    title: string
  }>
  toc: Array<{
    href: string
    label: string
  }>
}

export const legalContentByFile: Record<LegalLegacyFile, LegalContent> = {
  'impressum.html': {
    legacyFile: 'impressum.html',
    canonicalPath: '/impressum.html',
    seoTitle: 'Impressum — Matthias Ramahi',
    description:
      'Impressum von Matthias Ramahi: Anbieterkennzeichnung, Kontakt und rechtliche Angaben zur Fotografie-Website aus Düsseldorf.',
    hero: {
      kicker: 'Rechtliches / Matthias Ramahi',
      title: 'Impressum',
      lead: 'Angaben gemäß § 5 DDG, Kontakt, Verantwortlichkeit und rechtliche Hinweise für das Onlineangebot von Matthias Ramahi.',
    },
    toc: [
      { href: '#verantwortlicher', label: 'Angaben gemäß DDG' },
      { href: '#kennungen', label: 'Steuer / Behörde' },
      { href: '#haftung', label: 'Haftung & Links' },
      { href: '#urheberrecht', label: 'Urheberrecht' },
      { href: '#daten', label: 'Datenschutz' },
      { href: '#analytics', label: 'Analytics' },
    ],
    sections: [
      {
        id: 'verantwortlicher',
        title: 'Angaben gemäß § 5 DDG',
        items: [
          {
            type: 'card',
            title: 'Matthias Ramahi – Fotograf',
            paragraphs: [
              'Kempener Straße 44<br>40699 Erkrath',
              '<b>E-Mail:</b> <a href="mailto:info@matthiasramahi.de">info@matthiasramahi.de</a>',
            ],
          },
        ],
      },
      {
        id: 'kennungen',
        title: 'Umsatzsteuer-ID / Wirtschafts-ID',
        items: [
          {
            type: 'metaGrid',
            items: [
              {
                label: 'Umsatzsteuer-ID',
                value: 'Auf Anfrage',
                note: 'Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz.',
              },
              { label: 'Wirtschafts-ID', value: 'Auf Anfrage' },
              { label: 'Aufsichtsbehörde', value: 'Mettmann' },
              { label: 'Verantwortlich nach § 18 Abs. 2 MStV', value: 'Matthias Ramahi' },
            ],
          },
        ],
      },
      {
        id: 'haftung',
        title: 'Haftungsausschluss',
        items: [
          { type: 'heading', text: 'Haftung für Inhalte' },
          {
            type: 'paragraph',
            html: 'Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.',
          },
          {
            type: 'paragraph',
            html: 'Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden entsprechender Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.',
          },
          { type: 'heading', text: 'Haftung für Links' },
          {
            type: 'paragraph',
            html: 'Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.',
          },
          {
            type: 'paragraph',
            html: 'Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zu diesem Zeitpunkt nicht erkennbar. Eine permanente inhaltliche Kontrolle ist ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden derartige Links umgehend entfernt.',
          },
        ],
      },
      {
        id: 'urheberrecht',
        title: 'Urheberrecht',
        items: [
          {
            type: 'paragraph',
            html: 'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.',
          },
          {
            type: 'paragraph',
            html: 'Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet und entsprechend gekennzeichnet. Sollten Sie auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen Hinweis.',
          },
        ],
      },
      {
        id: 'daten',
        title: 'Datenschutz / Werbewiderspruch',
        items: [
          {
            type: 'paragraph',
            html: 'Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit personenbezogene Daten erhoben werden, erfolgt dies – soweit möglich – auf freiwilliger Basis. Diese Daten werden ohne ausdrückliche Zustimmung nicht an Dritte weitergegeben.',
          },
          {
            type: 'paragraph',
            html: 'Wir weisen darauf hin, dass die Datenübertragung im Internet Sicherheitslücken aufweisen kann. Ein lückenloser Schutz vor dem Zugriff durch Dritte ist nicht möglich.',
          },
          {
            type: 'paragraph',
            html: 'Der Nutzung der im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur Übersendung nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird ausdrücklich widersprochen. Rechtliche Schritte im Falle unverlangter Werbeinformationen, etwa durch Spam-Mails, bleiben vorbehalten.',
          },
        ],
      },
      {
        id: 'analytics',
        title: 'Google Analytics / Branchenverzeichnis',
        items: [
          {
            type: 'paragraph',
            html: 'Soweit Google Analytics eingesetzt wird, erfolgt dies zur Analyse der Benutzung der Website. Google Analytics verwendet Cookies, die Informationen über die Nutzung der Website erzeugen können. Nutzer können die Speicherung von Cookies durch eine entsprechende Einstellung der Browser-Software verhindern.',
          },
          {
            type: 'paragraph',
            html: 'Partner: <a href="https://www.branchenverzeichnis.org/" rel="nofollow noopener">branchenverzeichnis.org</a>',
          },
        ],
      },
    ],
  },
  'datenschutz.html': {
    legacyFile: 'datenschutz.html',
    canonicalPath: '/datenschutz.html',
    seoTitle: 'Datenschutzerklärung — Matthias Ramahi',
    description:
      'Datenschutzerklärung von Matthias Ramahi: Informationen zur Verarbeitung personenbezogener Daten, Kontakt, Webhosting, Cookies und Betroffenenrechten.',
    hero: {
      kicker: 'Rechtliches / Matthias Ramahi',
      title: 'Datenschutz',
      lead: 'Informationen darüber, welche personenbezogenen Daten verarbeitet werden, zu welchen Zwecken dies geschieht und welche Rechte betroffene Personen haben.',
    },
    toc: [
      { href: '#praeambel', label: 'Präambel' },
      { href: '#verantwortlicher', label: 'Verantwortlicher' },
      { href: '#daten', label: 'Verarbeitungen' },
      { href: '#rechtsgrundlagen', label: 'Rechtsgrundlagen' },
      { href: '#sicherheit', label: 'Sicherheit' },
      { href: '#rechte', label: 'Rechte' },
      { href: '#cookies', label: 'Cookies / Kontakt' },
    ],
    sections: [
      {
        id: 'praeambel',
        title: 'Präambel',
        items: [
          {
            type: 'paragraph',
            html: 'Mit dieser Datenschutzerklärung informieren wir darüber, welche Arten personenbezogener Daten zu welchen Zwecken und in welchem Umfang verarbeitet werden. Die Erklärung gilt für alle Verarbeitungen im Rahmen unserer Leistungen, auf unseren Webseiten sowie innerhalb externer Onlinepräsenzen.',
          },
          { type: 'paragraph', html: 'Stand: 20. Mai 2025', small: true },
        ],
      },
      {
        id: 'verantwortlicher',
        title: 'Verantwortlicher',
        items: [
          {
            type: 'card',
            title: 'Matthias Ramahi',
            paragraphs: [
              'Kempener Straße 44<br>40699 Erkrath',
              '<b>E-Mail:</b> <a href="mailto:info@matthiasramahi.de">info@matthiasramahi.de</a>',
            ],
          },
        ],
      },
      {
        id: 'daten',
        title: 'Übersicht der Verarbeitungen',
        items: [
          {
            type: 'metaGrid',
            items: [
              { label: 'Datenarten', value: 'Bestands-, Kontakt-, Inhalts-, Nutzungs-, Meta- und Protokolldaten' },
              { label: 'Betroffene Personen', value: 'Nutzer, Kommunikationspartner und Interessenten' },
              { label: 'Zwecke', value: 'Kommunikation, Sicherheit, Reichweitenmessung, Verwaltung, Onlineangebot' },
              { label: 'Infrastruktur', value: 'Webhosting, technische Bereitstellung, Anfrageverwaltung' },
            ],
          },
        ],
      },
      {
        id: 'rechtsgrundlagen',
        title: 'Maßgebliche Rechtsgrundlagen',
        items: [
          {
            type: 'paragraph',
            html: 'Die Verarbeitung personenbezogener Daten erfolgt insbesondere auf Grundlage der DSGVO:',
          },
          {
            type: 'list',
            items: [
              '<b>Einwilligung</b> (Art. 6 Abs. 1 S. 1 lit. a DSGVO), wenn eine Einwilligung für einen bestimmten Zweck erteilt wurde.',
              '<b>Vertragserfüllung und vorvertragliche Anfragen</b> (Art. 6 Abs. 1 S. 1 lit. b DSGVO), soweit die Verarbeitung für Leistungen oder Anfragen erforderlich ist.',
              '<b>Berechtigte Interessen</b> (Art. 6 Abs. 1 S. 1 lit. f DSGVO), sofern unsere Interessen nicht durch die Rechte und Freiheiten der betroffenen Personen überwogen werden.',
            ],
          },
          {
            type: 'paragraph',
            html: 'Zusätzlich können nationale Datenschutzregelungen in Deutschland, insbesondere das BDSG, Anwendung finden.',
          },
        ],
      },
      {
        id: 'sicherheit',
        title: 'Sicherheitsmaßnahmen',
        items: [
          {
            type: 'paragraph',
            html: 'Wir treffen nach Maßgabe der gesetzlichen Vorgaben geeignete technische und organisatorische Maßnahmen, um ein dem Risiko angemessenes Schutzniveau zu gewährleisten. Hierzu gehören Maßnahmen zur Sicherung von Vertraulichkeit, Integrität und Verfügbarkeit der Daten.',
          },
          {
            type: 'paragraph',
            html: 'Online-Verbindungen werden – soweit technisch verfügbar – durch TLS-/SSL-Verschlüsselung geschützt. Eine verschlüsselte Verbindung ist in der Regel an „HTTPS“ in der Adresszeile des Browsers erkennbar.',
          },
        ],
      },
      {
        title: 'Übermittlung, internationale Transfers und Löschung',
        items: [
          {
            type: 'paragraph',
            html: 'Im Rahmen der Verarbeitung kann es vorkommen, dass Daten an Dienstleister oder andere Stellen übermittelt werden, soweit dies zur Bereitstellung des Onlineangebotes, zur Kommunikation oder zur Bearbeitung von Anfragen erforderlich ist.',
          },
          {
            type: 'paragraph',
            html: 'Daten werden gelöscht, sobald sie für die jeweiligen Zwecke nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.',
          },
        ],
      },
      {
        id: 'rechte',
        title: 'Rechte der betroffenen Personen',
        items: [
          {
            type: 'paragraph',
            html: 'Betroffene Personen haben nach Maßgabe der gesetzlichen Vorgaben insbesondere Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch gegen bestimmte Verarbeitungen. Soweit eine Verarbeitung auf Einwilligung beruht, kann diese Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen werden.',
          },
          {
            type: 'paragraph',
            html: 'Außerdem besteht ein Beschwerderecht bei einer zuständigen Datenschutzaufsichtsbehörde.',
          },
        ],
      },
      {
        title: 'Webhosting und Server-Logs',
        items: [
          {
            type: 'paragraph',
            html: 'Beim Aufruf dieser Website werden technisch notwendige Daten verarbeitet, damit die Seite ausgeliefert und sicher betrieben werden kann. Dazu können IP-Adresse, Datum und Uhrzeit, aufgerufene Seiten, Browserinformationen, Betriebssystem und Referrer-URL gehören.',
          },
        ],
      },
      {
        id: 'cookies',
        title: 'Cookies, Blog und Kontakt',
        items: [
          {
            type: 'paragraph',
            html: 'Cookies können eingesetzt werden, um das Onlineangebot nutzerfreundlich, sicher und technisch stabil bereitzustellen. Nutzer können die Speicherung von Cookies in ihren Browser-Einstellungen einschränken.',
          },
          {
            type: 'paragraph',
            html: 'Wenn Sie uns per E-Mail oder Kontaktformular kontaktieren, verarbeiten wir die übermittelten Angaben zur Bearbeitung der Anfrage und für mögliche Anschlussfragen. Blog- und Publikationsinhalte können verarbeitet werden, wenn Nutzer mit entsprechenden Funktionen interagieren.',
          },
        ],
      },
      {
        title: 'Webanalyse, Monitoring und Social Media',
        items: [
          {
            type: 'paragraph',
            html: 'Soweit Webanalyse- oder Monitoring-Dienste eingesetzt werden, geschieht dies zur Reichweitenmessung, Optimierung und Sicherheit des Onlineangebotes. Präsenzen in sozialen Netzwerken dienen der Außendarstellung und Kommunikation mit Interessenten.',
          },
          {
            type: 'paragraph',
            html: 'Wenn Google Analytics eingesetzt wird, verwendet der Dienst Cookies zur Analyse der Nutzung. Die durch Cookies erzeugten Informationen können an Server von Google übertragen werden. Nutzer können die Installation von Cookies durch entsprechende Browser-Einstellungen verhindern.',
          },
        ],
      },
      {
        title: 'Änderung und Aktualisierung',
        items: [
          {
            type: 'paragraph',
            html: 'Wir bitten darum, sich regelmäßig über den Inhalt dieser Datenschutzerklärung zu informieren. Die Datenschutzerklärung wird angepasst, sobald Änderungen der von uns durchgeführten Datenverarbeitungen dies erforderlich machen.',
          },
        ],
      },
    ],
  },
}

export function legalJsonLd(content: LegalContent): JsonLd[] {
  const canonicalUrl = toAbsoluteSiteUrl(content.canonicalPath)
  const breadcrumbId = `${canonicalUrl}#breadcrumb`

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Startseite',
          item: toAbsoluteSiteUrl('/'),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: content.seoTitle,
          item: canonicalUrl,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: content.seoTitle,
      description: content.description,
      inLanguage: 'de-DE',
      isPartOf: {
        '@id': `${toAbsoluteSiteUrl('/')}#website`,
      },
      breadcrumb: {
        '@id': breadcrumbId,
      },
    },
  ]
}

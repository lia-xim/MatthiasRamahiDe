import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import legacyContent from '../../web/src/data/legacyContent'

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separator = trimmed.indexOf('=')
    if (separator === -1) continue

    const key = trimmed.slice(0, separator).trim()
    const rawValue = trimmed.slice(separator + 1).trim()
    const value = rawValue.replace(/^['"]|['"]$/g, '')

    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvFile(path.resolve(process.cwd(), '.env.local'))
loadEnvFile(path.resolve(process.cwd(), '.env'))

const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })

const link = ({ label, href }: { label: string; href: string }) => ({ label, href })

const truncate = (value: unknown, maxLength: number) => {
  if (typeof value !== 'string' || value.length <= maxLength) return value

  const shortened = value.slice(0, maxLength - 3).replace(/\s+\S*$/, '')
  return `${shortened}...`
}

const normalizeSitePage = (page: Record<string, unknown>) => {
  const seo = page.seo && typeof page.seo === 'object' ? (page.seo as Record<string, unknown>) : undefined

  return {
    ...page,
    seo: seo
      ? {
          ...seo,
          description: truncate(seo.description, 170),
          title: truncate(seo.title, 70),
        }
      : seo,
  }
}

async function upsertSitePage(slug: string, data: Record<string, unknown>) {
  const existing = await payload.find({
    collection: 'site-pages',
    limit: 1,
    overrideAccess: true,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const payloadData = {
    ...data,
    _status: 'published' as const,
  }

  if (existing.docs[0]?.id) {
    await payload.update({
      id: existing.docs[0].id,
      collection: 'site-pages',
      data: payloadData as any,
      draft: false,
      overrideAccess: true,
    })
    return 'updated'
  }

  await payload.create({
    collection: 'site-pages',
    data: payloadData as any,
    draft: false,
    overrideAccess: true,
  })
  return 'created'
}

async function seedGlobals() {
  const photographyLinks = legacyContent.navigation.photographyLinks.map(link)
  const primary = [
    link(legacyContent.navigation.primary[0]),
    link(legacyContent.navigation.photographyOverview),
    ...legacyContent.navigation.primary.slice(1).map(link),
  ]

  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      primary,
      photographyLinks,
      footerLinks: legacyContent.footer.columns.flatMap((column) => column.links.map(link)),
      legalLinks: legacyContent.footer.legalLinks.map(link),
      cta: {
        label: legacyContent.navigation.cta.label,
        href: legacyContent.navigation.cta.href,
      },
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      ...legacyContent.siteSettings,
      footerStatement: legacyContent.footer.statement,
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      statement: legacyContent.footer.statement,
      statementHighlight: legacyContent.footer.statementHighlight,
      email: legacyContent.footer.email,
      phone: legacyContent.footer.phone,
      locationLabel: legacyContent.footer.locationLabel,
      studioLink: link(legacyContent.footer.studioLink),
      copyright: legacyContent.footer.copyright,
      columns: legacyContent.footer.columns.map((column) => ({
        label: column.label,
        links: column.links.map(link),
      })),
      primaryLinks: legacyContent.footer.columns.find((column) => column.id === 'studio')?.links.map(link),
      serviceLinks: [
        ...legacyContent.footer.columns.find((column) => column.id === 'foto')!.links.map(link),
        ...legacyContent.footer.columns.find((column) => column.id === 'services')!.links.map(link),
      ],
      socialLinks: legacyContent.footer.socialLinks.map((social) => ({
        label: social.label,
        href: social.href,
        platform: social.platform,
      })),
      legalLinks: legacyContent.footer.legalLinks.map(link),
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'global-ctas',
    data: {
      primary: {
        label: legacyContent.navigation.cta.label,
        href: legacyContent.navigation.cta.href,
      },
      contactModule: {
        eyebrow: 'Anfrage',
        headline: 'Projekt anfragen.',
        text:
          'Projektart, Ort, Zeitraum und gewünschte Nutzung reichen für den ersten Schritt. Ich melde mich mit Rückfragen oder einem nächsten Vorschlag per E-Mail.',
        buttonLabel: legacyContent.navigation.cta.mobileLabel,
        emailSubject: 'Projektanfrage',
      },
    },
    overrideAccess: true,
  })
}

async function seedSitePages() {
  for (const page of legacyContent.sitePages) {
    const result = await upsertSitePage(page.slug, normalizeSitePage(page))
    payload.logger.info(`${result} site-page: ${page.slug}`)
  }
}

try {
  await seedGlobals()
  await seedSitePages()
  payload.logger.info('Legacy content seed complete.')
  process.exit(0)
} catch (error) {
  payload.logger.error(error)
  process.exit(1)
}

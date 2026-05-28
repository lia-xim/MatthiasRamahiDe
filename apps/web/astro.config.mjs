import node from '@astrojs/node'
import vercel from '@astrojs/vercel'
import { defineConfig } from 'astro/config'

const productionSiteUrl = 'https://matthiasramahi.de'
const configuredSiteUrl = process.env.ASTRO_PUBLIC_SITE_URL
const siteUrl =
  process.env.NODE_ENV === 'production' && configuredSiteUrl?.includes('localhost')
    ? productionSiteUrl
    : configuredSiteUrl || productionSiteUrl
const isVercel = process.env.VERCEL === '1' || process.env.ASTRO_ADAPTER === 'vercel'

export default defineConfig({
  site: siteUrl,
  output: 'server',
  adapter: isVercel
    ? vercel()
    : node({
        mode: 'standalone',
      }),
})

import node from '@astrojs/node'
import { defineConfig } from 'astro/config'

const productionSiteUrl = 'https://matthiasramahi.de'
const configuredSiteUrl = process.env.ASTRO_PUBLIC_SITE_URL
const siteUrl =
  process.env.NODE_ENV === 'production' && configuredSiteUrl?.includes('localhost')
    ? productionSiteUrl
    : configuredSiteUrl || productionSiteUrl

export default defineConfig({
  site: siteUrl,
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
})

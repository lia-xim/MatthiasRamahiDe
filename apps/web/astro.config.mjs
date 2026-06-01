import node from '@astrojs/node'
import react from '@astrojs/react'
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
  integrations: [react({ include: ['**/emails/**'] })],
  adapter: isVercel
    ? vercel()
    : node({
        mode: 'standalone',
      }),
  vite: {
    ssr: {
      // Bundle React (and the email renderer) into the server output instead of
      // leaving them as external imports. On Vercel's pnpm function trace these
      // packages were not being included, so the always-loaded renderers.mjs
      // (`import React from 'react'`) crashed every route with ERR_MODULE_NOT_FOUND.
      // Inlining them removes the runtime package-resolution step entirely.
      noExternal: ['react', 'react-dom', '@astrojs/react', '@react-email/components', '@react-email/render'],
    },
  },
})

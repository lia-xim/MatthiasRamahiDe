import node from '@astrojs/node'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import { defineConfig } from 'astro/config'
import tina from '@tinacms/astro/integration'

const productionSiteUrl = 'https://matthiasramahi.de'
const configuredSiteUrl = process.env.ASTRO_PUBLIC_SITE_URL
const siteUrl =
  process.env.NODE_ENV === 'production' && configuredSiteUrl?.includes('localhost')
    ? productionSiteUrl
    : configuredSiteUrl || productionSiteUrl
const isVercel = process.env.VERCEL === '1' || process.env.ASTRO_ADAPTER === 'vercel'
const allowedHosts = (process.env.TINA_ALLOWED_HOSTS || 'cms.matthiasramahi.de')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean)

export default defineConfig({
  site: siteUrl,
  output: 'server',
  devToolbar: {
    enabled: false,
  },
  integrations: [react({ include: ['**/emails/**'] }), tina()],
  adapter: isVercel
    ? vercel()
    : node({
        mode: 'standalone',
      }),
  // Only when building for Vercel: bundle React (and the email renderer) into the
  // server output instead of leaving them as external imports. Vercel's pnpm
  // function trace was not including these packages, so the always-loaded
  // renderers.mjs (`import React from 'react'`) crashed every route with
  // ERR_MODULE_NOT_FOUND. Inlining them removes the runtime resolution step.
  // This MUST stay scoped to the Vercel build — applying noExternal in `astro dev`
  // makes Vite's SSR module-runner evaluate React's CommonJS entry as ESM and
  // throw "module is not defined". Dev/node keep React external (resolved from
  // node_modules), which works fine; only the traced Vercel function needed it.
  vite: {
    server: {
      allowedHosts,
    },
    ...(isVercel
      ? {
          ssr: {
            noExternal: ['react', 'react-dom', '@astrojs/react', '@react-email/render'],
          },
        }
      : {}),
  },
})

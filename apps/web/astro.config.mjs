import node from '@astrojs/node'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: process.env.ASTRO_PUBLIC_SITE_URL || 'https://matthiasramahi.de',
  output: 'static',
  adapter: node({
    mode: 'standalone',
  }),
})

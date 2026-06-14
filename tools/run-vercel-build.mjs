import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      ...options,
    })
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} exited with ${code}`))
    })
    child.on('error', reject)
  })
}

const env = {
  ...process.env,
  ASTRO_ADAPTER: 'vercel',
  ASTRO_CONTENT_SOURCE: process.env.ASTRO_CONTENT_SOURCE ?? 'tina',
  ASTRO_PUBLIC_MEDIA_BASE_URL: process.env.ASTRO_PUBLIC_MEDIA_BASE_URL ?? 'https://cms.matthiasramahi.de',
  ASTRO_DISABLE_LEGACY_CMS_LOOKUP: process.env.ASTRO_DISABLE_LEGACY_CMS_LOOKUP ?? 'true',
  ASTRO_ENABLE_CMS_DYNAMIC_ROUTES: process.env.ASTRO_ENABLE_CMS_DYNAMIC_ROUTES ?? 'false',
  ASTRO_ENABLE_CMS_JOURNAL_ROUTES: process.env.ASTRO_ENABLE_CMS_JOURNAL_ROUTES ?? 'false',
  ASTRO_ENABLE_CMS_SERVICE_ROUTES: process.env.ASTRO_ENABLE_CMS_SERVICE_ROUTES ?? 'false',
  ASTRO_ENABLE_LOCAL_SEO_ADOPTED_ROUTES: process.env.ASTRO_ENABLE_LOCAL_SEO_ADOPTED_ROUTES ?? 'false',
  ASTRO_ENABLE_NATIVE_LOCAL_SEO_HTML_ROUTES: process.env.ASTRO_ENABLE_NATIVE_LOCAL_SEO_HTML_ROUTES ?? 'false',
}

const webRoot = path.join(process.cwd(), 'apps', 'web')

await run('corepack', ['pnpm', '--filter', '@matthias-ramahi/web', 'tina:build'], { env })
await fs.rm(path.join(webRoot, 'public', 'admin'), { recursive: true, force: true })
await run('corepack', ['pnpm', '--filter', '@matthias-ramahi/web', 'build'], { env })
await run('node', ['tools/copy-vercel-output.mjs'], { env: process.env })

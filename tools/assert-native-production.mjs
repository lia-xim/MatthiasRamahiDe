import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const webSourceRoot = path.join(repoRoot, 'apps', 'web', 'src')
const publicRoot = path.join(repoRoot, 'apps', 'web', 'public')
const publicAssetRoot = path.join(publicRoot, 'assets')
const assetSyncScript = path.join(repoRoot, 'tools', 'sync-public-assets.mjs')
const routeAuditScript = path.join(repoRoot, 'apps', 'web', 'scripts', 'legacy-route-audit.mjs')
const textExtensions = new Set(['.astro', '.css', '.html', '.js', '.jsx', '.json', '.mjs', '.ts', '.tsx'])
const failures = []
const allowedWebRuntimeFsImports = new Map([
  ['apps/web/src/layouts/AdoptedPageLayout.astro', 'CSS-only critical asset inlining for adopted native pages'],
  ['apps/web/src/lib/contact/email.ts', 'contact retry queue persistence'],
])

async function exists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function collectFiles(dir, predicate = () => true) {
  const files = []
  if (!(await exists(dir))) return files

  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (['.astro', '.git', 'dist', 'node_modules'].includes(entry.name)) continue
      files.push(...(await collectFiles(fullPath, predicate)))
      continue
    }
    if (entry.isFile() && predicate(fullPath)) files.push(fullPath)
  }

  return files
}

function relative(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, '/')
}

async function assertNoPublicHtml() {
  const files = await collectFiles(publicRoot, (file) => path.extname(file).toLowerCase() === '.html')
  if (files.length === 0) return
  failures.push(`apps/web/public contains HTML files that can shadow Astro routes: ${files.slice(0, 10).map(relative).join(', ')}`)
}

async function assertNoPublicLegacyAssets() {
  const files = await collectFiles(publicAssetRoot, (file) => path.basename(file).startsWith('legacy-'))
  if (files.length === 0) return
  failures.push(`apps/web/public/assets contains legacy-* assets: ${files.slice(0, 10).map(relative).join(', ')}`)
}

async function assertNoProductionLegacyRenderMarkers() {
  const files = await collectFiles(webSourceRoot, (file) => textExtensions.has(path.extname(file).toLowerCase()))
  const checks = [
    { pattern: /set:html=\{legacyHtml\}/, label: 'raw legacy HTML render marker' },
    { pattern: /payload-legacy-html/, label: 'Payload legacy HTML render source in web runtime' },
    { pattern: /\/assets\/legacy-/, label: 'legacy asset URL in web runtime' },
    { pattern: /sync-legacy-public/, label: 'old legacy public sync path' },
  ]

  for (const file of files) {
    const text = await fs.readFile(file, 'utf8')
    for (const check of checks) {
      if (check.pattern.test(text)) {
        failures.push(`${relative(file)} contains ${check.label}.`)
      }
    }
  }
}

async function assertNoUnexpectedWebRuntimeFsAccess() {
  const files = await collectFiles(webSourceRoot, (file) => textExtensions.has(path.extname(file).toLowerCase()))

  for (const file of files) {
    const text = await fs.readFile(file, 'utf8')
    if (!/from\s+['"]node:fs(?:\/promises)?['"]/.test(text)) continue

    const rel = relative(file)
    if (!allowedWebRuntimeFsImports.has(rel)) {
      failures.push(`${rel} imports node:fs in Astro runtime code without an allowlisted native-production reason.`)
    }
  }
}

async function assertAdoptedLayoutCannotInlineHtml() {
  const rel = 'apps/web/src/layouts/AdoptedPageLayout.astro'
  const file = path.join(repoRoot, rel)
  const text = await fs.readFile(file, 'utf8')

  if (!/cleanHref\.startsWith\('assets\/'\)\s*\|\|\s*!cleanHref\.endsWith\('\.css'\)/.test(text)) {
    failures.push(`${rel} must keep critical inlining limited to CSS assets, not root HTML or arbitrary files.`)
  }
}

async function assertAssetSyncIsNativeByDefault() {
  const text = await fs.readFile(assetSyncScript, 'utf8')
  if (!text.includes('SYNC_INCLUDE_ROOT_REFERENCE_HTML')) {
    failures.push('tools/sync-public-assets.mjs must keep root HTML reference scanning behind SYNC_INCLUDE_ROOT_REFERENCE_HTML.')
  }
  if (!/const includeRootReferenceFiles = process\.env\.SYNC_INCLUDE_ROOT_REFERENCE_HTML === 'true'/.test(text)) {
    failures.push('tools/sync-public-assets.mjs must not scan root HTML reference files by default.')
  }
}

async function assertRouteAuditRequiresNativeLayoutMarker() {
  const text = await fs.readFile(routeAuditScript, 'utf8')
  if (!text.includes("document.body?.dataset?.cmsLayoutSource")) {
    failures.push('apps/web/scripts/legacy-route-audit.mjs must collect the native Astro layout marker.')
  }
  if (!text.includes("'native-adopted-chrome'") || !text.includes("'base-layout'")) {
    failures.push('apps/web/scripts/legacy-route-audit.mjs must require native Astro layout sources for migrated HTML routes.')
  }
}

await assertNoPublicHtml()
await assertNoPublicLegacyAssets()
await assertNoProductionLegacyRenderMarkers()
await assertNoUnexpectedWebRuntimeFsAccess()
await assertAdoptedLayoutCannotInlineHtml()
await assertAssetSyncIsNativeByDefault()
await assertRouteAuditRequiresNativeLayoutMarker()

if (failures.length > 0) {
  console.error('Native production guard failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(
  'Native production guard passed: no public HTML shadows, no public legacy assets, no raw legacy web render path, no unexpected runtime fs access, and layout-marker route audit enforced.',
)

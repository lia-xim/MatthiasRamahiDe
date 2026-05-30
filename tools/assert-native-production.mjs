import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { auditNativeRouteCoverage } from './assert-native-route-coverage.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const webSourceRoot = path.join(repoRoot, 'apps', 'web', 'src')
const cmsSourceRoot = path.join(repoRoot, 'apps', 'cms', 'src')
const publicRoot = path.join(repoRoot, 'apps', 'web', 'public')
const publicAssetRoot = path.join(publicRoot, 'assets')
const legacyReferenceHtmlRoot = path.join(repoRoot, 'legacy-reference', 'html')
const assetSyncScript = path.join(repoRoot, 'tools', 'sync-public-assets.mjs')
const routeAuditScript = path.join(repoRoot, 'apps', 'web', 'scripts', 'legacy-route-audit.mjs')
const rootPackageJson = path.join(repoRoot, 'package.json')
const removedRouteDirs = [
  'apps/web/src/pages/componentized',
  'apps/web/src/pages/legacy-baseline',
]
const legacyReferenceMutationScripts = [
  'tools/regenerate-local-pages-from-category-templates.mjs',
  'tools/strengthen-photography-clusters.mjs',
  'tools/generate-blog-support-pages.mjs',
  'tools/optimize-legacy-media.mjs',
  'tools/harden-legacy-seo.mjs',
  'tools/harden-legacy-performance.mjs',
  'tools/replace-heavy-legacy-image-references.mjs',
  'tools/extract-repeated-inline-assets.mjs',
]
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

async function assertNoRootHtml() {
  const entries = await fs.readdir(repoRoot, { withFileTypes: true })
  const htmlFiles = entries.filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === '.html')
  if (htmlFiles.length === 0) return
  failures.push(
    `Repository root contains legacy HTML route files that can be mistaken for active project pages: ${htmlFiles
      .slice(0, 10)
      .map((entry) => entry.name)
      .join(', ')}. Move legacy references to legacy-reference/html.`,
  )
}

async function assertArchivedLegacyReferencesPresent() {
  const manifest = JSON.parse(await fs.readFile(path.join(repoRoot, 'docs', 'legacy-reference-manifest.json'), 'utf8'))
  const missing = []
  for (const entry of manifest.entries || []) {
    const file = typeof entry.file === 'string' ? entry.file : ''
    if (!file) continue
    if (!(await exists(path.join(legacyReferenceHtmlRoot, file)))) missing.push(file)
  }
  if (missing.length > 0) {
    failures.push(`Archived legacy reference HTML files are missing from legacy-reference/html: ${missing.slice(0, 20).join(', ')}`)
  }
}

async function assertNoRemovedRouteDirs() {
  for (const rel of removedRouteDirs) {
    if (await exists(path.join(repoRoot, rel))) {
      failures.push(`${rel} must stay removed; legacy/componentized baselines are served only by QA tooling, not Astro page routes.`)
    }
  }
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

async function assertNoMojibakeInProductionSources() {
  const sourceRoots = [webSourceRoot, cmsSourceRoot]
  const mojibakePattern = /\u00c3|\u00c2|\u00e2[\u20ac\u2020]|\ufffd/u

  for (const sourceRoot of sourceRoots) {
    const files = await collectFiles(sourceRoot, (file) => textExtensions.has(path.extname(file).toLowerCase()))
    for (const file of files) {
      const text = await fs.readFile(file, 'utf8')
      if (mojibakePattern.test(text)) {
        failures.push(`${relative(file)} contains mojibake-like text. Fix the source encoding before release.`)
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
    failures.push('tools/sync-public-assets.mjs must keep archived legacy HTML reference scanning behind SYNC_INCLUDE_ROOT_REFERENCE_HTML.')
  }
  if (!/const includeRootReferenceFiles = process\.env\.SYNC_INCLUDE_ROOT_REFERENCE_HTML === 'true'/.test(text)) {
    failures.push('tools/sync-public-assets.mjs must not scan archived legacy HTML reference files by default.')
  }
  if (!text.includes('legacy-reference')) {
    failures.push('tools/sync-public-assets.mjs must scan archived legacy HTML references from legacy-reference/html, never repository root HTML files.')
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

async function assertNativeDispatchFailsClosed() {
  const adoptedPageRel = 'apps/web/src/components/native/NativeAdoptedPage.astro'
  const localSeoPageRel = 'apps/web/src/components/cms/NativeLocalSeoFamilyPage.astro'
  const nativeRegistryRel = 'apps/web/src/lib/nativeAdoptedRouteRegistry.ts'
  const adoptedPage = await fs.readFile(path.join(repoRoot, adoptedPageRel), 'utf8')
  const localSeoPage = await fs.readFile(path.join(repoRoot, localSeoPageRel), 'utf8')
  const nativeRegistry = await fs.readFile(path.join(repoRoot, nativeRegistryRel), 'utf8')

  if (!adoptedPage.includes('nativeAdoptedRouteKindForFile') || !adoptedPage.includes('No native Astro renderer is registered')) {
    failures.push(`${adoptedPageRel} must resolve adopted routes through the native route registry and fail closed when a renderer is missing.`)
  }

  if (!nativeRegistry.includes('nativeAdoptedRouteKindForFile') || !nativeRegistry.includes('hasNativeAdoptedRenderer')) {
    failures.push(`${nativeRegistryRel} must expose the native adopted route registry used by the dispatcher and audits.`)
  }

  if (!localSeoPage.includes('No native local SEO renderer could be resolved')) {
    failures.push(`${localSeoPageRel} must fail closed when a local SEO route cannot resolve a native renderer.`)
  }
}

async function assertNativeRouteCoverage() {
  const result = await auditNativeRouteCoverage({ repoRoot })
  if (result.failures.length === 0) return

  failures.push(
    [
      `Native route coverage must cover every frozen archived legacy HTML file (${result.frozenFiles} total).`,
      ...result.failures.slice(0, 20),
    ].join('\n- '),
  )
}

async function assertLegacyReferenceWritesRequireOptIn() {
  const packageJson = JSON.parse(await fs.readFile(rootPackageJson, 'utf8'))
  const scripts = packageJson.scripts || {}

  if (!String(scripts['seo:fix'] || '').includes('print-native-seo-fix-guidance.mjs')) {
    failures.push('package.json script seo:fix must not run archived legacy HTML mutation tools.')
  }

  if (!String(scripts['legacy:seo:fix'] || '').includes('print-legacy-reference-guidance.mjs')) {
    failures.push('package.json script legacy:seo:fix must not run archived legacy HTML mutation tools.')
  }

  for (const rel of legacyReferenceMutationScripts) {
    const text = await fs.readFile(path.join(repoRoot, rel), 'utf8')
    if (!text.includes("assert-legacy-reference-write-allowed.mjs")) {
      failures.push(`${rel} must import assert-legacy-reference-write-allowed.mjs before mutating frozen legacy HTML references.`)
    }
  }
}

await assertNoPublicHtml()
await assertNoRootHtml()
await assertArchivedLegacyReferencesPresent()
await assertNoRemovedRouteDirs()
await assertNoPublicLegacyAssets()
await assertNoProductionLegacyRenderMarkers()
await assertNoMojibakeInProductionSources()
await assertNoUnexpectedWebRuntimeFsAccess()
await assertAdoptedLayoutCannotInlineHtml()
await assertAssetSyncIsNativeByDefault()
await assertRouteAuditRequiresNativeLayoutMarker()
await assertNativeDispatchFailsClosed()
await assertNativeRouteCoverage()
await assertLegacyReferenceWritesRequireOptIn()

if (failures.length > 0) {
  console.error('Native production guard failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(
  'Native production guard passed: no public/root HTML shadows, archived legacy references are present, no legacy/componentized route dirs, no public legacy assets, no raw legacy web render path, no mojibake in production sources, no unexpected runtime fs access, layout-marker route audit enforced, native route dispatch fails closed, frozen route coverage is complete, and legacy HTML mutation tools require explicit opt-in.',
)

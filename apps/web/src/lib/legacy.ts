import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const moduleDir = path.dirname(fileURLToPath(import.meta.url))
const candidates = [
  process.env.LEGACY_SITE_ROOT,
  path.resolve(process.cwd(), '../..'),
  process.cwd(),
  path.resolve(moduleDir, '../../../..'),
].filter(Boolean) as string[]

const legacyRoot =
  candidates.find((candidate) => {
    return fs.existsSync(path.join(candidate, 'index.html')) && fs.existsSync(path.join(candidate, 'assets', 'site-chrome.css'))
  }) || path.resolve(process.cwd(), '../..')

const htmlAliases: Record<string, string> = {
  about: 'ueber-mich.html',
  blog: 'blog.html',
  contact: 'contact.html',
  fotografie: 'fotografie-duesseldorf.html',
  journal: 'blog.html',
  kontakt: 'contact.html',
  leistungen: 'leistungen.html',
  portfolio: 'portfolio.html',
  services: 'leistungen.html',
  'ueber-mich': 'ueber-mich.html',
}

const htmlHeaders = {
  'content-type': 'text/html; charset=utf-8',
  'cache-control': 'no-cache',
}

function cleanPathname(pathname: string) {
  const clean = decodeURIComponent(pathname.split('?')[0] || '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
  return clean || 'index.html'
}

export function getLegacyRoot() {
  return legacyRoot
}

export function getLegacyFileForPath(pathname: string) {
  const clean = cleanPathname(pathname)
  if (clean === 'index.html') return 'index.html'
  if (htmlAliases[clean]) return htmlAliases[clean]

  const direct = clean.endsWith('.html') ? clean : `${clean}.html`
  const resolved = path.resolve(legacyRoot, direct)
  if (!resolved.startsWith(legacyRoot) || path.dirname(direct) !== '.') return null
  return fs.existsSync(resolved) ? direct : null
}

export async function readLegacyPage(fileName: string) {
  const resolved = path.resolve(legacyRoot, fileName)
  if (!resolved.startsWith(legacyRoot) || path.dirname(fileName) !== '.') {
    throw new Error(`Invalid legacy page path: ${fileName}`)
  }
  return fsp.readFile(resolved, 'utf8')
}

export async function legacyResponse(fileName: string) {
  return new Response(await readLegacyPage(fileName), { headers: htmlHeaders })
}

export async function listLegacyHtmlFiles() {
  const entries = await fsp.readdir(legacyRoot, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))
}

export async function getLegacyStaticPaths() {
  const files = await listLegacyHtmlFiles()
  const paths = files
    .filter((file) => file !== 'index.html')
    .map((file) => ({ params: { slug: file }, props: { legacyFile: file } }))

  for (const [slug, file] of Object.entries(htmlAliases)) {
    if (fs.existsSync(path.join(legacyRoot, file))) {
      paths.push({ params: { slug }, props: { legacyFile: file } })
    }
  }

  return paths
}

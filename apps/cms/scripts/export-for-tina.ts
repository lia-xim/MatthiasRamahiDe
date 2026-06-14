import crypto from 'node:crypto'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'

import { getPayload } from 'payload'

import { printPayloadScriptError } from './lib/errors'

type DataRecord = Record<string, unknown>

type CollectionSlug =
  | 'site-pages'
  | 'service-pages'
  | 'local-seo-pages'
  | 'portfolio-categories'
  | 'portfolio-projects'
  | 'journal-posts'
  | 'media'

const collections: CollectionSlug[] = [
  'site-pages',
  'service-pages',
  'local-seo-pages',
  'portfolio-categories',
  'portfolio-projects',
  'journal-posts',
  'media',
]

const globals = ['navigation', 'site-settings', 'global-ctas', 'footer'] as const

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return

  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separator = trimmed.indexOf('=')
    if (separator === -1) continue

    const key = trimmed.slice(0, separator).trim()
    const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

function argValue(name: string) {
  const prefix = `--${name}=`
  const match = process.argv.find((arg) => arg.startsWith(prefix))
  return match ? match.slice(prefix.length) : ''
}

const stamp = () =>
  new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z')

const repoRootFromCms = () => path.resolve(process.cwd(), '..', '..')

const outputDir = path.resolve(
  process.cwd(),
  argValue('out') || path.join('exports', `payload-for-tina-${stamp()}`),
)

const mediaDir = path.resolve(process.cwd(), argValue('media-dir') || 'media')

const shouldHashMedia = !process.argv.includes('--skip-media-hash')
const includeDrafts = process.argv.includes('--drafts')
const continueOnError = process.argv.includes('--continue-on-error')

async function writeJson(filePath: string, value: unknown) {
  await fsp.mkdir(path.dirname(filePath), { recursive: true })
  await fsp.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

async function findAll(payload: Awaited<ReturnType<typeof getPayload>>, collection: CollectionSlug, depth: number) {
  const docs: DataRecord[] = []
  let page = 1
  let totalPages = 1

  do {
    const result = await payload.find({
      collection: collection as never,
      depth,
      draft: includeDrafts,
      limit: 100,
      overrideAccess: true,
      page,
    })

    docs.push(...(result.docs as DataRecord[]))
    totalPages = result.totalPages || 1
    page += 1
  } while (page <= totalPages)

  return docs
}

async function hashFile(filePath: string) {
  const hash = crypto.createHash('sha256')
  await new Promise<void>((resolve, reject) => {
    const stream = fs.createReadStream(filePath)
    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('error', reject)
    stream.on('end', resolve)
  })
  return hash.digest('hex')
}

async function collectMediaFiles(dir: string) {
  const files: Array<{
    path: string
    bytes: number
    modifiedAt: string
    sha256?: string
  }> = []

  if (!fs.existsSync(dir)) return files

  async function walk(currentDir: string) {
    const entries = await fsp.readdir(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)
      if (entry.isDirectory()) {
        await walk(fullPath)
        continue
      }
      if (!entry.isFile()) continue

      const stat = await fsp.stat(fullPath)
      files.push({
        path: path.relative(dir, fullPath).replaceAll(path.sep, '/'),
        bytes: stat.size,
        modifiedAt: stat.mtime.toISOString(),
        ...(shouldHashMedia ? { sha256: await hashFile(fullPath) } : {}),
      })
    }
  }

  await walk(dir)
  return files.sort((a, b) => a.path.localeCompare(b.path))
}

let payload: Awaited<ReturnType<typeof getPayload>> | undefined

try {
  loadEnvFile(path.resolve(process.cwd(), '.env.local'))
  loadEnvFile(path.resolve(process.cwd(), '.env'))

  const { default: config } = await import('../src/payload.config')
  const cms = await getPayload({ config })
  payload = cms

  const rawCollections: Partial<Record<CollectionSlug, DataRecord[]>> = {}
  const resolvedCollections: Partial<Record<CollectionSlug, DataRecord[]>> = {}
  const rawGlobals: Record<string, DataRecord> = {}
  const resolvedGlobals: Record<string, DataRecord> = {}
  const counts: Record<string, number> = {}
  const errors: Array<{ scope: string; message: string }> = []

  await fsp.mkdir(outputDir, { recursive: true })

  for (const collection of collections) {
    try {
      const raw = await findAll(cms, collection, 0)
      const resolved = await findAll(cms, collection, 5)
      rawCollections[collection] = raw
      resolvedCollections[collection] = resolved
      counts[collection] = raw.length

      await writeJson(path.join(outputDir, 'collections', `${collection}.raw.json`), raw)
      await writeJson(path.join(outputDir, 'collections', `${collection}.resolved.json`), resolved)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      errors.push({ scope: `collection:${collection}`, message })
      counts[collection] = 0
      if (!continueOnError) throw error
    }
  }

  for (const globalSlug of globals) {
    try {
      rawGlobals[globalSlug] = (await cms.findGlobal({
        slug: globalSlug,
        depth: 0,
        draft: includeDrafts,
        overrideAccess: true,
      })) as unknown as DataRecord
      resolvedGlobals[globalSlug] = (await cms.findGlobal({
        slug: globalSlug,
        depth: 5,
        draft: includeDrafts,
        overrideAccess: true,
      })) as unknown as DataRecord
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      errors.push({ scope: `global:${globalSlug}`, message })
      if (!continueOnError) throw error
    }
  }

  const mediaFiles = await collectMediaFiles(mediaDir)
  const manifest = {
    exportedAt: new Date().toISOString(),
    source: {
      cwd: process.cwd(),
      repoRoot: repoRootFromCms(),
      mediaDir,
      database: process.env.PAYLOAD_DB || 'postgres',
      serverUrl: process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
      drafts: includeDrafts,
    },
    collections,
    globals,
    counts,
    mediaFiles: {
      count: mediaFiles.length,
      bytes: mediaFiles.reduce((sum, file) => sum + file.bytes, 0),
      sha256: shouldHashMedia,
    },
    errors,
  }

  await writeJson(path.join(outputDir, 'globals.raw.json'), rawGlobals)
  await writeJson(path.join(outputDir, 'globals.resolved.json'), resolvedGlobals)
  await writeJson(path.join(outputDir, 'media-files.manifest.json'), mediaFiles)
  await writeJson(path.join(outputDir, 'payload-export.manifest.json'), manifest)

  console.log('Payload Tina export complete')
  console.log(`Output: ${outputDir}`)
  console.log(`Collections: ${collections.map((collection) => `${collection}=${counts[collection]}`).join(', ')}`)
  console.log(`Globals: ${globals.join(', ')}`)
  console.log(`Media files: ${mediaFiles.length}`)
  if (errors.length > 0) {
    console.log(`Export warnings/errors captured: ${errors.length}`)
    for (const error of errors) console.log(`- ${error.scope}: ${error.message}`)
  }
} catch (error) {
  printPayloadScriptError(error, 'Payload Tina export')
  process.exitCode = 1
} finally {
  try {
    await payload?.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}

import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'

import { getPayload } from 'payload'

import { printPayloadScriptError } from './lib/errors'

type CollectionSlug = 'site-pages' | 'service-pages' | 'local-seo-pages' | 'portfolio-projects' | 'journal-posts' | 'portfolio-categories'
type DataRecord = Record<string, unknown>
type Suggestion = {
  title: string
  description: string
  focusKeyword?: string
  secondaryKeywords?: string[]
  searchIntent?: 'commercial' | 'informational' | 'local' | 'navigational' | 'transactional'
  internalLinkAnchors?: string[]
}

const collections: CollectionSlug[] = [
  'site-pages',
  'service-pages',
  'local-seo-pages',
  'portfolio-projects',
  'journal-posts',
  'portfolio-categories',
]

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

const arg = (name: string) => {
  const prefix = `--${name}=`
  return process.argv.find((entry) => entry.startsWith(prefix))?.slice(prefix.length)
}

const hasFlag = (name: string) => process.argv.includes(`--${name}`)
const asRecord = (value: unknown): DataRecord =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as DataRecord) : {}
const asString = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const cleanText = (value: unknown) =>
  asString(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const getAtPath = (data: DataRecord, dottedPath: string) =>
  dottedPath.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') return undefined
    return (current as DataRecord)[segment]
  }, data)

const clamp = (value: string, maxLength: number) => {
  const cleaned = cleanText(value)
  if (cleaned.length <= maxLength) return cleaned
  const clipped = cleaned.slice(0, maxLength - 1)
  const lastSpace = clipped.lastIndexOf(' ')
  return `${(lastSpace > 80 ? clipped.slice(0, lastSpace) : clipped).trim()}...`
}

const formatSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const routeLabel = (collection: string, doc: DataRecord) =>
  `${collection}/${asString(doc.slug) || asString(doc.title) || String(doc.id || 'unknown')}`

const contentText = (doc: DataRecord) =>
  [
    doc.title,
    doc.excerpt,
    doc.intro,
    doc.city,
    doc.service,
    doc.serviceType,
    getAtPath(doc, 'legacy.extractedText'),
    Array.isArray(doc.blocks)
      ? doc.blocks
          .map((block) => {
            const current = asRecord(block)
            return [current.eyebrow, current.headline, current.quote, current.text].map(cleanText).join(' ')
          })
          .join(' ')
      : '',
  ]
    .map(cleanText)
    .filter(Boolean)
    .join('\n')

const deterministicSuggestion = (doc: DataRecord): Suggestion => {
  const title = cleanText(doc.title) || 'Matthias Ramahi Fotografie'
  const source = cleanText(doc.excerpt || doc.intro || getAtPath(doc, 'legacy.extractedText') || title)
  const focusKeyword =
    cleanText(getAtPath(doc, 'seo.focusKeyword')) ||
    cleanText(doc.targetKeyword) ||
    cleanText([doc.service, doc.city].filter(Boolean).join(' ')) ||
    formatSlug(title)

  return {
    title: title.length + 19 <= 70 ? `${title} | Matthias Ramahi` : clamp(title, 70),
    description: clamp(source, 165),
    focusKeyword,
    secondaryKeywords: [cleanText(doc.service), cleanText(doc.city), cleanText(doc.serviceType)].filter(Boolean).slice(0, 5),
    searchIntent: doc.city || doc.service ? 'local' : 'commercial',
    internalLinkAnchors: [title, focusKeyword].filter(Boolean).slice(0, 4),
  }
}

const extractJson = (value: string) => {
  const trimmed = value.trim()
  if (trimmed.startsWith('{')) return JSON.parse(trimmed)
  const match = trimmed.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('LLM response did not contain a JSON object.')
  return JSON.parse(match[0])
}

const buildPrompt = (collection: string, doc: DataRecord) => `Du bist ein deutschsprachiger SEO-Editor fuer matthiasramahi.de.
Erzeuge genau ein JSON-Objekt mit diesen Keys:
title, description, focusKeyword, secondaryKeywords, searchIntent, internalLinkAnchors.
Regeln:
- title maximal 70 Zeichen, natuerlich, keine Keyword-Stapel.
- description 135 bis 165 Zeichen, konkret und klickwuerdig.
- searchIntent ist einer von commercial, informational, local, transactional, navigational.
- internalLinkAnchors sind 2 bis 5 natuerliche deutsche Anchor-Texte.
- Keine Markdown-Erklaerung, nur JSON.

Collection: ${collection}
Slug: ${asString(doc.slug)}
Bestehender Titel: ${asString(doc.title)}
Bestehende SEO-Daten: ${JSON.stringify(asRecord(doc.seo))}
Quelltext:
${contentText(doc).slice(0, 5000)}
`

const callChatCompletions = async (prompt: string): Promise<Suggestion> => {
  const baseUrl = process.env.SEO_LLM_BASE_URL
  const apiKey = process.env.SEO_LLM_API_KEY
  const model = process.env.SEO_LLM_MODEL
  if (!baseUrl || !apiKey || !model) throw new Error('SEO_LLM_BASE_URL, SEO_LLM_API_KEY und SEO_LLM_MODEL muessen gesetzt sein.')

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'Return only valid JSON.' },
        { role: 'user', content: prompt },
      ],
    }),
  })

  if (!response.ok) throw new Error(`LLM request failed: ${response.status} ${await response.text()}`)
  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> }
  return extractJson(data.choices?.[0]?.message?.content || '') as Suggestion
}

const callCommand = (prompt: string): Promise<Suggestion> =>
  new Promise((resolve, reject) => {
    const command = process.env.SEO_LLM_COMMAND
    if (!command) return reject(new Error('SEO_LLM_COMMAND is not set.'))
    const args = process.env.SEO_LLM_ARGS ? (JSON.parse(process.env.SEO_LLM_ARGS) as string[]) : []
    const child = spawn(command, args, { stdio: ['pipe', 'pipe', 'pipe'], shell: false })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (chunk) => {
      stdout += String(chunk)
    })
    child.stderr.on('data', (chunk) => {
      stderr += String(chunk)
    })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code !== 0) return reject(new Error(stderr || `LLM command exited with code ${code}`))
      try {
        resolve(extractJson(stdout) as Suggestion)
      } catch (error) {
        reject(error)
      }
    })
    child.stdin.end(prompt)
  })

const createSuggestion = async (collection: string, doc: DataRecord) => {
  const prompt = buildPrompt(collection, doc)
  if (process.env.SEO_LLM_COMMAND) return callCommand(prompt)
  if (process.env.SEO_LLM_BASE_URL && process.env.SEO_LLM_API_KEY && process.env.SEO_LLM_MODEL) {
    return callChatCompletions(prompt)
  }
  return deterministicSuggestion(doc)
}

const collection = (arg('collection') || 'service-pages') as CollectionSlug
const slug = arg('slug')
const limit = Number(arg('limit') || (slug ? 1 : 10))
const write = hasFlag('write')
const overwrite = hasFlag('overwrite')

if (!collections.includes(collection)) {
  console.error(`Unknown collection: ${collection}`)
  process.exit(1)
}

let payload: Awaited<ReturnType<typeof getPayload>> | undefined

try {
  loadEnvFile(path.resolve(process.cwd(), '.env.local'))
  loadEnvFile(path.resolve(process.cwd(), '.env'))

  const { default: config } = await import('../src/payload.config')
  const cms = await getPayload({ config })
  payload = cms
  const updateDocument = cms.update as unknown as (options: {
    collection: CollectionSlug
    id: string | number
    data: DataRecord
    overrideAccess: boolean
  }) => Promise<unknown>

  const result = await cms.find({
    collection: collection as never,
    depth: 1,
    draft: true,
    limit,
    overrideAccess: true,
    ...(slug ? { where: { slug: { equals: slug } } } : {}),
  })

  for (const doc of result.docs as DataRecord[]) {
    const suggestion = await createSuggestion(collection, doc)
    const existingSeo = asRecord(doc.seo)
    const nextSeo = {
      ...existingSeo,
      title: overwrite || !asString(existingSeo.title) ? suggestion.title : existingSeo.title,
      description: overwrite || !asString(existingSeo.description) ? suggestion.description : existingSeo.description,
      focusKeyword: overwrite || !asString(existingSeo.focusKeyword) ? suggestion.focusKeyword : existingSeo.focusKeyword,
      secondaryKeywords:
        overwrite || !Array.isArray(existingSeo.secondaryKeywords) || existingSeo.secondaryKeywords.length === 0
          ? suggestion.secondaryKeywords
          : existingSeo.secondaryKeywords,
      searchIntent: overwrite || !asString(existingSeo.searchIntent) ? suggestion.searchIntent : existingSeo.searchIntent,
      internalLinkAnchors:
        overwrite || !Array.isArray(existingSeo.internalLinkAnchors) || existingSeo.internalLinkAnchors.length === 0
          ? suggestion.internalLinkAnchors
          : existingSeo.internalLinkAnchors,
    }

    console.log('')
    console.log(routeLabel(collection, doc))
    console.log(JSON.stringify(nextSeo, null, 2))

    if (write) {
      await updateDocument({
        collection,
        id: doc.id as string | number,
        data: { seo: nextSeo },
        overrideAccess: true,
      })
      console.log('Updated.')
    }
  }

  if (!write) console.log('\nDry run. Mit --write speichern, mit --overwrite bestehende SEO-Felder ueberschreiben.')
} catch (error) {
  printPayloadScriptError(error, 'CMS SEO Suggestion Harness')
  process.exitCode = 1
} finally {
  try {
    await payload?.destroy()
  } finally {
    process.exit(process.exitCode || 0)
  }
}

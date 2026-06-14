#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const repoRoot = process.cwd()

function argValue(name) {
  const prefix = `--${name}=`
  const match = process.argv.find((arg) => arg.startsWith(prefix))
  return match ? match.slice(prefix.length) : ''
}

function latestMigrationOutputDir() {
  const outputsDir = path.join(repoRoot, 'outputs')
  if (!fs.existsSync(outputsDir)) return ''

  return fs
    .readdirSync(outputsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('payload-tina-migration-'))
    .map((entry) => path.join(outputsDir, entry.name))
    .sort()
    .at(-1)
}

const migrationDir = path.resolve(argValue('migration-dir') || latestMigrationOutputDir() || '')
const dumpPath = path.resolve(argValue('dump') || path.join(migrationDir, 'local-seo-tables.sql.gz'))
const exportDir = path.resolve(argValue('out') || path.join(migrationDir, 'payload-export'))
const collectionsDir = path.join(exportDir, 'collections')

if (!migrationDir || !fs.existsSync(dumpPath)) {
  console.error(`Local SEO SQL dump not found: ${dumpPath}`)
  process.exit(1)
}

function splitCopyColumns(value) {
  const columns = []
  let current = ''
  let quoted = false

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index]
    const next = value[index + 1]

    if (quoted) {
      if (char === '"' && next === '"') {
        current += '"'
        index += 1
        continue
      }
      if (char === '"') {
        quoted = false
        continue
      }
      current += char
      continue
    }

    if (char === '"') {
      quoted = true
      continue
    }

    if (char === ',') {
      columns.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  if (current.trim()) columns.push(current.trim())
  return columns
}

function parseCopyHeader(line) {
  const match = line.match(/^COPY public\.([a-z0-9_]+) \((.*)\) FROM stdin;$/)
  if (!match) return null
  return {
    table: match[1],
    columns: splitCopyColumns(match[2]),
  }
}

function decodeCopyValue(value) {
  if (value === '\\N') return null

  let output = ''
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index]
    if (char !== '\\') {
      output += char
      continue
    }

    const next = value[index + 1]
    if (next === undefined) {
      output += '\\'
      continue
    }

    if (next === 'b') output += '\b'
    else if (next === 'f') output += '\f'
    else if (next === 'n') output += '\n'
    else if (next === 'r') output += '\r'
    else if (next === 't') output += '\t'
    else if (next === 'v') output += '\v'
    else if (next === '\\') output += '\\'
    else if (next === 'x' && /^[0-9a-fA-F]{2}$/.test(value.slice(index + 2, index + 4))) {
      output += String.fromCharCode(Number.parseInt(value.slice(index + 2, index + 4), 16))
      index += 2
    } else if (/^[0-7]$/.test(next)) {
      const octal = value.slice(index + 1).match(/^[0-7]{1,3}/)?.[0] || next
      output += String.fromCharCode(Number.parseInt(octal, 8))
      index += octal.length - 1
    } else {
      output += next
    }

    index += 1
  }

  return output
}

const booleanColumns = new Set(['seo_no_index', 'open_in_new_tab'])
const numericColumns = new Set([
  '_order',
  '_parent_id',
  'canonical_service_page_id',
  'duration_sec',
  'hero_image_id',
  'id',
  'image_id',
  'order',
  'seo_og_image_id',
  'statement_image_id',
])

function normalizeValue(column, value) {
  if (value === null) return null
  if (booleanColumns.has(column)) return value === 't'
  if (numericColumns.has(column) && /^-?\d+$/.test(value)) return Number.parseInt(value, 10)
  if (numericColumns.has(column) && /^-?\d+\.\d+$/.test(value)) return Number.parseFloat(value)
  return value
}

function parseCopyRow(line, columns) {
  const values = line.split('\t')
  if (values.length !== columns.length) {
    throw new Error(`COPY row has ${values.length} values, expected ${columns.length}.`)
  }

  return Object.fromEntries(
    columns.map((column, index) => [column, normalizeValue(column, decodeCopyValue(values[index]))]),
  )
}

function parseDump(sqlText) {
  const tables = {}
  const lines = sqlText.split(/\r?\n/)

  for (let index = 0; index < lines.length; index += 1) {
    const header = parseCopyHeader(lines[index])
    if (!header) continue

    const rows = []
    index += 1
    while (index < lines.length && lines[index] !== '\\.') {
      rows.push(parseCopyRow(lines[index], header.columns))
      index += 1
    }

    tables[header.table] = {
      columns: header.columns,
      rows,
    }
  }

  return tables
}

function byParent(tables, tableName, parentField = '_parent_id') {
  const grouped = new Map()
  for (const row of tables[tableName]?.rows || []) {
    const parentId = row[parentField]
    const key = String(parentId)
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key).push(row)
  }

  for (const rows of grouped.values()) rows.sort((a, b) => Number(a._order ?? a.order ?? 0) - Number(b._order ?? b.order ?? 0))
  return grouped
}

function rowId(row) {
  return row?.id == null ? null : String(row.id)
}

function compactObject(value) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined))
}

function richTextFromText(text) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              mode: 'normal',
              text: text || '',
              type: 'text',
              style: '',
              detail: 0,
              format: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
        },
      ],
      direction: 'ltr',
    },
  }
}

function parseRichText(value) {
  if (!value) return null
  if (typeof value !== 'string') return value
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' ? parsed : richTextFromText(value)
  } catch {
    return richTextFromText(value)
  }
}

const sqlText = zlib.gunzipSync(fs.readFileSync(dumpPath)).toString('utf8')
const tables = parseDump(sqlText)

const heroPanelsByPage = byParent(tables, 'local_seo_pages_hero_panels')
const heroSlidesByPage = byParent(tables, 'local_seo_pages_hero_slides')
const localFaqByPage = byParent(tables, 'local_seo_pages_local_faq')
const localProofByPage = byParent(tables, 'local_seo_pages_local_proof')
const statementBodyByPage = byParent(tables, 'local_seo_pages_statement_body')
const shootingStylesByPage = byParent(tables, 'local_seo_pages_shooting_styles')
const portfolioTilesByPage = byParent(tables, 'local_seo_pages_portfolio_tiles')
const processStepsByPage = byParent(tables, 'local_seo_pages_process_steps')
const audienceCardsByPage = byParent(tables, 'local_seo_pages_audience_cards')
const relatedItemsByPage = byParent(tables, 'local_seo_pages_related_section_items')
const locationLinksByPage = byParent(tables, 'local_seo_pages_location_links_section_items')
const searchLinksByPage = byParent(tables, 'local_seo_pages_search_links_section_items')
const textsByPage = byParent(tables, 'local_seo_pages_texts', 'parent_id')

const faqItemsByBlock = byParent(tables, 'local_seo_pages_blocks_faq_block_items')
const imageSequenceItemsByBlock = byParent(tables, 'local_seo_pages_blocks_image_sequence_items')
const linkListLinksByBlock = byParent(tables, 'local_seo_pages_blocks_link_list_links')

function mapRows(group, pageId, mapper) {
  return (group.get(String(pageId)) || []).map(mapper)
}

function mediaId(value) {
  return value ?? null
}

function mapBlocks(pageId) {
  const blocks = [
    ...mapRows(byParent(tables, 'local_seo_pages_blocks_text_block'), pageId, (row) => ({
      order: row._order,
      value: {
        id: rowId(row),
        eyebrow: row.eyebrow,
        headline: row.headline,
        body: parseRichText(row.body),
        blockName: row.block_name,
        blockType: 'textBlock',
      },
    })),
    ...mapRows(byParent(tables, 'local_seo_pages_blocks_image_sequence'), pageId, (row) => ({
      order: row._order,
      value: {
        id: rowId(row),
        headline: row.headline,
        layout: row.layout,
        items: mapRows(imageSequenceItemsByBlock, row.id, (item) => ({
          id: rowId(item),
          image: mediaId(item.image_id),
          caption: item.caption,
          cropIntent: item.crop_intent,
        })),
        blockName: row.block_name,
        blockType: 'imageSequence',
      },
    })),
    ...mapRows(byParent(tables, 'local_seo_pages_blocks_quote_block'), pageId, (row) => ({
      order: row._order,
      value: {
        id: rowId(row),
        quote: row.quote,
        attribution: row.attribution,
        blockName: row.block_name,
        blockType: 'quoteBlock',
      },
    })),
    ...mapRows(byParent(tables, 'local_seo_pages_blocks_faq_block'), pageId, (row) => ({
      order: row._order,
      value: {
        id: rowId(row),
        headline: row.headline,
        items: mapRows(faqItemsByBlock, row.id, (item) => ({
          id: rowId(item),
          question: item.question,
          answer: item.answer,
        })),
        blockName: row.block_name,
        blockType: 'faqBlock',
      },
    })),
    ...mapRows(byParent(tables, 'local_seo_pages_blocks_link_list'), pageId, (row) => ({
      order: row._order,
      value: {
        id: rowId(row),
        headline: row.headline,
        links: mapRows(linkListLinksByBlock, row.id, (link) => ({
          id: rowId(link),
          label: link.label,
          href: link.href,
          description: link.description,
          seoPurpose: link.seo_purpose,
          rel: link.rel,
          openInNewTab: link.open_in_new_tab,
        })),
        blockName: row.block_name,
        blockType: 'linkList',
      },
    })),
    ...mapRows(byParent(tables, 'local_seo_pages_blocks_cta_block'), pageId, (row) => ({
      order: row._order,
      value: {
        id: rowId(row),
        headline: row.headline,
        text: row.text,
        buttonLabel: row.button_label,
        emailSubject: row.email_subject,
        blockName: row.block_name,
        blockType: 'ctaBlock',
      },
    })),
  ]

  return blocks
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0))
    .map((entry) => entry.value)
}

function reconstructDoc(row) {
  const pageId = row.id

  return compactObject({
    id: row.id,
    title: row.title,
    slug: row.slug,
    priority: row.priority,
    city: row.city,
    service: row.service,
    intro: row.intro,
    heroImage: mediaId(row.hero_image_id),
    heroLine2: row.hero_line2,
    heroSlides: mapRows(heroSlidesByPage, pageId, (slide) => ({
      id: rowId(slide),
      image: mediaId(slide.image_id),
      headlineLine1: slide.headline_line1,
      headlineLine2: slide.headline_line2,
      lead: slide.lead,
      durationSec: slide.duration_sec,
      primaryLabel: slide.primary_label,
      primaryHref: slide.primary_href,
      secondaryLabel: slide.secondary_label,
      secondaryHref: slide.secondary_href,
    })),
    heroPanels: mapRows(heroPanelsByPage, pageId, (panel) => ({
      id: rowId(panel),
      image: mediaId(panel.image_id),
    })),
    localProof: mapRows(localProofByPage, pageId, (item) => ({
      id: rowId(item),
      label: item.label,
      text: item.text,
    })),
    localFaq: mapRows(localFaqByPage, pageId, (item) => ({
      id: rowId(item),
      question: item.question,
      answer: item.answer,
    })),
    blocks: mapBlocks(pageId),
    statement: {
      image: mediaId(row.statement_image_id),
      headline: row.statement_headline,
      emphasis: row.statement_emphasis,
      body: mapRows(statementBodyByPage, pageId, (item) => ({
        id: rowId(item),
        text: item.text,
      })),
    },
    focusSection: {
      headline: row.focus_section_headline,
      emphasis: row.focus_section_emphasis,
      lead: row.focus_section_lead,
    },
    shootingStyles: mapRows(shootingStylesByPage, pageId, (item) => ({
      id: rowId(item),
      image: mediaId(item.image_id),
      title: item.title,
      text: item.text,
    })),
    gallerySection: {
      headline: row.gallery_section_headline,
      lead: row.gallery_section_lead,
    },
    portfolioTiles: mapRows(portfolioTilesByPage, pageId, (item) => ({
      id: rowId(item),
      image: mediaId(item.image_id),
      label: item.label,
    })),
    processSection: {
      headline: row.process_section_headline,
      emphasis: row.process_section_emphasis,
      lead: row.process_section_lead,
    },
    processSteps: mapRows(processStepsByPage, pageId, (item) => ({
      id: rowId(item),
      image: mediaId(item.image_id),
      imageLabel: item.image_label,
      title: item.title,
      text: item.text,
    })),
    audienceSection: {
      headline: row.audience_section_headline,
      lead: row.audience_section_lead,
    },
    audienceCards: mapRows(audienceCardsByPage, pageId, (item) => ({
      id: rowId(item),
      image: mediaId(item.image_id),
      number: item.number,
      title: item.title,
      text: item.text,
    })),
    relatedSection: {
      headline: row.related_section_headline,
      emphasis: row.related_section_emphasis,
      lead: row.related_section_lead,
      items: mapRows(relatedItemsByPage, pageId, (item) => ({
        id: rowId(item),
        image: mediaId(item.image_id),
        title: item.title,
        href: item.href,
        alt: item.alt,
      })),
    },
    faq: [],
    locationLinksSection: {
      headline: row.location_links_section_headline,
      emphasis: row.location_links_section_emphasis,
      items: mapRows(locationLinksByPage, pageId, (item) => ({
        id: rowId(item),
        label: item.label,
        href: item.href,
      })),
    },
    searchLinksSection: {
      headline: row.search_links_section_headline,
      emphasis: row.search_links_section_emphasis,
      items: mapRows(searchLinksByPage, pageId, (item) => ({
        id: rowId(item),
        label: item.label,
        href: item.href,
      })),
    },
    contactSection: {
      headline: row.contact_section_headline,
      emphasis: row.contact_section_emphasis,
      lead: row.contact_section_lead,
      emailSubject: row.contact_section_email_subject,
    },
    canonicalServicePage: row.canonical_service_page_id,
    targetKeyword: row.target_keyword,
    seo: {
      title: row.seo_title,
      description: row.seo_description,
      focusKeyword: row.seo_focus_keyword,
      searchIntent: row.seo_search_intent,
      canonicalUrl: row.seo_canonical_url,
      legacyUrl: row.seo_legacy_url,
      ogImage: mediaId(row.seo_og_image_id),
      noIndex: row.seo_no_index,
    },
    legacy: {
      sourceFile: row.legacy_source_file,
      sourceUrl: row.legacy_source_url,
      migrationStatus: row.legacy_migration_status,
      renderSource: row.legacy_render_source,
      renderedHeadHtml: row.legacy_rendered_head_html,
      renderedBodyHtml: row.legacy_rendered_body_html,
      afterFooterHtml: row.legacy_after_footer_html,
      bodyClass: row.legacy_body_class,
      headerCurrent: row.legacy_header_current,
      extractedText: row.legacy_extracted_text,
    },
    _texts: mapRows(textsByPage, pageId, (item) => ({
      id: rowId(item),
      path: item.path,
      text: item.text,
    })),
    updatedAt: row.updated_at,
    createdAt: row.created_at,
    _status: row._status,
  })
}

const docs = (tables.local_seo_pages?.rows || []).map(reconstructDoc)
const tableCounts = Object.fromEntries(Object.entries(tables).map(([name, table]) => [name, table.rows.length]))

const rescueManifest = {
  createdAt: new Date().toISOString(),
  sourceDump: path.relative(repoRoot, dumpPath).replaceAll(path.sep, '/'),
  note:
    'local-seo-pages was reconstructed from a focused PostgreSQL COPY dump because the production Payload API schema drifted from the current code.',
  documents: docs.length,
  tables: tableCounts,
  outputs: {
    raw: 'collections/local-seo-pages.raw.json',
    resolved: 'collections/local-seo-pages.resolved.json',
    sqlTables: 'collections/local-seo-pages.sql.tables.json',
    manifest: 'collections/local-seo-pages.rescue-manifest.json',
  },
}

fs.mkdirSync(collectionsDir, { recursive: true })
fs.writeFileSync(path.join(collectionsDir, 'local-seo-pages.raw.json'), `${JSON.stringify(docs, null, 2)}\n`)
fs.writeFileSync(path.join(collectionsDir, 'local-seo-pages.resolved.json'), `${JSON.stringify(docs, null, 2)}\n`)
fs.writeFileSync(path.join(collectionsDir, 'local-seo-pages.sql.tables.json'), `${JSON.stringify(tables, null, 2)}\n`)
fs.writeFileSync(path.join(collectionsDir, 'local-seo-pages.rescue-manifest.json'), `${JSON.stringify(rescueManifest, null, 2)}\n`)

console.log('Local SEO SQL rescue complete')
console.log(`Dump: ${dumpPath}`)
console.log(`Output: ${collectionsDir}`)
console.log(`Documents: ${docs.length}`)
console.log(`Tables: ${Object.keys(tables).length}`)

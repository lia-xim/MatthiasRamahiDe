#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const projectsDir = path.join(repoRoot, 'apps', 'web', 'content', 'portfolio-projects')
const registryPath = path.join(repoRoot, 'apps', 'web', 'content', 'media', 'portfolio-media-registry.json')
const manifestPath = path.join(repoRoot, 'apps', 'web', 'src', 'data', 'tinaMediaManifest.json')
const publicDir = path.join(repoRoot, 'apps', 'web', 'public')
const shouldWrite = process.argv.includes('--write')
const strict = process.argv.includes('--strict')
const strictMetadata = process.argv.includes('--strict-metadata')

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'))
const readOptionalJson = (filePath, fallback) => (fs.existsSync(filePath) ? readJson(filePath) : fallback)
const cleanText = (value) => (typeof value === 'string' ? value.trim() : '')
const unique = (values) => [...new Set(values.filter(Boolean))]

const normalizePublicPath = (value) => {
  const raw = typeof value === 'object' && value !== null ? value.url || value.path || value.src || value.id : value
  if (raw === null || raw === undefined) return ''
  const text = String(raw).trim()
  if (!text) return ''
  if (/^https?:\/\//i.test(text)) {
    try {
      return decodeURIComponent(new URL(text).pathname)
    } catch {
      return text
    }
  }
  try {
    return decodeURIComponent(text.startsWith('/') ? text : `/${text}`)
  } catch {
    return text.startsWith('/') ? text : `/${text}`
  }
}

const categoryFromReference = (value) => {
  const ref = cleanText(value)
  if (!ref) return ''
  return path.posix.basename(ref.replaceAll('\\', '/'), path.posix.extname(ref))
}

const manifest = readOptionalJson(manifestPath, { items: [] })
const mediaItems = Array.isArray(manifest.items) ? manifest.items : []
const mediaById = new Map(mediaItems.map((item) => [String(item.id), item]))
const mediaByPath = new Map()
for (const item of mediaItems) {
  for (const candidate of [item.url, item.filename]) {
    const normalized = normalizePublicPath(candidate)
    if (normalized) mediaByPath.set(normalized, item)
    if (normalized) mediaByPath.set(path.posix.basename(normalized), item)
  }
}

const resolveImage = (value) => {
  const raw = typeof value === 'object' && value !== null ? value.url || value.path || value.src || value.id : value
  const byId = raw !== null && raw !== undefined ? mediaById.get(String(raw)) : undefined
  const normalized = byId ? normalizePublicPath(byId.url || byId.filename) : normalizePublicPath(raw)
  const media = byId || mediaByPath.get(normalized) || mediaByPath.get(path.posix.basename(normalized))
  const image = normalizePublicPath(media?.url || normalized)
  return {
    image,
    media,
    exists:
      Boolean(media) ||
      (image.startsWith('/') && fs.existsSync(path.join(publicDir, image.replace(/^\/+/, '').replaceAll('/', path.sep)))),
  }
}

const projectFiles = fs
  .readdirSync(projectsDir)
  .filter((name) => name.endsWith('.json'))
  .sort()

const usagesByImage = new Map()
const errors = []
const warnings = []

const addUsage = ({ project, category, slot, value, caption = '', role = '' }) => {
  const resolved = resolveImage(value)
  if (!resolved.image) return
  if (!resolved.exists) errors.push(`${project}: ${slot} verweist auf eine nicht aufloesbare Datei (${resolved.image}).`)

  const usage = { project, category, slot, caption: cleanText(caption), role: cleanText(role) }
  const current = usagesByImage.get(resolved.image) || { media: resolved.media, usages: [] }
  current.usages.push(usage)
  if (!current.media && resolved.media) current.media = resolved.media
  usagesByImage.set(resolved.image, current)
}

for (const fileName of projectFiles) {
  const project = readJson(path.join(projectsDir, fileName))
  const slug = cleanText(project.slug) || path.basename(fileName, '.json')
  const category = categoryFromReference(project.category)
  if (!category) errors.push(`${slug}: Portfolio-Projekt hat keine Kategorie.`)

  addUsage({ project: slug, category, slot: 'cover', value: project.coverImage })

  const seenGalleryImages = new Set()
  for (const [index, item] of (project.gallery || []).entries()) {
    const resolved = resolveImage(item?.image)
    if (resolved.image && seenGalleryImages.has(resolved.image)) {
      errors.push(`${slug}: Galerie enthaelt ${resolved.image} mehrfach.`)
    }
    if (resolved.image) seenGalleryImages.add(resolved.image)
    addUsage({
      project: slug,
      category,
      slot: `gallery:${index + 1}`,
      value: item?.image,
      caption: item?.caption,
      role: item?.role,
    })
  }

  for (const [index, slide] of (project.heroSlides || []).entries()) {
    addUsage({ project: slug, category, slot: `hero:${index + 1}`, value: slide?.image })
  }

  for (const [index, card] of (project.projectPage?.relatedCards || []).entries()) {
    addUsage({ project: slug, category, slot: `related:${index + 1}`, value: card?.image })
  }
}

const existingRegistry = readOptionalJson(registryPath, { version: 1, items: [] })
const existingByImage = new Map((existingRegistry.items || []).map((item) => [normalizePublicPath(item.image), item]))

const items = [...usagesByImage.entries()]
  .map(([image, data]) => {
    const existing = existingByImage.get(image) || {}
    const categories = unique(data.usages.map((usage) => usage.category)).sort()
    const projects = unique(data.usages.map((usage) => usage.project)).sort()
    const surfaces = unique(data.usages.map((usage) => usage.slot.split(':')[0])).sort()
    const assignedCategory = cleanText(existing.assignedCategory) || categories[0] || 'unassigned'
    const orientation =
      cleanText(existing.orientation) ||
      cleanText(data.media?.orientation) ||
      (data.media?.width && data.media?.height
        ? data.media.width === data.media.height
          ? 'square'
          : data.media.width > data.media.height
            ? 'landscape'
            : 'portrait'
        : 'unknown')

    if (!categories.includes(assignedCategory) && assignedCategory !== 'unassigned') {
      errors.push(`${image}: Registry-Kategorie ${assignedCategory} passt nicht zur Verwendung in ${categories.join(', ')}.`)
    }
    if (categories.length > 1 && existing.allowCrossCategory !== true) {
      warnings.push(`${image}: wird in mehreren Kategorien verwendet (${categories.join(', ')}).`)
    }

    return {
      image,
      assignedCategory,
      seriesId: cleanText(existing.seriesId) || 'unassigned',
      subject: cleanText(existing.subject),
      orientation,
      rightsStatus: cleanText(existing.rightsStatus) || 'review-required',
      rightsNotes: cleanText(existing.rightsNotes),
      allowedSurfaces: Array.isArray(existing.allowedSurfaces) && existing.allowedSurfaces.length
        ? unique(existing.allowedSurfaces.map(cleanText))
        : surfaces,
      allowCrossCategory: existing.allowCrossCategory === true,
      usageCategories: categories,
      sourceProjects: projects,
      usageSummary: data.usages.map((usage) => `${usage.project}:${usage.slot}`).join(' | '),
      width: data.media?.width ?? existing.width ?? null,
      height: data.media?.height ?? existing.height ?? null,
    }
  })
  .sort((a, b) => a.image.localeCompare(b.image, 'de'))

const currentImages = new Set(items.map((item) => item.image))
if (!shouldWrite) {
  for (const item of items) {
    const registered = existingByImage.get(item.image)
    if (!registered) {
      errors.push(`${item.image}: fehlt in der Medien-Registry. Bitte media:registry:sync ausfuehren.`)
      continue
    }

    const registeredCategories = unique((registered.usageCategories || []).map(cleanText)).sort()
    const registeredProjects = unique((registered.sourceProjects || []).map(cleanText)).sort()
    if (JSON.stringify(registeredCategories) !== JSON.stringify(item.usageCategories)) {
      errors.push(`${item.image}: Kategorienutzung in der Registry ist veraltet. Bitte media:registry:sync ausfuehren.`)
    }
    if (JSON.stringify(registeredProjects) !== JSON.stringify(item.sourceProjects)) {
      errors.push(`${item.image}: Portfolio-Nutzung in der Registry ist veraltet. Bitte media:registry:sync ausfuehren.`)
    }
  }
}
for (const oldItem of existingRegistry.items || []) {
  const image = normalizePublicPath(oldItem.image)
  if (image && !currentImages.has(image)) warnings.push(`${image}: ist registriert, wird aber aktuell in keinem Portfolio verwendet.`)
}

const metadata = {
  unassignedSeries: items.filter((item) => item.seriesId === 'unassigned').length,
  rightsReviewRequired: items.filter((item) => item.rightsStatus === 'review-required').length,
  missingSubject: items.filter((item) => !item.subject).length,
  crossCategoryWithoutApproval: items.filter((item) => item.usageCategories.length > 1 && !item.allowCrossCategory).length,
}

const registry = {
  version: 1,
  updatedAt: new Date().toISOString(),
  description: 'Verbindliche Medienzuordnung fuer kuratierte Portfolio-Serien. Manuelle Felder bleiben beim Synchronisieren erhalten.',
  items,
}

if (shouldWrite) {
  fs.mkdirSync(path.dirname(registryPath), { recursive: true })
  fs.writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`)
}

console.log(`Portfolio-Medien: ${items.length}`)
console.log(`Portfolio-Projekte: ${projectFiles.length}`)
console.log(`Fehler: ${errors.length}`)
console.log(`Hinweise: ${warnings.length}`)
console.log(
  `Metadaten offen: Serien ${metadata.unassignedSeries}, Rechte ${metadata.rightsReviewRequired}, Motiv ${metadata.missingSubject}, Mehrfachkategorie ${metadata.crossCategoryWithoutApproval}`,
)
if (shouldWrite) console.log(`Registry aktualisiert: ${path.relative(repoRoot, registryPath)}`)
for (const message of errors) console.error(`ERROR ${message}`)
for (const message of warnings) console.warn(`WARN ${message}`)

if (strict && errors.length > 0) process.exit(1)
if (strictMetadata && Object.values(metadata).some((count) => count > 0)) process.exit(2)

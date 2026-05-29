'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, toast, useField, useForm, useFormFields, usePayloadAPI } from '@payloadcms/ui'

import './MediaGalleryPicker.scss'

export type MediaID = number | string

export type MediaDoc = {
  alt?: string
  category?: string
  featured?: boolean
  filename?: string
  id: MediaID
  orientation?: string
  sizes?: Record<string, { url?: string } | undefined>
  thumbnailURL?: string
  title?: string
  url?: string
}

type Props = {
  buttonLabel?: string
  defaultSort?: string
  imageFieldName?: string
  intro?: string
  limit?: number
  path?: string
  readOnly?: boolean
  rowDefaults?: Record<string, unknown>
  schemaPath?: string
  title?: string
}

export const categoryOptions = [
  { label: 'Alle Kategorien', value: 'all' },
  { label: 'Portrait', value: 'portrait' },
  { label: 'Automotive', value: 'automotive' },
  { label: 'Oldtimer', value: 'oldtimer' },
  { label: 'Motorrad', value: 'motorrad' },
  { label: 'Landschaft', value: 'landschaft' },
  { label: 'Service / Produktion', value: 'service' },
  { label: 'Atmosphaere / Detail', value: 'atmosphere' },
  { label: 'Noch nicht einsortiert', value: 'uncategorized' },
]

export const orientationOptions = [
  { label: 'Alle Formate', value: 'all' },
  { label: 'Querformat', value: 'landscape' },
  { label: 'Hochformat', value: 'portrait' },
  { label: 'Quadrat', value: 'square' },
  { label: 'Panorama', value: 'panorama' },
]

export const normalizeID = (value: unknown): string | undefined => {
  if (value === null || value === undefined) return undefined
  if (typeof value === 'object' && 'id' in value && (value as { id?: unknown }).id !== undefined) {
    return String((value as { id: unknown }).id)
  }
  return String(value)
}

export const getPreviewURL = (doc: MediaDoc): string | undefined =>
  doc.thumbnailURL || doc.sizes?.thumb?.url || doc.sizes?.card?.url || doc.url

export const getTitle = (doc: MediaDoc): string => doc.title || doc.alt || doc.filename || `Medium ${doc.id}`

const buildFieldState = (value: unknown) => ({
  initialValue: value,
  valid: true,
  value,
})

export function MediaGalleryPicker({
  buttonLabel = 'Ausgewaehlte Bilder hinzufuegen',
  defaultSort = '-updatedAt',
  imageFieldName = 'image',
  intro = 'Bilder als grosse Vorschau suchen, filtern und gesammelt in diese Liste uebernehmen.',
  limit = 48,
  path: pathFromProps,
  readOnly,
  rowDefaults = {},
  schemaPath,
  title = 'Galerie-Auswahl',
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [orientation, setOrientation] = useState('all')
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [selectedIDs, setSelectedIDs] = useState<Set<string>>(() => new Set())

  const { addFieldRow } = useForm()
  const { path } = useField<number>({ potentiallyStalePath: pathFromProps })

  const usedImageIDs = useFormFields(([fields]) => {
    const rowCount = Number(fields[path]?.value || fields[path]?.rows?.length || 0)
    const ids = new Set<string>()

    for (let index = 0; index < rowCount; index += 1) {
      const value = fields[`${path}.${index}.${imageFieldName}`]?.value
      const id = normalizeID(value)
      if (id) ids.add(id)
    }

    return ids
  })

  const params = useMemo(() => {
    const and: Record<string, unknown>[] = []
    const trimmedQuery = query.trim()

    if (trimmedQuery) {
      and.push({
        or: [
          { title: { like: trimmedQuery } },
          { filename: { like: trimmedQuery } },
          { alt: { like: trimmedQuery } },
          { caption: { like: trimmedQuery } },
          { tags: { contains: trimmedQuery } },
        ],
      })
    }

    if (category !== 'all') {
      and.push({ category: { equals: category } })
    }

    if (orientation !== 'all') {
      and.push({ orientation: { equals: orientation } })
    }

    if (featuredOnly) {
      and.push({ featured: { equals: true } })
    }

    return {
      depth: 0,
      limit,
      page,
      sort: defaultSort,
      ...(and.length > 0 ? { where: and.length === 1 ? and[0] : { and } } : {}),
    }
  }, [category, defaultSort, featuredOnly, limit, orientation, page, query])

  const [{ data, isError, isLoading }, { setParams }] = usePayloadAPI('/api/media', {
    initialParams: params,
  })

  useEffect(() => {
    setParams(params)
  }, [params, setParams])

  useEffect(() => {
    setPage(1)
  }, [category, featuredOnly, orientation, query])

  const docs = useMemo<MediaDoc[]>(() => (Array.isArray(data?.docs) ? data.docs : []), [data?.docs])
  const totalPages = Number(data?.totalPages || 1)

  const docByID = useMemo(() => {
    const map = new Map<string, MediaDoc>()
    docs.forEach((doc) => {
      map.set(String(doc.id), doc)
    })
    return map
  }, [docs])

  const selectableCount = docs.filter((doc) => !usedImageIDs.has(String(doc.id))).length

  const toggleSelection = useCallback((id: MediaID) => {
    const key = String(id)
    setSelectedIDs((previous) => {
      const next = new Set(previous)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const selectVisible = useCallback(() => {
    setSelectedIDs((previous) => {
      const next = new Set(previous)
      docs.forEach((doc) => {
        const key = String(doc.id)
        if (!usedImageIDs.has(key)) next.add(key)
      })
      return next
    })
  }, [docs, usedImageIDs])

  const clearSelection = useCallback(() => {
    setSelectedIDs(new Set())
  }, [])

  const addSelected = useCallback(() => {
    if (!path || selectedIDs.size === 0 || readOnly) return

    Array.from(selectedIDs).forEach((key) => {
      const doc = docByID.get(key)
      const mediaID = doc?.id ?? key
      const subFieldState = Object.entries({
        [imageFieldName]: mediaID,
        ...rowDefaults,
      }).reduce<Record<string, ReturnType<typeof buildFieldState>>>((acc, [fieldName, value]) => {
        acc[fieldName] = buildFieldState(value)
        return acc
      }, {})

      addFieldRow({
        path,
        schemaPath: schemaPath || path,
        subFieldState,
      })
    })

    toast.success(`${selectedIDs.size} Bild${selectedIDs.size === 1 ? '' : 'er'} hinzugefuegt`)
    setSelectedIDs(new Set())
  }, [addFieldRow, docByID, imageFieldName, path, readOnly, rowDefaults, schemaPath, selectedIDs])

  if (readOnly) return null

  return (
    <section className="media-gallery-picker">
      <div className="media-gallery-picker__topline">
        <div>
          <h4>{title}</h4>
          <p>{intro}</p>
        </div>
        <Button buttonStyle="secondary" onClick={() => setIsOpen((value) => !value)} type="button">
          {isOpen ? 'Auswahl schliessen' : 'Bilder visuell waehlen'}
        </Button>
      </div>

      {isOpen ? (
        <div className="media-gallery-picker__panel">
          <div className="media-gallery-picker__filters">
            <label>
              <span>Suchen</span>
              <input
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Titel, Datei, Alt-Text oder Tag"
                type="search"
                value={query}
              />
            </label>
            <label>
              <span>Kategorie</span>
              <select onChange={(event) => setCategory(event.target.value)} value={category}>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Format</span>
              <select onChange={(event) => setOrientation(event.target.value)} value={orientation}>
                {orientationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="media-gallery-picker__checkbox">
              <input
                checked={featuredOnly}
                onChange={(event) => setFeaturedOnly(event.target.checked)}
                type="checkbox"
              />
              <span>Nur Favoriten</span>
            </label>
          </div>

          <div className="media-gallery-picker__actions">
            <div>
              <strong>{selectedIDs.size}</strong> ausgewaehlt
              {usedImageIDs.size > 0 ? <span>{usedImageIDs.size} bereits in dieser Liste</span> : null}
            </div>
            <div>
              <Button buttonStyle="none" disabled={selectableCount === 0} onClick={selectVisible} type="button">
                Sichtbare waehlen
              </Button>
              <Button buttonStyle="none" disabled={selectedIDs.size === 0} onClick={clearSelection} type="button">
                Leeren
              </Button>
              <Button disabled={selectedIDs.size === 0} onClick={addSelected} type="button">
                {buttonLabel}
              </Button>
            </div>
          </div>

          {isError ? <p className="media-gallery-picker__status">Medien konnten nicht geladen werden.</p> : null}
          {isLoading ? <p className="media-gallery-picker__status">Medien werden geladen...</p> : null}

          {!isLoading && docs.length === 0 ? (
            <p className="media-gallery-picker__status">Keine passenden Bilder gefunden.</p>
          ) : null}

          <div className="media-gallery-picker__grid">
            {docs.map((doc) => {
              const id = String(doc.id)
              const isUsed = usedImageIDs.has(id)
              const isSelected = selectedIDs.has(id)
              const previewURL = getPreviewURL(doc)

              return (
                <button
                  aria-pressed={isSelected}
                  className={[
                    'media-gallery-picker__card',
                    isSelected ? 'media-gallery-picker__card--selected' : '',
                    isUsed ? 'media-gallery-picker__card--used' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  disabled={isUsed}
                  key={id}
                  onClick={() => toggleSelection(doc.id)}
                  type="button"
                >
                  <span className="media-gallery-picker__preview">
                    {previewURL ? <img alt={doc.alt || getTitle(doc)} src={previewURL} /> : <span>Keine Vorschau</span>}
                  </span>
                  <span className="media-gallery-picker__meta">
                    <strong>{getTitle(doc)}</strong>
                    <small>
                      {doc.category || 'ohne Kategorie'}
                      {doc.orientation ? ` / ${doc.orientation}` : ''}
                    </small>
                  </span>
                  {isUsed ? <span className="media-gallery-picker__badge">Schon drin</span> : null}
                </button>
              )
            })}
          </div>

          <div className="media-gallery-picker__pager">
            <Button buttonStyle="secondary" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} type="button">
              Zurueck
            </Button>
            <span>
              Seite {page} von {totalPages}
            </span>
            <Button
              buttonStyle="secondary"
              disabled={page >= totalPages}
              onClick={() => setPage((value) => value + 1)}
              type="button"
            >
              Weiter
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  )
}

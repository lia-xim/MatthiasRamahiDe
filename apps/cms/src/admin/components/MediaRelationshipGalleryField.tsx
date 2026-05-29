'use client'

import type { RelationshipFieldClientProps } from 'payload'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, RelationshipField, toast, useField, usePayloadAPI } from '@payloadcms/ui'

import {
  categoryOptions,
  getPreviewURL,
  getTitle,
  type MediaDoc,
  type MediaID,
  normalizeID,
  orientationOptions,
} from './MediaGalleryPicker'
import './MediaGalleryPicker.scss'

type Props = RelationshipFieldClientProps & {
  defaultSort?: string
  intro?: string
  limit?: number
  title?: string
}

export function MediaRelationshipGalleryField({
  defaultSort = '-updatedAt',
  intro = 'Direkt aus der Bildbibliothek waehlen. Die klassische Payload-Liste bleibt darunter als Fallback.',
  limit = 36,
  path: pathFromProps,
  readOnly,
  title = 'Bild visuell auswaehlen',
  ...relationshipProps
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [orientation, setOrientation] = useState('all')
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [page, setPage] = useState(1)

  const { path, setValue, value } = useField<unknown>({ potentiallyStalePath: pathFromProps })
  const currentID = normalizeID(value)

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

    if (category !== 'all') and.push({ category: { equals: category } })
    if (orientation !== 'all') and.push({ orientation: { equals: orientation } })
    if (featuredOnly) and.push({ featured: { equals: true } })

    return {
      depth: 0,
      limit,
      page,
      sort: defaultSort,
      ...(and.length > 0 ? { where: and.length === 1 ? and[0] : { and } } : {}),
    }
  }, [category, defaultSort, featuredOnly, limit, orientation, page, query])

  const [{ data, isError, isLoading }, { setParams }] = usePayloadAPI(isOpen ? '/api/media' : '', {
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

  const chooseImage = useCallback(
    (id: MediaID) => {
      setValue(id)
      toast.success('Bild ausgewaehlt')
      setIsOpen(false)
    },
    [setValue],
  )

  const fieldProps = {
    ...relationshipProps,
    path: pathFromProps,
    readOnly,
  } as RelationshipFieldClientProps

  return (
    <div className="media-relationship-gallery-field">
      {!readOnly ? (
        <section className="media-gallery-picker media-gallery-picker--single">
          <div className="media-gallery-picker__topline">
            <div>
              <h4>{title}</h4>
              <p>{intro}</p>
            </div>
            <Button buttonStyle="secondary" onClick={() => setIsOpen((value) => !value)} type="button">
              {isOpen ? 'Galerie schliessen' : 'Galerie oeffnen'}
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

              {isError ? <p className="media-gallery-picker__status">Medien konnten nicht geladen werden.</p> : null}
              {isLoading ? <p className="media-gallery-picker__status">Medien werden geladen...</p> : null}
              {!isLoading && docs.length === 0 ? (
                <p className="media-gallery-picker__status">Keine passenden Bilder gefunden.</p>
              ) : null}

              <div className="media-gallery-picker__grid">
                {docs.map((doc) => {
                  const id = String(doc.id)
                  const isSelected = currentID === id
                  const previewURL = getPreviewURL(doc)

                  return (
                    <button
                      aria-pressed={isSelected}
                      className={[
                        'media-gallery-picker__card',
                        isSelected ? 'media-gallery-picker__card--selected' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      key={id}
                      onClick={() => chooseImage(doc.id)}
                      type="button"
                    >
                      <span className="media-gallery-picker__preview">
                        {previewURL ? (
                          <img alt={doc.alt || getTitle(doc)} src={previewURL} />
                        ) : (
                          <span>Keine Vorschau</span>
                        )}
                      </span>
                      <span className="media-gallery-picker__meta">
                        <strong>{getTitle(doc)}</strong>
                        <small>
                          {doc.category || 'ohne Kategorie'}
                          {doc.orientation ? ` / ${doc.orientation}` : ''}
                        </small>
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="media-gallery-picker__pager">
                <Button
                  buttonStyle="secondary"
                  disabled={page <= 1}
                  onClick={() => setPage((value) => value - 1)}
                  type="button"
                >
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
      ) : null}

      <RelationshipField {...fieldProps} path={path} />
    </div>
  )
}

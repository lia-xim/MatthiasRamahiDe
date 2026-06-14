type TinaFieldSource = {
  _content_source?: {
    queryId?: string
    path?: Array<string | number>
  }
}

export function tinaAttrs(object: unknown, property?: string, index?: number) {
  const contentSource = (object as TinaFieldSource | null | undefined)?._content_source
  if (!contentSource?.queryId || !Array.isArray(contentSource.path)) return {}

  const path = property
    ? typeof index === 'number'
      ? [...contentSource.path, property, index]
      : [...contentSource.path, property]
    : contentSource.path
  const field = `${contentSource.queryId}---${path.join('.')}`

  return field ? { 'data-tina-field': field } : {}
}

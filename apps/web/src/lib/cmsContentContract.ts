export type CmsMediaSize = {
  filename?: string
  url?: string
  width?: number
  height?: number
  mimeType?: string
  filesize?: number
}

export type CmsMedia = {
  id: string
  filename?: string
  title?: string
  alt?: string
  caption?: string
  url?: string
  width?: number
  height?: number
  mimeType?: string
  filesize?: number
  focalX?: number
  focalY?: number
  dominantColor?: string
  blurDataUrl?: string
  updatedAt?: string
  sizes?: Record<string, CmsMediaSize>
}

export type CmsImageRef = CmsMedia | string | undefined

export type CmsLink = {
  label?: string
  href?: string
  description?: string
  platform?: string
  openInNewTab?: boolean
  rel?: string
  seoPurpose?: string
}

export type CmsCta = {
  label?: string
  href?: string
  headline?: string
  text?: string
  buttonLabel?: string
  emailSubject?: string
}

export type CmsSeo = {
  title?: string
  description?: string
  focusKeyword?: string
  searchIntent?: string
  canonicalUrl?: string
  legacyUrl?: string
  noIndex?: boolean
  ogImage?: CmsImageRef
}

export type CmsLegacyInfo = {
  sourceFile?: string
  sourceUrl?: string
  migrationStatus?: string
  renderSource?: string
  renderedHeadHtml?: string
  renderedBodyHtml?: string
  afterFooterHtml?: string
  bodyClass?: string
  headerCurrent?: string
}

export type JournalPublicationDocument = {
  _status?: unknown
  publishedAt?: unknown
  status?: unknown
}

export function isJournalDocumentPublic(document: JournalPublicationDocument, now: Date | number = Date.now()) {
  if (document._status === 'draft' || document.status === 'draft') return false

  const status = typeof document.status === 'string' ? document.status : ''
  const publishedAt = typeof document.publishedAt === 'string' ? document.publishedAt.trim() : ''
  if (!publishedAt) return status !== 'scheduled'

  const publishedAtMs = Date.parse(publishedAt)
  if (!Number.isFinite(publishedAtMs)) return status !== 'scheduled'

  const nowMs = typeof now === 'number' ? now : now.getTime()
  return publishedAtMs <= nowMs
}

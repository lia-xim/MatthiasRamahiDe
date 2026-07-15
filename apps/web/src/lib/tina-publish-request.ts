const firstForwardedValue = (value: string | null) => value?.split(',')[0]?.trim() || ''

const normalizedOrigin = (value: string) => {
  try {
    return new URL(value).origin
  } catch {
    return ''
  }
}

export const isTrustedTinaPublishRequest = (request: Request) => {
  const origin = request.headers.get('origin')
  if (!origin) return true

  const requestOrigin = normalizedOrigin(request.url)
  const forwardedHost = firstForwardedValue(request.headers.get('x-forwarded-host'))
  const host = forwardedHost || firstForwardedValue(request.headers.get('host'))
  const forwardedProto = firstForwardedValue(request.headers.get('x-forwarded-proto'))

  const allowedOrigins = new Set<string>()
  if (requestOrigin) allowedOrigins.add(requestOrigin)
  if (host && forwardedProto) {
    const proxyOrigin = normalizedOrigin(`${forwardedProto}://${host}`)
    if (proxyOrigin) allowedOrigins.add(proxyOrigin)
  }

  return allowedOrigins.has(normalizedOrigin(origin))
}

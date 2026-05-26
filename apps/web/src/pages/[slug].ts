import { getLegacyFileForPath, getLegacyStaticPaths, legacyResponse } from '../lib/legacy'

export const prerender = true

type EndpointContext = {
  props: { legacyFile?: string }
  url: URL
}

export async function getStaticPaths() {
  return getLegacyStaticPaths()
}

export function GET({ props, url }: EndpointContext) {
  const legacyFile = props.legacyFile || getLegacyFileForPath(url.pathname)

  if (!legacyFile) {
    return new Response('Not found', { status: 404 })
  }

  return legacyResponse(legacyFile)
}

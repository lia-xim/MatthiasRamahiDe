import { listLegacyHtmlFiles, readLegacyPage } from '../lib/legacy'

export const prerender = true

type EndpointContext = {
  params: { slug?: string }
  props: { legacyFile?: string }
}

const htmlHeaders = {
  'content-type': 'text/html; charset=utf-8',
}

export async function getStaticPaths() {
  const files = await listLegacyHtmlFiles()
  return files
    .filter((file) => file !== 'index.html')
    .map((file) => ({
      params: { slug: file.replace(/\.html$/i, '') },
      props: { legacyFile: file },
    }))
}

export async function GET({ props }: EndpointContext) {
  const legacyFile = props.legacyFile

  if (!legacyFile) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(await readLegacyPage(legacyFile), { headers: htmlHeaders })
}

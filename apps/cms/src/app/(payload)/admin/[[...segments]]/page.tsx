import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type PageArgs = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<Record<string, string | string[]>>
}

export const generateMetadata = ({ params, searchParams }: PageArgs) =>
  generatePageMetadata({ config, params, searchParams })

export default function Page({ params, searchParams }: PageArgs) {
  return RootPage({ config, importMap, params, searchParams })
}

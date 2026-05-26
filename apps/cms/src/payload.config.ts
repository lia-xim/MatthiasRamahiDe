import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { JournalPosts } from './collections/JournalPosts'
import { LocalSeoPages } from './collections/LocalSeoPages'
import { Media } from './collections/Media'
import { PortfolioCategories } from './collections/PortfolioCategories'
import { PortfolioProjects } from './collections/PortfolioProjects'
import { ServicePages } from './collections/ServicePages'
import { SitePages } from './collections/SitePages'
import { Users } from './collections/Users'
import { Footer } from './globals/Footer'
import { GlobalCtas } from './globals/GlobalCtas'
import { Navigation } from './globals/Navigation'
import { SiteSettings } from './globals/SiteSettings'
import { buildPreviewUrl, getWebUrl } from './livePreview'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const webUrl = getWebUrl()
const payloadUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
const payloadSecret = process.env.PAYLOAD_SECRET || randomUUID()
const useSQLite = process.env.PAYLOAD_DB === 'sqlite'
const hasS3 = Boolean(process.env.S3_BUCKET && process.env.S3_ENDPOINT && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY)

if (!process.env.PAYLOAD_SECRET) {
  console.warn('PAYLOAD_SECRET is not set. Using an ephemeral local secret; set PAYLOAD_SECRET in every persistent environment.')
}

export default buildConfig({
  serverURL: payloadUrl,
  cors: [webUrl, payloadUrl].filter(Boolean),
  csrf: [webUrl, payloadUrl].filter(Boolean),
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Matthias Ramahi CMS',
    },
    livePreview: {
      url: ({ collectionConfig, data }) =>
        buildPreviewUrl({ collection: collectionConfig?.slug || '', slug: data?.slug }),
      collections: ['portfolio-projects', 'service-pages', 'local-seo-pages', 'journal-posts', 'site-pages'],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 820, height: 1180 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 1000 },
      ],
    },
  },
  collections: [
    Users,
    Media,
    PortfolioCategories,
    PortfolioProjects,
    ServicePages,
    LocalSeoPages,
    JournalPosts,
    SitePages,
  ],
  globals: [Navigation, SiteSettings, Footer, GlobalCtas],
  editor: lexicalEditor({}),
  db: useSQLite
    ? sqliteAdapter({
        client: {
          url: process.env.DATABASE_URL || 'file:./payload-dev.db',
        },
        wal: true,
      })
    : postgresAdapter({
        pool: {
          connectionString: process.env.DATABASE_URI,
        },
      }),
  secret: payloadSecret,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: [
    ...(hasS3
      ? [
          s3Storage({
            bucket: process.env.S3_BUCKET as string,
            collections: {
              media: {
                prefix: 'media',
                disableLocalStorage: true,
              },
            },
            config: {
              endpoint: process.env.S3_ENDPOINT,
              region: process.env.S3_REGION || 'auto',
              forcePathStyle: true,
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
              },
            },
          }),
        ]
      : []),
  ],
})

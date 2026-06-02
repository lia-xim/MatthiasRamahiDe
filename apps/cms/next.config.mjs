import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  async headers() {
    return [
      {
        // Responsive media variants are content-stable (filename encodes the
        // dimensions). Cache them at the browser/CDN so repeat visits don't
        // re-download images. 1 day fresh + 30 day stale-while-revalidate means
        // an in-place re-compress still propagates within ~a day.
        source: '/api/media/file/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=2592000',
          },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig)

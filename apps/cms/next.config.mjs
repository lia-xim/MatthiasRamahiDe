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
        // Responsive media variants are addressed with a ?m=updatedAt/filesize
        // fingerprint on the website. Keep them fresh for repeat visits while
        // CMS updates still break the cache via a changed URL.
        source: '/api/media/file/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=31536000',
          },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig)

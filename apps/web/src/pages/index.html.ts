import { toAbsoluteSiteUrl } from '../lib/payload'

export const prerender = false

export function GET() {
  return new Response(null, {
    status: 308,
    headers: {
      location: toAbsoluteSiteUrl('/'),
    },
  })
}

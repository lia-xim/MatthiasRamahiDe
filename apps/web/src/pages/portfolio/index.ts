import { legacyResponse } from '../../lib/legacy'

export const prerender = true

export function GET() {
  return legacyResponse('portfolio.html')
}

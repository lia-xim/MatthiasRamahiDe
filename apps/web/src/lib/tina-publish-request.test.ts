import assert from 'node:assert/strict'
import test from 'node:test'

import { isTrustedTinaPublishRequest } from './tina-publish-request.ts'

test('accepts a direct same-origin publish request', () => {
  const request = new Request('https://cms.matthiasramahi.de/api/tina-publish', {
    headers: { origin: 'https://cms.matthiasramahi.de' },
  })

  assert.equal(isTrustedTinaPublishRequest(request), true)
})

test('accepts the public HTTPS origin behind the CMS reverse proxy', () => {
  const request = new Request('http://tina-web:4321/api/tina-publish', {
    headers: {
      host: 'cms.matthiasramahi.de',
      origin: 'https://cms.matthiasramahi.de',
      'x-forwarded-proto': 'https',
    },
  })

  assert.equal(isTrustedTinaPublishRequest(request), true)
})

test('rejects a foreign origin even when forwarded headers are present', () => {
  const request = new Request('http://tina-web:4321/api/tina-publish', {
    headers: {
      host: 'cms.matthiasramahi.de',
      origin: 'https://attacker.example',
      'x-forwarded-proto': 'https',
    },
  })

  assert.equal(isTrustedTinaPublishRequest(request), false)
})

test('keeps non-browser requests without an Origin header compatible', () => {
  const request = new Request('http://tina-web:4321/api/tina-publish')

  assert.equal(isTrustedTinaPublishRequest(request), true)
})

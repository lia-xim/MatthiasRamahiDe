import http from 'node:http'

function option(name, fallback) {
  const prefix = `--${name}=`
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length) || process.env[name.toUpperCase().replaceAll('-', '_')] || fallback
}

const listenHost = option('listen-host', '0.0.0.0')
const listenPort = Number(option('listen-port', '4002'))
const targetHost = option('target-host', '::1')
const targetPort = Number(option('target-port', '4001'))
const targetOrigin = `http://${targetHost.includes(':') ? `[${targetHost}]` : targetHost}:${targetPort}`
const targetHostHeader = `${targetHost.includes(':') ? `[${targetHost}]` : targetHost}:${targetPort}`

const imageVariantPattern = /-\d+x\d+\.(?:avif|webp|jpe?g|png)$/i
const hiddenDirectories = new Set(['generated', '_quality-backups'])

function requestUrl(request) {
  return new URL(request.url || '/', 'http://tina-proxy.local')
}

function directoryName(value) {
  return String(value || '')
    .replaceAll('\\', '/')
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .filter(Boolean)
    .at(-1)
}

function fileName(value) {
  const clean = String(value || '').split('?')[0].split('#')[0]
  try {
    return decodeURIComponent(clean.split('/').pop() || clean)
  } catch {
    return clean.split('/').pop() || clean
  }
}

function shouldShowDirectory(directory) {
  const name = directoryName(directory)
  return Boolean(name) && !name.startsWith('.') && !hiddenDirectories.has(name)
}

function shouldShowFile(file) {
  const name = fileName(file?.filename || file?.src)
  if (!name || name.startsWith('.')) return false
  return !imageVariantPattern.test(name)
}

function jsonResponse(response, status, payload) {
  const body = `${JSON.stringify(payload)}\n`
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store, private',
    'content-length': Buffer.byteLength(body),
  })
  response.end(body)
}

async function fetchMediaListPage(pathname, searchParams, cursor, limit) {
  const upstreamUrl = new URL(pathname, targetOrigin)
  for (const [key, value] of searchParams) {
    if (key !== 'cursor' && key !== 'limit') upstreamUrl.searchParams.append(key, value)
  }
  upstreamUrl.searchParams.set('limit', String(limit))
  if (cursor) upstreamUrl.searchParams.set('cursor', cursor)

  const upstreamResponse = await fetch(upstreamUrl)
  const text = await upstreamResponse.text()

  if (!upstreamResponse.ok) {
    const error = new Error(`Tina media list failed with ${upstreamResponse.status}`)
    error.status = upstreamResponse.status
    error.body = text
    throw error
  }

  return JSON.parse(text)
}

async function handleMediaList(request, response) {
  const url = requestUrl(request)
  const requestedLimit = Math.max(1, Math.min(200, Number(url.searchParams.get('limit') || '36') || 36))
  const directory = url.pathname.replace(/^\/media\/list\/?/, '').replace(/^\/+|\/+$/g, '')
  const upstreamLimit = directory === 'payload' ? Math.max(200, requestedLimit) : requestedLimit
  let cursor = url.searchParams.get('cursor') || ''
  const files = []
  const directories = []
  const seenDirectories = new Set()

  for (let page = 0; page < 80; page += 1) {
    const payload = await fetchMediaListPage(url.pathname, url.searchParams, cursor, upstreamLimit)

    for (const directoryEntry of payload.directories || []) {
      if (!shouldShowDirectory(directoryEntry)) continue
      if (seenDirectories.has(directoryEntry)) continue
      seenDirectories.add(directoryEntry)
      directories.push(directoryEntry)
    }

    for (const file of payload.files || []) {
      if (shouldShowFile(file)) files.push(file)
    }

    cursor = payload.cursor || ''
    if (!cursor || files.length >= requestedLimit || directory !== 'payload') break
  }

  jsonResponse(response, 200, {
    files,
    directories,
    cursor: cursor || null,
  })
}

function proxyRequest(request, response) {
  const upstreamRequest = http.request(
    {
      host: targetHost,
      port: targetPort,
      method: request.method,
      path: request.url,
      headers: {
        ...request.headers,
        host: targetHostHeader,
      },
    },
    (upstreamResponse) => {
      response.writeHead(upstreamResponse.statusCode || 502, upstreamResponse.headers)
      upstreamResponse.pipe(response)
    },
  )

  upstreamRequest.on('error', (error) => {
    if (response.headersSent) {
      response.destroy(error)
      return
    }
    response.writeHead(502, { 'content-type': 'text/plain; charset=utf-8' })
    response.end(`Tina proxy upstream error: ${error.message}`)
  })

  request.pipe(upstreamRequest)
}

const server = http.createServer((request, response) => {
  const url = requestUrl(request)

  if (request.method === 'GET' && (url.pathname === '/media/list' || url.pathname.startsWith('/media/list/'))) {
    handleMediaList(request, response).catch((error) => {
      const status = typeof error.status === 'number' ? error.status : 502
      if (error.body) {
        response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
        response.end(error.body)
        return
      }
      jsonResponse(response, status, { error: error.message || String(error) })
    })
    return
  }

  proxyRequest(request, response)
})

server.listen(listenPort, listenHost, () => {
  console.log(`Tina HTTP proxy listening on ${listenHost}:${listenPort} -> ${targetOrigin}`)
  console.log('Tina media list filtering is active for generated image variants.')
})

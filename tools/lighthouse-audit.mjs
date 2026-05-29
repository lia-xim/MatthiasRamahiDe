import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import http from 'node:http'
import path from 'node:path'

import { launch } from 'chrome-launcher'
import lighthouse from 'lighthouse'

const args = process.argv.slice(2).filter((arg) => arg !== '--')
const root = process.cwd()
const targetRoot = path.resolve(root, option('target', 'apps/web/dist/client'))
const baseUrlOption = option('base-url').replace(/\/$/, '')
const outputDir = path.resolve(root, option('output-dir', '.lighthouse'))
const maxAttempts = Math.max(1, Number(option('attempts', '2')) || 2)
const routes = option(
  'routes',
  [
    '/',
    '/fotografie.html',
    '/portfolio.html',
    '/automobil-fotografie-duesseldorf.html',
    '/sportwagen-fotografie-duesseldorf.html',
    '/oldtimer-fotografie-duesseldorf.html',
    '/motorrad-fotografie-duesseldorf.html',
    '/contact.html',
  ].join(','),
)
  .split(',')
  .map((route) => normalizeRoute(route.trim()))
  .filter(Boolean)
const formFactors = option('form-factors', 'mobile')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)
const thresholds = {
  accessibility: Number(option('min-accessibility', '0.95')),
  bestPractices: Number(option('min-best-practices', '0.95')),
  performance: Number(option('min-performance', '0.90')),
  seo: Number(option('min-seo', '0.95')),
}

function option(name, fallback = '') {
  const prefix = `--${name}=`
  return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length) || fallback
}

function normalizeRoute(route) {
  if (!route) return ''
  const withSlash = route.startsWith('/') ? route : `/${route}`
  return withSlash === '/index.html' ? '/' : withSlash.replace(/\/+$/, '') || '/'
}

function toPosix(value) {
  return value.replaceAll(path.sep, '/').replaceAll('\\', '/')
}

function contentTypeFor(file) {
  const ext = path.extname(file).toLowerCase()
  return {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.mp4': 'video/mp4',
    '.png': 'image/png',
    '.svg': 'image/svg+xml; charset=utf-8',
    '.webmanifest': 'application/manifest+json; charset=utf-8',
    '.webp': 'image/webp',
    '.xml': 'application/xml; charset=utf-8',
  }[ext] || 'application/octet-stream'
}

function candidateInsideTarget(candidate) {
  const resolved = path.resolve(targetRoot, candidate)
  return resolved === targetRoot || resolved.startsWith(`${targetRoot}${path.sep}`) ? resolved : ''
}

function findStaticFile(pathname) {
  const clean = decodeURIComponent(pathname.split('?')[0].split('#')[0]).replace(/^\/+/, '')
  const candidates = []
  const add = (candidate) => {
    const resolved = candidateInsideTarget(candidate)
    if (resolved) candidates.push(resolved)
  }

  if (!clean) {
    add('index.html')
    add(path.join('index.html', 'index.html'))
  }
  else {
    add(clean)
    if (path.extname(clean) === '.html') add(path.join(clean, 'index.html'))
    if (!path.extname(clean)) {
      add(path.join(clean, 'index.html'))
      add(`${clean}.html`)
      add(path.join(`${clean}.html`, 'index.html'))
    }
  }

  return candidates.find((candidate) => fsSync.existsSync(candidate) && fsSync.statSync(candidate).isFile()) || ''
}

function startStaticServer() {
  const server = http.createServer(async (request, response) => {
    const requestUrl = new URL(request.url || '/', 'http://127.0.0.1')
    const file = findStaticFile(requestUrl.pathname)
    if (!file) {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
      response.end('Not found')
      return
    }
    const body = await fs.readFile(file)
    response.writeHead(200, {
      'cache-control': 'public, max-age=31536000, immutable',
      'content-length': String(body.length),
      'content-type': contentTypeFor(file),
    })
    response.end(body)
  })

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      resolve({
        baseUrl: `http://127.0.0.1:${address.port}`,
        close: () => new Promise((done) => server.close(done)),
      })
    })
  })
}

function lighthouseConfig(formFactor) {
  if (formFactor !== 'desktop') return undefined
  return {
    extends: 'lighthouse:default',
    settings: {
      formFactor: 'desktop',
      screenEmulation: {
        deviceScaleFactor: 1,
        disabled: false,
        height: 940,
        mobile: false,
        width: 1350,
      },
    },
  }
}

function scoreOf(categories, id) {
  return Number(categories[id]?.score ?? 0)
}

function metricValue(audits, id) {
  return audits[id]?.numericValue ? Math.round(audits[id].numericValue) : 0
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function runtimeErrorOf(runnerResult) {
  const runtimeError = runnerResult?.lhr?.runtimeError
  return runtimeError ? { code: runtimeError.code, message: runtimeError.message } : undefined
}

function isRetryableRuntimeError(runnerResult) {
  const code = runnerResult?.lhr?.runtimeError?.code
  return code === 'ERRORED_DOCUMENT_REQUEST' || code === 'PAGE_HUNG' || code === 'NO_FCP'
}

async function runLighthouse(url, formFactor) {
  let lastError

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const chrome = await launch({
      chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
    })
    let runnerResult
    try {
      runnerResult = await lighthouse(
        url,
        {
          logLevel: 'error',
          onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
          output: 'json',
          port: chrome.port,
        },
        lighthouseConfig(formFactor),
      )
    } catch (error) {
      lastError = error
    } finally {
      try {
        await chrome.kill()
      } catch (error) {
        console.warn(`Chrome cleanup warning: ${error.message}`)
      }
    }

    if (runnerResult && (!isRetryableRuntimeError(runnerResult) || attempt === maxAttempts)) {
      return { attempts: attempt, runnerResult }
    }

    const reason = runtimeErrorOf(runnerResult)?.code || lastError?.message || 'unknown Lighthouse error'
    if (attempt < maxAttempts) {
      console.warn(`Retrying ${url} after Lighthouse navigation error (${reason}), attempt ${attempt + 1}/${maxAttempts}`)
      await sleep(750 * attempt)
    }
  }

  throw lastError || new Error(`Lighthouse failed for ${url}`)
}

if (!baseUrlOption && !fsSync.existsSync(targetRoot)) {
  console.error(`Build target does not exist: ${toPosix(path.relative(root, targetRoot))}`)
  console.error('Run `corepack pnpm vercel:build` before Lighthouse audits.')
  process.exit(1)
}

const server = baseUrlOption
  ? { baseUrl: baseUrlOption, close: async () => undefined }
  : await startStaticServer()

const results = []
try {
  await fs.mkdir(outputDir, { recursive: true })
  for (const formFactor of formFactors) {
    for (const route of routes) {
      const url = `${server.baseUrl}${route === '/' ? '/' : route}`
      const { attempts, runnerResult } = await runLighthouse(url, formFactor)
      const lhr = runnerResult.lhr
      const runtimeError = runtimeErrorOf(runnerResult)
      const scores = {
        accessibility: scoreOf(lhr.categories, 'accessibility'),
        bestPractices: scoreOf(lhr.categories, 'best-practices'),
        performance: scoreOf(lhr.categories, 'performance'),
        seo: scoreOf(lhr.categories, 'seo'),
      }
      const metrics = {
        cls: lhr.audits['cumulative-layout-shift']?.numericValue || 0,
        fcpMs: metricValue(lhr.audits, 'first-contentful-paint'),
        lcpMs: metricValue(lhr.audits, 'largest-contentful-paint'),
        speedIndexMs: metricValue(lhr.audits, 'speed-index'),
        tbtMs: metricValue(lhr.audits, 'total-blocking-time'),
      }
      const slug = route === '/' ? 'home' : route.replace(/^\/|\.html$/g, '').replaceAll('/', '-')
      await fs.writeFile(path.join(outputDir, `${formFactor}-${slug}.json`), runnerResult.report)
      results.push({ attempts, formFactor, metrics, route, scores, url, ...(runtimeError ? { runtimeError } : {}) })
    }
  }
} finally {
  await server.close()
}

const failures = []
for (const result of results) {
  if (result.scores.performance < thresholds.performance) failures.push({ ...result, failure: 'performance' })
  if (result.scores.accessibility < thresholds.accessibility) failures.push({ ...result, failure: 'accessibility' })
  if (result.scores.bestPractices < thresholds.bestPractices) failures.push({ ...result, failure: 'best-practices' })
  if (result.scores.seo < thresholds.seo) failures.push({ ...result, failure: 'seo' })
}

const summary = {
  auditedAt: new Date().toISOString(),
  failures: failures.length,
  formFactors,
  outputDir: toPosix(path.relative(root, outputDir)),
  routes: routes.length,
  thresholds,
  results,
}
await fs.writeFile(path.join(outputDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`)
console.log(JSON.stringify(summary, null, 2))

if (failures.length > 0) process.exit(1)

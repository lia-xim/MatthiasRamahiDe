import { mkdir } from 'node:fs/promises'
import net from 'node:net'
import { spawn, spawnSync } from 'node:child_process'

const root = process.cwd()
const args = process.argv.slice(2)
const host = process.env.SEO_RELEASE_PREVIEW_HOST || '127.0.0.1'
const requestedPort = Number(process.env.SEO_RELEASE_PREVIEW_PORT || 47901)
const skipBuild = args.includes('--skip-build') || process.env.SEO_RELEASE_PREVIEW_SKIP_BUILD === '1'
const reportDir = process.env.SEO_RELEASE_PREVIEW_REPORT_DIR || '.tmp/seo-release-preview'

function isPortOpen(port, hostname = host) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: hostname, port })
    const finish = (value) => {
      socket.destroy()
      resolve(value)
    }

    socket.setTimeout(500)
    socket.once('connect', () => finish(true))
    socket.once('timeout', () => finish(false))
    socket.once('error', () => finish(false))
  })
}

async function findAvailablePort(preferredPort) {
  if (!(await isPortOpen(preferredPort))) return preferredPort

  for (let port = preferredPort + 1; port <= preferredPort + 50; port += 1) {
    if (!(await isPortOpen(port))) return port
  }

  throw new Error(`No free preview port found from ${preferredPort} to ${preferredPort + 50}.`)
}

function run(command, commandArgs, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n> ${[command, ...commandArgs].join(' ')}`)
    const child = spawnCommand(command, commandArgs, {
      cwd: root,
      env: process.env,
      stdio: 'inherit',
      ...options,
    })

    child.once('error', reject)
    child.once('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${commandArgs.join(' ')} failed with exit code ${code}`))
    })
  })
}

function start(command, commandArgs) {
  console.log(`\n> ${[command, ...commandArgs].join(' ')}`)
  return spawnCommand(command, commandArgs, {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
  })
}

function spawnCommand(command, commandArgs, options) {
  if (process.platform !== 'win32') return spawn(command, commandArgs, options)
  return spawn([command, ...commandArgs].join(' '), { ...options, shell: true })
}

function stopProcessTree(child) {
  if (!child?.pid || child.killed) return

  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
    return
  }

  child.kill('SIGTERM')
}

async function waitForHttpOk(url, timeoutMs) {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {
      // The preview process can open the port before Astro is ready to serve.
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  throw new Error(`Preview did not serve ${url} within ${timeoutMs}ms.`)
}

let preview

try {
  await mkdir(reportDir, { recursive: true })

  if (!skipBuild) {
    await run('corepack', ['pnpm', 'web:build'])
  }

  const port = await findAvailablePort(requestedPort)
  const origin = `http://${host}:${port}`
  if (port !== requestedPort) {
    console.log(`Port ${requestedPort} is already in use; SEO release preview audit will use ${port}.`)
  }

  preview = start('corepack', [
    'pnpm',
    '--filter',
    '@matthias-ramahi/web',
    'exec',
    'astro',
    'preview',
    '--host',
    host,
    '--port',
    String(port),
  ])

  await waitForHttpOk(`${origin}/sitemap.xml`, 45000)

  await run('node', ['tools/assert-seo-release-routing.mjs', `--base-url=${origin}`])
  await run('node', [
    'tools/audit-sitemap-indexability.mjs',
    '--origin',
    origin,
    '--report',
    `${reportDir}/sitemap-indexability.md`,
    '--strict',
  ])
  await run('node', [
    'tools/audit-gsc-indexing-exports.mjs',
    '--origin',
    origin,
    '--not-found',
    'tools/fixtures/gsc-indexing-exports/not-found-2026-06-30.txt',
    '--crawled',
    'tools/fixtures/gsc-indexing-exports/crawled-not-indexed-2026-06-30.txt',
    '--found',
    'tools/fixtures/gsc-indexing-exports/found-not-indexed-2026-06-30.txt',
    '--report',
    `${reportDir}/gsc-export-url-audit.md`,
    '--strict',
  ])
} finally {
  stopProcessTree(preview)
}

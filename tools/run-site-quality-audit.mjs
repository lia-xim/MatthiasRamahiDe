import net from 'node:net'
import { spawn, spawnSync } from 'node:child_process'

const root = process.cwd()
const host = process.env.SITE_QUALITY_HOST || '127.0.0.1'
const requestedPort = Number(process.env.SITE_QUALITY_PORT || '0')
const passThroughArgs = process.argv.slice(2)

function spawnCommand(command, args, options) {
  if (process.platform !== 'win32') return spawn(command, args, options)
  return spawn(formatCommand(command, args), { ...options, shell: true })
}

function quoteArg(arg) {
  return /^[A-Za-z0-9_./:@=-]+$/.test(arg) ? arg : `"${arg.replace(/"/g, '\\"')}"`
}

function formatCommand(command, args) {
  return [command, ...args].map(quoteArg).join(' ')
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    console.log(`\n> ${formatCommand(command, args)}`)
    const child = spawnCommand(command, args, {
      cwd: root,
      env: process.env,
      stdio: 'inherit',
    })

    child.once('error', reject)
    child.once('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}`))
    })
  })
}

function start(command, args) {
  console.log(`\n> ${formatCommand(command, args)}`)
  return spawnCommand(command, args, {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
  })
}

function stopProcessTree(child) {
  if (!child?.pid || child.killed) return
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
    return
  }
  child.kill('SIGTERM')
}

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port })
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

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.once('error', reject)
    server.listen(requestedPort, host, () => {
      const address = server.address()
      server.close(() => resolve(address.port))
    })
  })
}

async function waitForPort(port, timeoutMs = 45000) {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    if (await isPortOpen(port)) return
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error(`Astro preview did not become reachable on ${host}:${port} within ${timeoutMs}ms.`)
}

const port = await getFreePort()
const baseUrl = `http://${host}:${port}`
let preview

try {
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
  await waitForPort(port)
  await run('corepack', [
    'pnpm',
    '--filter',
    '@matthias-ramahi/web',
    'test:site-quality',
    '--',
    `--base-url=${baseUrl}`,
    '--route-source=all',
    '--strict',
    ...passThroughArgs,
  ])
} finally {
  stopProcessTree(preview)
}

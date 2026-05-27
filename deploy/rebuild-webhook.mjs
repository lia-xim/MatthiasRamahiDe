import { createServer } from 'node:http'
import { spawn } from 'node:child_process'

const port = Number(process.env.REBUILD_WEBHOOK_PORT || 8787)
const secret = process.env.ASTRO_REBUILD_WEBHOOK_SECRET
const script = process.env.REBUILD_SCRIPT || '/srv/matthias-ramahi/deploy/rebuild-astro.sh'

if (!secret) {
  throw new Error('ASTRO_REBUILD_WEBHOOK_SECRET is required')
}

let running = false

createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/rebuild') {
    res.writeHead(404).end('not found')
    return
  }

  if (req.headers.authorization !== `Bearer ${secret}`) {
    res.writeHead(401).end('unauthorized')
    return
  }

  if (running) {
    res.writeHead(202).end('already running')
    return
  }

  running = true
  const child = spawn(script, { shell: true, stdio: 'inherit' })
  child.on('exit', () => {
    running = false
  })

  res.writeHead(202).end('queued')
}).listen(port, '127.0.0.1', () => {
  console.log(`Rebuild webhook listening on 127.0.0.1:${port}`)
})

import type { APIContext } from 'astro'
import { spawn } from 'node:child_process'

export const prerender = false

type PublishState = {
  command: string
  exitCode: number | null
  finishedAt: string | null
  log: string[]
  running: boolean
  startedAt: string | null
  status: 'idle' | 'running' | 'success' | 'failed'
}

type PublishGlobals = typeof globalThis & {
  __matthiasTinaPublishState?: PublishState
}

const maxLogLines = 120
const publishGlobals = globalThis as PublishGlobals

const state =
  publishGlobals.__matthiasTinaPublishState ||
  (publishGlobals.__matthiasTinaPublishState = {
    command: '',
    exitCode: null,
    finishedAt: null,
    log: [],
    running: false,
    startedAt: null,
    status: 'idle',
  })

const env = (name: string, fallback = '') => {
  const value = (import.meta.env as Record<string, unknown>)[name] ?? process.env[name] ?? fallback
  return typeof value === 'string' ? value.trim() : String(value).trim()
}

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'cache-control': 'no-store, private',
      'content-type': 'application/json; charset=utf-8',
    },
  })

const publishEnabled = () => env('TINA_PUBLISH_ENABLED') === '1'

const isSameOrigin = (request: Request) => {
  const origin = request.headers.get('origin')
  if (!origin) return true

  try {
    return new URL(origin).origin === new URL(request.url).origin
  } catch {
    return false
  }
}

const hasPublishHeader = (request: Request) => request.headers.get('x-tina-publish-request') === '1'

const appendLog = (chunk: Buffer | string) => {
  const text = String(chunk)
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trimEnd()
    if (!trimmed) continue
    state.log.push(trimmed)
  }

  if (state.log.length > maxLogLines) {
    state.log.splice(0, state.log.length - maxLogLines)
  }
}

const numericEnv = (name: string) => {
  const value = Number(env(name))
  return Number.isInteger(value) && value >= 0 ? value : undefined
}

const responseState = () => ({
  command: state.command,
  exitCode: state.exitCode,
  finishedAt: state.finishedAt,
  log: state.log.slice(-40),
  ok: state.status === 'success',
  running: state.running,
  startedAt: state.startedAt,
  status: state.status,
})

const startPublish = () => {
  const command = env('TINA_PUBLISH_COMMAND', 'deploy/publish-tina-to-git.sh')
  const cwd = env('TINA_PUBLISH_CWD', '/app')
  const uid = numericEnv('TINA_PUBLISH_UID')
  const gid = numericEnv('TINA_PUBLISH_GID')

  state.command = command
  state.exitCode = null
  state.finishedAt = null
  state.log = []
  state.running = true
  state.startedAt = new Date().toISOString()
  state.status = 'running'
  appendLog(`Starting Tina publish: ${command}`)

  const child = spawn('sh', ['-lc', command], {
    cwd,
    env: {
      ...process.env,
      SOURCE_DIR: env('TINA_PUBLISH_SOURCE_DIR', cwd),
      TINA_GIT_WORKTREE: env('TINA_GIT_WORKTREE', '/tina-git-worktree'),
      TINA_GIT_SSH_KEY: env('TINA_GIT_SSH_KEY', '/home/node/.ssh/tina_publish_github_ed25519'),
      TINA_GIT_PUSH: env('TINA_GIT_PUSH', '1'),
    },
    gid,
    uid,
  })

  child.stdout.on('data', appendLog)
  child.stderr.on('data', appendLog)
  child.on('error', (error) => {
    appendLog(`Publish failed to start: ${error.message}`)
    state.exitCode = -1
    state.finishedAt = new Date().toISOString()
    state.running = false
    state.status = 'failed'
  })
  child.on('close', (code) => {
    state.exitCode = code
    state.finishedAt = new Date().toISOString()
    state.running = false
    state.status = code === 0 ? 'success' : 'failed'
    appendLog(code === 0 ? 'Tina publish finished successfully.' : `Tina publish failed with exit code ${code}.`)
  })
}

export async function GET() {
  if (!publishEnabled()) return json({ ok: false, error: 'Tina publish is disabled.' }, 404)
  return json(responseState())
}

export async function POST({ request }: APIContext) {
  if (!publishEnabled()) return json({ ok: false, error: 'Tina publish is disabled.' }, 404)
  if (!isSameOrigin(request) || !hasPublishHeader(request)) {
    return json({ ok: false, error: 'Publish request was rejected.' }, 403)
  }

  if (state.running) {
    return json({ ...responseState(), ok: false, error: 'Ein Publish laeuft bereits.' }, 409)
  }

  startPublish()
  return json(responseState(), 202)
}

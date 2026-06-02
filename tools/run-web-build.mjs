import { execFileSync, spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const buildHeap = process.env.WEB_BUILD_MAX_OLD_SPACE_SIZE || '4096'
const nodeOptions = [process.env.NODE_OPTIONS, `--max-old-space-size=${buildHeap}`].filter(Boolean).join(' ')
const astroCli = path.join(process.cwd(), 'node_modules', 'astro', 'astro.js')
const minifyWebAssets = path.join(path.dirname(fileURLToPath(import.meta.url)), 'minify-web-assets.mjs')
const pruneUnusedDistAssets = path.join(path.dirname(fileURLToPath(import.meta.url)), 'prune-unused-dist-assets.mjs')
const assetVersion = resolveAssetVersion()

function commandOutput(command, args) {
  try {
    return execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return ''
  }
}

function resolveAssetVersion() {
  const explicit =
    process.env.ASTRO_ASSET_VERSION ||
    process.env.PUBLIC_ASSET_VERSION ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.VERCEL_DEPLOYMENT_ID

  if (explicit) return explicit

  const gitSha = commandOutput('git', ['rev-parse', '--short=12', 'HEAD'])
  const dirty = commandOutput('git', ['status', '--short'])
  if (gitSha && !dirty) return gitSha
  if (gitSha) return `${gitSha}-${Date.now().toString(36)}`

  return Date.now().toString(36)
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      ...options,
      env: {
        ...process.env,
        ASTRO_ASSET_VERSION: process.env.ASTRO_ASSET_VERSION || assetVersion,
        PUBLIC_ASSET_VERSION: process.env.PUBLIC_ASSET_VERSION || assetVersion,
        NODE_OPTIONS: nodeOptions,
        ...options.env,
      },
    })

    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} exited with ${code}`))
    })
    child.on('error', reject)
  })
}

await run(process.execPath, [astroCli, 'check'])
await run(process.execPath, [astroCli, 'build'])
await run(process.execPath, [minifyWebAssets])
await run(process.execPath, [pruneUnusedDistAssets])

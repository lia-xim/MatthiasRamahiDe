import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const buildHeap = process.env.WEB_BUILD_MAX_OLD_SPACE_SIZE || '4096'
const nodeOptions = [process.env.NODE_OPTIONS, `--max-old-space-size=${buildHeap}`].filter(Boolean).join(' ')
const astroCli = path.join(process.cwd(), 'node_modules', 'astro', 'astro.js')
const pruneUnusedDistAssets = path.join(path.dirname(fileURLToPath(import.meta.url)), 'prune-unused-dist-assets.mjs')

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      ...options,
      env: {
        ...process.env,
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
await run(process.execPath, [pruneUnusedDistAssets])

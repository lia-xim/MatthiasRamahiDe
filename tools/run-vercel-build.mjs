import { spawn } from 'node:child_process'

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      ...options,
    })
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} exited with ${code}`))
    })
    child.on('error', reject)
  })
}

const env = {
  ...process.env,
  ASTRO_ADAPTER: 'vercel',
}

await run('corepack', ['pnpm', '--filter', '@matthias-ramahi/web', 'build'], { env })
await run('node', ['tools/copy-vercel-output.mjs'], { env: process.env })

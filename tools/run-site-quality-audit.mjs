import { spawn } from 'node:child_process'

const root = process.cwd()
const passThroughArgs = process.argv.slice(2)

function quoteArg(arg) {
  return /^[A-Za-z0-9_./:@=-]+$/.test(arg) ? arg : `"${arg.replace(/"/g, '\\"')}"`
}

function formatCommand(command, args) {
  return [command, ...args].map(quoteArg).join(' ')
}

function spawnCommand(command, args, options) {
  if (process.platform !== 'win32') return spawn(command, args, options)
  return spawn(formatCommand(command, args), { ...options, shell: true })
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

await run('corepack', [
  'pnpm',
  '--filter',
  '@matthias-ramahi/web',
  'test:site-quality',
  '--',
  '--route-source=all',
  '--strict',
  ...passThroughArgs,
])

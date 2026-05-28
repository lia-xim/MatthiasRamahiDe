import fs from 'node:fs/promises'
import path from 'node:path'

const repoRoot = process.cwd()
const source = path.join(repoRoot, 'apps', 'web', '.vercel', 'output')
const target = path.join(repoRoot, '.vercel', 'output')

await fs.rm(target, { recursive: true, force: true })
await fs.mkdir(path.dirname(target), { recursive: true })
await fs.cp(source, target, { recursive: true })

console.log(`Vercel output copied: ${path.relative(repoRoot, source)} -> ${path.relative(repoRoot, target)}`)

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const replacements = new Map([
  ['assets/optimized/assets-photos-automobil-neon-1920.webp', 'assets/optimized/assets-photos-automobil-neon-1920.webp'],
  ['assets/optimized/assets-photos-automobil-sunset-1920.webp', 'assets/optimized/assets-photos-automobil-sunset-1920.webp'],
  ['assets/optimized/assets-photos-landschaft-1920.webp', 'assets/optimized/assets-photos-landschaft-1920.webp'],
  ['assets/optimized/assets-photos-motorrad-1920.webp', 'assets/optimized/assets-photos-motorrad-1920.webp'],
  ['assets/optimized/assets-photos-oldtimer-stage-1920.webp', 'assets/optimized/assets-photos-oldtimer-stage-1920.webp'],
  [
    'assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp',
    'assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp',
  ],
  [
    'assets/optimized/assets-portfolio-dsc3032-generase-2-1920.webp',
    'assets/optimized/assets-portfolio-dsc3032-generase-2-1920.webp',
  ],
  [
    'assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp',
    'assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp',
  ],
  [
    'assets/optimized/assets-portfolio-dsc3032-generase-2-1920.webp',
    'assets/optimized/assets-portfolio-dsc3032-generase-2-1920.webp',
  ],
])

const sourceExtensions = new Set(['.astro', '.css', '.html', '.js', '.jsx', '.mjs', '.ts', '.tsx'])
const sourceDirs = ['assets', 'tools', path.join('apps', 'web', 'src')]
const skipDirs = new Set(['.git', 'dist', 'node_modules', 'public'])

function toPosix(value) {
  return value.replaceAll(path.sep, '/').replaceAll('\\', '/')
}

async function collectFiles(dir) {
  const files = []
  let entries = []
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return files
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue
      files.push(...(await collectFiles(fullPath)))
      continue
    }
    if (entry.isFile() && sourceExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath)
    }
  }
  return files
}

async function rootHtmlFiles() {
  const entries = await fs.readdir(repoRoot, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === '.html')
    .map((entry) => path.join(repoRoot, entry.name))
}

function replaceHeavyRefs(text) {
  let next = text
  for (const [from, to] of replacements) {
    next = next.split(from).join(to)
    next = next.split(`../${from}`).join(`../${to}`)
  }
  return next
}

let updated = 0
const files = [
  ...(await rootHtmlFiles()),
  ...(
    await Promise.all(sourceDirs.map((dir) => collectFiles(path.join(repoRoot, dir))))
  ).flat(),
]

for (const file of files) {
  const before = await fs.readFile(file, 'utf8')
  const after = replaceHeavyRefs(before)
  if (after === before) continue
  await fs.writeFile(file, after)
  updated += 1
}

console.log(`Heavy legacy image references normalized in ${updated} files.`)

const missing = []
for (const target of new Set(replacements.values())) {
  try {
    await fs.access(path.join(repoRoot, toPosix(target)))
  } catch {
    missing.push(target)
  }
}

if (missing.length > 0) {
  console.warn(`Missing optimized image targets: ${missing.join(', ')}`)
}

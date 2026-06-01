import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const defaultTargets = [
  path.join(repoRoot, 'apps', 'web', 'dist', 'client'),
  path.join(repoRoot, 'apps', 'web', '.vercel', 'output', 'static'),
  path.join(repoRoot, '.vercel', 'output', 'static'),
]

const argTargets = process.argv
  .filter((arg) => arg.startsWith('--target='))
  .map((arg) => path.resolve(repoRoot, arg.slice('--target='.length)))
const targets = argTargets.length > 0 ? argTargets : defaultTargets

const toPosix = (value) => value.replaceAll(path.sep, '/').replaceAll('\\', '/')

async function exists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function walk(dir) {
  const files = []
  let entries = []
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return files
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(fullPath)))
    else if (entry.isFile()) files.push(fullPath)
  }
  return files
}

async function importDependency(name, fallbackRelativePath) {
  try {
    return await import(name)
  } catch {
    const fallback = path.join(repoRoot, 'node_modules', '.pnpm', 'node_modules', ...fallbackRelativePath)
    return import(pathToFileURL(fallback).href)
  }
}

const [{ minify: minifyCss }, esbuild] = await Promise.all([
  importDependency('csso', ['csso', 'lib', 'index.js']),
  importDependency('esbuild', ['esbuild', 'lib', 'main.js']),
])

async function minifyFile(file) {
  const ext = path.extname(file).toLowerCase()
  const before = await fs.readFile(file, 'utf8')
  let after = before

  if (ext === '.css') {
    after = minifyCss(before, { comments: false, restructure: false }).css
  } else if (ext === '.js') {
    const result = await esbuild.transform(before, {
      legalComments: 'none',
      minify: true,
      sourcemap: false,
      target: 'es2019',
    })
    after = result.code.trimEnd()
  }

  if (!after || after.length >= before.length) return { before: before.length, after: before.length, changed: false }

  await fs.writeFile(file, after)
  return { before: before.length, after: after.length, changed: true }
}

let changed = 0
let beforeBytes = 0
let afterBytes = 0

for (const target of targets) {
  if (!(await exists(target))) continue

  const files = (await walk(target)).filter((file) => ['.css', '.js'].includes(path.extname(file).toLowerCase()))
  let targetChanged = 0
  let targetBefore = 0
  let targetAfter = 0

  for (const file of files) {
    const result = await minifyFile(file)
    targetBefore += result.before
    targetAfter += result.after
    if (result.changed) targetChanged += 1
  }

  changed += targetChanged
  beforeBytes += targetBefore
  afterBytes += targetAfter

  if (targetChanged > 0) {
    const savedKb = Math.round((targetBefore - targetAfter) / 1024)
    console.log(`Minified ${targetChanged} web assets in ${toPosix(path.relative(repoRoot, target))} (-${savedKb} KiB).`)
  }
}

if (changed > 0) {
  const savedKb = Math.round((beforeBytes - afterBytes) / 1024)
  console.log(`Web asset minification complete: ${changed} files, ${savedKb} KiB saved.`)
}

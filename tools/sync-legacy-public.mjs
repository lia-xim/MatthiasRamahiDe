import { constants } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicRoot = path.join(repoRoot, 'apps', 'web', 'public')
const assetSource = path.join(repoRoot, 'assets')
const assetTarget = path.join(publicRoot, 'assets')
const mediaExtensions = new Set([
  '.avif',
  '.gif',
  '.ico',
  '.jpeg',
  '.jpg',
  '.mp4',
  '.png',
  '.svg',
  '.webm',
  '.webp',
])

let copied = 0
let skipped = 0
let bytes = 0

async function exists(filePath) {
  try {
    await fs.access(filePath, constants.F_OK)
    return true
  } catch {
    return false
  }
}

async function shouldCopy(source, target) {
  const sourceStat = await fs.stat(source)
  try {
    const targetStat = await fs.stat(target)
    return sourceStat.size !== targetStat.size || sourceStat.mtimeMs > targetStat.mtimeMs + 1000
  } catch {
    return true
  }
}

async function copyFile(source, target) {
  if (!(await shouldCopy(source, target))) {
    skipped += 1
    return
  }

  await fs.mkdir(path.dirname(target), { recursive: true })
  await fs.copyFile(source, target)
  const sourceStat = await fs.stat(source)
  await fs.utimes(target, sourceStat.atime, sourceStat.mtime)
  copied += 1
  bytes += sourceStat.size
}

async function copyDirectory(sourceDir, targetDir) {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true })
  await fs.mkdir(targetDir, { recursive: true })

  for (const entry of entries) {
    const source = path.join(sourceDir, entry.name)
    const target = path.join(targetDir, entry.name)
    if (entry.isDirectory()) {
      await copyDirectory(source, target)
    } else if (entry.isFile()) {
      await copyFile(source, target)
    }
  }
}

async function syncRootMedia() {
  const entries = await fs.readdir(repoRoot, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isFile()) continue
    const ext = path.extname(entry.name).toLowerCase()
    if (!mediaExtensions.has(ext)) continue
    await copyFile(path.join(repoRoot, entry.name), path.join(publicRoot, entry.name))
  }
}

if (!(await exists(assetSource))) {
  throw new Error(`Legacy assets folder not found: ${assetSource}`)
}

await fs.mkdir(publicRoot, { recursive: true })
await copyDirectory(assetSource, assetTarget)
await syncRootMedia()

const copiedMb = (bytes / 1024 / 1024).toFixed(2)
console.log(`Legacy public sync complete: ${copied} copied (${copiedMb} MB), ${skipped} unchanged.`)

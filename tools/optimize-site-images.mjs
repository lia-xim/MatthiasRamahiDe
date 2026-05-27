import sharp from 'sharp'
import { chmod, copyFile, mkdir, readdir, rename, stat, unlink } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const jobs = [
  { dir: 'assets/photos', width: 1920, quality: 76 },
  { dir: 'assets/services', width: 1400, quality: 74 },
]

const imageExts = new Set(['.jpg', '.jpeg', '.png', '.webp'])

async function listImages(dir) {
  const absolute = path.join(repoRoot, dir)
  const entries = await readdir(absolute, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && imageExts.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => path.join(absolute, entry.name))
}

async function sizeOf(file) {
  return (await stat(file)).size
}

async function replaceFile(source, target) {
  await chmod(target, 0o666).catch(() => {})
  try {
    await rename(source, target)
  } catch {
    await copyFile(source, target)
    await unlink(source)
  }
}

async function optimizeToWebp(file, { width, quality }) {
  const ext = path.extname(file).toLowerCase()
  const parsed = path.parse(file)
  if (ext === '.webp') return null

  const outFile = path.join(parsed.dir, `${parsed.name}.webp`)
  const tempFile = path.join(parsed.dir, `.${parsed.name}.tmp.webp`)
  const before = await sizeOf(file)

  await sharp(file)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 5, smartSubsample: true })
    .toFile(tempFile)

  const after = await sizeOf(tempFile)

  await replaceFile(tempFile, outFile)
  return { file, outFile, before, after, changed: true }
}

let totalBefore = 0
let totalAfter = 0
let changed = 0

for (const job of jobs) {
  await mkdir(path.join(repoRoot, job.dir), { recursive: true })
  const files = await listImages(job.dir)

  for (const file of files) {
    try {
      const result = await optimizeToWebp(file, job)
      if (!result) continue

      totalBefore += result.before
      totalAfter += result.after
      if (result.changed) changed += 1

      const relIn = path.relative(repoRoot, result.file)
      const relOut = path.relative(repoRoot, result.outFile)
      const beforeMb = (result.before / 1024 / 1024).toFixed(2)
      const afterMb = (result.after / 1024 / 1024).toFixed(2)
      console.log(`${relIn} -> ${relOut}: ${beforeMb} MB -> ${afterMb} MB`)
    } catch (error) {
      console.error(`Failed ${path.relative(repoRoot, file)}: ${error.message}`)
    }
  }
}

console.log(
  `\nOptimized ${changed} files. Comparable total: ${(totalBefore / 1024 / 1024).toFixed(2)} MB -> ${(totalAfter / 1024 / 1024).toFixed(2)} MB`,
)

#!/usr/bin/env node

import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'

const repoRoot = process.cwd()

function argValue(name) {
  const prefix = `--${name}=`
  const match = process.argv.find((arg) => arg.startsWith(prefix))
  return match ? match.slice(prefix.length) : ''
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`)
}

async function exists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function latestMigrationOutputDir() {
  const outputsDir = path.join(repoRoot, 'outputs')
  if (!(await exists(outputsDir))) return ''

  const entries = await fs.readdir(outputsDir, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('payload-tina-migration-'))
    .map((entry) => path.join(outputsDir, entry.name))
    .sort()
    .at(-1)
}

function resolveInsideWorkspace(inputPath, fallback) {
  return path.resolve(repoRoot, inputPath || fallback)
}

function assertTargetIsUploads(targetDir) {
  const uploadsRoot = path.resolve(repoRoot, 'apps', 'web', 'public', 'uploads')
  const resolved = path.resolve(targetDir)
  if (resolved === uploadsRoot || resolved.startsWith(`${uploadsRoot}${path.sep}`)) return
  throw new Error(`Refusing to write outside apps/web/public/uploads: ${resolved}`)
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

async function fileInfo(filePath) {
  try {
    const stats = await fs.stat(filePath)
    if (!stats.isFile()) return null
    return stats
  } catch {
    return null
  }
}

async function sha256(filePath) {
  const hash = createHash('sha256')
  const file = await fs.open(filePath, 'r')
  try {
    for await (const chunk of file.createReadStream()) {
      hash.update(chunk)
    }
  } finally {
    await file.close()
  }
  return hash.digest('hex')
}

async function auditFiles(manifest, targetDir, verifyHash) {
  const missing = []
  const sizeMismatch = []
  const hashMismatch = []

  for (const item of manifest) {
    const relativePath = String(item.path || '').replaceAll('\\', '/')
    if (!relativePath || relativePath.startsWith('/') || relativePath.includes('../')) {
      throw new Error(`Unsafe media manifest path: ${relativePath}`)
    }

    const targetFile = path.join(targetDir, ...relativePath.split('/'))
    const stats = await fileInfo(targetFile)
    if (!stats) {
      missing.push(relativePath)
      continue
    }

    if (typeof item.bytes === 'number' && stats.size !== item.bytes) {
      sizeMismatch.push(relativePath)
      continue
    }

    if (verifyHash && item.sha256) {
      const actualHash = await sha256(targetFile)
      if (actualHash !== item.sha256) hashMismatch.push(relativePath)
    }
  }

  return { missing, sizeMismatch, hashMismatch }
}

function runTarExtract(tarPath, targetDir) {
  return new Promise((resolve, reject) => {
    const args = ['-xzf', tarPath, '-C', targetDir, '--strip-components=1']
    const child = spawn('tar', args, {
      cwd: repoRoot,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
    })

    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString()
    })
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString()
    })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr })
        return
      }
      reject(new Error(`tar exited with ${code}: ${stderr || stdout}`))
    })
  })
}

const migrationDir = await latestMigrationOutputDir()
const resolvedMigrationDir = resolveInsideWorkspace(argValue('migration-dir'), migrationDir || '')
const manifestPath = resolveInsideWorkspace(
  argValue('manifest'),
  path.join(resolvedMigrationDir, 'payload-export', 'media-files.manifest.json'),
)
const tarPath = resolveInsideWorkspace(argValue('tar'), path.join(resolvedMigrationDir, 'media.tar.gz'))
const targetDir = resolveInsideWorkspace(argValue('target'), path.join('apps', 'web', 'public', 'uploads', 'payload'))
const force = hasFlag('force')
const verifyHash = hasFlag('verify-hash')

assertTargetIsUploads(targetDir)

if (!(await exists(manifestPath))) {
  throw new Error(`Media manifest not found: ${manifestPath}`)
}

if (!(await exists(tarPath))) {
  throw new Error(`Media archive not found: ${tarPath}`)
}

const manifest = await readJson(manifestPath)
if (!Array.isArray(manifest)) {
  throw new Error(`Media manifest must be an array: ${manifestPath}`)
}

await fs.mkdir(targetDir, { recursive: true })
await fs.writeFile(path.join(path.dirname(targetDir), '.gitkeep'), '\n')

const before = force ? { missing: ['--force'], sizeMismatch: [], hashMismatch: [] } : await auditFiles(manifest, targetDir, false)
const needsExtract = force || before.missing.length > 0 || before.sizeMismatch.length > 0

if (needsExtract) {
  await runTarExtract(tarPath, targetDir)
}

const after = await auditFiles(manifest, targetDir, verifyHash)
const ok = after.missing.length === 0 && after.sizeMismatch.length === 0 && after.hashMismatch.length === 0

console.log('Tina media sync complete')
console.log(`Source archive: ${path.relative(repoRoot, tarPath).replaceAll(path.sep, '/')}`)
console.log(`Target: ${path.relative(repoRoot, targetDir).replaceAll(path.sep, '/')}`)
console.log(`Manifest files: ${manifest.length}`)
console.log(`Extracted: ${needsExtract ? 'yes' : 'no, already present'}`)
console.log(`Verify hash: ${verifyHash ? 'yes' : 'no'}`)

if (!ok) {
  const sample = [...after.missing, ...after.sizeMismatch, ...after.hashMismatch].slice(0, 20)
  console.error(`Media sync verification failed. Sample: ${sample.join(', ')}`)
  console.error(`Missing: ${after.missing.length}`)
  console.error(`Size mismatch: ${after.sizeMismatch.length}`)
  console.error(`Hash mismatch: ${after.hashMismatch.length}`)
  process.exit(1)
}

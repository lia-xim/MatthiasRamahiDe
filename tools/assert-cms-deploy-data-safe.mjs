import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migrationDir = path.join(root, 'apps/cms/src/migrations')
const deployFiles = [
  'deploy/deploy-cms-hetzner.sh',
  '.github/workflows/deploy-cms-hetzner.yml',
]

const blockedDeployPatterns = [
  { pattern: /\b(seed|import):[a-z0-9:-]*/i, label: 'seed/import script in deploy path' },
  { pattern: /\bcms:(seed|import)[a-z0-9:-]*/i, label: 'root seed/import script in deploy path' },
  { pattern: /\bensure:admin\b/i, label: 'admin user write in deploy path' },
  { pattern: /\bcms:ensure-admin\b/i, label: 'root admin user write in deploy path' },
  { pattern: /\bschema:push:local\b/i, label: 'local schema push in deploy path' },
  { pattern: /\bcms:schema-push-local\b/i, label: 'root local schema push in deploy path' },
  { pattern: /\bPAYLOAD_DB_PUSH\s*=\s*true\b/i, label: 'PAYLOAD_DB_PUSH=true in deploy path' },
]

const blockedMigrationPatterns = [
  { pattern: /\bINSERT\s+INTO\b/i, label: 'INSERT INTO in migration up()' },
  { pattern: /\bUPDATE\s+(?:"[^"]+"|[a-z0-9_."-]+)\s+SET\b/i, label: 'UPDATE ... SET in migration up()' },
  { pattern: /\bDELETE\s+FROM\b/i, label: 'DELETE FROM in migration up()' },
  { pattern: /\bTRUNCATE\b/i, label: 'TRUNCATE in migration up()' },
  { pattern: /\bDROP\s+(TABLE|SCHEMA|DATABASE)\b/i, label: 'DROP table/schema/database in migration up()' },
  { pattern: /\bgetPayload\s*\(/i, label: 'Payload client usage in migration up()' },
  { pattern: /\bpayload\.(create|update|delete|updateGlobal|deleteGlobal)\s*\(/i, label: 'Payload content write in migration up()' },
]

const failures = []

function readFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
}

function lineFor(source, index) {
  return source.slice(0, index).split(/\r?\n/).length
}

function extractUpFunction(source) {
  const upIndex = source.search(/export\s+async\s+function\s+up\b/)
  if (upIndex === -1) return ''

  const downIndex = source.search(/export\s+async\s+function\s+down\b/)
  return source.slice(upIndex, downIndex === -1 ? undefined : downIndex)
}

for (const relativePath of deployFiles) {
  if (!fs.existsSync(path.join(root, relativePath))) continue

  const source = readFile(relativePath)
  for (const { pattern, label } of blockedDeployPatterns) {
    const match = pattern.exec(source)
    if (match) {
      failures.push(`${relativePath}:${lineFor(source, match.index)} ${label}`)
    }
  }
}

for (const entry of fs.readdirSync(migrationDir, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.ts') || entry.name === 'index.ts') continue

  const relativePath = path.relative(root, path.join(migrationDir, entry.name)).replaceAll(path.sep, '/')
  const source = readFile(relativePath)
  const upSource = extractUpFunction(source)

  for (const { pattern, label } of blockedMigrationPatterns) {
    const match = pattern.exec(upSource)
    if (match) {
      failures.push(`${relativePath}:${lineFor(source, source.indexOf(upSource) + match.index)} ${label}`)
    }
  }
}

if (failures.length > 0) {
  console.error('CMS deploy data-safety check failed.')
  console.error('Production deploys may run schema migrations only; seeds/imports/content writes must stay manual.')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('CMS deploy data-safety check passed: deploy path contains no seeds/imports/content-writing migrations.')

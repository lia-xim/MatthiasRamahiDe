import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const webRoot = path.join(repoRoot, 'apps', 'web')
const args = process.argv.slice(2)

const option = (name, fallback = '') => {
  const prefix = `--${name}=`
  return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length) || fallback
}

const flag = (name) => args.includes(`--${name}`)
const baseUrl = option('base-url')
const skipBuild = flag('skip-build')

function parseJson(stdout) {
  const start = stdout.indexOf('{')
  const end = stdout.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  return JSON.parse(stdout.slice(start, end + 1))
}

function runStep(name, command, commandArgs, options = {}) {
  console.log(`\n==> ${name}`)
  const result = spawnSync(command, commandArgs, {
    cwd: options.cwd || repoRoot,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  })

  if (result.stdout) process.stdout.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)

  if (result.status !== 0) {
    throw new Error(`${name} failed with exit code ${result.status}.`)
  }

  return result.stdout || ''
}

function assertSeoRepairClean(stdout) {
  const report = parseJson(stdout)
  if (!report) throw new Error('SEO repair dry-run did not return JSON.')
  if (report.changedDocuments > 0) {
    throw new Error(
      `SEO metadata is not clean: ${report.changedDocuments} document(s) would change. Run "corepack pnpm --filter @matthias-ramahi/web repair:seo-metadata" first.`,
    )
  }
}

function assertTinaContentClean(stdout) {
  const report = parseJson(stdout)
  if (!report) throw new Error('Tina content audit did not return JSON.')
  if (report.failures > 0 || report.warnings > 0) {
    throw new Error(`Tina content audit reported ${report.failures} failure(s) and ${report.warnings} warning(s).`)
  }
}

function assertTinaSeoClean(stdout) {
  const report = parseJson(stdout)
  if (!report) throw new Error('Tina SEO audit did not return JSON.')
  if (report.issueCount > 0) throw new Error(`Tina SEO audit reported ${report.issueCount} issue(s).`)
}

try {
  const seoRepair = runStep('SEO metadata dry-run', 'node', ['scripts/repair-seo-metadata.mjs', '--refresh-derived'], { cwd: webRoot })
  assertSeoRepairClean(seoRepair)

  const contentAudit = runStep('Tina content audit', 'node', ['scripts/tina-content-audit.mjs'], { cwd: webRoot })
  assertTinaContentClean(contentAudit)

  const seoAuditArgs = ['scripts/tina-seo-audit.mjs']
  if (baseUrl) seoAuditArgs.push(`--base-url=${baseUrl}`)
  const seoAudit = runStep(baseUrl ? 'Tina SEO audit (content + live)' : 'Tina SEO audit (content)', 'node', seoAuditArgs, { cwd: webRoot })
  assertTinaSeoClean(seoAudit)

  if (!skipBuild) {
    runStep('Astro/Tina web build', 'corepack', ['pnpm', '--filter', '@matthias-ramahi/web', 'build'])
  }

  console.log('\nTina preflight passed.')
} catch (error) {
  console.error(`\nTina preflight failed: ${error.message}`)
  process.exit(1)
}

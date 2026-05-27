param(
  [switch]$SkipStop
)

$ErrorActionPreference = 'Stop'

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$cmsEnv = Join-Path $root 'apps/cms/.env'
$webEnv = Join-Path $root 'apps/web/.env'
$cmsOut = Join-Path $env:TEMP 'mr-cms-dev.out.log'
$cmsErr = Join-Path $env:TEMP 'mr-cms-dev.err.log'
$webOut = Join-Path $env:TEMP 'mr-web-dev.out.log'
$webErr = Join-Path $env:TEMP 'mr-web-dev.err.log'

function New-LocalSecret {
  return ((1..4 | ForEach-Object { [guid]::NewGuid().ToString('N') }) -join '')
}

function Write-Utf8NoBom {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Value
  )

  $encoding = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Value, $encoding)
}

function Get-EnvValue {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Name
  )

  if (-not (Test-Path -LiteralPath $Path)) {
    return $null
  }

  $line = Get-Content -LiteralPath $Path | Where-Object { $_ -match "^$Name=" } | Select-Object -First 1
  if (-not $line) {
    return $null
  }

  return $line.Substring($Name.Length + 1)
}

function Write-Line {
  param([string]$Value = '')
  [Console]::WriteLine($Value)
}

$previewSecret = Get-EnvValue -Path $cmsEnv -Name 'PREVIEW_SECRET'
if (-not $previewSecret -or $previewSecret -eq 'change-me-preview-secret') {
  $previewSecret = New-LocalSecret
}

if (-not (Test-Path -LiteralPath $cmsEnv)) {
  $cmsEnvValue = @"
PAYLOAD_SECRET=$(New-LocalSecret)
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
PAYLOAD_DB=sqlite
DATABASE_URL=file:./payload-dev.db
PAYLOAD_DB_PUSH=false
ASTRO_PREVIEW_URL=http://localhost:4321
ASTRO_PUBLIC_SITE_URL=http://localhost:4321
PREVIEW_SECRET=$previewSecret
ASTRO_REBUILD_WEBHOOK_URL=
ASTRO_REBUILD_WEBHOOK_SECRET=
S3_BUCKET=
S3_ENDPOINT=
S3_REGION=auto
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
"@
  Write-Utf8NoBom -Path $cmsEnv -Value $cmsEnvValue
  Write-Line "Created apps/cms/.env for local SQLite testing."
}

if (-not (Test-Path -LiteralPath $webEnv)) {
  $webEnvValue = @"
ASTRO_PUBLIC_SITE_URL=http://localhost:4321
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
PREVIEW_SECRET=$previewSecret
PAYLOAD_PREVIEW_API_KEY=
"@
  Write-Utf8NoBom -Path $webEnv -Value $webEnvValue
  Write-Line "Created apps/web/.env for local testing."
}

$payloadDb = Get-EnvValue -Path $cmsEnv -Name 'PAYLOAD_DB'
if ($payloadDb -ne 'sqlite') {
  Write-Warning 'apps/cms/.env is not set to PAYLOAD_DB=sqlite. Start Postgres or switch to SQLite for no-Docker local testing.'
}

if ($SkipStop) {
  $existingPorts = Get-NetTCPConnection -LocalPort 3000, 4321 -State Listen -ErrorAction SilentlyContinue
  if ($existingPorts) {
    Write-Error 'Ports 3000 or 4321 are already in use. Run corepack pnpm local:stop first or omit -SkipStop.'
    exit 1
  }
} else {
  & (Join-Path $PSScriptRoot 'stop-local.ps1') | Out-Null
}

Remove-Item -LiteralPath $cmsOut, $cmsErr, $webOut, $webErr -ErrorAction SilentlyContinue

$cmsNextDir = Join-Path $root 'apps/cms/.next'
if (Test-Path -LiteralPath $cmsNextDir) {
  Remove-Item -LiteralPath $cmsNextDir -Recurse -Force -ErrorAction SilentlyContinue
}

$cmsSqliteDb = Join-Path $root 'apps/cms/payload-dev.db'
$cmsSchemaPush = if ($payloadDb -eq 'sqlite' -and -not (Test-Path -LiteralPath $cmsSqliteDb)) { 'true' } else { 'false' }

Write-Line 'Starting local Payload CMS and Astro servers...'

$cms = Start-Process -FilePath 'powershell' -ArgumentList @(
  '-NoProfile',
  '-ExecutionPolicy',
  'Bypass',
  '-Command',
  "`$env:PAYLOAD_DB_PUSH='$cmsSchemaPush'; corepack pnpm cms:dev"
) -WorkingDirectory $root -RedirectStandardOutput $cmsOut -RedirectStandardError $cmsErr -WindowStyle Hidden -PassThru

Start-Sleep -Seconds 10

$web = Start-Process -FilePath 'powershell' -ArgumentList @(
  '-NoProfile',
  '-ExecutionPolicy',
  'Bypass',
  '-Command',
  'corepack pnpm web:dev'
) -WorkingDirectory $root -RedirectStandardOutput $webOut -RedirectStandardError $webErr -WindowStyle Hidden -PassThru

Start-Sleep -Seconds 6

Write-Line ''
Write-Line 'Local stack started.'
Write-Line "Payload Admin: http://localhost:3000/admin"
Write-Line "Astro Frontend: http://localhost:4321/"
Write-Line "CMS PID: $($cms.Id)"
Write-Line "Web PID: $($web.Id)"
Write-Line "CMS log: $cmsOut"
Write-Line "CMS errors: $cmsErr"
Write-Line "Web log: $webOut"
Write-Line "Web errors: $webErr"

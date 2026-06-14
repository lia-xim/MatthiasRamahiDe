param(
  [switch]$SkipStop
)

$ErrorActionPreference = 'Stop'

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$webEnv = Join-Path $root 'apps/web/.env'
$webOut = Join-Path $env:TEMP 'mr-tina-dev.out.log'
$webErr = Join-Path $env:TEMP 'mr-tina-dev.err.log'

function Write-Utf8NoBom {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Value
  )

  $encoding = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Value, $encoding)
}

function Write-Line {
  param([string]$Value = '')
  [Console]::WriteLine($Value)
}

if (-not (Test-Path -LiteralPath $webEnv)) {
  $webEnvValue = @"
ASTRO_PUBLIC_SITE_URL=http://localhost:4321
ASTRO_CONTENT_SOURCE=tina
ASTRO_PUBLIC_MEDIA_BASE_URL=https://cms.matthiasramahi.de
"@
  Write-Utf8NoBom -Path $webEnv -Value $webEnvValue
  Write-Line "Created apps/web/.env for local Tina testing."
}

if ($SkipStop) {
  $existingPorts = Get-NetTCPConnection -LocalPort 4001, 4321 -State Listen -ErrorAction SilentlyContinue
  if ($existingPorts) {
    Write-Error 'Ports 4001 or 4321 are already in use. Run corepack pnpm local:stop first or omit -SkipStop.'
    exit 1
  }
} else {
  & (Join-Path $PSScriptRoot 'stop-local.ps1') | Out-Null
}

Remove-Item -LiteralPath $webOut, $webErr -ErrorAction SilentlyContinue

Write-Line 'Starting local Tina CMS and Astro server...'

$web = Start-Process -FilePath 'powershell' -ArgumentList @(
  '-NoProfile',
  '-ExecutionPolicy',
  'Bypass',
  '-Command',
  "`$env:ASTRO_CONTENT_SOURCE='tina'; `$env:ASTRO_PUBLIC_MEDIA_BASE_URL='https://cms.matthiasramahi.de'; corepack pnpm --filter @matthias-ramahi/web sync:assets; corepack pnpm web:tina:dev"
) -WorkingDirectory $root -RedirectStandardOutput $webOut -RedirectStandardError $webErr -WindowStyle Hidden -PassThru

Start-Sleep -Seconds 8

Write-Line ''
Write-Line 'Local Tina stack started.'
Write-Line 'Tina Admin: http://localhost:4321/admin/'
Write-Line 'Astro Frontend: http://localhost:4321/'
Write-Line "Tina PID: $($web.Id)"
Write-Line "Tina log: $webOut"
Write-Line "Tina errors: $webErr"

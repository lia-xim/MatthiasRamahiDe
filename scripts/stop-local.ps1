param(
  [int[]]$Ports = @(3000, 4321)
)

$ErrorActionPreference = 'SilentlyContinue'

$connections = Get-NetTCPConnection -LocalPort $Ports -State Listen -ErrorAction SilentlyContinue
$portProcessIds = @($connections | Select-Object -ExpandProperty OwningProcess -Unique)
$devProcessIds = @(
  Get-CimInstance Win32_Process -Filter "name='powershell.exe'" |
    Where-Object { $_.CommandLine -match 'corepack pnpm (cms|web):dev' } |
    Select-Object -ExpandProperty ProcessId
)
$processIds = @($portProcessIds + $devProcessIds | Where-Object { $_ } | Select-Object -Unique)

foreach ($processId in $processIds) {
  if ($processId) {
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
  }
}

if ($processIds.Count -gt 0) {
  Write-Output "Stopped local processes on ports $($Ports -join ', ')."
} else {
  Write-Output "No local processes found on ports $($Ports -join ', ')."
}

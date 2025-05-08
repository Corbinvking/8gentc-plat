#!/usr/bin/env pwsh
# kill-ports.ps1 - Script to kill processes using ports 3000 and above

param (
    [int]$startPort = 3000,
    [int]$endPort = 9999
)

Write-Host "Looking for processes using ports $startPort to $endPort..."

# Create a regex pattern for the port range
$portPattern = ($startPort..$endPort -join "|")
$regexPattern = "TCP.*:($portPattern)\s.*LISTENING"

# Find all TCP connections on specified port range
$connections = netstat -ano | Select-String -Pattern $regexPattern | ForEach-Object { $_ -replace '^\s+', '' } | ForEach-Object { $_.Trim() }

# Check if any connections were found
if (-not $connections) {
    Write-Host "No processes found running on ports $startPort to $endPort."
    exit 0
}

Write-Host "Found the following connections:"
$connections | ForEach-Object { Write-Host $_ }

# Extract PIDs from connections
$pids = $connections | ForEach-Object {
    $parts = $_ -split '\s+'
    $parts[-1]
} | Sort-Object -Unique

Write-Host "`nFound these PIDs to terminate: $($pids -join ', ')"

# Kill each process
foreach ($pid in $pids) {
    try {
        $processInfo = Get-Process -Id $pid
        Write-Host "Killing process: $($processInfo.ProcessName) (PID: $pid)"
        Stop-Process -Id $pid -Force
        Write-Host "Successfully terminated process with PID: $pid" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to kill process with PID: $pid - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nVerifying ports are now free..."
$remainingConnections = netstat -ano | Select-String -Pattern $regexPattern | ForEach-Object { $_ -replace '^\s+', '' } | ForEach-Object { $_.Trim() }

if ($remainingConnections) {
    Write-Host "Warning: Some processes may still be using the ports:" -ForegroundColor Yellow
    $remainingConnections | ForEach-Object { Write-Host $_ }
} else {
    Write-Host "All ports $startPort to $endPort are now free." -ForegroundColor Green
} 
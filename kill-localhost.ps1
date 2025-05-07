Write-Host "Killing processes on common development ports..." -ForegroundColor Cyan

# Function to kill process on a specific port
function Kill-ProcessOnPort {
    param (
        [int]$Port
    )
    
    $processInfo = netstat -ano | Select-String ":$Port\s+.*LISTENING\s+(\d+)" | ForEach-Object { $_.Matches.Groups[1].Value }
    
    if ($processInfo) {
        Write-Host "Found process using port $Port with PID: $processInfo" -ForegroundColor Yellow
        
        try {
            Stop-Process -Id $processInfo -Force
            Write-Host "Successfully killed process with PID: $processInfo" -ForegroundColor Green
        } catch {
            Write-Host "Failed to kill process with PID: $processInfo" -ForegroundColor Red
            Write-Host $_.Exception.Message
        }
    } else {
        Write-Host "No process found using port $Port" -ForegroundColor Gray
    }
}

# Kill processes on common development ports
$developmentPorts = @(3000, 3001, 3002, 3003, 3004, 3005, 5173, 8000, 8080)

foreach ($port in $developmentPorts) {
    Kill-ProcessOnPort -Port $port
}

# Uncomment to kill all node processes
# Write-Host "Killing all Node.js processes..." -ForegroundColor Yellow
# Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "Finished killing processes." -ForegroundColor Cyan
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 
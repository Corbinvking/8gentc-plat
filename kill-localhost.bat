@echo off
echo Killing processes on common development ports...

REM Find and kill processes on ports 3000-3999
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :30') do (
    echo Killing process with PID: %%a
    taskkill /F /PID %%a 2>nul
)

REM Find and kill processes on other common development ports
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    echo Killing process with PID: %%a
    taskkill /F /PID %%a 2>nul
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
    echo Killing process with PID: %%a
    taskkill /F /PID %%a 2>nul
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do (
    echo Killing process with PID: %%a
    taskkill /F /PID %%a 2>nul
)

REM Kill all node processes (uncomment if needed)
REM taskkill /F /IM node.exe

echo Finished killing processes.
pause 
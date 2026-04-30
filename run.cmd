@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

set PORT=8000
if not "%~1"=="" set PORT=%~1

set "PYTHON_CMD="

where py >nul 2>&1
if not errorlevel 1 set "PYTHON_CMD=py"

if not defined PYTHON_CMD (
  where python >nul 2>&1
  if not errorlevel 1 set "PYTHON_CMD=python"
)

if not defined PYTHON_CMD (
  set "BUNDLED_PY=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
  if exist "%BUNDLED_PY%" set "PYTHON_CMD=%BUNDLED_PY%"
)

if not defined PYTHON_CMD (
  echo Python not found.
  echo.
  echo Option 1: Install Python 3.10+ from python.org ^(adds ^"py^" launcher^).
  echo Option 2: Install Codex desktop runtimes and retry ^(uses bundled python^).
  echo.
  echo Press any key to close this window...
  pause >nul
  exit /b 1
)

echo.
echo CalAppt (local server)
echo ----------------------------------------
echo Serving folder:
echo   %cd%
echo.
echo On this computer:
echo   http://127.0.0.1:%PORT%/
echo.
echo On your iPhone (same Wi-Fi), try one of these:
for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr /i "IPv4"') do (
  set IP=%%A
  set IP=!IP: =!
  if not "!IP!"=="" echo   http://!IP!:%PORT%/
)
echo.
echo If Windows Firewall prompts, allow "Private networks".
echo Press Ctrl+C to stop.
echo.

start "" "http://127.0.0.1:%PORT%/"

if /i "%PYTHON_CMD%"=="py" (
  py -m http.server %PORT% --bind 0.0.0.0
) else if /i "%PYTHON_CMD%"=="python" (
  python -m http.server %PORT% --bind 0.0.0.0
) else (
  "%PYTHON_CMD%" -m http.server %PORT% --bind 0.0.0.0
)

if errorlevel 1 (
  echo.
  echo Server exited with an error.
  echo Tip: Try a different port ^(example: run.cmd 8001^) or check firewall prompts.
  echo.
  echo Press any key to close this window...
  pause >nul
  exit /b 1
)

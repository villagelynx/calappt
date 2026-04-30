@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

set "LOG_FILE=%cd%\run-debug.log"

set "PORT_ARG=%~1"
set "RUN_ARGS="
if not "%PORT_ARG%"=="" set "RUN_ARGS=%PORT_ARG%"

echo.
echo Starting server (logging to "%LOG_FILE%")...
echo Tip: Stop the server with Ctrl+C.
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$log = '%LOG_FILE%';" ^
  "'' | Out-File -FilePath $log -Encoding utf8;" ^
  "'==================================================' | Out-File -FilePath $log -Encoding utf8 -Append;" ^
  "'CalAppt debug run' | Out-File -FilePath $log -Encoding utf8 -Append;" ^
  "('Started: ' + (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')) | Out-File -FilePath $log -Encoding utf8 -Append;" ^
  "('Folder:  ' + (Get-Location).Path) | Out-File -FilePath $log -Encoding utf8 -Append;" ^
  "('Args:    ' + '%RUN_ARGS%') | Out-File -FilePath $log -Encoding utf8 -Append;" ^
  "'==================================================' | Out-File -FilePath $log -Encoding utf8 -Append;" ^
  "& '%~dp0run.cmd' %RUN_ARGS% 2>&1 | ForEach-Object { $_; $_ | Out-File -FilePath $log -Encoding utf8 -Append };" ^
  "$ec = $LASTEXITCODE; exit $ec"

set "EXITCODE=%errorlevel%"

echo.
echo Finished (exit code %EXITCODE%).
echo Log saved to:
echo   "%LOG_FILE%"
echo.
echo Press any key to close this window...
pause >nul
exit /b %EXITCODE%

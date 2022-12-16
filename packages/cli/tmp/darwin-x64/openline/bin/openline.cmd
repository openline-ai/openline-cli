@echo off
setlocal enableextensions

if not "%OPENLINE_REDIRECTED%"=="1" if exist "%LOCALAPPDATA%\openline\client\bin\openline.cmd" (
  set OPENLINE_REDIRECTED=1
  "%LOCALAPPDATA%\openline\client\bin\openline.cmd" %*
  goto:EOF
)

if not defined OPENLINE_BINPATH set OPENLINE_BINPATH="%~dp0openline.cmd"
if exist "%~dp0..\bin\node.exe" (
  "%~dp0..\bin\node.exe" "%~dp0..\bin\run" %*
) else if exist "%LOCALAPPDATA%\oclif\node\node-18.12.1.exe" (
  "%LOCALAPPDATA%\oclif\node\node-18.12.1.exe" "%~dp0..\bin\run" %*
) else (
  node "%~dp0..\bin\run" %*
)

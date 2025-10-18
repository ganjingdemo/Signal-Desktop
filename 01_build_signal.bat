set CURRENT_DIR=%~dp0
cd /d %CURRENT_DIR%

call npm install -g pnpm
REM pause

call pnpm install
REM pause

call pnpm run generate
REM pause

call pnpm build
pause
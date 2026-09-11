@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Instalando dependencias do FisioAtlas...
  call npm ci
  if errorlevel 1 goto :erro
)
if not exist dist\index.html (
  call npm run build
  if errorlevel 1 goto :erro
)
echo.
echo FisioAtlas 3D: http://127.0.0.1:4173
echo Mantenha esta janela aberta enquanto estiver estudando.
echo Para encerrar, pressione Ctrl+C.
echo.
call npm start
goto :fim
:erro
echo Nao foi possivel iniciar. Verifique as mensagens acima.
:fim
pause

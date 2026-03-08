@echo off
chcp 65001 >nul
title Controle de Peso - Servidor
cd /d "%~dp0"

echo.
echo  Controle de Peso - Iniciando em modo producao...
echo.

if not exist "node_modules" (
  echo  Instalando dependencias...
  call npm install
  if errorlevel 1 (
    echo  Erro ao instalar dependencias.
    pause
    exit /b 1
  )
)

echo  Compilando aplicacao...
call npm run build
if errorlevel 1 (
  echo  Erro na compilacao.
  pause
  exit /b 1
)

echo.
echo  Iniciando servidor. O navegador sera aberto quando estiver pronto.
echo  Para encerrar, feche esta janela ou pressione Ctrl+C.
echo.

node scripts/launcher.js

pause

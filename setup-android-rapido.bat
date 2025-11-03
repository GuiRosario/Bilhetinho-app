@echo off
echo Configurando ambiente Android rapidamente...

:: Definir variáveis de ambiente
setx ANDROID_HOME "%USERPROFILE%\AppData\Local\Android\Sdk"

:: Criar arquivo local.properties
echo sdk.dir=%USERPROFILE%\AppData\Local\Android\Sdk > android\local.properties

:: Adicionar platform-tools ao PATH temporário
set PATH=%PATH%;%USERPROFILE%\AppData\Local\Android\Sdk\platform-tools
set PATH=%PATH%;%USERPROFILE%\AppData\Local\Android\Sdk\emulator

echo Ambiente configurado! Executando o aplicativo...
echo.

:: Iniciar o emulador em segundo plano
start "" "%USERPROFILE%\AppData\Local\Android\Sdk\emulator\emulator.exe" -avd Medium_Phone_API_36.0

:: Aguardar o emulador iniciar
echo Aguardando o emulador iniciar...
timeout /t 10

:: Executar o aplicativo
echo Executando o aplicativo...
npx react-native run-android
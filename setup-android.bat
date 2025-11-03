@echo off
echo Configurando ambiente Android para o projeto Bilhetinho...

:: Definir variáveis de ambiente
setx ANDROID_HOME "%USERPROFILE%\AppData\Local\Android\Sdk"
setx PATH "%PATH%;%USERPROFILE%\AppData\Local\Android\Sdk\platform-tools"

echo Variáveis de ambiente configuradas!
echo ANDROID_HOME = %USERPROFILE%\AppData\Local\Android\Sdk

echo.
echo Para completar a configuração:
echo 1. Instale o Android Studio: https://developer.android.com/studio
echo 2. Durante a instalação, selecione "Custom" e marque:
echo    - Android SDK
echo    - Android SDK Platform
echo    - Android Virtual Device
echo 3. Após a instalação, abra o Android Studio e vá para:
echo    Tools -^> SDK Manager -^> SDK Platforms
echo    Instale Android 13 (Tiramisu)
echo 4. Em SDK Tools, instale:
echo    - Android SDK Build-Tools
echo    - Android Emulator
echo    - Android SDK Platform-Tools
echo 5. Crie um emulador em:
echo    Tools -^> Device Manager -^> Create Device
echo.
echo Depois de configurar, reinicie o terminal e execute:
echo npx react-native run-android
# Guia para Testar o Firebase no Bilhetinho App

## Configuração Concluída ✅
- Firebase SDK instalado (versão 12.5.0)
- Firebase Admin SDK instalado
- Arquivos de configuração preparados
- Emuladores do Firebase configurados

## Como Testar o Firebase

### Opção 1: Executar o App React Native
```bash
# Inicie o emulador Android ou conecte um dispositivo
npx react-native run-android

# OU para iOS
npx react-native run-ios
```

O app executará automaticamente os testes do Firebase definidos em `src/services/firebaseTest.ts`.

### Opção 2: Usar o Firebase Emulator (Recomendado para Desenvolvimento) ✅
```bash
# Iniciar os emuladores
firebase emulators:start
```

**Emuladores configurados:**
- Authentication: http://127.0.0.1:9099
- Firestore: http://127.0.0.1:8080
- Database: http://127.0.0.1:9000
- Storage: http://127.0.0.1:9199

**Interface do Emulador:** http://127.0.0.1:4000

## Configuração para Usar os Emuladores no App

Para conectar seu app aos emuladores, adicione este código no arquivo `src/services/firebase.ts`:

```typescript
// Conectar aos emuladores em ambiente de desenvolvimento
if (__DEV__) {
  firebase.auth().useEmulator('http://localhost:9099');
  firebase.firestore().useEmulator('localhost', 8080);
  firebase.storage().useEmulator('localhost', 9199);
}
```

## Verificação de Integração
Para verificar se o Firebase está corretamente integrado, o app executará testes para:
1. Autenticação anônima
2. Operações no Firestore
3. Upload/download no Storage

## Solução de Problemas
Se encontrar erros:
1. Verifique se os arquivos de configuração (`google-services.json` e `GoogleService-Info.plist`) foram substituídos pelos arquivos reais do seu projeto Firebase
2. Confirme que os serviços necessários estão habilitados no console do Firebase
3. Para testes em ambiente Node.js, use os emuladores do Firebase que já estão configurados
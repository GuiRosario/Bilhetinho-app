// Script super simples para verificar a instalação do Firebase
console.log('🔥 Verificando instalação do Firebase...');

try {
  // Verificar se o Firebase está instalado
  const firebaseVersion = require('firebase/package.json').version;
  console.log(`✅ Firebase SDK instalado (versão ${firebaseVersion})`);
  
  // Verificar se o Firebase Admin está instalado
  const firebaseAdminVersion = require('firebase-admin/package.json').version;
  console.log(`✅ Firebase Admin SDK instalado (versão ${firebaseAdminVersion})`);
  
  console.log('\n✅ Tudo pronto para usar o Firebase!');
  console.log('\nPara testar o Firebase no app React Native:');
  console.log('1. Execute: npx react-native run-android');
  console.log('2. O app executará os testes automaticamente');
  
  console.log('\nPara testar com o Firebase Emulator:');
  console.log('1. Instale o Firebase CLI: npm install -g firebase-tools');
  console.log('2. Inicie o emulador: firebase emulators:start');
} catch (error) {
  console.error('❌ Erro ao verificar instalação:', error.message);
}

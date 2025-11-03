import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Função para testar a autenticação anônima
export const testAnonymousAuth = async () => {
  try {
    const userCredential = await auth().signInAnonymously();
    console.log('Autenticação anônima bem-sucedida:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Erro na autenticação anônima:', error);
    throw error;
  }
};

// Função para testar o Firestore
export const testFirestore = async (userId: string) => {
  try {
    const testDocRef = await firestore().collection('testes').doc(userId).set({
      timestamp: firestore.FieldValue.serverTimestamp(),
      testValue: 'Teste de integração do Firestore'
    });
    console.log('Teste do Firestore bem-sucedido');
    return true;
  } catch (error) {
    console.error('Erro no teste do Firestore:', error);
    throw error;
  }
};

// Função para testar o Storage
export const testStorage = async (userId: string) => {
  try {
    const storageRef = storage().ref(`testes/${userId}_test.txt`);
    await storageRef.putString('Teste de integração do Storage');
    const downloadUrl = await storageRef.getDownloadURL();
    console.log('Teste do Storage bem-sucedido, URL:', downloadUrl);
    return downloadUrl;
  } catch (error) {
    console.error('Erro no teste do Storage:', error);
    throw error;
  }
};

// Função para executar todos os testes
export const runAllTests = async () => {
  try {
    console.log('Iniciando testes de integração do Firebase...');
    
    // Teste de autenticação
    const user = await testAnonymousAuth();
    
    // Teste do Firestore
    await testFirestore(user.uid);
    
    // Teste do Storage
    await testStorage(user.uid);
    
    console.log('Todos os testes de integração do Firebase foram concluídos com sucesso!');
    return true;
  } catch (error) {
    console.error('Falha nos testes de integração do Firebase:', error);
    return false;
  }
};
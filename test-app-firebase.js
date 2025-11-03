// Script para testar a integração do aplicativo com o Firebase
const { initializeApp } = require('firebase/app');
const { getAuth, signInAnonymously } = require('firebase/auth');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
const { getStorage, ref, uploadString } = require('firebase/storage');

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBtnBqZoKCrCt5J6JClmpRYYy7kI7El1h8",
  authDomain: "bilhetinho-acf03.firebaseapp.com",
  projectId: "bilhetinho-acf03",
  storageBucket: "bilhetinho-acf03.firebasestorage.app",
  messagingSenderId: "983367411395",
  appId: "1:983367411395:android:81fa062947588eb569e476"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase inicializado com sucesso!");

// Configurar emuladores
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Conectar aos emuladores
const connectToEmulators = () => {
  const { connectAuthEmulator } = require('firebase/auth');
  const { connectFirestoreEmulator } = require('firebase/firestore');
  const { connectStorageEmulator } = require('firebase/storage');

  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(firestore, "localhost", 8080);
  connectStorageEmulator(storage, "localhost", 9199);
  
  console.log("Conectado aos emuladores com sucesso!");
};

// Testar autenticação anônima
const testAuth = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    console.log("Autenticação anônima bem-sucedida:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("Erro na autenticação:", error);
    throw error;
  }
};

// Testar Firestore
const testFirestore = async (userId) => {
  try {
    const docRef = await addDoc(collection(firestore, "users"), {
      uid: userId,
      testTimestamp: new Date(),
      message: "Teste de integração"
    });
    console.log("Documento adicionado ao Firestore:", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Erro ao adicionar documento:", error);
    throw error;
  }
};

// Testar Storage
const testStorage = async (userId) => {
  try {
    const storageRef = ref(storage, `test/${userId}/test-image.txt`);
    const result = await uploadString(storageRef, "Conteúdo de teste");
    console.log("Arquivo enviado para o Storage com sucesso!");
    return result;
  } catch (error) {
    console.error("Erro ao enviar arquivo:", error);
    throw error;
  }
};

// Executar todos os testes
const runAllTests = async () => {
  try {
    console.log("Iniciando testes de integração com Firebase...");
    
    // Conectar aos emuladores
    connectToEmulators();
    
    // Testar autenticação
    const user = await testAuth();
    
    // Testar Firestore
    await testFirestore(user.uid);
    
    // Testar Storage
    await testStorage(user.uid);
    
    console.log("Todos os testes concluídos com sucesso!");
  } catch (error) {
    console.error("Falha nos testes:", error);
  }
};

// Executar os testes
runAllTests();
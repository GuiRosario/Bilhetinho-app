// Script simples para testar a conexão com o Firebase
const { initializeApp } = require('firebase/app');

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
try {
  const app = initializeApp(firebaseConfig);
  console.log("Firebase inicializado com sucesso!");
  console.log("Configuração do Firebase está correta.");
  
  // Verificar se os emuladores estão rodando
  console.log("\nEmuladores do Firebase disponíveis:");
  console.log("- Auth: http://localhost:9099");
  console.log("- Firestore: http://localhost:8080");
  console.log("- Storage: http://localhost:9199");
  console.log("- UI: http://127.0.0.1:4000");
  
  console.log("\nPara usar os emuladores no app React Native, verifique se o código em src/services/firebase.ts está configurado corretamente.");
} catch (error) {
  console.error("Erro ao inicializar o Firebase:", error);
}
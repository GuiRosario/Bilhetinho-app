import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
// Authentication functions

// Use emuladores apenas quando explicitamente habilitados.
const USE_EMULATORS = true;

if (__DEV__ && USE_EMULATORS) {
  // In Android emulador, 10.0.2.2 aponta para o host (PC).
  // Em iOS/simulador e web, 127.0.0.1 funciona como esperado.
  const host = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';

  auth().useEmulator(`http://${host}:9099`);
  firestore().useEmulator(host, 8080);
  storage().useEmulator(host, 9199);
}

export const signInAnonymously = async () => {
  try {
    const userCredential = await auth().signInAnonymously();
    return userCredential.user;
  } catch (error) {
    console.error('Anonymous sign-in error:', error);
    throw error;
  }
};

// Connection code functions
export const generateConnectionCode = async (userId: string) => {
  console.log('[generateConnectionCode] Iniciando geração para userId=', userId);
  // Generate a random 6-character alphanumeric code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Format as XXX-XXX
  const formattedCode = `${code.substring(0, 3)}-${code.substring(3, 6)}`;

  // Store the code in Firestore
  try {
    await firestore().collection('users').doc(userId).set(
      {
        connectionCode: formattedCode,
        role: 'recipient',
        createdAt: firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    console.log('[generateConnectionCode] Código salvo no Firestore:', formattedCode);
  } catch (err) {
    console.error('[generateConnectionCode] Falha ao salvar código:', err);
    throw err;
  }

  return formattedCode;
};

export const connectWithCode = async (userId: string, code: string) => {
  // Query for the user with this connection code
  const querySnapshot = await firestore()
    .collection('users')
    .where('connectionCode', '==', code)
    .get();

  if (querySnapshot.empty) {
    throw new Error('Invalid connection code');
  }

  const recipientDoc = querySnapshot.docs[0];
  const recipientId = recipientDoc.id;

  // Create a connection between the two users
  await firestore().collection('connections').add({
    senderId: userId,
    recipientId: recipientId,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

  // Update the current user's role
  await firestore().collection('users').doc(userId).set({
    role: 'sender',
    connectedTo: recipientId,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

  return recipientId;
};

// Notelet functions
export const sendNotelet = async (
  senderId: string,
  recipientId: string,
  imageData: string,
  text: string,
) => {
  try {
    // Upload the drawing to Firebase Storage
    const storageRef = storage().ref(`notelets/${senderId}_${Date.now()}.png`);
    await storageRef.putString(imageData, 'data_url');
    const imageUrl = await storageRef.getDownloadURL();

    // Save the notelet data to Firestore
    const noteletRef = await firestore().collection('notelets').add({
      senderId,
      recipientId,
      imageUrl,
      text,
      createdAt: firestore.FieldValue.serverTimestamp(),
      read: false,
    });

    return noteletRef.id;
  } catch (error) {
    console.error('Error sending notelet:', error);
    throw error;
  }
};

export const getLatestNotelet = async (userId: string) => {
  try {
    const querySnapshot = await firestore()
      .collection('notelets')
      .where('recipientId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return null;
    }

    const noteletData = querySnapshot.docs[0].data();
    return {
      id: querySnapshot.docs[0].id,
      ...noteletData,
      createdAt: noteletData.createdAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error('Error getting latest notelet:', error);
    throw error;
  }
};

export const getNoteletHistory = async (userId: string, limit = 10) => {
  try {
    const querySnapshot = await firestore()
      .collection('notelets')
      .where('recipientId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error('Error getting notelet history:', error);
    throw error;
  }
};

// Push notification functions
export const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
};

export const registerDeviceToken = async (userId: string) => {
  try {
    const token = await messaging().getToken();
    await firestore().collection('users').doc(userId).update({
      deviceToken: token,
    });
    return token;
  } catch (error) {
    console.error('Error registering device token:', error);
    throw error;
  }
};

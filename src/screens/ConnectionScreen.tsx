import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Share } from 'react-native';
import { connectWithCode } from '../services/firebase';

const ConnectionScreen = ({ route, navigation }) => {
  const { mode, userId, connectionCode } = route.params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Please enter a connection code');
      return;
    }

    setLoading(true);
    try {
      const recipientId = await connectWithCode(userId, code.trim());
      Alert.alert(
        'Success', 
        'Connected successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Drawing', { userId, recipientId }) 
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to connect. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const shareCode = async () => {
    try {
      await Share.share({
        message: `Connect with me on Bilhetinho! My connection code is: ${connectionCode}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share connection code');
    }
  };

  if (mode === 'recipient') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Your Connection Code</Text>
        <View style={styles.codeContainer}>
          <Text style={styles.code}>{connectionCode}</Text>
        </View>
        <Text style={styles.instructions}>
          Share this code with your partner so they can connect with you and send notelets to your home screen.
        </Text>
        <TouchableOpacity style={styles.button} onPress={shareCode}>
          <Text style={styles.buttonText}>Share Code</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={() => navigation.navigate('History', { userId })}
        >
          <Text style={[styles.buttonText, styles.secondaryText]}>View Notelet History</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect with Your Partner</Text>
      <Text style={styles.instructions}>
        Enter the connection code shared by your partner to start sending notelets.
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter code (e.g. ABC-123)"
        value={code}
        onChangeText={setCode}
        autoCapitalize="characters"
        maxLength={7}
      />
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleConnect}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Connect</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  instructions: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    paddingHorizontal: 20,
  },
  codeContainer: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    minWidth: 150,
    alignItems: 'center',
  },
  code: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#FF6B6B',
  },
  input: {
    width: '80%',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF6B6B',
    marginTop: 20,
  },
  secondaryText: {
    color: '#FF6B6B',
  },
});

export default ConnectionScreen;
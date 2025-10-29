import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInAnonymously, generateConnectionCode } from '../services/firebase';

const WelcomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Sign in anonymously when the app starts
    const signIn = async () => {
      try {
        const user = await signInAnonymously();
        setUserId(user.uid);
      } catch (error) {
        Alert.alert('Error', 'Failed to sign in. Please try again.');
      }
    };
    
    signIn();
  }, []);

  const handleRecipientSetup = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const code = await generateConnectionCode(userId);
      navigation.navigate('Connection', { 
        mode: 'recipient', 
        userId, 
        connectionCode: code 
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to generate connection code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSenderSetup = () => {
    if (!userId) return;
    navigation.navigate('Connection', { mode: 'sender', userId });
  };

  if (!userId) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Setting up Bilhetinho...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bilhetinho</Text>
        <Text style={styles.subtitle}>Connect with your loved ones through simple notes</Text>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionButton} 
            onPress={handleRecipientSetup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.optionText}>I want to receive notelets</Text>
            )}
          </TouchableOpacity>
          
          <Text style={styles.orText}>- or -</Text>
          
          <TouchableOpacity 
            style={[styles.optionButton, styles.secondaryButton]} 
            onPress={handleSenderSetup}
            disabled={loading}
          >
            <Text style={[styles.optionText, styles.secondaryText]}>
              I want to send notelets
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 60,
  },
  optionsContainer: {
    width: '100%',
    maxWidth: 300,
  },
  optionButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  secondaryText: {
    color: '#FF6B6B',
  },
  orText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 10,
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
  },
});

export default WelcomeScreen;
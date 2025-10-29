import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Firebase initialization
import '@react-native-firebase/app';

// Screens
import WelcomeScreen from './screens/WelcomeScreen';
import ConnectionScreen from './screens/ConnectionScreen';
import DrawingScreen from './screens/DrawingScreen';
import HistoryScreen from './screens/HistoryScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Connection" 
            component={ConnectionScreen} 
            options={{ title: 'Connect with Partner' }}
          />
          <Stack.Screen 
            name="Drawing" 
            component={DrawingScreen} 
            options={{ title: 'Create Notelet' }}
          />
          <Stack.Screen 
            name="History" 
            component={HistoryScreen} 
            options={{ title: 'Notelet History' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import ErrorBoundary from './src/utils/ErrorBoundary';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainMenuScreen from './src/screens/MainMenuScreen';
import GameArenaScreen from './src/screens/GameArenaScreen';
import CharacterScreen from './src/screens/CharacterScreen';
import InventoryScreen from './src/screens/InventoryScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { player, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1a1a1a' },
          animation: 'slide_from_right',
        }}
      >
        {!player ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainMenu" component={MainMenuScreen} />
            <Stack.Screen name="GameArena" component={GameArenaScreen} />
            <Stack.Screen name="Character" component={CharacterScreen} />
            <Stack.Screen name="Inventory" component={InventoryScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <PaperProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </PaperProvider>
    </ErrorBoundary>
  );
}

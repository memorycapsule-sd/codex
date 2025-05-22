import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Navigation from './navigation';
import { View, Text } from 'react-native';

// Import Firebase configuration
import { firebase } from './app/config/firebase';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize Firebase on app startup
  useEffect(() => {
    try {
      // Log to confirm Firebase is initialized
      console.log('Firebase initialized with app:', firebase.name);
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      setIsLoading(false);
    }
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', marginBottom: 10 }}>Error initializing app:</Text>
        <Text>{errorMessage}</Text>
      </View>
    );
  }

  // Main app with navigation
  return (
    <>
      <Navigation />
      <StatusBar style="auto" />
    </>
  );
}

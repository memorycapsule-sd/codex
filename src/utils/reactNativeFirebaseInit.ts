/**
 * React Native-specific Firebase Auth initialization with AsyncStorage
 * 
 * This utility function ensures Firebase Auth is properly initialized with
 * AsyncStorage persistence for React Native environments.
 */

import { initializeApp, getApp } from 'firebase/app';
import { Auth, getAuth, initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Import using require to avoid type checking errors when the module isn't available
let getReactNativePersistence: any = null;
if (Platform.OS !== 'web') {
  try {
    // Try to dynamically import the React Native persistence module
    const reactNativeAuthModule = require('firebase/auth/react-native');
    getReactNativePersistence = reactNativeAuthModule.getReactNativePersistence;
  } catch (e) {
    console.warn('Could not import getReactNativePersistence, will fall back to default Auth persistence');
  }
}

/**
 * Initializes Firebase Auth with AsyncStorage persistence for React Native
 * This should be called early in the app lifecycle, before any Firebase auth operations
 */
export async function initializeReactNativeAuth(app: any): Promise<Auth> {
  try {
    // First check if auth is already initialized
    try {
      return getAuth(app);
    } catch (e) {
      // Auth not initialized yet, continue with initialization
    }

    // For React Native environments
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      if (getReactNativePersistence) {
        console.log('Initializing Firebase Auth with AsyncStorage persistence for React Native');
        return initializeAuth(app, {
          persistence: getReactNativePersistence(AsyncStorage)
        });
      } else {
        console.warn('React Native persistence not available, using default Auth initialization');
      }
    }
    
    // Fallback to standard auth initialization
    return getAuth(app);
  } catch (error) {
    console.error('Error initializing React Native Auth:', error);
    // Always return an auth instance, even on error
    return getAuth(app);
  }
}

/**
 * Setup manual persistence with AsyncStorage
 * This acts as a fallback when the official persistence doesn't work
 */
export async function setupManualPersistence(auth: Auth): Promise<void> {
  // Listen for auth state changes
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      // User is signed in, save minimal user data to AsyncStorage
      await AsyncStorage.setItem('userId', user.uid);
      await AsyncStorage.setItem('userEmail', user.email || '');
    } else {
      // User is signed out, clear from AsyncStorage
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userEmail');
    }
  });
}

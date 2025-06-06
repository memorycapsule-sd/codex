console.log('!!! EXECUTING src/firebase.ts TOP LEVEL !!!');
/**
 * Consolidated Firebase initialization for Memory Capsule
 * Works on native platforms using @react-native-firebase modules
 */
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import app from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'; // Import the type

// Exported instances for use throughout the app
export let db: FirebaseFirestoreTypes.Module | null = null;
type User = FirebaseAuthTypes.User;

// Google Auth Configuration
export const googleAuthConfig = {
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "660630380757-1vbjdvsq8al3qi0dchc2akmqnl5okcpd.apps.googleusercontent.com",
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "660630380757-1vbjdvsq8al3qi0dchc2akmqnl5okcpd.apps.googleusercontent.com",
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "660630380757-1vbjdvsq8al3qi0dchc2akmqnl5okcpd.apps.googleusercontent.com"
};

/**
 * Initialize Firebase if needed
 * With @react-native-firebase, most initialization is handled automatically
 * through the native configuration files.
 */
export const initializeFirebase = () => {
  try {
    console.log('[FIREBASE] Starting unified initialization...');
    
    // With React Native Firebase, we don't need to explicitly initialize most services
    // They are automatically initialized through native configuration files
    console.log('[FIREBASE] Firebase services available through native modules');
    console.log('[FIREBASE] Platform:', Platform.OS);
    
    // The auth, firestore, and storage services are already initialized
    // and accessible through their respective imports
    const firestoreModule = require('@react-native-firebase/firestore').default;
    db = firestoreModule(); // Initialize Firestore instance here
    console.log('[FIREBASE] Firestore instance created.');
    
    console.log('[FIREBASE] All services initialized successfully');
    
  } catch (error) {
    console.error('[FIREBASE] Initialization error:', error);
  }

  // No need to return anything here, as the services are already exported
  // and available through their direct imports
};

// Initialize Firebase on module import
initializeFirebase();

// Helper functions for AsyncStorage persistence
export const saveUserToStorage = async (user: FirebaseAuthTypes.User | null) => {
  if (!user) return false;
  
  try {
    await AsyncStorage.setItem('userId', user.uid);
    await AsyncStorage.setItem('userEmail', user.email || '');
    return true;
  } catch (error) {
    console.log('Error saving user to AsyncStorage:', error);
    return false;
  }
};

export const clearUserFromStorage = async () => {
  try {
    await AsyncStorage.multiRemove(['userId', 'userEmail']);
    return true;
  } catch (error) {
    console.log('Error clearing user from AsyncStorage:', error);
    return false;
  }
};

export const getUserFromStorage = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const userEmail = await AsyncStorage.getItem('userEmail');
    
    if (userId) {
      return { uid: userId, email: userEmail };
    }
    return null;
  } catch (error) {
    console.log('Error getting user from AsyncStorage:', error);
    return null;
  }
};

// Export all Firebase instances and the initialization function
export { auth, storage };
export default app;

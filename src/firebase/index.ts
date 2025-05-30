/**
 * Platform-specific Firebase initialization for Memory Capsule
 */
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyADZA_39LvezewktuxCUJuEAYbiCEFwzM8",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "memory-capsule-codex.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "memory-capsule-codex",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "memory-capsule-codex.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "660630380757",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:660630380757:web:4280b1fbf1243ca0dc425c",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-CY6S95F9EN"
};

// Platform-specific initialization
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

// Separate implementations for web and native
if (Platform.OS === 'web') {
  // Web implementation
  try {
    const { initializeApp } = require('firebase/app');
    const { getAuth, browserLocalPersistence, setPersistence } = require('firebase/auth');
    const { getFirestore } = require('firebase/firestore');
    const { getStorage } = require('firebase/storage');

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // Set persistence for web
    setPersistence(auth, browserLocalPersistence)
      .catch((error) => {
        console.log('Error setting auth persistence:', error);
      });
  } catch (error) {
    console.log('Firebase web initialization error:', error);
  }
} else {
  // React Native implementation
  try {
    const firebaseApp = require('@react-native-firebase/app').default;
    const firebaseAuth = require('@react-native-firebase/auth').default;
    const firebaseFirestore = require('@react-native-firebase/firestore').default;
    const firebaseStorage = require('@react-native-firebase/storage').default;

    // Initialize if not already initialized
    if (!firebaseApp.apps.length) {
      app = firebaseApp.initializeApp(firebaseConfig);
    } else {
      app = firebaseApp.app();
    }

    auth = firebaseAuth();
    db = firebaseFirestore();
    storage = firebaseStorage();
  } catch (error) {
    console.log('Firebase native initialization error:', error);
  }
}

// Helper functions for persistence with AsyncStorage
export const saveUserToStorage = async (user: any): Promise<boolean> => {
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

export const clearUserFromStorage = async (): Promise<boolean> => {
  try {
    await AsyncStorage.multiRemove(['userId', 'userEmail']);
    return true;
  } catch (error) {
    console.log('Error clearing user from AsyncStorage:', error);
    return false;
  }
};

export const getUserFromStorage = async (): Promise<{ uid: string; email: string | null } | null> => {
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

// Export Firebase instances
export { app, auth, db, storage };
export default app;

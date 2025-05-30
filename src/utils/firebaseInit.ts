/**
 * Firebase initialization utility
 * 
 * This ensures Firebase Auth is properly initialized with AsyncStorage persistence
 * to address the "Component auth has not been registered yet" error.
 */

import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, indexedDBLocalPersistence, inMemoryPersistence } from 'firebase/auth';
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

// Initialize Firebase early - duplicate initialization is handled gracefully by Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Setup persistence for Firebase Auth
export const setupAsyncStoragePersistence = async () => {
  try {
    // For React Native web, use the appropriate persistence mechanism
    // In a full React Native app, we'd use a different approach specific to React Native
    // For Expo web, use browserLocalPersistence which works in web environments
    try {
      await setPersistence(auth, browserLocalPersistence);
      console.log('Firebase Auth persistence set to browserLocalPersistence');
    } catch (browserError) {
      console.log('Browser persistence failed, falling back to indexedDB:', browserError);
      try {
        // Try indexedDB as a fallback
        await setPersistence(auth, indexedDBLocalPersistence);
        console.log('Firebase Auth persistence set to indexedDBLocalPersistence');
      } catch (indexedDBError) {
        console.log('IndexedDB persistence failed, falling back to in-memory:', indexedDBError);
        // Last resort: in-memory persistence (not persistent across sessions)
        await setPersistence(auth, inMemoryPersistence);
        console.log('Firebase Auth persistence set to inMemoryPersistence');
      }
    }
    
    // Manual persistence: save auth state to AsyncStorage when user signs in/out
    // Listen for auth state changes
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in, save to AsyncStorage
        await AsyncStorage.setItem('userId', user.uid);
        await AsyncStorage.setItem('userEmail', user.email || '');
      } else {
        // User is signed out, clear from AsyncStorage
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('userEmail');
      }
    });
    
    // Check for existing user in AsyncStorage
    const userId = await AsyncStorage.getItem('userId');
    const userEmail = await AsyncStorage.getItem('userEmail');
    
    // Log persistence setup status
    console.log('Firebase Auth persistence with AsyncStorage is set up');
    console.log('Existing user data:', userId ? 'Found' : 'Not found');
    
    return true;
  } catch (error) {
    console.error('Error setting up Firebase Auth persistence:', error);
    return false;
  }
};

// Export Firebase instances
export { app, auth };

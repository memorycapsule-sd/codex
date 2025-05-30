/**
 * Firebase Initialization for React Native
 * This file handles proper initialization of Firebase with AsyncStorage persistence
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence,
  browserLocalPersistence,
  setPersistence 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADZA_39LvezewktuxCUJuEAYbiCEFwzM8",
  authDomain: "memory-capsule-codex.firebaseapp.com",
  projectId: "memory-capsule-codex",
  storageBucket: "memory-capsule-codex.firebasestorage.app",
  messagingSenderId: "660630380757",
  appId: "1:660630380757:web:4280b1fbf1243ca0dc425c",
  measurementId: "G-CY6S95F9EN"
};

// Initialize Firebase app
let app;
try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('🔥 Firebase app initialized');
  } else {
    app = getApp();
    console.log('🔥 Using existing Firebase app');
  }
} catch (error) {
  console.error('🔥 Failed to initialize Firebase app:', error);
  throw error;
}

// Initialize Auth with proper persistence
let auth;
try {
  // Check if we already have an auth instance
  const existingAuth = getAuth(app);
  if (existingAuth) {
    auth = existingAuth;
    console.log('🔥 Using existing auth instance');
  }
} catch (error) {
  // Auth not initialized yet, proceed with initialization
  try {
    if (Platform.OS !== 'web') {
      // React Native initialization
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
      });
      console.log('🔥 Auth initialized with AsyncStorage persistence');
    } else {
      // Web initialization
      auth = getAuth(app);
      setPersistence(auth, browserLocalPersistence)
        .then(() => console.log('🔥 Browser persistence set'))
        .catch(error => console.warn('🔥 Failed to set browser persistence:', error));
    }
  } catch (initError) {
    console.warn('🔥 Failed to initialize auth with persistence:', initError);
    // Fallback to basic auth
    auth = getAuth(app);
    console.log('🔥 Auth initialized without persistence');
  }
}

// Initialize other services
const firestore = getFirestore(app);
const storage = getStorage(app);

// Export instances
export { app, auth, firestore, storage };

// Export default app
export default app;

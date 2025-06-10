console.log('!!! EXECUTING src/firebase.ts TOP LEVEL (Firebase Web SDK initialization) !!!');

import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  initializeAuth, 
  getAuth, 
  Auth,
  User as FirebaseUser,
  browserLocalPersistence,
  indexedDBLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  inMemoryPersistence
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyADZA_39LvezewktuxCUJuEAYbiCEFwzM8",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "memory-capsule-codex.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "memory-capsule-codex",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "memory-capsule-codex.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "660630380757",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:660630380757:web:4280b1fbf1243ca0dc425c",
  // measurementId is optional for web
  // measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "YOUR_MEASUREMENT_ID" 
};

// Functions for managing user persistence with AsyncStorage
export const saveUserToStorage = async (user: FirebaseUser | null) => {
  if (!user) return false;
  try {
    await AsyncStorage.setItem('userId', user.uid);
    await AsyncStorage.setItem('userEmail', user.email || '');
    console.log('[FIREBASE] User details saved to AsyncStorage:', { uid: user.uid, email: user.email });
    return true;
  } catch (error) {
    console.error('[FIREBASE] Error saving user to AsyncStorage:', error);
    return false;
  }
};

export const clearUserFromStorage = async () => {
  try {
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userEmail');
    console.log('[FIREBASE] User details cleared from AsyncStorage');
    return true;
  } catch (error) {
    console.error('[FIREBASE] Error clearing user from AsyncStorage:', error);
    return false;
  }
};

export const getUserFromStorage = async (): Promise<{ uid: string; email: string } | null> => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const userEmail = await AsyncStorage.getItem('userEmail');
    
    if (userId && userEmail) {
      console.log('[FIREBASE] User details retrieved from AsyncStorage:', { email: userEmail, uid: userId });
      return { uid: userId, email: userEmail };
    }
    return null;
  } catch (error) {
    console.error('[FIREBASE] Error getting user from AsyncStorage:', error);
    return null;
  }
};

// Function to restore auth state from AsyncStorage
export const restoreAuthState = async () => {
  try {
    const user = await getUserFromStorage();
    if (user) {
      console.log('[FIREBASE] Found stored user:', user.email);
      return user;
    }
    return null;
  } catch (error) {
    console.error('[FIREBASE] Error restoring auth state:', error);
    return null;
  }
};

// Initialize Firebase App, Auth, Firestore, and Storage
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

// Initialize Firebase services
try {
  // Check if Firebase app is already initialized to avoid duplicates
  if (getApps().length === 0) {
    console.log('[FIREBASE] No existing Firebase app found. Initializing new app...');
    app = initializeApp(firebaseConfig);
    console.log('[FIREBASE] Modular Firebase App initialized successfully:', app.name);

    // Initialize Auth based on platform
    if (Platform.OS === 'web') {
      // For web, use browserLocalPersistence
      auth = initializeAuth(app, {
        persistence: [indexedDBLocalPersistence, browserLocalPersistence]
      });
      console.log('[FIREBASE] Modular Firebase Auth initialized with browser persistence.');
    } else {
      // For React Native, initialize auth with in-memory persistence
      auth = initializeAuth(app);
      
      // Set in-memory persistence explicitly
      setPersistence(auth, inMemoryPersistence)
        .then(() => {
          console.log('[FIREBASE] Set in-memory persistence for React Native');
        })
        .catch((error) => {
          console.error('[FIREBASE] Error setting persistence:', error);
        });
      
      console.log('[FIREBASE] Modular Firebase Auth initialized for React Native.');
    }
  } else {
    // Get the existing Firebase app if it's already initialized
    app = getApp();
    auth = getAuth(app);
    console.log('[FIREBASE] Using existing Firebase app:', app.name);
  }
  
  // Initialize Firestore
  db = getFirestore(app);
  console.log('[FIREBASE] Modular Firestore initialized successfully.');
  
  // Initialize Storage
  storage = getStorage(app);
  console.log('[FIREBASE] Modular Storage initialized successfully.');
  
  // Set up auth state listener for manual persistence
  if (Platform.OS !== 'web') {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, store their ID
        saveUserToStorage(user);
      } else {
        // User is signed out, clear storage
        clearUserFromStorage();
      }
    });
  }
  
  // Log successful initialization
  console.log('[FIREBASE] All modular services configured:', {
    appName: app.name,
    authInitialized: !!auth,
    dbInitialized: !!db,
    storageInitialized: !!storage
  });
  
} catch (error: any) {
  console.error('[FIREBASE] CRITICAL Error during Firebase initialization:', error);
  throw new Error(`Firebase initialization failed: ${error.message}`);
}

// Export initialized Firebase services
export { app, auth, db, storage };

// Export Firebase types for use in other parts of the app
export type { FirebaseApp, Auth, Firestore, FirebaseStorage, FirebaseUser }; 
export type User = FirebaseUser; 

// Google Auth Configuration - remains the same, but ensure client IDs are correct
export const googleAuthConfig = {
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "660630380757-1vbjdvsq8al3qi0dchc2akmqnl5okcpd.apps.googleusercontent.com",
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "660630380757-1vbjdvsq8al3qi0dchc2akmqnl5okcpd.apps.googleusercontent.com",
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "660630380757-1vbjdvsq8al3qi0dchc2akmqnl5okcpd.apps.googleusercontent.com"
};

// The initializeFirebaseApp function might not be strictly necessary anymore
// as initialization happens at the top level. You can keep it for logging if desired.
export async function initializeFirebaseApp(): Promise<void> {
  console.log('[FIREBASE] Modular Firebase App and services are initialized.');
  console.log('[FIREBASE] Details:', {
    appName: app.name,
    authInitialized: !!auth,
    dbInitialized: !!db,
    storageInitialized: !!storage,
  });
}

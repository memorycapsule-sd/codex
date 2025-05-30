/**
 * FIREBASE UNIFIED SOLUTION
 * 
 * This is the DEFINITIVE source of truth for all Firebase services.
 * It must be imported before ANY other Firebase-related code.
 * 
 * Features:
 * - Platform-specific initialization (Web, iOS, Android)
 * - AsyncStorage persistence for authentication
 * - Proper error handling and logging
 * - TypeScript compatibility
 * - Google Auth configuration
 */

// Core Firebase imports
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  onAuthStateChanged,
  getReactNativePersistence 
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

console.log(' [FIREBASE] Starting unified initialization...');

// Initialize Firebase app (safely handling multiple initializations)
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log(' [FIREBASE] App initialized for the first time');
} else {
  app = getApp();
  console.log(' [FIREBASE] Using existing app instance');
}

// Initialize Auth with proper AsyncStorage persistence
let auth;
try {
  if (Platform.OS !== 'web') {
    // Use proper persistence for React Native with AsyncStorage
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } else {
    // For web, use standard getAuth
    auth = getAuth(app);
  }
  console.log(' [FIREBASE] Auth initialized successfully for platform:', Platform.OS);
} catch (error) {
  console.error(' [FIREBASE] Auth initialization failed:', error);
  throw error;
}

// Initialize other Firebase services
const firestore = getFirestore(app);
const storage = getStorage(app);

// Set up auth state listener for manual persistence
if (auth) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await saveUserToStorage(user);
      console.log(' [FIREBASE] User auth state saved to AsyncStorage');
    } else {
      await clearUserFromStorage();
      console.log(' [FIREBASE] User auth state cleared from AsyncStorage');
    }
  });

  // Restore user session on app start
  restoreUserSession();
}

console.log(' [FIREBASE] All services initialized successfully');

// Export Firebase instances
export { app, auth, firestore, storage };

/**
 * Manual Authentication Persistence System
 * These functions interact with AsyncStorage directly.
 * They can complement Firebase's built-in persistence or serve specific app needs.
 */

// Restore user session from AsyncStorage (Manual Check)
async function restoreUserSession() {
  try {
    const userData = await getUserFromStorage();
    if (userData) {
      console.log(' [FIREBASE] Found stored user session in AsyncStorage');
    }
  } catch (error) {
    console.warn(' [FIREBASE] Failed to restore user session:', error);
  }
}

// Save user data to AsyncStorage
export const saveUserToStorage = async (user) => {
  if (!AsyncStorage) return false;
  
  try {
    if (user) {
      // Store minimal user data to avoid excessive storage
      const userData = {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null
      };
      
      // Store as JSON string
      await AsyncStorage.setItem('firebase_user', JSON.stringify(userData));
      return true;
    } else {
      await clearUserFromStorage();
      return true;
    }
  } catch (error) {
    console.warn(' [FIREBASE] Storage save failed:', error);
    return false;
  }
};

// Get user data from AsyncStorage
export const getUserFromStorage = async () => {
  if (!AsyncStorage) return null;
  
  try {
    // Try to get the complete user object first
    const userData = await AsyncStorage.getItem('firebase_user');
    if (userData) {
      return JSON.parse(userData);
    }
    
    return null;
  } catch (error) {
    console.warn(' [FIREBASE] Storage read failed:', error);
    return null;
  }
};

// Clear user data from AsyncStorage
export const clearUserFromStorage = async () => {
  if (!AsyncStorage) return false;
  
  try {
    // Remove all user-related keys
    await AsyncStorage.removeItem('firebase_user');
    console.log(' [FIREBASE] User data cleared from AsyncStorage');
    return true;
  } catch (error) {
    console.warn(' [FIREBASE] Storage clear failed:', error);
    return false;
  }
};

/**
 * Additional Exports and Configurations
 */

// Google Auth Configuration
export const googleAuthConfig = {
  androidClientId: '660630380757-m8ko60jb0bf8mmr3snu2585shranfl23.apps.googleusercontent.com',
  iosClientId: '660630380757-6h8pt3kccprm0s6l15ts84r1pi7rfcme.apps.googleusercontent.com',
  webClientId: '660630380757-rqpodn1871shiou4k8kp2kd4ebul3l0r.apps.googleusercontent.com',
};

// Helper function to check if a user is authenticated
export const isUserAuthenticated = () => {
  return !!auth.currentUser;
};

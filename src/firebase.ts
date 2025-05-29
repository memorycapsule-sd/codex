/**
 * Firebase initialization for Memory Capsule
 * Using lazy initialization to avoid "Component not registered" errors
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

// Firebase instances - lazy loaded
let _app: any = null;
let _auth: any = null;
let _db: any = null;
let _storage: any = null;
let _initialized = false;

// Lazy initialization function
const initializeFirebase = () => {
  if (_initialized) return { app: _app, auth: _auth, db: _db, storage: _storage };
  
  try {
    const firebaseApp = require('firebase/app');
    const firebaseAuth =
      Platform.OS === 'web'
        ? require('firebase/auth')
        : require('firebase/auth/react-native');
    const firebaseFirestore = require('firebase/firestore');
    const firebaseStorage = require('firebase/storage');
    
    // Initialize app if not already initialized
    if (!firebaseApp.getApps().length) {
      _app = firebaseApp.initializeApp(firebaseConfig);
    } else {
      _app = firebaseApp.getApp();
    }
    
    // For React Native (non-web), we need to initialize Auth with AsyncStorage
    if (Platform.OS !== 'web') {
      // Use initializeAuth with AsyncStorage persistence for React Native
      const { initializeAuth, getReactNativePersistence } = firebaseAuth;
      
      try {
        _auth = initializeAuth(_app, {
          persistence: getReactNativePersistence(AsyncStorage)
        });
        console.log('React Native auth initialized with AsyncStorage persistence');
      } catch (authError) {
        // If auth is already initialized, just get the instance
        console.log('Auth already initialized, using existing instance');
        _auth = firebaseAuth.getAuth(_app);
      }
    } else {
      // For web, use regular auth
      _auth = firebaseAuth.getAuth(_app);
      
      // Set persistence for web
      firebaseAuth.setPersistence(_auth, firebaseAuth.browserLocalPersistence)
        .catch((error: any) => console.log('Web auth persistence error:', error));
    }
    
    // Initialize other services
    _db = firebaseFirestore.getFirestore(_app);
    _storage = firebaseStorage.getStorage(_app);
    
    _initialized = true;
    console.log('Firebase initialized successfully for platform:', Platform.OS);
  } catch (error) {
    console.error('Firebase initialization error:', error);
    // Return null services but don't crash
  }
  
  return { app: _app, auth: _auth, db: _db, storage: _storage };
};

// Getters that initialize on first access
export const getApp = () => {
  if (!_app) initializeFirebase();
  return _app;
};

export const getAuth = () => {
  if (!_auth) initializeFirebase();
  return _auth;
};

export const getDb = () => {
  if (!_db) initializeFirebase();
  return _db;
};

export const getStorage = () => {
  if (!_storage) initializeFirebase();
  return _storage;
};

// Helper functions for AsyncStorage persistence
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

// Export getter functions for compatibility
export const app = getApp();
export const auth = getAuth();
export const db = getDb();
export const storage = getStorage();

// Also export the initialization function for manual initialization
export { initializeFirebase };
export default getApp();

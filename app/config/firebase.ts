import { initializeApp } from 'firebase/app';
import { Auth, getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

let getReactNativePersistence: any = null;
if (Platform.OS !== 'web') {
  try {
    ({ getReactNativePersistence } = require('firebase/auth/react-native'));
  } catch {
    console.warn('Could not load getReactNativePersistence');
  }
}

// Hybrid configuration that works in both OpenAI Codex and Windsurf environments
const firebaseConfig = {
  // Use environment variables if available, otherwise fall back to direct values
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyADZA_39LvezewktuxCUJuEAYbiCEFwzM8",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "memory-capsule-codex.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "memory-capsule-codex",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "memory-capsule-codex.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "660630380757",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:660630380757:web:4280b1fbf1243ca0dc425c",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-CY6S95F9EN"
};

// Google Auth Configuration
export const googleAuthConfig = {
  // Web client ID (from Firebase console)
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "660630380757-1vbjdvsq8al3qi0dchc2akmqnl5okcpd.apps.googleusercontent.com",
  // iOS client ID (from Firebase console)
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "660630380757-1vbjdvsq8al3qi0dchc2akmqnl5okcpd.apps.googleusercontent.com",
  // Android client ID (from Firebase console)
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "660630380757-1vbjdvsq8al3qi0dchc2akmqnl5okcpd.apps.googleusercontent.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let auth: Auth;

if (Platform.OS !== 'web' && getReactNativePersistence) {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
    console.log('Firebase Auth initialized for React Native');
  } catch {
    auth = getAuth(app);
  }
} else {
  auth = getAuth(app);
}

// Check if we're running in a React Native environment
const isReactNative = Platform.OS === 'ios' || Platform.OS === 'android';

// Log platform info for debugging
if (isReactNative) {
  console.log(`Running on React Native platform: ${Platform.OS}`);
} else {
  console.log('Running on web platform');
}

// Initialize and export Firebase instances
export const db = getFirestore(app);
export const storage = getStorage(app);
export { app, auth };

// Helper function to save user data to AsyncStorage
export const saveUserToStorage = async (user: any) => {
  if (user) {
    await AsyncStorage.setItem('userId', user.uid);
    await AsyncStorage.setItem('userEmail', user.email || '');
    return true;
  }
  return false;
};

// Helper function to clear user data from AsyncStorage
export const clearUserFromStorage = async () => {
  await AsyncStorage.multiRemove(['userId', 'userEmail']);
  return true;
};

// Helper function to get user data from AsyncStorage
export const getUserFromStorage = async () => {
  const userId = await AsyncStorage.getItem('userId');
  const userEmail = await AsyncStorage.getItem('userEmail');
  
  if (userId) {
    return { uid: userId, email: userEmail };
  }
  return null;
};

// Firebase configuration is now fully set up

// Export the app instance
export default app;

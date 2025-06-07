import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  Auth,
  User,
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
    'AIzaSyADZA_39LvezewktuxCUJuEAYbiCEFwzM8',
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    'memory-capsule-codex.firebaseapp.com',
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'memory-capsule-codex',
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    'memory-capsule-codex.firebasestorage.app',
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '660630380757',
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ||
    '1:660630380757:web:4280b1fbf1243ca0dc425c',
  measurementId:
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-CY6S95F9EN',
};

export let app: FirebaseApp | undefined;
export let auth: Auth | undefined;
export let db: Firestore | undefined;
export let storage: FirebaseStorage | undefined;

export async function initializeFirebaseApp(): Promise<void> {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  if (Platform.OS !== 'web') {
    const { getReactNativePersistence } = await import(
      'firebase/auth/react-native'
    );
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } else {
    auth = getAuth(app);
  }

  db = getFirestore(app);
  storage = getStorage(app);
}

export const googleAuthConfig = {
  webClientId:
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
    '660630380757-1vbjdvsq8al3qi0dchc2akmqnl5okcpd.apps.googleusercontent.com',
  iosClientId:
    process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
    '660630380757-1vbjdvsq8al3qi0dchc2akmqnl5okcpd.apps.googleusercontent.com',
  androidClientId:
    process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
    '660630380757-1vbjdvsq8al3qi0dchc2akmqnl5okcpd.apps.googleusercontent.com',
};

export type FirebaseUser = User;

export const saveUserToStorage = async (
  user: FirebaseUser | null,
): Promise<boolean> => {
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

export const getUserFromStorage = async (): Promise<
  | { uid: string; email: string | null }
  | null
> => {
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

export default app;

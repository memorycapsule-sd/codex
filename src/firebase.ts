console.log('!!! EXECUTING src/firebase.ts TOP LEVEL (deferred initialization) !!!');
import firebaseApp from '@react-native-firebase/app';
import firebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import firebaseStorage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Initialize and export RNFirebase service instances
export const app = firebaseApp.app();
export const auth = firebaseAuth();
export const db = firestore();
export const storage = firebaseStorage();

type User = FirebaseAuthTypes.User;

// Google Auth Configuration - remains the same
export const googleAuthConfig = {
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "660630380757-1vbjdvsq8al3qi0dchc2akmqnl5okcpd.apps.googleusercontent.com",
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "660630380757-1vbjdvsq8al3qi0dchc2akmqnl5okcpd.apps.googleusercontent.com",
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "660630380757-1vbjdvsq8al3qi0dchc2akmqnl5okcpd.apps.googleusercontent.com"
};

export async function initializeFirebaseApp(): Promise<void> {
  console.log('[FIREBASE] RNFirebase static instances initialized:', {
    app: app.name,
    auth: !!auth,
    db: !!db,
    storage: !!storage,
  });
}

// Helper functions for AsyncStorage persistence - remain the same
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

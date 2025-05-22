import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '../../app/config/firebase';

// Get the auth instance without custom persistence
const auth = getAuth(firebase);

/**
 * Authentication service wrapping Firebase Auth.
 */
export const AuthService = {
  /**
   * Get the current auth instance
   */
  getAuth() {
    return auth;
  },

  /**
   * Create a new user with email and password.
   */
  async signUp(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Store the user ID in AsyncStorage for persistence
      await AsyncStorage.setItem('userId', userCredential.user.uid);
      return userCredential;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  /**
   * Sign in with email and password.
   */
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Store the user ID in AsyncStorage for persistence
      await AsyncStorage.setItem('userId', userCredential.user.uid);
      return userCredential;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  /**
   * Check if user is already authenticated
   */
  async isAuthenticated() {
    const userId = await AsyncStorage.getItem('userId');
    return userId !== null;
  },
};

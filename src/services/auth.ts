import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, saveUserToStorage, clearUserFromStorage } from '../firebase';
import { googleAuthService } from './googleAuth';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  birthYear?: string;
  interests?: string[];
  profilePicture?: string;
  createdAt: Date;
}

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
      
      // Store the user data in AsyncStorage for persistence
      await saveUserToStorage(userCredential.user);
      
      // Create initial user profile
      const userProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        createdAt: new Date(),
      };
      
      // Store user profile in AsyncStorage temporarily
      await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
      
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
      // Store the user data in AsyncStorage for persistence
      await saveUserToStorage(userCredential.user);
      return userCredential;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  /**
   * Sign in with Google
   */
  async signInWithGoogle() {
    try {
      const result = await googleAuthService.signInWithGoogle();
      
      if (result.success && result.user) {
        // Store the user data in AsyncStorage
        await saveUserToStorage(result.user);
        
        // Create user profile from Google data and additional userInfo
        const userProfile: UserProfile = {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || (result.userInfo?.name || ''),
          profilePicture: result.user.photoURL || (result.userInfo?.picture || ''),
          createdAt: new Date(),
        };
        
        // Store user profile in AsyncStorage
        await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
        
        return { user: result.user };
      } else {
        throw new Error(result.error || 'Google sign-in failed');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  },

  /**
   * Sign out the current user
   */
  async signOut() {
    try {
      await firebaseSignOut(auth);
      // Clear stored user data
      await clearUserFromStorage();
      await AsyncStorage.removeItem('userProfile');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  /**
   * Check if user is already authenticated
   */
  async isAuthenticated() {
    try {
      const userId = await AsyncStorage.getItem('userId');
      return userId !== null && auth.currentUser !== null;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  /**
   * Get stored user profile
   */
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const profileData = await AsyncStorage.getItem('userProfile');
      return profileData ? JSON.parse(profileData) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  /**
   * Update user profile
   */
  async updateUserProfile(profile: Partial<UserProfile>) {
    try {
      const currentProfile = await this.getUserProfile();
      if (currentProfile) {
        const updatedProfile = { ...currentProfile, ...profile };
        await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        return updatedProfile;
      }
      throw new Error('No current profile found');
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  /**
   * Listen to authentication state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  /**
   * Get authentication error message
   */
  getAuthErrorMessage(error: any): string {
    if (error?.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          return 'No account found with this email address.';
        case 'auth/wrong-password':
          return 'Incorrect password. Please try again.';
        case 'auth/email-already-in-use':
          return 'An account with this email already exists.';
        case 'auth/weak-password':
          return 'Password should be at least 6 characters long.';
        case 'auth/invalid-email':
          return 'Please enter a valid email address.';
        case 'auth/network-request-failed':
          return 'Network error. Please check your connection.';
        default:
          return error.message || 'An error occurred during authentication.';
      }
    }
    return 'An unexpected error occurred.';
  },
};

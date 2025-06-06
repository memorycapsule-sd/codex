import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveUserToStorage, clearUserFromStorage } from '../firebase';
// Import from googleAuth is no longer needed as we'll use the native GoogleAuthProvider

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  birthYear?: string;
  interests?: string[];
  profilePicture?: string;
  createdAt: Date;
}

// Use FirebaseAuthTypes.User instead of User from firebase/auth

/**
 * Authentication service wrapping Firebase Auth.
 */
export const AuthService = {
  /**
   * Get the current auth instance
   */
  getAuth() {
    return auth();
  },

  /**
   * Create a new user with email and password.
   */
  async signUp(email: string, password: string) {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      
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
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
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
      // Get the Google provider
      const provider = auth.GoogleAuthProvider;
      const result = await auth().signInWithProvider(provider);
      
      if (result.user) {
        // Store the user data in AsyncStorage
        await saveUserToStorage(result.user);
        
        // Create user profile from Google data
        const userProfile: UserProfile = {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || '',
          profilePicture: result.user.photoURL || '',
          createdAt: new Date(),
        };
        
        // Store user profile in AsyncStorage
        await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
        
        return { user: result.user };
      } else {
        throw new Error('Google sign-in failed');
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
      await auth().signOut();
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
      return userId !== null && auth().currentUser !== null;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },

  /**
   * Get current user
   */
  getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
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
  onAuthStateChanged(callback: (user: FirebaseAuthTypes.User | null) => void) {
    return auth().onAuthStateChanged(callback);
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

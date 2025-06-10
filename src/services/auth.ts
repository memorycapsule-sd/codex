import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  auth, // Assuming this is the initialized Firebase Auth instance from ../firebase.ts
  saveUserToStorage,
  clearUserFromStorage,
} from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut, // Alias to avoid conflict if AuthService has a signOut method
  onAuthStateChanged as firebaseOnAuthStateChanged, // Alias
  GoogleAuthProvider,
  signInWithCredential,
  User, // This is the User type from firebase/auth
  AuthError
} from 'firebase/auth';

// UserProfile remains largely the same, stores additional app-specific user details
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  birthYear?: string;
  interests?: string[];
  profilePicture?: string;
  createdAt: Date;
}

// We now use User directly from 'firebase/auth'

/**
 * Authentication service wrapping Firebase Auth.
 */
export const AuthService = {
  // The initialized 'auth' instance is imported from '../firebase.ts' and used directly.
  // If a getter is strictly needed by other parts of the app, it can be:
  // getAuthInstance() {
  //   return auth;
  // },


  /**
   * Create a new user with email and password.
   */
  async signUp(email: string, password: string): Promise<User | null> {
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
      
      return userCredential.user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  /**
   * Sign in with email and password.
   */
  async signIn(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Store the user data in AsyncStorage for persistence
      await saveUserToStorage(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  /**
    } catch (error) {
      // This outer catch handles errors from Firebase credential/sign-in or rethrown Google errors
      console.error('Overall error in signInWithGoogle (Firebase stage or rethrown):', error);
      throw error; // Rethrow to be handled by UI and getAuthErrorMessage
    }
  },

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
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
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      // Generic error handling for updateUserProfile.
      // The error will be rethrown and can be handled by the caller,
      // potentially using getAuthErrorMessage if it's a Firebase Auth error from a related operation.
      throw error;
    }
  },

  /**
   * Listen to authentication state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void) {
    return firebaseOnAuthStateChanged(auth, callback);
  },

  /**
   * Get authentication error message
   */
  getAuthErrorMessage(error: any): string {
    // Check for Firebase AuthError by looking for a 'code' property starting with 'auth/'
    if (error && typeof error === 'object' && typeof error.code === 'string' && error.code.startsWith('auth/')) {
      const firebaseError = error as AuthError; // Safe to cast now for type-checking properties
      // Handle known Firebase Auth errors
      switch (firebaseError.code) {
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
        // Add other specific AuthError codes as needed
        default:
          return error.message || 'An authentication error occurred.';
      }
    } else if (error && typeof error.code === 'string') {
      // Handle other errors that might have a 'code' property (less common for client-side auth)
      // This switch is kept for compatibility if other error types with 'code' were expected.
      switch (error.code) {
        // Potentially map other error codes if necessary
        default:
          return error.message || `An error occurred (code: ${error.code}).`;
      }
    } else if (error && error.message) {
      return error.message;
    }
    // Fallback for any other type of error or if no specific message could be determined above

    return 'An unexpected error occurred.';
  } // End of getAuthErrorMessage

};

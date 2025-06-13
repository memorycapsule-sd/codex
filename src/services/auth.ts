import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  auth, // Assuming this is the initialized Firebase Auth instance from ../firebase.ts
  db, // Assuming this is the initialized Firestore instance from ../firebase.ts
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
  AuthError,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { UserProfile } from '../types/capsule'; // Import from the single source of truth

/**
 * Authentication service wrapping Firebase Auth and Firestore for user profiles.
 */
const AuthService = {
  /**
   * Create a new user with email and password.
   */
  async signUp(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store the user auth data in AsyncStorage for persistence
      await saveUserToStorage(user);

      // Create initial user profile in Firestore
      const userProfile: UserProfile = {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || 'New User',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        // Default values for new fields
        privacySetting: 'private',
        username: '', // Placeholder, will be set during profile setup
      };

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, userProfile);

      return user;
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
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      // Clear stored user data
      await clearUserFromStorage();
      // No need to remove a separate profile from AsyncStorage anymore
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  /**
   * Check if user is already authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const userId = await AsyncStorage.getItem('userId');
      return userId !== null && auth.currentUser !== null;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },

  /**
   * Get current user from Firebase Auth
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  /**
   * Get user profile from Firestore
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDocRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  /**
   * Update user profile in Firestore
   */
  async updateUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, {
        ...profile,
        updatedAt: Date.now(),
      });
    } catch (error: any) {
      console.error('Error updating user profile:', error);
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
    if (error && typeof error === 'object' && typeof error.code === 'string' && error.code.startsWith('auth/')) {
      const firebaseError = error as AuthError;
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
        default:
          return error.message || 'An authentication error occurred.';
      }
    } else if (error && error.message) {
      return error.message;
    }
    return 'An unexpected error occurred.';
  }
};

export default AuthService;
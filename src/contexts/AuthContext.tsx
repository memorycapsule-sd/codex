import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { AuthService } from '../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveUserToStorage, getUserFromStorage } from '../firebase';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshAuthState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Firebase on component mount
  useEffect(() => {
    console.log('AuthProvider mounted - setting up auth state listener');
    setIsLoading(true); // Set loading true on mount
    let isActive = true; // Flag to prevent state updates if component unmounted
    let unsubscribeFromAuth: (() => void) | undefined;

    const setupAuthListener = async () => {
      try {
        const unsubscribe = await checkAuthState(); // checkAuthState sets up onAuthStateChanged and returns its unsubscriber
        if (isActive) {
          if (typeof unsubscribe === 'function') {
            unsubscribeFromAuth = unsubscribe;
          }
        } else {
          // Component unmounted before setup completed, so unsubscribe immediately if we got one
          if (typeof unsubscribe === 'function') {
            console.log('AuthContext: Unsubscribing immediately as component unmounted during setup');
            unsubscribe();
          }
        }
      } catch (error) {
        if (isActive) {
          console.error('AuthContext: Error during auth setup:', error);
          // Ensure isLoading is false if an error occurs during setup
          setIsLoading(false);
        }
      }
    };

    setupAuthListener();

    return () => {
      isActive = false;
      if (unsubscribeFromAuth) {
        console.log('AuthContext: Unsubscribing from onAuthStateChanged listener');
        unsubscribeFromAuth();
      }
    };
  }, []);

  const checkAuthState = async () => {
    try {
      
      // First check AsyncStorage for existing user
      const storedUser = await getUserFromStorage();
      if (storedUser) {
        console.log('Found user in AsyncStorage:', storedUser.email);
      }
      
      // Listen for auth state changes using React Native Firebase
      const unsubscribe = auth().onAuthStateChanged((user) => {
        if (user) {
          console.log('Auth state changed - user signed in:', user.email);
          // Save user to AsyncStorage whenever auth state changes
          saveUserToStorage(user);
        } else {
          console.log('Auth state changed - user signed out');
        }
        setUser(user);
        if (isLoading) { // Only set isLoading false if it's the initial load
            setIsLoading(false);
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error checking auth state:', error);
      if (isLoading) { // Ensure isLoading is false if an error occurs during initial check
          setIsLoading(false);
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Signing in user:', email);
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      setUser(userCredential.user);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Creating new user account:', email);
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      setUser(userCredential.user);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      console.log('Signing in with Google');
      // Get the Google provider
      const { googleAuthConfig } = await import('../firebase');
      const provider = auth.GoogleAuthProvider;
      const googleCredential = await auth().signInWithProvider(provider);
      
      // The user is automatically set by the auth state listener,
      // no need to manually set it here
      console.log('Google sign-in successful');
    } catch (error) {
      console.error('Sign in with Google error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      console.log('Signing out user');
      await auth().signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuthState = async () => {
    console.log('Refreshing auth state');
    await checkAuthState();
  };

  const value = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    refreshAuthState,
  }), [user, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

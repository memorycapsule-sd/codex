import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { auth } from '../firebase';
import { AuthService } from '../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveUserToStorage, getUserFromStorage } from '../firebase';
import googleAuthService from '../services/googleAuth';

interface AuthContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Firebase on component mount
  useEffect(() => {
    console.log('AuthProvider mounted - setting up auth state listener');
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
      setIsLoading(true);
      
      // First check AsyncStorage for existing user
      const storedUser = await getUserFromStorage();
      if (storedUser) {
        console.log('Found user in AsyncStorage:', storedUser.email);
      }
      
      // Listen for auth state changes
      const unsubscribe = onAuthStateChanged(auth!, (currentUser) => {
        if (currentUser) {
          console.log('Auth state changed - user signed in:', currentUser.email);
          saveUserToStorage(currentUser);
        } else {
          console.log('Auth state changed - user signed out');
        }
        setUser(currentUser);
        setIsLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error checking auth state:', error);
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Signing in user:', email);
      const userCredential = await signInWithEmailAndPassword(auth!, email, password);
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
      const userCredential = await createUserWithEmailAndPassword(auth!, email, password);
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
      const result = await googleAuthService.signInWithGoogle();
      if (!result.success) {
        throw new Error(result.error || 'Google sign-in failed');
      }
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
      await firebaseSignOut(auth!);
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

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
// Removed: import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
// We will use AuthService for all auth operations and User type from 'firebase/auth' (via AuthService or direct import if needed)
import { User } from 'firebase/auth'; // Explicitly import User type for clarity
import AuthService from '../services/auth';
import { UserProfile } from '../types/capsule';
import { saveUserToStorage, getUserFromStorage } from '../firebase';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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
      
      // Listen for auth state changes using our AuthService
      const unsubscribe = AuthService.onAuthStateChanged(async (user: User | null) => {
        setUser(user);
        if (user) {
          console.log('Auth state changed - user signed in:', user.email);
          saveUserToStorage(user);
          const profile = await AuthService.getUserProfile(user.uid);
          setUserProfile(profile);
        } else {
          console.log('Auth state changed - user signed out');
          setUserProfile(null);
        }

        if (isLoading) {
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
      const firebaseUser = await AuthService.signIn(email, password);
      setUser(firebaseUser); // AuthService.signIn now returns User | null
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
      const firebaseUser = await AuthService.signUp(email, password);
      setUser(firebaseUser); // AuthService.signUp now returns User | null
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      console.log('Signing out user');
      await AuthService.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    if (user) {
      console.log('Refreshing user profile');
      const profile = await AuthService.getUserProfile(user.uid);
      setUserProfile(profile);
    }
  };

  const value = useMemo(() => {
    const isProfileComplete = !!(userProfile && typeof userProfile.birthday === 'number'); // Profile is complete if birthday is set
    return {
      user,
      userProfile,
      isLoading,
      isAuthenticated: !!user,
      isProfileComplete,
      signIn,
      signUp,
      signOut,
      refreshUserProfile,
    };
  }, [user, userProfile, isLoading]);

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

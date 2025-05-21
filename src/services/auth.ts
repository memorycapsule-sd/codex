import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { firebase } from '../../app/config/firebase';

/**
 * Simple authentication service wrapping Firebase Auth.
 */
export const AuthService = {
  /**
   * Create a new user with email and password.
   */
  async signUp(email: string, password: string) {
    const auth = getAuth(firebase);
    await createUserWithEmailAndPassword(auth, email, password);
  },

  /**
   * Sign in with email and password.
   */
  async signIn(email: string, password: string) {
    const auth = getAuth(firebase);
    await signInWithEmailAndPassword(auth, email, password);
  },
};

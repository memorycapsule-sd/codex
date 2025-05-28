import { getAuth } from 'firebase/auth';
import { firebase } from './firebase';

// Initialize Firebase Auth
// Note: We'll handle persistence manually using AsyncStorage in the AuthService
export const auth = getAuth(firebase);

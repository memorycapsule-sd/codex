import { getAuth } from 'firebase/auth';
import app from './firebase';

// Initialize Firebase Auth
// Note: We'll handle persistence manually using AsyncStorage in the AuthService
export const auth = getAuth(app);

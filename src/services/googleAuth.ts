import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../app/config/firebase';

// Complete the auth session for web
WebBrowser.maybeCompleteAuthSession();

interface GoogleAuthConfig {
  clientId: string;
  redirectUri: string;
}

interface GoogleAuthResult {
  success: boolean;
  user?: any;
  error?: string;
}

class GoogleAuthService {
  private config: GoogleAuthConfig;

  constructor() {
    // Get the Google Client ID from Firebase config or environment
    const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 
                    '660630380757-your-google-client-id.apps.googleusercontent.com';
    
    this.config = {
      clientId,
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'com.memorycapsule.app',
      }),
    };
  }

  /**
   * Initiate Google Sign-In flow
   */
  async signInWithGoogle(): Promise<GoogleAuthResult> {
    try {
      // Use the discovery document
      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
      };

      // Create the auth request
      const request = new AuthSession.AuthRequest({
        clientId: this.config.clientId,
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.Code,
        redirectUri: this.config.redirectUri,
        extraParams: {},
        state: Math.random().toString(36).substring(2, 15),
      });

      // Prompt for authentication
      const result = await request.promptAsync(discovery);

      if (result.type === 'success') {
        // Exchange the authorization code for tokens
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            clientId: this.config.clientId,
            code: result.params.code,
            extraParams: {
              code_verifier: request.codeVerifier || '',
            },
            redirectUri: this.config.redirectUri,
          },
          discovery
        );

        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${tokenResult.accessToken}` },
        });
        const userInfo = await userInfoResponse.json();

        // Create Firebase credential and sign in
        const credential = GoogleAuthProvider.credential(tokenResult.idToken);
        const firebaseResult = await signInWithCredential(auth, credential);

        return {
          success: true,
          user: {
            uid: firebaseResult.user.uid,
            email: firebaseResult.user.email,
            displayName: firebaseResult.user.displayName,
            photoURL: firebaseResult.user.photoURL,
            ...userInfo,
          },
        };
      } else if (result.type === 'cancel') {
        return {
          success: false,
          error: 'User cancelled the sign-in process',
        };
      } else {
        return {
          success: false,
          error: 'Authentication failed',
        };
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get the redirect URI for configuration
   */
  getRedirectUri(): string {
    return this.config.redirectUri;
  }

  /**
   * Check if Google Auth is properly configured
   */
  isConfigured(): boolean {
    return !!this.config.clientId && this.config.clientId !== '660630380757-your-google-client-id.apps.googleusercontent.com';
  }
}

export const googleAuthService = new GoogleAuthService();
export default googleAuthService;

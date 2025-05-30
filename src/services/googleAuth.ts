import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { GoogleAuthProvider, signInWithCredential, Auth, User, UserCredential } from 'firebase/auth';
import { auth } from '../firebase';

// Google Auth Configuration (from environment variables or defaults)
const googleAuthConfig = {
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '660630380757-your-google-client-id.apps.googleusercontent.com',
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '660630380757-your-google-client-id.apps.googleusercontent.com',
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '660630380757-your-google-client-id.apps.googleusercontent.com',
  redirectUri: process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI || 'https://memory-capsule-codex.firebaseapp.com/__/auth/handler'
};
import * as AuthSession from 'expo-auth-session';

// Configure WebBrowser for redirects
WebBrowser.maybeCompleteAuthSession();

// Google OAuth endpoints
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

interface GoogleAuthResult {
  success: boolean;
  user?: User;
  userInfo?: {
    email: string;
    name: string;
    picture: string;
    [key: string]: any;
  };
  error?: string;
}

class GoogleAuthService {
  // Get the appropriate client ID for the current platform
  private getClientId(): string {
    return Platform.select({
      web: googleAuthConfig.webClientId,
      ios: googleAuthConfig.iosClientId,
      android: googleAuthConfig.androidClientId,
    }) || googleAuthConfig.webClientId;
  }

  /**
   * Initiate Google Sign-In flow
   */
  async signInWithGoogle(): Promise<GoogleAuthResult> {
    try {
      console.log('Starting Google Sign-In process...');
      
      // Create a proper redirect URI
      const redirectUri = AuthSession.makeRedirectUri({
        // Use native URI scheme for deep linking
        // This needs to be registered in app.json
        scheme: 'exp'
      });
      
      console.log('Using redirect URI:', redirectUri);
      console.log('Using client ID:', this.getClientId());
      
      // Create the auth request
      const request = new AuthSession.AuthRequest({
        clientId: this.getClientId(),
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.Token,
        redirectUri,
      });
      
      // Prompt the user to authenticate
      console.log('Prompting for authentication...');
      const result = await request.promptAsync(discovery);
      console.log('Auth result type:', result.type);
      
      if (result.type === 'success') {
        console.log('Authentication successful, getting user info...');
        const { access_token, id_token } = result.params;
        
        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        const userInfo = await userInfoResponse.json();
        console.log('User info retrieved:', userInfo.email);
        
        // Create Firebase credential and sign in
        const credential = GoogleAuthProvider.credential(id_token);
        const firebaseResult = await signInWithCredential(auth as Auth, credential);
        
        return {
          success: true,
          user: firebaseResult.user,
          userInfo: userInfo, // Store Google user info separately
        };
      } else if (result.type === 'cancel') {
        console.log('User cancelled the sign-in process');
        return {
          success: false,
          error: 'User cancelled the sign-in process',
        };
      } else {
        console.error('Authentication failed:', result);
        return {
          success: false,
          error: 'Authentication failed: ' + JSON.stringify(result),
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
    return AuthSession.makeRedirectUri({
      scheme: 'exp'
    });
  }

  /**
   * Check if Google Auth is properly configured
   */
  isConfigured(): boolean {
    const clientId = this.getClientId();
    return !!clientId && clientId !== '660630380757-your-google-client-id.apps.googleusercontent.com';
  }
}

export const googleAuthService = new GoogleAuthService();
export default googleAuthService;

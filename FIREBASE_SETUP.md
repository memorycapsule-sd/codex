# Firebase Setup Guide for MemoryCapsule

## Prerequisites
- Google account
- Access to [Firebase Console](https://console.firebase.google.com/)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `memory-capsule` (or your preferred name)
4. Choose whether to enable Google Analytics (recommended)
5. Select or create a Google Analytics account
6. Click "Create project"

## Step 2: Configure Firebase for Web

1. In your Firebase project dashboard, click the web icon (`</>`) to add a web app
2. Register your app with a nickname like "MemoryCapsule Web"
3. **Don't check** "Also set up Firebase Hosting" (we're using Expo)
4. Click "Register app"
5. Copy the configuration object - you'll need these values for your `.env` file

## Step 3: Set up Authentication

1. In the Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable the following sign-in providers:
   - **Email/Password**: Click and toggle "Enable"
   - **Google**: Click, toggle "Enable", and add your project's support email
   - **Apple** (optional): For iOS users

## Step 4: Set up Firestore Database

1. Go to **Firestore Database** in the Firebase Console
2. Click "Create database"
3. Choose **"Start in test mode"** for now (we'll secure it later)
4. Select a location close to your users (e.g., `us-central1`)
5. Click "Done"

## Step 5: Set up Storage

1. Go to **Storage** in the Firebase Console
2. Click "Get started"
3. Choose **"Start in test mode"** for now
4. Select the same location as your Firestore database
5. Click "Done"

## Step 6: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and replace the placeholder values with your Firebase config:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_actual_app_id
   ```

## Step 7: Test the Setup

1. Restart your Expo development server:
   ```bash
   npx expo start --clear
   ```

2. Try creating an account and signing in through the app

## Security Rules (Production Setup)

### Firestore Security Rules
Replace the default rules in **Firestore Database** > **Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Capsules belong to authenticated users
    match /capsules/{capsuleId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Memories belong to authenticated users
    match /memories/{memoryId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### Storage Security Rules
Replace the default rules in **Storage** > **Rules**:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can only access their own files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Troubleshooting

### Common Issues:

1. **"Firebase not initialized" error**:
   - Check that all environment variables are set correctly
   - Restart the Expo development server

2. **Authentication not working**:
   - Verify that Email/Password is enabled in Firebase Console
   - Check that the auth domain is correct in your `.env` file

3. **Firestore permission denied**:
   - Make sure you're in "test mode" or have proper security rules
   - Verify the project ID is correct

4. **Storage upload fails**:
   - Check that Storage is enabled and in "test mode"
   - Verify the storage bucket name is correct

### Getting Help:
- Check the [Firebase Documentation](https://firebase.google.com/docs)
- Look at the browser console for detailed error messages
- Check the Expo logs for authentication issues

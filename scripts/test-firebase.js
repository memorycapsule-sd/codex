/**
 * Firebase Connection Test Script
 * Run this script to test your Firebase configuration
 * 
 * Usage: node scripts/test-firebase.js
 */

require('dotenv').config();

// Check if all required environment variables are set
const requiredEnvVars = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID'
];

console.log('🔥 Firebase Configuration Test\n');

// Check environment variables
console.log('📋 Checking environment variables...');
let missingVars = [];

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    missingVars.push(varName);
    console.log(`❌ ${varName}: Missing`);
  } else {
    console.log(`✅ ${varName}: Set (${value.substring(0, 10)}...)`);
  }
});

if (missingVars.length > 0) {
  console.log('\n❌ Missing environment variables:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n📝 Please check your .env file and ensure all variables are set.');
  console.log('💡 Refer to .env.example for the required format.');
  process.exit(1);
}

console.log('\n✅ All environment variables are set!');

// Test Firebase initialization (Node.js compatible)
try {
  const { initializeApp } = require('firebase/app');
  const { getAuth, connectAuthEmulator } = require('firebase/auth');
  const { getFirestore, connectFirestoreEmulator } = require('firebase/firestore');
  const { getStorage, connectStorageEmulator } = require('firebase/storage');

  const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  };

  console.log('\n🚀 Initializing Firebase...');
  const app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully!');

  console.log('\n🔐 Testing Firebase services...');
  
  // Test Auth
  try {
    const auth = getAuth(app);
    console.log('✅ Firebase Auth initialized');
  } catch (error) {
    console.log('❌ Firebase Auth failed:', error.message);
  }

  // Test Firestore
  try {
    const db = getFirestore(app);
    console.log('✅ Firestore initialized');
  } catch (error) {
    console.log('❌ Firestore failed:', error.message);
  }

  // Test Storage
  try {
    const storage = getStorage(app);
    console.log('✅ Firebase Storage initialized');
  } catch (error) {
    console.log('❌ Firebase Storage failed:', error.message);
  }

  console.log('\n🎉 Firebase configuration test completed successfully!');
  console.log('\n📱 You can now test the app with:');
  console.log('   npx expo start');

} catch (error) {
  console.log('\n❌ Firebase initialization failed:');
  console.log('   Error:', error.message);
  console.log('\n💡 Common solutions:');
  console.log('   1. Check that your Firebase project exists');
  console.log('   2. Verify all configuration values are correct');
  console.log('   3. Ensure your Firebase project has the required services enabled');
  process.exit(1);
}

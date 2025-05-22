import { initializeApp } from 'firebase/app';

// Hybrid configuration that works in both OpenAI Codex and Windsurf environments
const firebaseConfig = {
  // Use environment variables if available, otherwise fall back to direct values
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyADZA_39LvezewktuxCUJuEAYbiCEFwzM8",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "memory-capsule-codex.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "memory-capsule-codex",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "memory-capsule-codex.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "660630380757",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:660630380757:web:4280b1fbf1243ca0dc425c",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-CY6S95F9EN"
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);

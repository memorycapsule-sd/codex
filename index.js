/**
 * Memory Capsule entry point
 * Ensure Firebase is initialized before the main application
 * before any React components try to use it.
 */

// First, import Firebase initialization
// This must happen before any other imports to prevent "Component auth has not been registered yet" errors
import './firebase';

// Now import app components after Firebase is initialized
import { registerRootComponent } from 'expo';
import App from './App';

// Standard Expo app registration - this is all we need
// When using Expo, registerRootComponent is the preferred method
registerRootComponent(App);

// NOTE: We don't need AppRegistry.registerComponent for Expo apps
// The duplicate registration might be causing the "App entry not found" error

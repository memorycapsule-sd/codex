/**
 * Metro configuration for Memory Capsule
 * This configuration addresses the Firebase Auth "Component auth has not been registered yet" error
 */

const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const defaultConfig = getDefaultConfig(__dirname);
  
  // Add cjs to source extensions for better module resolution
  defaultConfig.resolver.sourceExts.push('cjs');
  
  // This is the critical fix for Firebase Auth registration issues
  // It disables the Node.js package exports resolution that can cause problems with Firebase
  defaultConfig.resolver.unstable_enablePackageExports = false;
  
  return defaultConfig;
})();

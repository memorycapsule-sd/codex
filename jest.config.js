module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],

  // Allow Babel to transpile ESM code inside selected node_modules
  transformIgnorePatterns: [
    'node_modules/(?!(?:' +
      'expo' + // core expo/*
      '|expo-status-bar' + // other Expo ESM libs
      '|react-native' +
      '|@react-native' +
      '|@react-navigation' +
      '|firebase' + // firebase (un-scoped)
      '|@firebase' + // ← NEW: scoped @firebase/*
      ')/)',
  ],
  testPathIgnorePatterns: ['<rootDir>/e2e/'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/features/onboarding',
    '<rootDir>/src/services',
    '<rootDir>/src/features/capsules/CapsuleScreen.tsx',
    '<rootDir>/src/features/capsules/DashboardScreen.tsx',
  ],
};

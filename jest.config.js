module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],

  transformIgnorePatterns: [
    'node_modules/(?!(expo|react-native'
      + '|@react-native'
      + '|@react-navigation'
      + '|firebase'            // ← transform any firebase/* package
      + ')/)',
  ],
};


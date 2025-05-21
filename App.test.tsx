import { render } from '@testing-library/react-native';

jest.mock('./src/config/firebase', () => ({
  auth: {},
  db: {},
  storage: {},
  default: {},
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ canceled: true })),
  launchCameraAsync: jest.fn(() => Promise.resolve({ canceled: true })),
  MediaTypeOptions: {},
}), { virtual: true });

jest.mock('expo-av', () => ({
  Audio: {
    requestPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
    Recording: {
      createAsync: jest.fn(() => Promise.resolve({ recording: { stopAndUnloadAsync: jest.fn(), getURI: () => '' } })),
      OptionsPresets: { HIGH_QUALITY: {} },
    },
  },
}), { virtual: true });

import App from './App';

it('renders the root component without crashing', () => {
  render(<App />);
});

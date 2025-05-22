import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';
import App from './App';

// Register the app with both Expo and React Native methods
registerRootComponent(App);

// Also register with AppRegistry as a fallback
AppRegistry.registerComponent('main', () => App);

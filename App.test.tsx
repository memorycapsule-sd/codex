import { render } from '@testing-library/react-native';
import App from './App';
jest.mock('@react-native-async-storage/async-storage', () => ({}));

it('renders the root component without crashing', () => {
  render(<App />);
});

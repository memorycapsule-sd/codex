import { render } from '@testing-library/react-native';
import App from './App';

it('renders the root component without crashing', () => {
  render(<App />);
});

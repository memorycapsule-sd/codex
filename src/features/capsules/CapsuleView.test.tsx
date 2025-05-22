import React from 'react';
import { render } from '@testing-library/react-native';
import CapsuleView from './CapsuleView';
import { NavigationContainer } from '@react-navigation/native';

it('renders capsule ID in read-only view', () => {
  const component = (
    <NavigationContainer>
      <CapsuleView
        route={{ key: '1', name: 'CapsuleView', params: { id: '123' } }}
        navigation={undefined as any}
      />
    </NavigationContainer>
  );
  const { getByText } = render(component);
  expect(getByText('Shared Capsule 123')).toBeTruthy();
});

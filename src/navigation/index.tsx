import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../features/onboarding/OnboardingScreen';
import DashboardScreen from '../features/capsules/DashboardScreen';
import CapsuleScreen from '../features/capsules/CapsuleScreen';

export type RootStackParamList = {
  Onboarding: undefined;
  Dashboard: undefined;
  Capsule: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Capsule" component={CapsuleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

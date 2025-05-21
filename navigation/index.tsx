import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../src/features/onboarding/WelcomeScreen';
import SignUpScreen from '../src/features/onboarding/SignUpScreen';
import SignInScreen from '../src/features/onboarding/SignInScreen';
import DashboardScreen from '../src/features/capsules/DashboardScreen';
import CapsuleScreen from '../src/features/capsules/CapsuleScreen';

export type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  SignIn: undefined;
  Dashboard: undefined;
  Capsule: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Capsule" component={CapsuleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

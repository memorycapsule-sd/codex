import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../src/features/onboarding/WelcomeScreen';
import SignUpScreen from '../src/features/onboarding/SignUpScreen';
import SignInScreen from '../src/features/onboarding/SignInScreen';
import { TabNavigator } from '../src/navigation/TabNavigator';
import CapsuleView from '../src/features/capsules/CapsuleView';

export type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  SignIn: undefined;
  Main: undefined; 
  CapsuleView: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['memorycapsule://'],
    config: {
      screens: {
        CapsuleView: 'capsule/:id',
        Main: {
          path: 'main',
          screens: {
            Home: 'home',
            Timeline: 'timeline',
            Create: 'create',
            Capsules: 'capsules',
            Settings: 'settings',
          },
        },
      },
    },
  };
  
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen 
          name="CapsuleView" 
          component={CapsuleView}
          options={{ 
            headerShown: true,
            title: 'Capsule Details',
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

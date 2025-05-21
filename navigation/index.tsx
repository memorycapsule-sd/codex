import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../src/features/onboarding/WelcomeScreen';
import SignUpScreen from '../src/features/onboarding/SignUpScreen';
import SignInScreen from '../src/features/onboarding/SignInScreen';
import CapsuleListScreen from '../src/features/capsules/CapsuleListScreen';
import CapsuleDetailScreen from '../src/features/capsules/CapsuleDetailScreen';
import PromptPickerScreen from '../src/features/capsules/PromptPickerScreen';
import ResponseRecorderScreen from '../src/features/capsules/ResponseRecorderScreen';

export type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  SignIn: undefined;
  Capsules: undefined;
};

export type CapsulesStackParamList = {
  CapsuleList: undefined;
  CapsuleDetail: { capsuleId: string };
  PromptPicker: { capsuleId: string };
  ResponseRecorder: { capsuleId: string; promptId: string };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const CapsulesStack = createNativeStackNavigator<CapsulesStackParamList>();

function CapsulesStackScreen() {
  return (
    <CapsulesStack.Navigator>
      <CapsulesStack.Screen name="CapsuleList" component={CapsuleListScreen} />
      <CapsulesStack.Screen name="CapsuleDetail" component={CapsuleDetailScreen} />
      <CapsulesStack.Screen name="PromptPicker" component={PromptPickerScreen} />
      <CapsulesStack.Screen name="ResponseRecorder" component={ResponseRecorderScreen} />
    </CapsulesStack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Welcome" component={WelcomeScreen} />
        <RootStack.Screen name="SignUp" component={SignUpScreen} />
        <RootStack.Screen name="SignIn" component={SignInScreen} />
        <RootStack.Screen
          name="Capsules"
          component={CapsulesStackScreen}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

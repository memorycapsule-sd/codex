import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import CapsulesScreen from '../screens/CapsulesScreen';
import CapsuleDetailScreen from '../screens/CapsuleDetailScreen';
import PromptResponseScreen from '../screens/PromptResponseScreen';

// Define the types for the stack navigator
export type CapsulesStackParamList = {
  CapsulesList: undefined;
  CapsuleDetail: {
    capsuleId: string;
    title: string;
  };
  PromptResponse: {
    promptId: string;
    promptText: string;
    capsuleTitle: string;
  };
};

const Stack = createNativeStackNavigator<CapsulesStackParamList>();

/**
 * Stack navigator for the Capsules tab
 * Includes the list of capsules, capsule detail, and prompt response screens
 */
export function CapsulesNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="CapsulesList"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="CapsulesList" component={CapsulesScreen} />
      <Stack.Screen name="CapsuleDetail" component={CapsuleDetailScreen} />
      <Stack.Screen name="PromptResponse" component={PromptResponseScreen} />
    </Stack.Navigator>
  );
}

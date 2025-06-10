import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import CapsulesScreen from '../screens/CapsulesScreen';
import CapsuleDetailScreen from '../screens/CapsuleDetailScreen';
import PromptResponseScreen from '../screens/PromptResponseScreen';
import CapsuleViewingScreen from '../screens/CapsuleViewingScreen'; // Added import

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
    capsuleId: string; // Added to identify the capsule
  };
  CapsuleViewingScreen: {
    capsuleResponse: import('../types/capsule').CapsuleResponse; // Added screen params
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
      <Stack.Screen name="CapsuleViewingScreen" component={CapsuleViewingScreen} />
    </Stack.Navigator>
  );
}

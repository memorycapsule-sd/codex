import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import CapsulesScreen from '../screens/CapsulesScreen';
import MacroCapsulePromptsScreen from '../screens/MacroCapsulePromptsScreen';
import PromptResponseScreen from '../screens/PromptResponseScreen';
import CapsuleDetailScreen from '../screens/CapsuleDetailScreen';
import MediaMetadataScreen from '../screens/MediaMetadataScreen';
import EditCapsuleScreen from '../screens/EditCapsuleScreen';
import AddEntryScreen from '../screens/AddEntryScreen';

// Define the types for the stack navigator
export type CapsulesStackParamList = {
  CapsulesList: undefined;
  AddEntry: {
    capsuleId: string;
    capsuleTitle: string;
    promptText: string;
  };
  PromptResponse: {
    capsuleId: string;
    promptId: string;
    promptText: string;
    capsuleTitle: string;
  };
  CapsuleDetail: {
    capsuleId: string;
    title: string;
  };
  CapsuleDetailScreen: {
    capsuleId: string;
  };
  MediaMetadataScreen: {
    entry: import('../types/capsule').CapsuleEntry;
    capsule: import('../types/capsule').CapsuleResponse;
    isEditing?: boolean;
  };
  EditCapsule: {
    capsuleId: string;
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
      <Stack.Screen name="CapsuleDetail" component={MacroCapsulePromptsScreen} />
      <Stack.Screen name="PromptResponse" component={PromptResponseScreen} />
      <Stack.Screen name="CapsuleDetailScreen" component={CapsuleDetailScreen} />
      <Stack.Screen name="MediaMetadataScreen" component={MediaMetadataScreen} />
      <Stack.Screen name="AddEntry" component={AddEntryScreen} />
      <Stack.Screen name="EditCapsule" component={EditCapsuleScreen} />
    </Stack.Navigator>
  );
}

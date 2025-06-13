import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // TEMPORARY: Not needed for bypass

// Auth Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';

// Main App
import { TabNavigator } from './TabNavigator';
import { useAuth } from '../contexts/AuthContext';

export type AuthStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  SignIn: undefined;
  ProfileSetup: undefined;
};

export type AppStackParamList = {
  Main: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="Main" component={TabNavigator} />
    </AppStack.Navigator>
  );
}

export default function AuthNavigationWrapper() {
  const { user, isLoading, isProfileComplete } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#42275a" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#666666', fontFamily: 'Inter_400Regular' }}>
          Loading...
        </Text>
      </View>
    );
  }

  if (!user) {
    return <AuthNavigator />;
  }

  if (!isProfileComplete) {
    return (
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      </AuthStack.Navigator>
    );
  }

  return <AppNavigator />;
}

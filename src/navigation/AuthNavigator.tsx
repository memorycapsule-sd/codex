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
  const { user, isLoading } = useAuth();
  
  // TEMPORARY BYPASS: Skip profile completion check
  // const [hasCompletedProfile, setHasCompletedProfile] = useState<boolean | null>(null);
  // const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  // Check if user has completed profile setup
  // useEffect(() => {
  //   checkProfileCompletion();
  // }, [user]);

  // const checkProfileCompletion = async () => {
  //   if (!user) {
  //     setIsCheckingProfile(false);
  //     return;
  //   }

  //   try {
  //     const profileData = await AsyncStorage.getItem('userProfile');
  //     if (profileData) {
  //       const profile = JSON.parse(profileData);
  //       // Check if profile has required fields (displayName and interests)
  //       const isComplete = profile.displayName && profile.interests && profile.interests.length > 0;
  //       setHasCompletedProfile(isComplete);
  //     } else {
  //       setHasCompletedProfile(false);
  //     }
  //   } catch (error) {
  //     console.error('Error checking profile completion:', error);
  //     setHasCompletedProfile(false);
  //   } finally {
  //     setIsCheckingProfile(false);
  //   }
  // };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#ffffff'
      }}>
        <ActivityIndicator size="large" color="#42275a" />
        <Text style={{ 
          marginTop: 16, 
          fontSize: 16, 
          color: '#666666',
          fontFamily: 'Inter_400Regular'
        }}>
          Loading...
        </Text>
      </View>
    );
  }

  // If user is not authenticated, show auth flow
  if (!user) {
    return <AuthNavigator />;
  }

  // TEMPORARY BYPASS: Skip profile setup and go directly to main app
  // If user is authenticated but hasn't completed profile, show profile setup
  // if (user && hasCompletedProfile === false) {
  //   return (
  //     <AuthStack.Navigator screenOptions={{ headerShown: false }}>
  //       <AuthStack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
  //     </AuthStack.Navigator>
  //   );
  // }

  // If user is authenticated, show main app directly (bypassing profile setup)
  return <AppNavigator />;
}

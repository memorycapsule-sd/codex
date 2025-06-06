/**
 * Memory Capsule App Entry Point
 */

// Import Firebase services from our firebase.js file
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { app as firebaseApp, auth as firebaseAuth } from './src/firebase';

// React and React Native imports
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, SafeAreaView, ScrollView, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Camera, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';

// App imports
import { AuthProvider } from './src/contexts/AuthContext';
import AuthNavigationWrapper from './src/navigation/AuthNavigator';
// We'll add the others back gradually

export default function App() {

  // Define proper types for our initialization state
  type InitStatus = 'pending' | 'success' | 'error';
  interface InitState {
    firebase: {
      status: 'pending' | 'success' | 'error';
      error: string | null;
    };
    camera: {
      status: 'pending' | 'success' | 'error';
      error: string | null;
    };
    auth: {
      status: 'pending' | 'success' | 'error';
      error: string | null;
    };
  };
  
  const [initializationSteps, setInitializationSteps] = useState<InitState>({
    firebase: { status: 'pending', error: null },
    camera: { status: 'pending', error: null },
    auth: { status: 'pending', error: null },
  });
  
  // Firebase Auth is already initialized in our firebase.ts module

  // Initialize Firebase on app startup
  useEffect(() => {
    try {
      // Log to confirm Firebase is initialized
      console.log('Firebase initialized with app:', firebaseApp.name);
      
      setInitializationSteps(prev => ({
        ...prev,
        firebase: { status: 'success', error: null }
      }));
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      setInitializationSteps(prev => ({
        ...prev,
        firebase: { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' }
      }));
    }
  }, []);
  
  // Setup auth persistence after Firebase is initialized
  useEffect(() => {
    if (initializationSteps.firebase.status === 'success') {
      try {
        // Firebase now handles persistence automatically, just verify it's working
        const auth: FirebaseAuthTypes.Module = firebaseAuth; // Native Firebase Auth instance
        if (auth) {
          // Mark auth as initialized immediately since Firebase already set it up
          setInitializationSteps(prev => ({
            ...prev,
            auth: { status: 'success', error: null }
          }));
          
          // No need for cleanup as Firebase manages the auth state listener
        } else {
          throw new Error('Firebase Auth not available from Firebase');
        }
      } catch (error) {
        console.error('Error verifying auth setup:', error);
        setInitializationSteps(prev => ({
          ...prev,
          auth: { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' }
        }));
      }
    }
  }, [initializationSteps.firebase.status]);
  
  // Get camera and microphone permissions with hooks
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  
  // Check and request camera permissions
  useEffect(() => {
    (async () => {
      try {
        // Request camera and microphone permissions if not already granted
        if (!cameraPermission?.granted) {
          await requestCameraPermission();
        }
        
        if (!microphonePermission?.granted) {
          await requestMicrophonePermission();
        }
        
        // Check if permissions are now granted
        if (cameraPermission?.granted && microphonePermission?.granted) {
          setInitializationSteps(prev => ({
            ...prev,
            camera: { status: 'success', error: null }
          }));
        } else {
          setInitializationSteps(prev => ({
            ...prev,
            camera: { 
              status: 'error', 
              error: 'Camera or microphone permission denied'
            }
          }));
        }
      } catch (error) {
        console.error('Error checking camera permissions:', error);
        setInitializationSteps(prev => ({
          ...prev,
          camera: { 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Unknown error' 
          }
        }));
      }
    })();
  }, [cameraPermission, microphonePermission, requestCameraPermission, requestMicrophonePermission]);

  // Show diagnostic screen if there are errors, otherwise show main app
  const hasErrors = (
    initializationSteps.firebase.status === 'error' ||
    initializationSteps.camera.status === 'error'
  );
  
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  
  // If in diagnostic mode, show the diagnostic screen
  if (showDiagnostics) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
            Memory Capsule App - Initialization Status
          </Text>

          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              Firebase Initialization
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {initializationSteps.firebase.status === 'pending' && (
                <ActivityIndicator size="small" color="#42275a" style={{ marginRight: 10 }} />
              )}
              {initializationSteps.firebase.status === 'success' && (
                <Text style={{ color: 'green', marginRight: 10 }}>✓</Text>
              )}
              {initializationSteps.firebase.status === 'error' && (
                <Text style={{ color: 'red', marginRight: 10 }}>✗</Text>
              )}
              <Text>
                Status: {initializationSteps.firebase.status.toUpperCase()}
                {initializationSteps.firebase.error && (
                  <Text style={{ color: 'red' }}> - {initializationSteps.firebase.error}</Text>
                )}
              </Text>
            </View>
          </View>
          
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              Camera Initialization
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {initializationSteps.camera.status === 'pending' && (
                <ActivityIndicator size="small" color="#42275a" style={{ marginRight: 10 }} />
              )}
              {initializationSteps.camera.status === 'success' && (
                <Text style={{ color: 'green', marginRight: 10 }}>✓</Text>
              )}
              {initializationSteps.camera.status === 'error' && (
                <Text style={{ color: 'red', marginRight: 10 }}>✗</Text>
              )}
              <Text>
                Status: {initializationSteps.camera.status.toUpperCase()}
                {initializationSteps.camera.error && (
                  <Text style={{ color: 'red' }}> - {initializationSteps.camera.error}</Text>
                )}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={{
              backgroundColor: '#42275a',
              padding: 15,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 20,
            }}
            onPress={() => setShowDiagnostics(false)}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Continue to App
            </Text>
          </TouchableOpacity>
          
          <StatusBar style="auto" />
        </ScrollView>
      </SafeAreaView>
    );
  }
  
  // Main app with diagnostic button in dev mode
  return (
    <AuthProvider>
      <NavigationContainer>
        {__DEV__ && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              backgroundColor: 'rgba(66, 39, 90, 0.8)',
              padding: 10,
              borderRadius: 30,
              zIndex: 999,
            }}
            onPress={() => setShowDiagnostics(true)}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>Diagnostics</Text>
          </TouchableOpacity>
        )}
        <AuthNavigationWrapper />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AuthProvider>
  );
}

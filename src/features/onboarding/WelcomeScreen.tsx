import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation';

/**
 * First screen shown to the user. Offers sign up or sign in options.
 */
export default function WelcomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Welcome'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Capsule</Text>
      <View style={styles.buttons}>
        <View style={styles.buttonWrapper}>
          <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Sign In" onPress={() => navigation.navigate('SignIn')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 24 },
  buttons: { width: '60%' },
  buttonWrapper: { marginBottom: 12 },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation';
import { spacing } from '../../theme';

/**
 * Read-only view for shared capsules.
 */
export default function CapsuleView({ route }: NativeStackScreenProps<RootStackParamList, 'CapsuleView'>) {
  const { id } = route.params;

  // TODO: fetch capsule details from Firestore and check privacy settings

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shared Capsule {id}</Text>
      <Text>This capsule is view-only.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  title: { fontSize: 20, marginBottom: spacing.md },
});

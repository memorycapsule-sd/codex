import React from 'react';
import { View, Text, Button, StyleSheet, useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation';
import { spacing } from '../../theme';
import { generateCapsuleShareLink } from './shareLink';

export default function CapsuleScreen({ route }: NativeStackScreenProps<RootStackParamList, 'Capsule'>) {
  const { id } = route.params;
  const { width } = useWindowDimensions();

  const containerStyle = width >= 1024 ? styles.webContainer : width >= 768 ? styles.tabletContainer : styles.mobileContainer;

  return (
    <View style={containerStyle}>
      <Text style={styles.title}>Capsule {id}</Text>
      <Button title="Record Response" onPress={() => { /* TODO: implement */ }} />
      <View style={styles.shareButton}>
        <Button
          title="Share Capsule"
          onPress={() => {
            const link = generateCapsuleShareLink(id);
            console.log('Share link:', link);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mobileContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.md },
  tabletContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  webContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg * 2 },
  title: { marginBottom: spacing.md },
  shareButton: { marginTop: spacing.md },
});

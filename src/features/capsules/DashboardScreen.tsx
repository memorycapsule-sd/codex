import React from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation';
import { spacing } from '../../theme';
import { generateCapsuleShareLink } from './shareLink';

interface Capsule {
  id: string;
  title: string;
  privacy: 'private' | 'unlisted' | 'public';
}

const sampleCapsules: Capsule[] = [
  { id: '1', title: 'My Childhood', privacy: 'private' },
  { id: '2', title: 'College Years', privacy: 'unlisted' },
];

export default function DashboardScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Dashboard'>) {
  const renderItem = ({ item }: { item: Capsule }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Capsule', { id: item.id })}
    >
      <Text>{item.title}</Text>
      {item.privacy !== 'private' && (
        <Button
          title="Share"
          onPress={() => {
            const link = generateCapsuleShareLink(item.id);
            console.log('Share link:', link);
          }}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList data={sampleCapsules} keyExtractor={(item) => item.id} renderItem={renderItem} />
      <Button title="Create New Capsule" onPress={() => { /* TODO: implement */ }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md },
  item: { padding: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});

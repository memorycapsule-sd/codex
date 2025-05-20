import React from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

interface Capsule {
  id: string;
  title: string;
}

const sampleCapsules: Capsule[] = [
  { id: '1', title: 'My Childhood' },
  { id: '2', title: 'College Years' },
];

export default function DashboardScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Dashboard'>) {
  const renderItem = ({ item }: { item: Capsule }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Capsule', { id: item.id })}>
      <Text style={{ padding: 16 }}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList data={sampleCapsules} keyExtractor={(item) => item.id} renderItem={renderItem} />
      <Button title="Create New Capsule" onPress={() => { /* TODO: implement */ }} />
    </View>
  );
}

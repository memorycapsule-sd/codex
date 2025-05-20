import React from 'react';
import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

export default function CapsuleScreen({ route }: NativeStackScreenProps<RootStackParamList, 'Capsule'>) {
  const { id } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Capsule {id}</Text>
      <Button title="Record Response" onPress={() => { /* TODO: implement */ }} />
    </View>
  );
}

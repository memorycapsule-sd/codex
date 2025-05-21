import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CapsulesStackParamList } from '../../../navigation';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { CapsulesService, Capsule } from '../../services/capsules';

export default function CapsuleListScreen({ navigation }: NativeStackScreenProps<CapsulesStackParamList, 'CapsuleList'>) {
  const [capsules, setCapsules] = useState<Capsule[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'capsules'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) =>
      setCapsules(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Capsule) })))
    );
    return unsub;
  }, []);

  const createCapsule = async () => {
    try {
      await CapsulesService.create({ title: 'New Capsule' });
    } catch (err) {
      Alert.alert('Error', 'Could not create capsule');
    }
  };

  const deleteCapsule = async (id: string) => {
    try {
      await CapsulesService.remove(id);
    } catch (err) {
      Alert.alert('Error', 'Could not delete capsule');
    }
  };

  const renderItem = ({ item }: { item: Capsule }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('CapsuleDetail', { capsuleId: item.id })}
      onLongPress={() => deleteCapsule(item.id)}
    >
      <Text>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList data={capsules} keyExtractor={(item) => item.id} renderItem={renderItem} />
      <View style={styles.fab}>
        <Button title="+" onPress={createCapsule} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: { padding: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  fab: { position: 'absolute', bottom: 16, right: 16 },
});

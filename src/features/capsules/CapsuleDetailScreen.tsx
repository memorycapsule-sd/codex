import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CapsulesStackParamList } from '../../../navigation';
import { onSnapshot, doc, collection, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Capsule } from '../../services/capsules';

interface ResponseDoc {
  id: string;
  promptId: string;
  mediaURL: string;
  mediaType: string;
}

export default function CapsuleDetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<CapsulesStackParamList, 'CapsuleDetail'>) {
  const { capsuleId } = route.params;
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [responses, setResponses] = useState<ResponseDoc[]>([]);

  useEffect(() => {
    const unsubCapsule = onSnapshot(doc(db, 'capsules', capsuleId), (snap) =>
      setCapsule({ id: snap.id, ...(snap.data() as Capsule) })
    );
    const q = query(collection(db, 'responses'), where('capsuleId', '==', capsuleId));
    const unsubResp = onSnapshot(q, (snap) =>
      setResponses(snap.docs.map((d) => ({ id: d.id, ...(d.data() as ResponseDoc) })))
    );
    return () => {
      unsubCapsule();
      unsubResp();
    };
  }, [capsuleId]);

  const renderItem = ({ item }: { item: ResponseDoc }) => (
    <View style={styles.item}>
      <Text>{item.promptId}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{capsule?.title}</Text>
      <FlatList data={responses} keyExtractor={(r) => r.id} renderItem={renderItem} />
      <Button title="Add response" onPress={() => navigation.navigate('PromptPicker', { capsuleId })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, marginBottom: 16 },
  item: { paddingVertical: 8 },
});

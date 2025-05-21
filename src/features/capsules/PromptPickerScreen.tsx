import React from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CapsulesStackParamList } from '../../../navigation';

const PROMPTS = [
  {
    title: 'Childhood',
    data: [
      { id: 'c1', text: 'What is your earliest memory?' },
      { id: 'c2', text: 'Describe your childhood home.' },
    ],
  },
  {
    title: 'Career',
    data: [
      { id: 'ca1', text: 'How did you choose your profession?' },
      { id: 'ca2', text: 'What was your first job?' },
    ],
  },
];

export default function PromptPickerScreen({ navigation, route }: NativeStackScreenProps<CapsulesStackParamList, 'PromptPicker'>) {
  const { capsuleId } = route.params;
  const renderItem = ({ item }: { item: { id: string; text: string } }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ResponseRecorder', { capsuleId, promptId: item.id })}>
      <Text>{item.text}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <SectionList
        sections={PROMPTS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => <Text style={styles.section}>{title}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { padding: 8, fontWeight: 'bold' },
  item: { padding: 12, borderBottomWidth: StyleSheet.hairlineWidth },
});

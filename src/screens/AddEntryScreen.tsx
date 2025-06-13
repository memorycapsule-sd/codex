import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { CapsulesStackParamList } from '../navigation/CapsulesNavigator';

// Define the route prop type for this screen
type AddEntryScreenRouteProp = RouteProp<CapsulesStackParamList, 'AddEntry'>;

export default function AddEntryScreen() {
  const route = useRoute<AddEntryScreenRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<CapsulesStackParamList>>();

  const { capsuleId, capsuleTitle, promptText } = route.params;

  const handleAddEntry = (type: 'text' | 'photo' | 'video' | 'audio') => {
    // For now, only text is implemented
    if (type === 'text') {
      navigation.navigate('PromptResponse', { 
        capsuleId,
        promptId: 'prompt-id-placeholder',
        promptText,
        capsuleTitle,
      });
    } else {
      alert(`'${type}' feature coming soon!`);
    }
  };

  const handleFinish = () => {
    navigation.navigate('CapsuleDetail', { capsuleId, title: capsuleTitle });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{capsuleTitle}</Text>
        <Text style={styles.subtitle}>Add memories to your capsule. What would you like to add?</Text>
        
        <View style={styles.buttonGrid}>
          <TouchableOpacity style={styles.button} onPress={() => handleAddEntry('text')}>
            <Ionicons name="text" size={32} color={theme.colors.primary} />
            <Text style={styles.buttonText}>Add Journal Entry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleAddEntry('photo')}>
            <Ionicons name="camera" size={32} color={theme.colors.primary} />
            <Text style={styles.buttonText}>Add Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleAddEntry('video')}>
            <Ionicons name="videocam" size={32} color={theme.colors.primary} />
            <Text style={styles.buttonText}>Add Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleAddEntry('audio')}>
            <Ionicons name="mic" size={32} color={theme.colors.primary} />
            <Text style={styles.buttonText}>Add Audio</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishButtonText}>Done - View Capsule</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.light,
  },
  container: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.size['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.size.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  button: {
    width: '48%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
    minHeight: 140,
  },
  buttonText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  finishButton: {
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  finishButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

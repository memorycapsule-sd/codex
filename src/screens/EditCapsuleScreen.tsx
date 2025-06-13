import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CapsulesStackParamList } from '../navigation/CapsulesNavigator';
import * as CapsuleService from '../services/capsuleService';
import { CapsuleResponse } from '../types/capsule';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

type EditCapsuleScreenRouteProp = RouteProp<CapsulesStackParamList, 'EditCapsuleScreen'>;
type EditCapsuleScreenNavigationProp = NativeStackNavigationProp<CapsulesStackParamList, 'EditCapsuleScreen'>;

const EditCapsuleScreen: React.FC = () => {
  const route = useRoute<EditCapsuleScreenRouteProp>();
  const navigation = useNavigation<EditCapsuleScreenNavigationProp>();
  const { capsuleId } = route.params;

  const [capsule, setCapsule] = useState<CapsuleResponse | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCapsule = async () => {
      try {
        const fetchedCapsule = await CapsuleService.getCapsuleResponseById(capsuleId);
        if (fetchedCapsule) {
          setCapsule(fetchedCapsule);
          setTitle(fetchedCapsule.capsuleTitle || '');
          setCategory(fetchedCapsule.category || '');
        } else {
          Alert.alert('Error', 'Capsule not found.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load capsule details.');
      } finally {
        setLoading(false);
      }
    };
    fetchCapsule();
  }, [capsuleId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Edit Capsule',
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: -10 }}>
          <Ionicons name="chevron-back" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleSaveChanges = async () => {
    if (!capsule) return;
    setSaving(true);
    try {
      const updatedData = {
        capsuleTitle: title,
        category: category,
      };
      await CapsuleService.updateCapsule(capsule.id, updatedData);
      Alert.alert('Success', 'Capsule updated successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" color={theme.colors.primary} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Capsule Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter capsule title"
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="Enter category (e.g., Travel, Family)"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges} disabled={saving}>
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  label: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    marginBottom: theme.spacing.lg,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

export default EditCapsuleScreen;

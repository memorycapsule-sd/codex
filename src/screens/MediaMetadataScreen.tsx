import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { CapsulesStackParamList } from '../navigation/CapsulesNavigator';
import { theme } from '../theme';
import { CapsuleEntry, CapsuleResponse, MediaMetadata } from '../types/capsule';
import * as capsuleService from '../services/capsuleService';
import { useAuth } from '../contexts/AuthContext';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type MediaMetadataScreenRouteProp = RouteProp<CapsulesStackParamList, 'MediaMetadataScreen'>;

export default function MediaMetadataScreen() {
  const navigation = useNavigation();
  const route = useRoute<MediaMetadataScreenRouteProp>();
  const { user } = useAuth();

  const { entry, capsule, isEditing } = route.params;

  // State for the main text content of a journal entry
  const [textContent, setTextContent] = useState(entry.textContent || '');

  // Placeholder states for metadata fields - replace with actual data from entry.metadata
  const [description, setDescription] = useState(entry.metadata?.userDescription || '');
  const [dateTaken, setDateTaken] = useState<Date | undefined>(
    entry.metadata?.dateTaken ? new Date(entry.metadata.dateTaken) : undefined
  );
  // For now, location is a simple string. We will improve this later.
  const [location, setLocation] = useState(entry.metadata?.location ? `${entry.metadata.location.latitude}, ${entry.metadata.location.longitude}` : '');
  const [people, setPeople] = useState<string[]>(entry.metadata?.people || []);
  const [newPerson, setNewPerson] = useState('');
  const [tags, setTags] = useState<string[]>(entry.metadata?.tags || []);
  const [newTag, setNewTag] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleSaveChanges = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to save changes.');
      return;
    }

    // Basic validation for location string
    const locationParts = location.split(',').map(part => part.trim());
    const parsedLocation = locationParts.length === 2 && !isNaN(parseFloat(locationParts[0])) && !isNaN(parseFloat(locationParts[1]))
      ? { latitude: parseFloat(locationParts[0]), longitude: parseFloat(locationParts[1]) }
      : undefined;

    const updatedMetadata: MediaMetadata = { ...entry.metadata };

    updatedMetadata.userDescription = entry.type === 'text' ? textContent : description;
    updatedMetadata.people = people;
    updatedMetadata.tags = tags;

    if (dateTaken) {
      updatedMetadata.dateTaken = dateTaken.getTime();
    }

    if (parsedLocation) {
      updatedMetadata.location = parsedLocation;
    } else {
      delete updatedMetadata.location;
    }

    const updatedEntryData: Partial<CapsuleEntry> = {
      metadata: updatedMetadata,
    };

    if (entry.type === 'text') {
      updatedEntryData.textContent = textContent;
    }

    try {
      const success = await capsuleService.updateCapsuleEntry(user.uid, capsule.id, entry.id, updatedEntryData);
      if (success) {
        Alert.alert('Saved', 'Media details have been updated.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to save changes. Please try again.');
      }
    } catch (error) {
      console.error('Failed to save media metadata:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const handleAddPerson = () => {
    if (newPerson.trim() !== '' && !people.includes(newPerson.trim())) {
      setPeople([...people, newPerson.trim()]);
      setNewPerson('');
    }
  };

  const handleRemovePerson = (indexToRemove: number) => {
    setPeople(people.filter((_, index) => index !== indexToRemove));
  };

  const handleAddTag = () => {
    if (newTag.trim() !== '' && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date: Date) => {
    setDateTaken(date);
    hideDatePicker();
  };

  const renderMediaPreview = () => {
    if (!entry) return null;
    switch (entry.type) {
      case 'photo':
        return <Image source={{ uri: entry.mediaUri }} style={styles.mediaPreviewImage} resizeMode="cover" />;
      case 'video':
        // Placeholder for video preview
        return <View style={styles.mediaPreviewGeneric}><Ionicons name="videocam-outline" size={50} color={theme.colors.primary} /><Text>Video Preview</Text></View>;
      case 'audio':
        // Placeholder for audio preview
        return <View style={styles.mediaPreviewGeneric}><Ionicons name="mic-outline" size={50} color={theme.colors.primary} /><Text>Audio Preview</Text></View>;
      default:
        return <View style={styles.mediaPreviewGeneric}><Text>No Preview Available</Text></View>;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Media Preview Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Media Preview</Text>
        {renderMediaPreview()}
      </View>

      {/* Capsule Context Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Capsule Context</Text>
        <View style={styles.contextRow}>
          <Text style={styles.contextLabel}>Capsule:</Text>
          <Text style={styles.contextValue}>{capsule?.capsuleTitle || 'N/A'}</Text>
        </View>
        <View style={styles.contextRow}>
          <Text style={styles.contextLabel}>Category:</Text>
          <Text style={styles.contextValue}>{capsule?.category || 'N/A'}</Text>
        </View>
      </View>

      {/* Metadata Fields Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Details</Text>

        {/* Date Taken */}
        <Text style={styles.inputLabel}>Date Taken</Text>
        <TouchableOpacity style={styles.dateInputButton} onPress={showDatePicker}>
          <Text style={styles.dateInputText}>{dateTaken ? dateTaken.toLocaleDateString() : 'Select Date'}</Text>
          <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>

        {/* Description */}
        <Text style={styles.inputLabel}>{entry.type === 'text' ? 'Journal Entry' : 'Description'}</Text>
        <TextInput
          style={styles.textInputLarge}
          value={entry.type === 'text' ? textContent : description}
          onChangeText={entry.type === 'text' ? setTextContent : setDescription}
          placeholder={
            entry.type === 'text'
              ? 'Your journal entry...'
              : 'Add a description for your media...'
          }
          multiline
          editable={isEditing || entry.type !== 'text'}
        />

        {/* Location */}
        <Text style={styles.inputLabel}>Location</Text>
        <TextInput
          style={styles.textInput}
          value={location}
          onChangeText={setLocation}
          placeholder="e.g., Paris, France or manually enter"
        />

        {/* People Chip Input */}
        <Text style={styles.inputLabel}>People</Text>
        <View style={styles.chipContainer}>
          {people.map((person, index) => (
            <View key={index} style={styles.chip}>
              <Text style={styles.chipText}>{person}</Text>
              <TouchableOpacity onPress={() => handleRemovePerson(index)}>
                <Ionicons name="close-circle" size={20} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.chipInput}
            value={newPerson}
            onChangeText={setNewPerson}
            placeholder="Add a person..."
            onSubmitEditing={handleAddPerson} // Add on enter press
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddPerson}>
            <Ionicons name="add" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        {/* Tags Chip Input */}
        <Text style={styles.inputLabel}>Tags</Text>
        <View style={styles.chipContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.chip}>
              <Text style={styles.chipText}>{tag}</Text>
              <TouchableOpacity onPress={() => handleRemoveTag(index)}>
                <Ionicons name="close-circle" size={20} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.chipInput}
            value={newTag}
            onChangeText={setNewTag}
            placeholder="Add a tag..."
            onSubmitEditing={handleAddTag} // Add on enter press
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddTag}>
            <Ionicons name="add" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
          <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        date={dateTaken || new Date()} // Default to today if no date is set
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  sectionCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.md,
  },
  mediaPreviewPlaceholder: {
    height: 200,
    backgroundColor: theme.colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  mediaPreviewImage: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  mediaPreviewGeneric: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  contextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  contextLabel: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.gray[600],
  },
  contextValue: {
    fontSize: theme.typography.size.base,
    color: theme.colors.dark,
    fontWeight: theme.typography.fontWeight.normal,
  },
  inputLabel: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.dark,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  textInput: {
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.size.base,
    color: theme.colors.dark,
    marginBottom: theme.spacing.sm,
  },
  textInputLarge: {
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.size.base,
    color: theme.colors.dark,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: theme.spacing.sm,
  },
  dateInputButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  dateInputText: {
    fontSize: theme.typography.size.base,
    color: theme.colors.dark,
  },
  actionsContainer: {
    marginTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl, // Ensure space from bottom
  },
  button: {
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  saveButton: {
    backgroundColor: theme.colors.primary, // Or your gradient
    ...theme.shadows.sm,
  },
  cancelButton: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
  },
  buttonText: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.white,
  },
  cancelButtonText: {
    color: theme.colors.dark,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  chipText: {
    color: theme.colors.white,
    marginRight: theme.spacing.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  chipInput: {
    flex: 1,
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.size.base,
    color: theme.colors.dark,
    marginRight: theme.spacing.sm,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

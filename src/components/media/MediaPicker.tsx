import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MediaService, MediaFile } from '../../services/media';
import { theme } from '../../theme';

interface MediaPickerProps {
  onMediaSelected: (mediaFile: MediaFile) => void;
  mediaType?: 'image' | 'video' | 'audio' | 'all';
  maxFileSize?: number; // in MB
  style?: any;
}

const { width } = Dimensions.get('window');

export function MediaPicker({
  onMediaSelected,
  mediaType = 'all',
  maxFileSize = 50,
  style,
}: MediaPickerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMediaSelection = async (type: 'camera-photo' | 'camera-video' | 'gallery' | 'audio') => {
    try {
      setIsLoading(true);
      setIsModalVisible(false);
      
      let mediaFile: MediaFile | null = null;

      switch (type) {
        case 'camera-photo':
          mediaFile = await MediaService.takePhoto();
          break;
        case 'camera-video':
          mediaFile = await MediaService.recordVideo();
          break;
        case 'gallery':
          mediaFile = await MediaService.pickImage();
          break;
        case 'audio':
          // For audio, we'll handle recording separately
          Alert.alert('Audio Recording', 'Audio recording will be handled in the recording component');
          return;
      }

      if (mediaFile) {
        // Check file size
        const fileSizeMB = mediaFile.size / (1024 * 1024);
        if (fileSizeMB > maxFileSize) {
          Alert.alert(
            'File Too Large',
            `The selected file is ${MediaService.formatFileSize(mediaFile.size)}. Maximum allowed size is ${maxFileSize}MB.`
          );
          return;
        }

        onMediaSelected(mediaFile);
      }
    } catch (error) {
      console.error('Error selecting media:', error);
      Alert.alert('Error', 'Failed to select media. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableOptions = () => {
    const options = [];

    if (mediaType === 'image' || mediaType === 'all') {
      options.push(
        {
          id: 'camera-photo',
          title: 'Take Photo',
          icon: 'camera' as const,
          color: theme.colors.primary,
        },
        {
          id: 'gallery',
          title: 'Choose from Gallery',
          icon: 'images' as const,
          color: theme.colors.secondary,
        }
      );
    }

    if (mediaType === 'video' || mediaType === 'all') {
      options.push({
        id: 'camera-video',
        title: 'Record Video',
        icon: 'videocam' as const,
        color: theme.colors.accent,
      });
    }

    if (mediaType === 'audio' || mediaType === 'all') {
      options.push({
        id: 'audio',
        title: 'Record Audio',
        icon: 'mic' as const,
        color: theme.colors.primary,
      });
    }

    return options;
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setIsModalVisible(true)}
        disabled={isLoading}
      >
        <Ionicons
          name="add-circle-outline"
          size={24}
          color={theme.colors.primary}
        />
        <Text style={styles.pickerButtonText}>
          {isLoading ? 'Processing...' : 'Add Media'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Media</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsContainer}>
              {getAvailableOptions().map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionButton}
                  onPress={() => handleMediaSelection(option.id as any)}
                >
                  <View style={[styles.optionIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                    <Ionicons
                      name={option.icon}
                      size={28}
                      color={theme.colors.primary}
                    />
                  </View>
                  <Text style={styles.optionText}>{option.title}</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.colors.text.secondary}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.sm,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary + '10',
  },
  pickerButtonText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.size.lg,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadius['2xl'],
    borderTopRightRadius: theme.borderRadius['2xl'],
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  optionButton: {
    flex: 1,
    minWidth: '45%',
    aspectRatio: 1,
    backgroundColor: theme.colors.light,
    borderRadius: theme.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  optionText: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  cancelButton: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.border.light,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

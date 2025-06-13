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
import { VideoRecorder } from './VideoRecorder';
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
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);

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
          // Show the custom video recorder
          setShowVideoRecorder(true);
          setIsLoading(false);
          return;
        case 'gallery':
          mediaFile = await MediaService.pickImage();
          break;
        case 'audio':
          // For audio, we'll handle recording separately
          Alert.alert('Audio Recording', 'Audio recording will be handled in the recording component');
          return;
      }

      if (mediaFile) {
        // Check file size if available
        if (typeof mediaFile.size === 'number') {
          const fileSizeMB = mediaFile.size / (1024 * 1024);
          if (fileSizeMB > maxFileSize) {
            Alert.alert(
              'File Too Large',
              `The selected file is ${MediaService.formatFileSize(mediaFile.size)}. Maximum allowed size is ${maxFileSize}MB.`
            );
            return;
          }
        } else {
          // Optional: Log or handle cases where size is not available
          console.warn(`Media file size for ${mediaFile.uri} is undefined. Skipping size check.`);
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

  const handleVideoRecorded = (mediaFile: MediaFile) => {
    setShowVideoRecorder(false);
    onMediaSelected(mediaFile);
  };

  const handleVideoRecorderCancel = () => {
    setShowVideoRecorder(false);
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
          description: 'Capture a photo with your camera',
        },
        {
          id: 'gallery',
          title: 'Choose from Gallery',
          icon: 'images' as const,
          color: theme.colors.secondary,
          description: 'Select an existing photo',
        }
      );
    }

    if (mediaType === 'video' || mediaType === 'all') {
      options.push({
        id: 'camera-video',
        title: 'Record Video',
        icon: 'videocam' as const,
        color: theme.colors.accent,
        description: 'Record a video response',
      });
    }

    if (mediaType === 'audio' || mediaType === 'all') {
      options.push({
        id: 'audio',
        title: 'Record Audio',
        icon: 'mic' as const,
        color: theme.colors.primary,
        description: 'Record an audio response',
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
                  <View style={[styles.optionIcon, { backgroundColor: option.color + '20' }]}>
                    <Ionicons
                      name={option.icon}
                      size={28}
                      color={option.color}
                    />
                  </View>
                  <Text style={styles.optionText}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
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

      {/* Video Recorder Modal */}
      <Modal
        visible={showVideoRecorder}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <VideoRecorder
          onVideoRecorded={handleVideoRecorded}
          onCancel={handleVideoRecorderCancel}
          maxDuration={300} // 5 minutes
        />
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
    borderRadius: theme.borderRadius.xl,
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
    gap: theme.spacing.md,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  optionText: {
    flex: 1,
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  optionDescription: {
    flex: 1,
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.md,
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

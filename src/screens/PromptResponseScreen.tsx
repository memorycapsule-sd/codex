import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CapsulesStackParamList } from '../navigation/CapsulesNavigator'; // Import the param list type
import { Ionicons } from '@expo/vector-icons';
import * as CapsuleService from '../services/capsuleService';
import { MediaPicker } from '../components/media/MediaPicker';
import { MediaPreview } from '../components/media/MediaPreview';
import { AudioRecorder } from '../components/media/AudioRecorder';
import { MediaFile } from '../services/media';
import { CapsuleResponse, CapsuleEntry, MediaMetadata } from '../types/capsule';
import { theme } from '../theme';
import { generateUUID } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';
import { MediaService, MediaFile as LocalMediaFile } from '../services/media'; // Added MediaService import

// Define the route params type
type PromptResponseRouteParams = {
  PromptResponse: {
    capsuleId: string; // Added
    promptId: string;
    promptText: string;
    capsuleTitle: string;
  };
};

type MediaType = 'text' | 'audio' | 'video' | 'photo' | null;

/**
 * Screen for responding to a capsule prompt with different media types
 */
const PromptResponseScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<CapsulesStackParamList, 'PromptResponse'>>();
  const route = useRoute<RouteProp<PromptResponseRouteParams, 'PromptResponse'>>();
  const { capsuleId, promptId, promptText, capsuleTitle } = route.params; // Added capsuleId
  const { user } = useAuth();
  
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType>(null);
  const [textResponse, setTextResponse] = useState('');
  const [mediaFile, setMediaFile] = useState<MediaFile | null>(null);
  const [isRecording, setIsRecording] = useState(false); // This state might become unused after removing from AudioRecorder props
  const [isSaving, setIsSaving] = useState(false);
  
  const handleMediaSelect = (type: MediaType) => {
    setSelectedMediaType(type);
    
    // Reset previous responses when changing media type
    if (type === 'text') {
      setMediaFile(null);
    } else {
      setTextResponse('');
    }
  };
  
  const handleMediaCaptured = (capturedMediaFile: MediaFile) => {
    setMediaFile(capturedMediaFile);
    setSelectedMediaType(capturedMediaFile.type === 'image' ? 'photo' : capturedMediaFile.type);
  };
  
  const handleAudioRecordingComplete = async (mediaFile: MediaFile) => {
    if (mediaFile && mediaFile.uri) {
      // Ensure mediaFile has an id, if AudioRecorder doesn't provide it
      const ensuredMediaFile = {
        ...mediaFile,
        id: mediaFile.id || generateUUID(), // Ensure ID exists
      };
      setMediaFile(ensuredMediaFile);
      setSelectedMediaType('audio');
    } else if (mediaFile) {
      // Handle case where mediaFile is provided but URI might be missing (e.g. error state)
      // For now, just log it or decide on a specific error handling strategy
      console.warn('Audio recording complete but URI is missing:', mediaFile);
      // Potentially set an error state or a default media file indicating an issue
      const errorMediaFile: MediaFile = {
        id: mediaFile.id || generateUUID(),
        type: 'audio',
        filename: 'error_recording.m4a',
        // uri: undefined, // Explicitly
      }
      setMediaFile(errorMediaFile);
      setSelectedMediaType('audio');
    } else {
      setMediaFile(null);
    }
  };

  const handleAudioCancel = () => {
    setSelectedMediaType(null); // Go back to media type selection
    setMediaFile(null);
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
  };

  const handleRetakeMedia = () => {
    setMediaFile(null);
  };
  
  const handleSaveResponse = async () => {
    console.log('[PromptResponseScreen] Attempting to save response...');
    try {
      setIsSaving(true);
      console.log('[PromptResponseScreen] isSaving set to true.');

      if (!user) {
        console.error('User not authenticated, cannot save response.');
        Alert.alert('Error', 'User not authenticated. Please log in.');
        setIsSaving(false);
        return;
      }

      // Validate selectedMediaType and content
      if (!selectedMediaType) {
        Alert.alert('Input Error', 'Please select a response type (text, photo, etc.).');
        setIsSaving(false);
        return;
      }
      if (selectedMediaType === 'text' && !textResponse.trim()) {
        Alert.alert('Input Error', 'Please enter some text for your response.');
        setIsSaving(false);
        return;
      }
      if (selectedMediaType !== 'text' && !mediaFile) {
        Alert.alert('Input Error', `Please select a ${selectedMediaType} file.`);
        setIsSaving(false);
        return;
      }

      const nowTimestamp = Date.now();
      let entryTypeForCapsule: CapsuleEntry['type'];
      let actualTextContent: string | undefined = undefined;
      let finalMediaUri: string | undefined = undefined;
      let finalThumbnailUri: string | undefined = undefined;
      let originalFilename: string | undefined = undefined;
      let dateTakenForMetadata: number = nowTimestamp; // Default to now

      if (selectedMediaType === 'text') {
        entryTypeForCapsule = 'text';
        actualTextContent = textResponse.trim();
      } else if (mediaFile && mediaFile.uri) { // Photo, Video, or Audio
        // Determine CapsuleEntry type ('photo', 'video', 'audio')
        if (selectedMediaType === 'photo') entryTypeForCapsule = 'photo'; // selectedMediaType is 'photo'
        else if (selectedMediaType === 'video') entryTypeForCapsule = 'video';
        else if (selectedMediaType === 'audio') entryTypeForCapsule = 'audio';
        else {
          // Should not happen if validation above is correct
          console.error('Invalid media type combination');
          Alert.alert('Error', 'Invalid media type.');
          setIsSaving(false);
          return;
        }

        finalMediaUri = mediaFile.uri; // Start with local URI
        finalThumbnailUri = mediaFile.type === 'video' ? (mediaFile as any).thumbnailUri : undefined;
        originalFilename = mediaFile.filename;
        // dateTakenForMetadata could be extracted from mediaFile if available, e.g., mediaFile.dateTaken (if we add it to LocalMediaFile)

        // Upload to Firebase Storage
        console.log(`[PromptResponseScreen] Attempting to upload ${mediaFile.type}: ${mediaFile.filename}`);
        try {
          const uploadableMediaFile: LocalMediaFile = {
            id: mediaFile.id || generateUUID(),
            type: mediaFile.type as 'image' | 'video' | 'audio', // mediaFile.type is 'image', 'video', or 'audio'
            uri: mediaFile.uri,
            filename: mediaFile.filename,
          };
          const downloadURL = await MediaService.uploadMediaFile(uploadableMediaFile, user.uid);
          finalMediaUri = downloadURL; // Update with cloud storage URL
          console.log(`[PromptResponseScreen] Media uploaded successfully. Download URL: ${downloadURL}`);
        } catch (uploadError) {
          console.error('[PromptResponseScreen] Error uploading media file:', uploadError);
          Alert.alert('Upload Error', 'Failed to upload media. Please try again.');
          setIsSaving(false);
          return;
        }
      } else {
        // This case should be caught by earlier validation
        console.error('Inconsistent state: No text and no valid mediaFile for non-text type.');
        Alert.alert('Error', 'Something went wrong. Please try again.');
        setIsSaving(false);
        return;
      }

      // Prepare MediaMetadata
      const newEntryMetadata: MediaMetadata = {
        uploadedAt: nowTimestamp,
        userDescription: textResponse || '', // User's text input serves as description here
        dateTaken: dateTakenForMetadata, 
      };
      if (originalFilename) {
        newEntryMetadata.filename = originalFilename;
      }

      // Construct the new entry
      const newEntry: CapsuleEntry = {
        id: generateUUID(),
        type: entryTypeForCapsule,
        ...(actualTextContent && { textContent: actualTextContent }),
        ...(finalMediaUri && { mediaUri: finalMediaUri }),
        ...(finalThumbnailUri && { thumbnailUri: finalThumbnailUri }),
        metadata: newEntryMetadata,
        createdAt: nowTimestamp,
        updatedAt: nowTimestamp,
      };

      const newCapsuleResponseData: CapsuleResponse = {
        id: capsuleId,
        userId: user.uid,
        promptId: promptId,
        capsuleTitle: capsuleTitle,
        entries: [newEntry],
        createdAt: nowTimestamp,
        updatedAt: nowTimestamp,
      };

      console.log('[PromptResponseScreen] Calling CapsuleService.addCapsuleResponse with data:', JSON.stringify(newCapsuleResponseData, null, 2));
      const saveSuccess = await CapsuleService.addCapsuleResponse(
      user.uid,
      newCapsuleResponseData.promptId,
      newCapsuleResponseData.capsuleTitle,
      newCapsuleResponseData.entries[0], // Assuming there's always at least one entry
      newCapsuleResponseData.tags,       // Pass tags if available
      newCapsuleResponseData.category    // Pass category if available
    );

      if (saveSuccess) {
        console.log('[PromptResponseScreen] CapsuleService.addCapsuleResponse successful. Capsule data:', JSON.stringify(newCapsuleResponseData, null, 2));
        navigation.navigate('CapsulesList', undefined);
      } else {
        console.error('[PromptResponseScreen] CapsuleService.addCapsuleResponse returned false.');
        Alert.alert('Save Error', 'Failed to save capsule. Please try again.');
      }
    } catch (error) {
      console.error('[PromptResponseScreen] Error in handleSaveResponse catch block:', error);
      // Optionally, show an alert to the user here
    } finally {
      console.log('[PromptResponseScreen] Entering finally block, setting isSaving to false.');
      setIsSaving(false);
    }
  };
  
  const renderMediaSelector = () => {
    return (
      <View style={styles.mediaSelectorContainer}>
        <Text style={styles.mediaSelectorTitle}>Choose how you want to respond:</Text>
        
        <View style={styles.mediaTypeButtons}>
          <TouchableOpacity 
            style={[
              styles.mediaTypeButton,
              selectedMediaType === 'text' && styles.mediaTypeButtonSelected
            ]}
            onPress={() => handleMediaSelect('text')}
          >
            <Ionicons 
              name="document-text-outline" 
              size={24} 
              color={selectedMediaType === 'text' ? theme.colors.primary : theme.colors.text.secondary} 
            />
            <Text 
              style={[
                styles.mediaTypeText,
                selectedMediaType === 'text' && styles.mediaTypeTextSelected
              ]}
            >
              Text
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.mediaTypeButton,
              selectedMediaType === 'audio' && styles.mediaTypeButtonSelected
            ]}
            onPress={() => handleMediaSelect('audio')}
          >
            <Ionicons 
              name="mic-outline" 
              size={24} 
              color={selectedMediaType === 'audio' ? theme.colors.primary : theme.colors.text.secondary} 
            />
            <Text 
              style={[
                styles.mediaTypeText,
                selectedMediaType === 'audio' && styles.mediaTypeTextSelected
              ]}
            >
              Audio
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.mediaTypeButton,
              selectedMediaType === 'photo' && styles.mediaTypeButtonSelected
            ]}
            onPress={() => handleMediaSelect('photo')}
          >
            <Ionicons 
              name="camera-outline" 
              size={24} 
              color={selectedMediaType === 'photo' ? theme.colors.primary : theme.colors.text.secondary} 
            />
            <Text 
              style={[
                styles.mediaTypeText,
                selectedMediaType === 'photo' && styles.mediaTypeTextSelected
              ]}
            >
              Photo
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.mediaTypeButton,
              selectedMediaType === 'video' && styles.mediaTypeButtonSelected
            ]}
            onPress={() => handleMediaSelect('video')}
          >
            <Ionicons 
              name="videocam-outline" 
              size={24} 
              color={selectedMediaType === 'video' ? theme.colors.primary : theme.colors.text.secondary} 
            />
            <Text 
              style={[
                styles.mediaTypeText,
                selectedMediaType === 'video' && styles.mediaTypeTextSelected
              ]}
            >
              Video
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const renderTextResponse = () => {
    if (selectedMediaType !== 'text') return null;
    
    return (
      <View style={styles.textResponseContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type your response here..."
          placeholderTextColor={theme.colors.text.secondary}
          multiline
          textAlignVertical="top"
          value={textResponse}
          onChangeText={setTextResponse}
        />
      </View>
    );
  };
  
  const renderAudioResponse = () => {
    if (selectedMediaType !== 'audio') return null;
    
    return (
      <View style={styles.audioResponseContainer}>
        {mediaFile ? (
          <View style={styles.audioPreviewContainer}>
            <MediaPreview 
              mediaFile={mediaFile}
              onRemove={handleRemoveMedia}
              showControls={true}
            />
            <TouchableOpacity 
              style={styles.retakeButton}
              onPress={handleRetakeMedia}
            >
              <Ionicons name="refresh-outline" size={16} color={theme.colors.text.primary} />
              <Text style={styles.retakeButtonText}>Record Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <AudioRecorder
            onRecordingComplete={handleAudioRecordingComplete}
            onCancel={handleAudioCancel}
            maxDuration={300} // 5 minutes
          />
        )}
      </View>
    );
  };
  
  const renderPhotoVideoResponse = () => {
    if (selectedMediaType !== 'photo' && selectedMediaType !== 'video') return null;
    
    return (
      <View style={styles.mediaResponseContainer}>
        {mediaFile ? (
          <View style={styles.mediaPreviewContainer}>
            <MediaPreview 
              mediaFile={mediaFile}
              onRemove={handleRemoveMedia}
              showControls={true}
            />
            <TouchableOpacity 
              style={styles.retakeButton}
              onPress={handleRetakeMedia}
            >
              <Ionicons name="refresh-outline" size={16} color={theme.colors.text.primary} />
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <MediaPicker
            onMediaSelected={handleMediaCaptured}
            mediaType={selectedMediaType === 'photo' ? 'image' : 'video'}
            maxFileSize={100} // 100MB limit for videos
          />
        )}
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>{capsuleTitle}</Text>
          
          <TouchableOpacity 
            style={[
              styles.saveButton,
              (!selectedMediaType || 
                (selectedMediaType === 'text' && !textResponse.trim()) ||
                (selectedMediaType !== 'text' && !mediaFile)) && styles.saveButtonDisabled
            ]}
            onPress={handleSaveResponse}
            disabled={
              !selectedMediaType || 
              (selectedMediaType === 'text' && !textResponse.trim()) ||
              (selectedMediaType !== 'text' && !mediaFile) ||
              isSaving
            }
          >
            <Text style={[
              styles.saveButtonText,
              (!selectedMediaType || 
                (selectedMediaType === 'text' && !textResponse.trim()) ||
                (selectedMediaType !== 'text' && !mediaFile)) && styles.saveButtonTextDisabled
            ]}>
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.promptContainer}>
            <Text style={styles.promptText}>{promptText}</Text>
          </View>
          
          {renderMediaSelector()}
          {renderTextResponse()}
          {renderAudioResponse()}
          {renderPhotoVideoResponse()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.typography.size.xl,
    color: theme.colors.text.primary,
    textAlign: 'center',
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.spacing.sm,
  },
  saveButtonDisabled: {
    backgroundColor: theme.colors.gray[300],
  },
  saveButtonText: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.inverse,
  },
  saveButtonTextDisabled: {
    color: theme.colors.gray[600],
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: theme.spacing.lg,
  },
  promptContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  promptText: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  mediaSelectorContainer: {
    marginBottom: theme.spacing.xl,
  },
  mediaSelectorTitle: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  mediaTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mediaTypeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    width: '22%',
    ...theme.shadows.sm,
  },
  mediaTypeButtonSelected: {
    backgroundColor: `${theme.colors.primary}15`, // 15% opacity
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  mediaTypeText: {
    fontSize: theme.typography.size.base,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  mediaTypeTextSelected: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  textResponseContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  textInput: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border.medium, // Changed from .main
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.size.base,
    color: theme.colors.text.primary,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  audioResponseContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  audioPreviewContainer: {
    marginBottom: theme.spacing.md,
  },
  mediaResponseContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  mediaPreviewContainer: {
    marginBottom: theme.spacing.md,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.gray[200],
    borderRadius: theme.spacing.sm,
    marginTop: theme.spacing.md,
    alignSelf: 'center',
  },
  retakeButtonText: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
  },
});

export default PromptResponseScreen;

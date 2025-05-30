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
  StatusBar
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CapsuleService } from '../services/capsuleService';
import { MediaPicker } from '../components/media/MediaPicker';
import { MediaPreview } from '../components/media/MediaPreview';
import { AudioRecorder } from '../components/media/AudioRecorder';
import { MediaFile } from '../services/media';
import { theme } from '../theme';

// Define the route params type
type PromptResponseRouteParams = {
  PromptResponse: {
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
  const navigation = useNavigation();
  const route = useRoute<RouteProp<PromptResponseRouteParams, 'PromptResponse'>>();
  const { promptId, promptText, capsuleTitle } = route.params;
  
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType>(null);
  const [textResponse, setTextResponse] = useState('');
  const [mediaFile, setMediaFile] = useState<MediaFile | null>(null);
  const [isRecording, setIsRecording] = useState(false);
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
  
  const handleAudioRecorded = (uri: string) => {
    // Create a MediaFile object for audio
    const audioFile: MediaFile = {
      id: Date.now().toString(),
      type: 'audio',
      uri,
      filename: `audio_${Date.now()}.m4a`,
      size: 0,
      mimeType: 'audio/m4a',
    };
    setMediaFile(audioFile);
    setSelectedMediaType('audio');
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
  };

  const handleRetakeMedia = () => {
    setMediaFile(null);
  };
  
  const handleSaveResponse = async () => {
    try {
      setIsSaving(true);
      
      // Validate that we have a response
      if (
        (selectedMediaType === 'text' && !textResponse.trim()) ||
        (selectedMediaType !== 'text' && !mediaFile)
      ) {
        // Show error or alert that response is empty
        return;
      }
      
      // Prepare response content based on type
      const content = selectedMediaType === 'text' ? textResponse : mediaFile?.uri || '';
      
      // Save the response
      const success = await CapsuleService.saveResponse(promptId, {
        type: selectedMediaType as 'text' | 'audio' | 'video' | 'photo',
        content,
        mediaFile: selectedMediaType !== 'text' ? mediaFile : undefined
      });
      
      if (success) {
        // Navigate back to capsule detail
        navigation.goBack();
      } else {
        // Handle error
        console.error('Failed to save response');
      }
    } catch (error) {
      console.error('Error saving response:', error);
    } finally {
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
            onRecordingComplete={handleAudioRecorded}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            maxDuration={180} // 3 minutes
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
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    textAlign: 'center',
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  saveButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.sm,
  },
  saveButtonDisabled: {
    backgroundColor: theme.colors.gray[300],
  },
  saveButtonText: {
    ...theme.typography.button,
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
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  mediaSelectorContainer: {
    marginBottom: theme.spacing.xl,
  },
  mediaSelectorTitle: {
    ...theme.typography.subtitle,
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
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  mediaTypeTextSelected: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight[600] as any,
  },
  textResponseContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  textInput: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    height: 200,
    textAlignVertical: 'top',
    padding: theme.spacing.sm,
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
    ...theme.typography.button,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
  },
});

export default PromptResponseScreen;

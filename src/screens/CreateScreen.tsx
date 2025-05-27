import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

type ResponseType = 'text' | 'audio' | 'video';

interface PromptData {
  id: string;
  category: string;
  title: string;
  description: string;
  currentPrompt: number;
  totalPrompts: number;
}

const samplePrompt: PromptData = {
  id: '1',
  category: 'Childhood Memories',
  title: 'Your First Day of School',
  description: 'Describe your earliest memory of a school day. What were you wearing? How did you feel? Was there a teacher or classmate who made an impression on you?',
  currentPrompt: 3,
  totalPrompts: 12,
};

export default function CreateScreen() {
  const [selectedResponseType, setSelectedResponseType] = useState<ResponseType>('text');
  const [prompt] = useState<PromptData>(samplePrompt);

  const handleResponseTypeSelect = (type: ResponseType) => {
    setSelectedResponseType(type);
  };

  const handleRefreshPrompt = () => {
    Alert.alert('Refresh Prompt', 'This would generate a new AI prompt');
  };

  const handleUploadMedia = () => {
    Alert.alert('Upload Media', 'This would open media picker');
  };

  const handleStartResponse = () => {
    const actionText = selectedResponseType === 'text' ? 'Start Writing' : 
                     selectedResponseType === 'audio' ? 'Start Recording' : 'Start Recording';
    Alert.alert('Start Response', `${actionText} for: ${prompt.title}`);
  };

  const handlePreviousPrompt = () => {
    Alert.alert('Previous Prompt', 'Navigate to previous prompt');
  };

  const handleNextPrompt = () => {
    Alert.alert('Next Prompt', 'Navigate to next prompt');
  };

  const renderProgressBar = () => {
    const progressBars = [];
    const segmentWidth = 100 / prompt.totalPrompts;
    
    for (let i = 0; i < prompt.totalPrompts; i++) {
      const isCompleted = i < prompt.currentPrompt;
      progressBars.push(
        <View
          key={i}
          style={[
            styles.progressSegment,
            { width: `${segmentWidth}%` },
            isCompleted ? styles.progressSegmentActive : styles.progressSegmentInactive
          ]}
        />
      );
    }
    
    return progressBars;
  };

  const renderResponseTypeButton = (type: ResponseType, icon: keyof typeof Ionicons.glyphMap, label: string) => {
    const isSelected = selectedResponseType === type;
    
    return (
      <TouchableOpacity
        key={type}
        style={[
          styles.responseTypeButton,
          isSelected ? styles.responseTypeButtonActive : styles.responseTypeButtonInactive
        ]}
        onPress={() => handleResponseTypeSelect(type)}
      >
        <Ionicons
          name={icon}
          size={20}
          color={isSelected ? theme.colors.primary : theme.colors.gray[400]}
        />
        <Text
          style={[
            styles.responseTypeText,
            isSelected ? styles.responseTypeTextActive : styles.responseTypeTextInactive
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const getActionButtonText = () => {
    switch (selectedResponseType) {
      case 'text':
        return 'Start Writing';
      case 'audio':
        return 'Start Recording';
      case 'video':
        return 'Start Recording';
      default:
        return 'Start Writing';
    }
  };

  const getActionButtonIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (selectedResponseType) {
      case 'text':
        return 'create-outline';
      case 'audio':
        return 'mic-outline';
      case 'video':
        return 'videocam-outline';
      default:
        return 'create-outline';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{prompt.category}</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.dark} />
        </TouchableOpacity>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressSection}>
        <Text style={styles.progressText}>
          Prompt {prompt.currentPrompt} of {prompt.totalPrompts}
        </Text>
        <View style={styles.progressContainer}>
          {renderProgressBar()}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Prompt Card */}
        <View style={styles.promptSection}>
          <View style={styles.promptCard}>
            <View style={styles.promptHeader}>
              <Text style={styles.promptTitle}>{prompt.title}</Text>
              <TouchableOpacity style={styles.refreshButton} onPress={handleRefreshPrompt}>
                <Ionicons name="refresh" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.promptDescription}>{prompt.description}</Text>
            
            <View style={styles.aiIndicator}>
              <Ionicons name="star" size={12} color={theme.colors.accent} />
              <Text style={styles.aiIndicatorText}>AI-generated prompt</Text>
            </View>
          </View>
        </View>

        {/* Response Type Selection */}
        <View style={styles.responseTypeSection}>
          <Text style={styles.sectionLabel}>HOW WOULD YOU LIKE TO RESPOND?</Text>
          <View style={styles.responseTypeGrid}>
            {renderResponseTypeButton('text', 'document-text-outline', 'Text')}
            {renderResponseTypeButton('audio', 'mic-outline', 'Audio')}
            {renderResponseTypeButton('video', 'videocam-outline', 'Video')}
          </View>
        </View>

        {/* Media Upload Section */}
        <View style={styles.mediaUploadSection}>
          <Text style={styles.sectionLabel}>ATTACH MEDIA (OPTIONAL)</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadMedia}>
            <View style={styles.uploadIcon}>
              <Ionicons name="add" size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.uploadText}>Upload photos or documents</Text>
            <Text style={styles.uploadSubtext}>Max 5 files, 20MB each</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Navigation Controls */}
      <View style={styles.navigationSection}>
        <TouchableOpacity style={styles.navButton} onPress={handlePreviousPrompt}>
          <Ionicons name="chevron-back" size={20} color={theme.colors.dark} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleStartResponse}>
          <Text style={styles.actionButtonText}>{getActionButtonText()}</Text>
          <Ionicons name={getActionButtonIcon()} size={16} color={theme.colors.white} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton} onPress={handleNextPrompt}>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.dark} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  headerButton: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.light,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark,
  },
  progressSection: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.gray[500],
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  progressSegment: {
    height: 6,
    borderRadius: 3,
  },
  progressSegmentActive: {
    backgroundColor: theme.colors.primary,
  },
  progressSegmentInactive: {
    backgroundColor: theme.colors.gray[200],
  },
  content: {
    flex: 1,
  },
  promptSection: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
  },
  promptCard: {
    backgroundColor: theme.colors.light,
    borderRadius: theme.borderRadius['2xl'],
    padding: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  promptTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  refreshButton: {
    width: 32,
    height: 32,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptDescription: {
    fontSize: theme.typography.size.base,
    color: theme.colors.gray[600],
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiIndicatorText: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.gray[500],
  },
  responseTypeSection: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  sectionLabel: {
    fontSize: theme.typography.size.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.gray[500],
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  responseTypeGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  responseTypeButton: {
    flex: 1,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
  },
  responseTypeButtonActive: {
    backgroundColor: theme.colors.primary + '10',
    borderColor: theme.colors.primary,
  },
  responseTypeButtonInactive: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.gray[200],
  },
  responseTypeText: {
    fontSize: theme.typography.size.xs,
    fontWeight: theme.typography.fontWeight.medium,
    marginTop: theme.spacing.sm,
  },
  responseTypeTextActive: {
    color: theme.colors.primary,
  },
  responseTypeTextInactive: {
    color: theme.colors.gray[500],
  },
  mediaUploadSection: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  uploadButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.gray[300],
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.gray[50],
  },
  uploadIcon: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.primary + '10',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  uploadText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.gray[500],
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.gray[400],
  },
  navigationSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[100],
  },
  navButton: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.light,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
    ...theme.shadows.md,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.2,
  },
  actionButtonText: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
});

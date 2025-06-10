import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { VideoRecorder } from '../components/media/VideoRecorder';
import { AudioRecorder } from '../components/media/AudioRecorder';
import { MediaFile, MediaService } from '../services/media';
import { MediaPreview } from '../components/media/MediaPreview';
import { useAuth } from '../contexts/AuthContext';
import { saveMemory, getRecentMemories, Memory } from '../services/memoryService';

const { width } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  active?: boolean;
}

interface TimelineItem {
  id: string;
  title: string;
  year: string;
  description: string;
  tags: string[];
  dotColor: string;
}

const categories: Category[] = [
  { id: '1', name: 'Childhood', icon: 'happy-outline', active: true },
  { id: '2', name: 'Education', icon: 'school-outline', active: false },
  { id: '3', name: 'Career', icon: 'briefcase-outline', active: false },
  { id: '4', name: 'Family', icon: 'people-outline', active: false },
  { id: '5', name: 'Travel', icon: 'airplane-outline', active: false },
];

const timelineItems: TimelineItem[] = [
  {
    id: '1',
    title: 'Childhood Home',
    year: '1995',
    description: 'I lived in a small blue house on Maple Street until I was 12...',
    tags: ['Childhood', 'Family'],
    dotColor: theme.colors.accent,
  },
  {
    id: '2',
    title: 'High School Graduation',
    year: '2008',
    description: 'The day I graduated from Lincoln High School...',
    tags: ['Education', 'Milestone'],
    dotColor: theme.colors.secondary,
  },
];

export default function DashboardScreen() {
  const { user } = useAuth();
  const [recentActivities, setRecentActivities] = useState<Memory[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  // Effect to fetch recent activities
  useEffect(() => {
    if (user?.uid) {
      const fetchActivities = async () => {
        setIsLoadingActivities(true);
        try {
          const activities = await getRecentMemories(user.uid, 5);
          setRecentActivities(activities);
        } catch (error) {
          console.error('Failed to fetch recent activities:', error);
          Alert.alert('Error', 'Could not load recent activities.');
        }
        setIsLoadingActivities(false);
      };
      fetchActivities();
    }
  }, [user?.uid]);

  // Media capture state
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<MediaFile | null>(null);
  const [showMediaPreview, setShowMediaPreview] = useState(false);
  const [textMemory, setTextMemory] = useState('');
  const [memoryTitle, setMemoryTitle] = useState('');
  const [isSavingMemory, setIsSavingMemory] = useState(false);

  const handleSaveTextMemory = () => {
    if (textMemory.trim() === '') {
      Alert.alert('Empty Memory', 'Please write something to save your memory.');
      return;
    }
    const newTextMemory: MediaFile = {
      id: Date.now().toString(),
      type: 'text',
      textContent: textMemory.trim(),
      // No uri, filename, or size needed for text type
    };
    setCapturedMedia(newTextMemory);
    setShowMediaPreview(true);
    setTextMemory('');
    setMemoryTitle(''); // Reset title for new capture
    setShowTextInput(false);
  };

  const handleSaveMemory = async () => {
    if (!user || !capturedMedia) {
      Alert.alert('Error', 'User or media data is missing. Cannot save memory.');
      return;
    }
    if (!memoryTitle.trim()) {
      Alert.alert('Title Required', 'Please enter a title for your memory.');
      return;
    }

    setIsSavingMemory(true);
    try {
      // Add title to the capturedMedia object
      const mediaToSave: MediaFile = {
        ...capturedMedia,
        title: memoryTitle.trim(),
      };

      await saveMemory(mediaToSave, user.uid);
      Alert.alert('Success', 'Memory saved successfully!');
      setShowMediaPreview(false);
      setCapturedMedia(null);
      setMemoryTitle('');
      // Refresh recent activities
      if (user?.uid) {
        const fetchActivities = async () => {
          setIsLoadingActivities(true);
          try {
            const activities = await getRecentMemories(user.uid, 5);
            setRecentActivities(activities);
          } catch (error) {
            console.error('Failed to fetch recent activities after save:', error);
            // Optionally show a less intrusive error or just log
          }
          setIsLoadingActivities(false);
        };
        fetchActivities();
      }
    } catch (error) {
      console.error('Error saving memory:', error);
      Alert.alert('Error', 'Failed to save memory. Please try again.');
    } finally {
      setIsSavingMemory(false);
    }
  };

  const renderCategoryItem = (category: Category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        category.active ? styles.categoryButtonActive : styles.categoryButtonInactive
      ]}
    >
      <Ionicons
        name={category.icon}
        size={20}
        color={category.active ? theme.colors.white : theme.colors.dark}
      />
      <Text
        style={[
          styles.categoryText,
          category.active ? styles.categoryTextActive : styles.categoryTextInactive
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return "Good Night";
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    if (hour < 22) return "Good Evening";
    return "Good Night";
  };

  const renderRecentActivityItem = ({ item }: { item: Memory }) => (
    <TouchableOpacity key={item.id} style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: theme.colors.primaryLight } ]}>
        <Ionicons 
          name={item.type === 'video' ? 'videocam-outline' : item.type === 'audio' ? 'mic-outline' : item.type === 'text' ? 'document-text-outline' : 'camera-outline'} 
          size={20} 
          color={theme.colors.white} // Changed from theme.colors.primary[500]
        />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title || 'Untitled Memory'}</Text>
        <Text style={styles.activityDescription}>
          {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'Date unknown'}
        </Text>
      </View>
      <TouchableOpacity style={styles.activityChevron}>
        <Ionicons name="chevron-forward" size={16} color={theme.colors.gray[400]} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>{getCurrentGreeting()}</Text>
          <Text style={styles.userName}>{user?.displayName || user?.email || 'User'}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitial}>
              {user?.displayName ? user.displayName[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : 'U'}
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationBadge}>
            <Ionicons name="notifications-outline" size={20} color={theme.colors.dark} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Record a Memory */}
        <View style={styles.recordMemorySection}>
          <Text style={styles.recordMemoryTitle}>Record a Memory</Text>
          <Text style={styles.recordMemorySubtitle}>Capture and preserve your moments</Text>
          <View style={styles.recordOptions}>
            <TouchableOpacity style={styles.recordOption} onPress={() => setShowVideoRecorder(true)}>
              <LinearGradient colors={['#42275a', '#734b6d']} style={styles.recordIconContainer}>
                <Ionicons name="videocam" size={24} color={theme.colors.white} />
              </LinearGradient>
              <Text style={styles.recordOptionText}>Video</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recordOption} onPress={() => setShowAudioRecorder(true)}>
              <LinearGradient colors={['#42275a', '#734b6d']} style={styles.recordIconContainer}>
                <Ionicons name="mic" size={24} color={theme.colors.white} />
              </LinearGradient>
              <Text style={styles.recordOptionText}>Audio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recordOption} onPress={() => setShowTextInput(true)}>
              <LinearGradient colors={['#42275a', '#734b6d']} style={styles.recordIconContainer}>
                <Ionicons name="create" size={24} color={theme.colors.white} />
              </LinearGradient>
              <Text style={styles.recordOptionText}>Text</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            <View style={styles.categoriesContainer}>
              {categories.map(renderCategoryItem)}
            </View>
          </ScrollView>
        </View>

        {/* Daily Prompt */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Memory Prompt</Text>
            <TouchableOpacity>
              <Text style={styles.refreshButton}>Refresh</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.promptCard}>
            <View style={styles.promptHeader}>
              <Ionicons name="bulb" size={20} color="#FFD166" />
              <Text style={styles.promptCategory}>Childhood</Text>
            </View>
            <Text style={styles.promptText}>
              What was your favorite game to play during recess in elementary school? 
              Who did you play with and what made it so special?
            </Text>
            <View style={styles.promptActions}>
              <TouchableOpacity style={styles.promptAction} onPress={() => setShowAudioRecorder(true)}>
                <Ionicons name="mic" size={16} color="#7C67CB" />
                <Text style={styles.promptActionText}>Record</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.promptAction} onPress={() => setShowTextInput(true)}>
                <Ionicons name="create" size={16} color="#7C67CB" />
                <Text style={styles.promptActionText}>Write</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.promptAction} onPress={() => { Alert.alert("Photo Memory", "Photo capture coming soon!"); }}>
                <Ionicons name="camera" size={16} color="#7C67CB" />
                <Text style={styles.promptActionText}>Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => Alert.alert("View All", "Viewing all activities coming soon!")}>
              <Text style={styles.viewAllButton}>View All</Text>
            </TouchableOpacity>
          </View>
          {isLoadingActivities ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20}} />
          ) : (
            <FlatList
              data={recentActivities}
              renderItem={renderRecentActivityItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <Text style={{ textAlign: 'center', color: theme.colors.gray[500], marginTop: 20, fontSize: theme.typography.size.base }}>
                  No recent activity yet. Start by recording a memory!
                </Text>
              }
              scrollEnabled={false} // If inside a ScrollView, disable FlatList's own scroll
            />
          )}
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Video Recorder Modal */}
      {showVideoRecorder && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={showVideoRecorder}
          onRequestClose={() => setShowVideoRecorder(false)}
        >
          <VideoRecorder
            onVideoRecorded={(media: MediaFile) => {
              setCapturedMedia(media);
              setShowVideoRecorder(false);
              setShowMediaPreview(true);
              setMemoryTitle(''); 
            }}
            onCancel={() => setShowVideoRecorder(false)}
          />
        </Modal>
      )}

      {/* Audio Recorder Modal */}
      {showAudioRecorder && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={showAudioRecorder}
          onRequestClose={() => setShowAudioRecorder(false)}
        >
          <AudioRecorder
            onRecordingComplete={(media: MediaFile) => {
              setCapturedMedia(media);
              setShowAudioRecorder(false);
              setShowMediaPreview(true);
              setMemoryTitle('');
            }}
            onCancel={() => setShowAudioRecorder(false)}
          />
        </Modal>
      )}

      {/* Text Input Modal */}
      {showTextInput && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={showTextInput}
          onRequestClose={() => setShowTextInput(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Write a Memory</Text>
                <TouchableOpacity onPress={() => setShowTextInput(false)}>
                  <Ionicons name="close-circle" size={28} color={theme.colors.gray[400]} />
                </TouchableOpacity>
              </View>
              <View style={styles.textInputContainer}>
                <Text style={styles.textInputLabel}>Title</Text>
                <TextInput
                  style={styles.titleInput}
                  placeholder="Enter a title for your memory"
                  value={memoryTitle}
                  onChangeText={setMemoryTitle}
                  placeholderTextColor={theme.colors.gray[400]}
                />
                <Text style={styles.textInputLabel}>Your Memory</Text>
                <View style={styles.textAreaContainer}>
                  <TextInput
                    style={styles.textInputActual}
                    placeholder="Start writing your memory..."
                    value={textMemory}
                    onChangeText={setTextMemory}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    placeholderTextColor={theme.colors.gray[400]}
                  />
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.saveButton, (!textMemory.trim() || !memoryTitle.trim()) && styles.disabledButton]} 
                onPress={handleSaveTextMemory}
                disabled={!textMemory.trim() || !memoryTitle.trim()}
              >
                <Text style={styles.saveButtonText}>Preview & Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Media Preview Modal */}
      {showMediaPreview && capturedMedia && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={showMediaPreview}
          onRequestClose={() => {
            setShowMediaPreview(false);
            setCapturedMedia(null);
            setMemoryTitle('');
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Preview & Save</Text>
                <TouchableOpacity onPress={() => {
                  setShowMediaPreview(false);
                  setCapturedMedia(null);
                  setMemoryTitle('');
                }}>
                  <Ionicons name="close-circle" size={28} color={theme.colors.gray[400]} />
                </TouchableOpacity>
              </View>
              <MediaPreview mediaFile={capturedMedia} />
              <View style={styles.textInputContainer}>
                <Text style={styles.textInputLabel}>Memory Title</Text>
                <TextInput
                  style={styles.titleInput}
                  placeholder="Enter a title for your memory"
                  value={memoryTitle}
                  onChangeText={setMemoryTitle}
                  placeholderTextColor={theme.colors.gray[400]}
                />
              </View>
              <TouchableOpacity
                style={[styles.saveButton, (isSavingMemory || !memoryTitle.trim()) && styles.disabledButton]}
                onPress={handleSaveMemory}
                disabled={isSavingMemory || !memoryTitle.trim()}
              >
                {isSavingMemory ? (
                  <ActivityIndicator color={theme.colors.white} />
                ) : (
                  <Text style={styles.saveButtonText}>Save Memory</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    ...theme.shadows.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
  },
  userName: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
    marginLeft: theme.spacing.sm,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
  },
  notificationBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  content: {
    flex: 1,
  },
  categoriesSection: {
    paddingVertical: theme.spacing.md,
  },
  categoriesScroll: {
    paddingHorizontal: theme.spacing.lg,
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  categoryButton: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    minWidth: 80,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryButtonInactive: {
    backgroundColor: theme.colors.white,
    ...theme.shadows.sm,
  },
  categoryText: {
    fontSize: theme.typography.size.xs,
    fontWeight: theme.typography.fontWeight.medium,
    marginTop: 4,
  },
  categoryTextActive: {
    color: theme.colors.white,
  },
  categoryTextInactive: {
    color: theme.colors.dark,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
  },
  viewAllButton: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
  },
  promptCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius['2xl'],
    ...theme.shadows.sm,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  promptCategory: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  promptText: {
    fontSize: theme.typography.size.base,
    color: theme.colors.gray[700],
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  promptActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  promptAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.lg,
    gap: 6,
  },
  promptActionText: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
  },
  activityList: {
    gap: theme.spacing.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.sm,
  },
  activityIcon: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.dark,
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.gray[500],
  },
  activityChevron: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineContainer: {
    position: 'relative',
    paddingLeft: theme.spacing.xl,
  },
  timelineLine: {
    position: 'absolute',
    left: 8,
    top: 4,
    bottom: 0,
    width: 2,
    backgroundColor: theme.colors.gray[200],
  },
  timelineItem: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  timelineDot: {
    position: 'absolute',
    left: -20,
    top: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  timelineCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.sm,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  timelineTitle: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.dark,
    flex: 1,
  },
  timelineYear: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.gray[500],
  },
  timelineDescription: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.gray[600],
    marginBottom: theme.spacing.sm,
    lineHeight: 18,
  },
  timelineTags: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  timelineTag: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    backgroundColor: theme.colors.light,
    borderRadius: theme.borderRadius.full,
  },
  timelineTagText: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.gray[600],
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.xl,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
  },
  bottomSpacing: {
    height: 100,
  },
  refreshButton: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
  },
  recordMemorySection: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  recordMemoryTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.xs,
  },
  recordMemorySubtitle: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.gray[500],
    marginBottom: theme.spacing.md,
  },
  recordOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  recordOption: {
    alignItems: 'center',
    width: (width - theme.spacing.lg * 4) / 3,
  },
  recordIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    ...theme.shadows.md,
  },
  recordOptionText: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.dark,
    marginTop: theme.spacing.xs,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    width: '100%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark,
  },
  // Text input styles
  textInputContainer: {
    marginBottom: theme.spacing.lg,
  },
  textInputLabel: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.dark,
    marginBottom: theme.spacing.sm,
  },
  textAreaContainer: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textAreaPlaceholder: {
    color: theme.colors.gray[400],
    fontSize: theme.typography.size.base,
  },
  textInputActual: {
    flex: 1, 
    minHeight: 150, 
    fontSize: theme.typography.size.base,
    color: theme.colors.dark,
    padding: 10,
  },
  // Media preview styles
  previewContainer: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.xl,
    alignSelf: 'center',
    ...theme.shadows.sm,
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.fontWeight.medium,
  },
  titleInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.size.base,
    color: theme.colors.dark,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
  disabledButton: {
    backgroundColor: theme.colors.gray[300],
  },
});

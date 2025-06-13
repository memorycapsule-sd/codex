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
import { MediaFile } from '../services/media';
import { MediaPreview } from '../components/media/MediaPreview';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { saveMemory } from '../services/memoryService';
import { loadUserCapsuleResponses } from '../services/capsuleService';
import { CapsuleResponse } from '../types/capsule';

const { width } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  active?: boolean;
}

const categories: Category[] = [
  { id: '1', name: 'Childhood', icon: 'happy-outline', active: true },
  { id: '2', name: 'Education', icon: 'school-outline', active: false },
  { id: '3', name: 'Career', icon: 'briefcase-outline', active: false },
  { id: '4', name: 'Family', icon: 'people-outline', active: false },
  { id: '5', name: 'Travel', icon: 'airplane-outline', active: false },
];

const getCurrentGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 5) return "Good Night";
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  if (hour < 22) return "Good Evening";
  return "Good Night";
};

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { user, userProfile } = useAuth();

  const [recentActivities, setRecentActivities] = useState<CapsuleResponse[]>([]);
  const [latestCapsule, setLatestCapsule] = useState<CapsuleResponse | null>(null);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [isLoadingCapsule, setIsLoadingCapsule] = useState(false);

  let displayGreeting: string;
  let userNameToDisplay: string | null = null;

  if (userProfile?.name) {
    const trimmedName = userProfile.name.trim();
    if (trimmedName) {
      const nameParts = trimmedName.split(' ');
      const firstName = nameParts[0];
      displayGreeting = `Welcome back, ${firstName}.`;
      if (nameParts.length > 1) {
        userNameToDisplay = trimmedName;
      }
    } else {
      displayGreeting = getCurrentGreeting();
      userNameToDisplay = user?.displayName || user?.email || 'User';
    }
  } else {
    displayGreeting = getCurrentGreeting();
    userNameToDisplay = user?.displayName || user?.email || 'User';
  }

  const fetchCapsuleData = async () => {
    if (!user?.uid) return;
    setIsLoadingCapsule(true);
    setIsLoadingActivities(true);
    try {
      const capsules = await loadUserCapsuleResponses(user.uid);
      capsules.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

      if (capsules && capsules.length > 0) {
        setLatestCapsule(capsules[0]);
        setRecentActivities(capsules.slice(0, 3));
      } else {
        setLatestCapsule(null);
        setRecentActivities([]);
      }
    } catch (error) {
      console.error('Failed to fetch capsule data:', error);
      setLatestCapsule(null);
      setRecentActivities([]);
    } finally {
      setIsLoadingCapsule(false);
      setIsLoadingActivities(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchCapsuleData();
    }
  }, [user?.uid]);

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
    };
    setCapturedMedia(newTextMemory);
    setShowMediaPreview(true);
    setTextMemory('');
    setMemoryTitle('');
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
      const mediaToSave: MediaFile = {
        ...capturedMedia,
        title: memoryTitle.trim(),
      };
      await saveMemory(mediaToSave, user.uid);
      Alert.alert('Success', 'Memory saved successfully!');
      setShowMediaPreview(false);
      setCapturedMedia(null);
      setMemoryTitle('');
      await fetchCapsuleData(); // Refresh all data
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

  const renderRecentActivityItem = ({ item }: { item: CapsuleResponse }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.activityItem}
      onPress={() => navigation.navigate('Capsules', { screen: 'CapsuleDetailScreen', params: { capsuleId: item.id } })}
    >
      <View style={[styles.activityIcon, { backgroundColor: theme.colors.primaryLight }]}>
        <Ionicons
          name={'albums-outline'}
          size={20}
          color={theme.colors.white}
        />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.capsuleTitle || 'Untitled Capsule'}</Text>
        <Text style={styles.activityDescription}>
          Updated {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'Date unknown'}
        </Text>
      </View>
      <TouchableOpacity style={styles.activityChevron}>
        <Ionicons name="chevron-forward" size={16} color={theme.colors.gray[400]} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>{displayGreeting}</Text>
          {userNameToDisplay && <Text style={styles.userName}>{userNameToDisplay}</Text>}
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

        {isLoadingCapsule ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 20 }}/>
        ) : latestCapsule ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('Capsules', { screen: 'CapsuleDetailScreen', params: { capsuleId: latestCapsule.id } })}
          >
            <LinearGradient
              colors={theme.gradients.accentTheme}
              style={styles.latestCapsuleCard}
            >
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="albums-outline" size={24} color={theme.colors.white} />
                <Text style={styles.latestCapsuleTitle}>Latest Capsule</Text>
              </View>
              <Text style={styles.latestCapsuleName}>{latestCapsule.capsuleTitle}</Text>
              {latestCapsule.category && (
                <Text style={styles.latestCapsuleCategory}>Category: {latestCapsule.category}</Text>
              )}
              <View style={styles.viewCapsulePromptContainer}>
                <Text style={styles.viewCapsulePromptText}>View Capsule</Text>
                <Ionicons name="arrow-forward-circle-outline" size={20} color={theme.colors.white} style={{ marginLeft: theme.spacing.xs}} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.noCapsulesCard}>
            <Ionicons name="archive-outline" size={24} color={theme.colors.gray[500]} />
            <Text style={styles.noCapsulesText}>No capsules yet. Create your first memory!</Text>
          </View>
        )}

        <View style={styles.categoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            <View style={styles.categoriesContainer}>
              {categories.map(renderCategoryItem)}
            </View>
          </ScrollView>
        </View>

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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Timeline')}>
                <Text style={styles.viewAllButton}>View All</Text>
            </TouchableOpacity>
          </View>
          {isLoadingActivities ? (
            <ActivityIndicator />
          ) : recentActivities.length > 0 ? (
            <FlatList
              data={recentActivities}
              renderItem={renderRecentActivityItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noActivityText}>No recent activity to show.</Text>
          )}
        </View>
      </ScrollView>

      {/* Media Recorders and Previews */}
      <Modal visible={showVideoRecorder} animationType="slide" onRequestClose={() => setShowVideoRecorder(false)}>
        <VideoRecorder
          onVideoRecorded={(mediaFile: MediaFile) => {
            setCapturedMedia(mediaFile);
            setShowVideoRecorder(false);
            setShowMediaPreview(true);
          }}
          onCancel={() => setShowVideoRecorder(false)}
        />
      </Modal>
      <Modal visible={showAudioRecorder} animationType="slide" onRequestClose={() => setShowAudioRecorder(false)}>
        <AudioRecorder
          onRecordingComplete={(mediaFile: MediaFile) => {
            setCapturedMedia(mediaFile);
            setShowAudioRecorder(false);
            setShowMediaPreview(true);
          }}
          onCancel={() => setShowAudioRecorder(false)}
        />
      </Modal>
      <Modal visible={showTextInput} transparent={true} animationType="slide" onRequestClose={() => setShowTextInput(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Write a Memory</Text>
            <TextInput
              style={styles.textInput}
              placeholder="What's on your mind?"
              multiline
              value={textMemory}
              onChangeText={setTextMemory}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowTextInput(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonPrimary]} onPress={handleSaveTextMemory}>
                <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={showMediaPreview} animationType="slide" onRequestClose={() => setShowMediaPreview(false)}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>Preview & Save</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="Enter a title for this memory..."
              value={memoryTitle}
              onChangeText={setMemoryTitle}
            />
            {capturedMedia && <MediaPreview mediaFile={capturedMedia!} />}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
              <TouchableOpacity
                style={styles.previewButton}
                onPress={() => {
                  setShowMediaPreview(false);
                  setCapturedMedia(null);
                  setMemoryTitle('');
                }}>
                <Text>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.previewButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleSaveMemory}
                disabled={isSavingMemory}
              >
                {isSavingMemory ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff' }}>Save Memory</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.dark,
  },
  userName: {
    fontSize: 18,
    color: theme.colors.gray[600],
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationBadge: {
    marginLeft: theme.spacing.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  recordMemorySection: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  recordMemoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.dark,
  },
  recordMemorySubtitle: {
    fontSize: 14,
    color: theme.colors.gray[500],
    marginBottom: theme.spacing.lg,
  },
  recordOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  recordOption: {
    alignItems: 'center',
  },
  recordIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  recordOptionText: {
    fontSize: 14,
    color: theme.colors.dark,
    fontWeight: '500',
  },
  latestCapsuleCard: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  latestCapsuleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginLeft: theme.spacing.sm,
  },
  latestCapsuleName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  latestCapsuleCategory: {
    fontSize: 14,
    color: theme.colors.white,
    opacity: 0.8,
    marginBottom: theme.spacing.md,
  },
  viewCapsulePromptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  viewCapsulePromptText: {
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  noCapsulesCard: {
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noCapsulesText: {
    color: theme.colors.gray[600],
    marginTop: theme.spacing.sm,
    fontSize: 16,
  },
  categoriesSection: {
    marginBottom: theme.spacing.lg,
  },
  categoriesScroll: {
    marginHorizontal: -theme.spacing.lg,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryButtonInactive: {
    backgroundColor: theme.colors.gray[200],
  },
  categoryText: {
    marginLeft: theme.spacing.xs,
    fontWeight: 'bold',
  },
  categoryTextActive: {
    color: theme.colors.white,
  },
  categoryTextInactive: {
    color: theme.colors.dark,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.dark,
  },
  refreshButton: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  viewAllButton: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  promptCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  promptCategory: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.dark,
    fontWeight: 'bold',
  },
  promptText: {
    fontSize: 16,
    color: theme.colors.gray[600],
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  promptActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  promptAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.lg,
  },
  promptActionText: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.dark,
  },
  activityDescription: {
    fontSize: 14,
    color: theme.colors.gray[500],
  },
  activityChevron: {
    padding: theme.spacing.sm,
  },
  noActivityText: {
    textAlign: 'center',
    color: theme.colors.gray[500],
    marginTop: theme.spacing.md,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.spacing.lg,
  },
  textInput: {
    height: 150,
    borderColor: theme.colors.gray[300],
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    textAlignVertical: 'top',
    marginBottom: theme.spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginLeft: theme.spacing.md,
  },
  modalButtonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonPrimaryText: {
    color: theme.colors.white,
  },
  titleInput: {
    height: 50,
    borderColor: theme.colors.gray[300],
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    marginBottom: theme.spacing.lg,
  },
  previewButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: theme.colors.gray[200],
  },
});
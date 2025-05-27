import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

interface Person {
  id: string;
  name: string;
  avatar: string;
}

interface CapsuleData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  locationDetail: string;
  journalTitle: string;
  journalContent: string[];
  mainMedia: MediaItem;
  mediaGallery: MediaItem[];
  tags: string[];
  people: Person[];
  isPrivate: boolean;
  videoDuration: string;
  videoProgress: number;
}

export default function CapsulesScreen() {
  const [isPlaying, setIsPlaying] = useState(false);

  // Sample capsule data
  const capsule: CapsuleData = {
    id: '1',
    title: 'Summer Vacation 2022',
    date: 'July 15, 2022',
    time: '3:24 PM',
    location: 'Maui, Hawaii',
    locationDetail: 'Wailea Beach',
    journalTitle: 'Our First Day in Paradise',
    journalContent: [
      "We finally made it to Maui after planning this trip for over a year! The flight was long but worth every minute once we saw those crystal blue waters.",
      "The kids couldn't wait to jump in the ocean. Emma built her first sand castle and Jake tried snorkeling for the first time. He saw three sea turtles!",
      "We ended the day with a beautiful sunset dinner on the beach. I'll never forget the look on everyone's faces as the sky turned pink and orange."
    ],
    mainMedia: {
      id: 'main',
      type: 'video',
      url: 'https://example.com/video.mp4',
      thumbnail: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e4420d301d-b3866d5ec5f6fac0a2c4.png'
    },
    mediaGallery: [
      { id: '1', type: 'image', url: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e4420d301d-b3866d5ec5f6fac0a2c4.png' },
      { id: '2', type: 'image', url: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e4420d301d-b3866d5ec5f6fac0a2c4.png' },
      { id: '3', type: 'image', url: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e4420d301d-b3866d5ec5f6fac0a2c4.png' }
    ],
    tags: ['Family', 'Vacation', 'Beach', 'Hawaii', 'Summer'],
    people: [
      { id: '1', name: 'Emma', avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg' },
      { id: '2', name: 'Jake', avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg' },
      { id: '3', name: 'Sarah', avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg' },
      { id: '4', name: 'Mike', avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg' }
    ],
    isPrivate: true,
    videoDuration: '2:18',
    videoProgress: 0.33
  };

  const handlePlayVideo = () => {
    setIsPlaying(!isPlaying);
    Alert.alert('Video Player', isPlaying ? 'Pausing video...' : 'Playing video...');
  };

  const handleAction = (action: string) => {
    Alert.alert('Action', `${action} functionality coming soon!`);
  };

  const renderMediaPlayer = () => (
    <View style={styles.mediaPlayer}>
      <Image source={{ uri: capsule.mainMedia.thumbnail }} style={styles.mediaImage} />
      <View style={styles.mediaOverlay}>
        <TouchableOpacity style={styles.playButton} onPress={handlePlayVideo}>
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
      
      {/* Video Controls */}
      <View style={styles.videoControls}>
        <Text style={styles.videoTime}>0:24</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${capsule.videoProgress * 100}%` }]} />
          </View>
        </View>
        <Text style={styles.videoTime}>{capsule.videoDuration}</Text>
        <TouchableOpacity style={styles.fullscreenButton}>
          <Ionicons name="expand" size={14} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Media Type Badge */}
      <View style={styles.mediaTypeBadge}>
        <Ionicons name="videocam" size={12} color="white" />
        <Text style={styles.mediaTypeText}>Video</Text>
      </View>
    </View>
  );

  const renderMetadata = () => (
    <View style={styles.metadataContainer}>
      <View style={styles.metadataItem}>
        <View style={styles.metadataIcon}>
          <Ionicons name="calendar" size={16} color={theme.colors.primary} />
        </View>
        <View>
          <Text style={styles.metadataTitle}>{capsule.date}</Text>
          <Text style={styles.metadataSubtitle}>{capsule.time}</Text>
        </View>
      </View>
      
      <View style={styles.metadataItem}>
        <View style={styles.metadataIcon}>
          <Ionicons name="location" size={16} color={theme.colors.primary} />
        </View>
        <View>
          <Text style={styles.metadataTitle}>{capsule.location}</Text>
          <Text style={styles.metadataSubtitle}>{capsule.locationDetail}</Text>
        </View>
      </View>
    </View>
  );

  const renderJournalEntry = () => (
    <View style={styles.journalSection}>
      <Text style={styles.journalTitle}>{capsule.journalTitle}</Text>
      <View style={styles.journalContent}>
        {capsule.journalContent.map((paragraph, index) => (
          <Text key={index} style={styles.journalParagraph}>
            {paragraph}
          </Text>
        ))}
      </View>
    </View>
  );

  const renderMediaGallery = () => (
    <View style={styles.gallerySection}>
      <View style={styles.galleryHeader}>
        <Text style={styles.sectionTitle}>Photos & Media</Text>
        <TouchableOpacity onPress={() => handleAction('View All Media')}>
          <Text style={styles.viewAllButton}>View All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.galleryGrid}>
        {capsule.mediaGallery.map((item, index) => (
          <TouchableOpacity key={item.id} style={styles.galleryItem}>
            <Image source={{ uri: item.url }} style={styles.galleryImage} />
            {index === capsule.mediaGallery.length - 1 && (
              <View style={styles.galleryOverlay}>
                <Text style={styles.galleryOverlayText}>+12</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTags = () => (
    <View style={styles.tagsSection}>
      <Text style={styles.sectionTitle}>Tags</Text>
      <View style={styles.tagsContainer}>
        {capsule.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPeople = () => (
    <View style={styles.peopleSection}>
      <Text style={styles.sectionTitle}>People In This Memory</Text>
      <View style={styles.peopleContainer}>
        {capsule.people.map((person, index) => (
          <Image 
            key={person.id} 
            source={{ uri: person.avatar }} 
            style={[styles.personAvatar, { marginLeft: index > 0 ? -8 : 0 }]} 
          />
        ))}
      </View>
    </View>
  );

  const renderPrivacyStatus = () => (
    <View style={styles.privacyContainer}>
      <View style={styles.privacyInfo}>
        <Ionicons name="lock-closed" size={16} color={theme.colors.primary} />
        <View style={styles.privacyText}>
          <Text style={styles.privacyTitle}>Private</Text>
          <Text style={styles.privacySubtitle}>Only you can view this memory</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleAction('Change Privacy')}>
        <Text style={styles.changeButton}>Change</Text>
      </TouchableOpacity>
    </View>
  );

  const renderActionBar = () => (
    <View style={styles.actionBar}>
      <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('Edit')}>
        <Ionicons name="create-outline" size={20} color={theme.colors.text.secondary} />
        <Text style={styles.actionButtonText}>Edit</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('Share')}>
        <Ionicons name="share-outline" size={20} color={theme.colors.text.secondary} />
        <Text style={styles.actionButtonText}>Share</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('Add to')}>
        <Ionicons name="folder-open-outline" size={20} color={theme.colors.text.secondary} />
        <Text style={styles.actionButtonText}>Add to</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('Delete')}>
        <Ionicons name="trash-outline" size={20} color={theme.colors.text.secondary} />
        <Text style={styles.actionButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => handleAction('Back')}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{capsule.title}</Text>
        <TouchableOpacity style={styles.headerButton} onPress={() => handleAction('Options')}>
          <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderMediaPlayer()}
        {renderMetadata()}
        {renderJournalEntry()}
        {renderMediaGallery()}
        {renderTags()}
        {renderPeople()}
        {renderPrivacyStatus()}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Action Bar */}
      {renderActionBar()}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  mediaPlayer: {
    marginBottom: theme.spacing.xl,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    height: 220,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  mediaOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  videoTime: {
    color: 'white',
    fontSize: 12,
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: theme.spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  fullscreenButton: {
    marginLeft: theme.spacing.sm,
  },
  mediaTypeBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mediaTypeText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  metadataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${theme.colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  metadataTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  metadataSubtitle: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  journalSection: {
    marginBottom: theme.spacing.xl,
  },
  journalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  journalContent: {
    gap: theme.spacing.sm,
  },
  journalParagraph: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.secondary,
  },
  gallerySection: {
    marginBottom: theme.spacing.xl,
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  viewAllButton: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  galleryGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  galleryItem: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  galleryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryOverlayText: {
    color: 'white',
    fontWeight: '500',
  },
  tagsSection: {
    marginBottom: theme.spacing.xl,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  tag: {
    backgroundColor: `${theme.colors.primary}15`,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  peopleSection: {
    marginBottom: theme.spacing.xl,
  },
  peopleContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
  },
  personAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'white',
  },
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 12,
    marginBottom: theme.spacing.xl,
  },
  privacyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyText: {
    marginLeft: theme.spacing.sm,
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  privacySubtitle: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  changeButton: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 80,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
  },
  actionButtonText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
});

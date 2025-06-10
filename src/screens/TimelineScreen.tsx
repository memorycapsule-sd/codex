import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Added import
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Added import
import { theme } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { CapsuleService } from '../services/capsuleService';
import { CapsuleResponse, CapsuleEntry } from '../types/capsule'; // Added import for CapsuleResponse and CapsuleEntry
import { CapsulesStackParamList } from '../navigation/CapsulesNavigator'; // Added import

type MediaType = 'video' | 'text' | 'audio' | 'photo'; 

type Category = 'All' | 'Childhood' | 'Education' | 'Career' | 'Family' | 'Travel';

// Define navigation prop type specific to this screen's place in the CapsulesNavigator
type TimelineNavigationProp = NativeStackNavigationProp<CapsulesStackParamList, 'CapsulesList'>;

const categories: Category[] = ['All', 'Childhood', 'Education', 'Career', 'Family', 'Travel'];

export default function TimelineScreen() {
  const navigation = useNavigation<TimelineNavigationProp>(); // Added navigation hook
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [timelineData, setTimelineData] = useState<CapsuleResponse[]>([]); // Updated type to CapsuleResponse[]
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCapsules = async () => {
      if (user?.uid) {
        setIsLoading(true);
        try {
          const responses = await CapsuleService.loadUserCapsuleResponses(user.uid);
          setTimelineData(responses);
        } catch (error) {
          console.error("Error fetching timeline data:", error);
          Alert.alert("Error", "Could not load timeline data.");
          setTimelineData([]); 
        }
        setIsLoading(false);
      } else {
        setTimelineData([]); 
        setIsLoading(false);
      }
    };

    fetchCapsules();
  }, [user]); 

  const handleSearch = () => {
    Alert.alert('Search', 'Search functionality would be implemented here');
  };

  const handleProfile = () => {
    Alert.alert('Profile', 'Profile menu would be shown here');
  };

  const handleFilterDropdown = (type: 'capsules' | 'date') => {
    Alert.alert('Filter', `${type} filter dropdown would be shown here`);
  };

  const handleEntryOptions = (entryId: string) => {
    Alert.alert('Entry Options', `Options for entry ${entryId}`);
  };

  const handlePlayAudio = (entryId: string) => {
    Alert.alert('Play Audio', `Playing audio for entry ${entryId}`);
  };

  const handlePlayVideo = (entryId: string) => {
    Alert.alert('Play Video', `Playing video for entry ${entryId}`);
  };

  const handleViewPhotos = (entryId: string) => {
    Alert.alert('View Photos', `Viewing photo gallery for entry ${entryId}`);
  };

  const getCategoryIcon = (categoryTitle: string): keyof typeof Ionicons.glyphMap => {
    const category = categoryTitle as Category; 
    switch (category) {
      case 'Career':
        return 'briefcase';
      case 'Education':
        return 'school';
      case 'Family':
        return 'people';
      case 'Childhood':
        return 'happy';
      case 'Travel':
        return 'airplane';
      default:
        return 'document-text';
    }
  };

  const getCategoryColor = (categoryTitle: string) => {
    const category = categoryTitle as Category; 
    switch (category) {
      case 'Career':
        return theme.colors.secondary;
      case 'Education':
        return theme.colors.accent;
      case 'Family':
        return theme.colors.primary;
      case 'Childhood':
        return theme.colors.secondary;
      case 'Travel':
        return theme.colors.accent;
      default:
        return theme.colors.gray[400];
    }
  };

  const getMediaTypeIcon = (mediaType: CapsuleEntry['type']): keyof typeof Ionicons.glyphMap => { // Changed to use CapsuleEntry['type']
    switch (mediaType) {
      case 'video':
        return 'videocam';
      case 'audio':
        return 'mic';
      case 'photo':
        return 'image-outline'; 
      case 'text':
        return 'document-text-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const renderCategoryPill = (category: Category) => {
    const isSelected = selectedCategory === category;
    return (
      <TouchableOpacity
        key={category}
        style={[
          styles.categoryPill,
          isSelected ? styles.categoryPillActive : styles.categoryPillInactive
        ]}
        onPress={() => setSelectedCategory(category)}
      >
        <Text
          style={[
            styles.categoryPillText,
            isSelected ? styles.categoryPillTextActive : styles.categoryPillTextInactive
          ]}
        >
          {category}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMediaContent = (capsuleEntry: CapsuleEntry, capsuleResponseId: string) => {
    // Assuming handlePlayVideo etc. now expect capsuleEntry.id or need to be adapted.
    // For now, using capsuleEntry.id for media-specific actions.
    switch (capsuleEntry.type) {
      case 'video':
        return (
          <TouchableOpacity onPress={() => handlePlayVideo(capsuleEntry.id)} style={styles.videoContainer}>
            <Image source={{ uri: capsuleEntry.mediaUri || undefined }} style={styles.videoThumbnail} resizeMode="cover" />
            <View style={styles.videoOverlay}>
              <Ionicons name="play-circle" size={48} color={theme.colors.white} />
            </View>
          </TouchableOpacity>
        );
      case 'text':
        return <Text style={styles.entryDescription}>{capsuleEntry.textContent}</Text>; 
      case 'audio':
        return (
          <TouchableOpacity onPress={() => handlePlayAudio(capsuleEntry.id)} style={styles.audioContainer}>
            <View style={styles.audioPlayButton}>
              <Ionicons name="play" size={18} color={theme.colors.white} />
            </View>
            <View style={styles.audioProgress}>
              <Text style={styles.audioTime}>{capsuleEntry.metadata?.duration ? `${Math.floor(capsuleEntry.metadata.duration / 60)}:${String(Math.floor(capsuleEntry.metadata.duration % 60)).padStart(2, '0')}` : 'Audio'}</Text>
              {/* Progress bar can be implemented here */}
            </View>
          </TouchableOpacity>
        );
      case 'photo': 
        return (
          <TouchableOpacity onPress={() => handleViewPhotos(capsuleEntry.id)} style={styles.photoItemSingle}>
            <Image source={{ uri: capsuleEntry.mediaUri || undefined }} style={styles.photoImage} resizeMode="cover" />
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  const renderTimelineEntry = (capsuleResponseItem: CapsuleResponse) => {
    const entryDate = capsuleResponseItem.createdAt ? new Date(capsuleResponseItem.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Date unknown';
    // The concept of a single 'description' or 'responseType' at the CapsuleResponse level is removed.
    // Content is now an array of entries.

    return (
      <TouchableOpacity 
        style={styles.entryCard} 
        onPress={() => navigation.navigate('CapsuleViewingScreen', { capsuleResponse: capsuleResponseItem })}
      >
        {/* Original content of entryCard will be nested here */}
        <View style={styles.entryHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(capsuleResponseItem.capsuleTitle) }]}>
            {/* Assuming getCategoryIcon is for the capsule's category/title, not media type */}
            <Ionicons name={getCategoryIcon(capsuleResponseItem.capsuleTitle)} size={20} color={theme.colors.white} />
          </View>
          <View style={styles.entryInfo}>
            <Text style={styles.entryTitle}>{capsuleResponseItem.capsuleTitle}</Text> 
            <Text style={styles.entryDate}>{entryDate}</Text>
          </View>
          {/* onPress event for options should likely use capsuleResponse.id */}
          <TouchableOpacity onPress={() => handleEntryOptions(capsuleResponseItem.id)} style={styles.entryOptionsButton}>
            <Ionicons name="ellipsis-horizontal" size={18} color={theme.colors.dark} />
          </TouchableOpacity>
        </View>
        
        {/* Iterate over entries and render content for each */}
        {capsuleResponseItem.entries.map((entryItem: CapsuleEntry) => (
          <View key={entryItem.id} style={styles.entryItemContainer}> {/* Ensure styles.entryItemContainer is defined */}
            {renderMediaContent(entryItem, capsuleResponseItem.id)}
          </View>
        ))}
        
        {/* Footer with tags can be adapted if needed */}
      </TouchableOpacity>
    );
  };

  const groupEntriesByMonth = (entriesToGroup: CapsuleResponse[]) => {
    if (!entriesToGroup || entriesToGroup.length === 0) return {}; 
    return entriesToGroup.reduce((acc, entry) => {
      if (!entry.createdAt) return acc; 
      const monthYear = new Date(entry.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(entry);
      return acc;
    }, {} as Record<string, CapsuleResponse[]>); 
  };

  const filteredEntries = timelineData.filter(
    entry => selectedCategory === 'All' || entry.capsuleTitle === selectedCategory
  );
  const groupedEntries = groupEntriesByMonth(filteredEntries);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your timeline...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Timeline</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleProfile}>
            <Image
              source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Controls */}
      <View style={styles.filterSection}>
        <View style={styles.filterRow}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => handleFilterDropdown('capsules')}
          >
            <Text style={styles.filterButtonText}>All Capsules</Text>
            <Ionicons name="chevron-down" size={12} color={theme.colors.dark} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => handleFilterDropdown('date')}
          >
            <Ionicons name="calendar-outline" size={16} color={theme.colors.dark} />
            <Text style={styles.filterButtonText}>Date Range</Text>
            <Ionicons name="chevron-down" size={12} color={theme.colors.dark} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map(renderCategoryPill)}
        </ScrollView>
      </View>

      {/* Timeline Entries */}
      <ScrollView style={styles.timelineContainer} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedEntries).map(([month, monthEntries]: [string, CapsuleResponse[]]) => (
          <View key={month}>
            <View style={styles.dateHeader}>
              <View style={styles.dateLine} />
              <Text style={styles.dateHeaderText}>{month}</Text>
              <View style={styles.dateLine} />
            </View>
            {monthEntries.map(renderTimelineEntry)}
          </View>
        ))}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.white,
    ...theme.shadows.sm,
  },
  headerTitle: {
    fontSize: theme.typography.size['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  searchButton: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.light,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  filterSection: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.light,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  filterButtonText: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.dark,
  },
  categoriesContainer: {
    marginTop: theme.spacing.sm,
  },
  categoriesContent: {
    paddingRight: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
  },
  categoryPillActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryPillInactive: {
    backgroundColor: theme.colors.light,
  },
  categoryPillText: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  categoryPillTextActive: {
    color: theme.colors.white,
  },
  categoryPillTextInactive: {
    color: theme.colors.dark,
  },
  timelineContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.md,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.gray[300],
  },
  dateHeaderText: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.gray[500],
    marginHorizontal: theme.spacing.sm,
  },
  entryCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  entryItemContainer: {
    marginTop: theme.spacing.sm,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  entryInfo: {
    flex: 1,
  },
  entryTitle: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
    marginBottom: 2,
  },
  entryDate: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.gray[500],
  },
  entryDescription: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.gray[600],
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  videoContainer: {
    height: 160,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioContainer: {
    backgroundColor: theme.colors.light,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioPlayButton: {
    width: 32,
    height: 32,
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  audioProgress: {
    flex: 1,
  },
  audioProgressBar: {
    height: 8,
    backgroundColor: theme.colors.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  audioProgressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  audioTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  audioTime: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.gray[500],
  },
  photoItemSingle: {
    height: 200, 
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryTags: {
    flexDirection: 'row',
    gap: 4,
  },
  tag: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    backgroundColor: theme.colors.light,
    borderRadius: theme.borderRadius.md,
  },
  tagText: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.dark,
  },
  entryOptionsButton: {
    width: 32,
    height: 32,
    backgroundColor: theme.colors.light,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
  loadingContainer: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: { 
    marginTop: theme.spacing.md,
    fontSize: theme.typography.size.base,
    color: theme.colors.text.secondary,
  },
});

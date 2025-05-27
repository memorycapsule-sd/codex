import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

type MediaType = 'video' | 'text' | 'audio' | 'photos';
type Category = 'All' | 'Childhood' | 'Education' | 'Career' | 'Family' | 'Travel';

interface TimelineEntry {
  id: string;
  title: string;
  category: Category;
  date: string;
  description: string;
  mediaType: MediaType;
  thumbnail?: string;
  audioDuration?: string;
  audioProgress?: number;
  photoCount?: number;
}

const sampleEntries: TimelineEntry[] = [
  {
    id: '1',
    title: 'Career Milestone',
    category: 'Career',
    date: 'May 15, 2023',
    description: 'My first day as a team lead was both exciting and nerve-wracking. I remember walking into the office feeling like...',
    mediaType: 'video',
    thumbnail: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e4420d301d-b3866d5ec5f6fac0a2c4.png'
  },
  {
    id: '2',
    title: 'College Memories',
    category: 'Education',
    date: 'May 10, 2023',
    description: 'The library was always my sanctuary during finals week. I\'d find a quiet corner on the third floor where I could spread out my notes and textbooks. The smell of coffee from my thermos mixed with the musty scent of old books created a strangely comforting atmosphere...',
    mediaType: 'text'
  },
  {
    id: '3',
    title: 'Family Vacation',
    category: 'Family',
    date: 'April 25, 2023',
    description: 'The sound of waves crashing on the shore as the kids played in the sand. This moment was everything...',
    mediaType: 'audio',
    audioDuration: '3:45',
    audioProgress: 0.33
  },
  {
    id: '4',
    title: 'Childhood Home',
    category: 'Childhood',
    date: 'April 12, 2023',
    description: 'I recently found these old photos of our first family home. The backyard tree where we built that treehouse...',
    mediaType: 'photos',
    photoCount: 7,
    thumbnail: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e4420d301d-b3866d5ec5f6fac0a2c4.png'
  }
];

const categories: Category[] = ['All', 'Childhood', 'Education', 'Career', 'Family', 'Travel'];

export default function TimelineScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [entries] = useState<TimelineEntry[]>(sampleEntries);

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

  const getCategoryIcon = (category: Category): keyof typeof Ionicons.glyphMap => {
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

  const getCategoryColor = (category: Category) => {
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

  const getMediaTypeIcon = (mediaType: MediaType): keyof typeof Ionicons.glyphMap => {
    switch (mediaType) {
      case 'video':
        return 'videocam';
      case 'audio':
        return 'mic';
      case 'photos':
        return 'images';
      case 'text':
        return 'document-text';
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

  const renderMediaContent = (entry: TimelineEntry) => {
    switch (entry.mediaType) {
      case 'video':
        return (
          <TouchableOpacity 
            style={styles.videoContainer}
            onPress={() => handlePlayVideo(entry.id)}
          >
            <Image source={{ uri: entry.thumbnail }} style={styles.videoThumbnail} />
            <View style={styles.videoOverlay}>
              <Ionicons name="play" size={24} color={theme.colors.white} />
            </View>
          </TouchableOpacity>
        );
      
      case 'audio':
        return (
          <View style={styles.audioContainer}>
            <TouchableOpacity 
              style={styles.audioPlayButton}
              onPress={() => handlePlayAudio(entry.id)}
            >
              <Ionicons name="play" size={12} color={theme.colors.white} />
            </TouchableOpacity>
            <View style={styles.audioProgress}>
              <View style={styles.audioProgressBar}>
                <View 
                  style={[
                    styles.audioProgressFill, 
                    { width: `${(entry.audioProgress || 0) * 100}%` }
                  ]} 
                />
              </View>
              <View style={styles.audioTimeContainer}>
                <Text style={styles.audioTime}>
                  {Math.floor(((entry.audioProgress || 0) * 225))}:{Math.floor(((entry.audioProgress || 0) * 225) % 60).toString().padStart(2, '0')}
                </Text>
                <Text style={styles.audioTime}>{entry.audioDuration}</Text>
              </View>
            </View>
          </View>
        );
      
      case 'photos':
        return (
          <TouchableOpacity 
            style={styles.photoGrid}
            onPress={() => handleViewPhotos(entry.id)}
          >
            <View style={styles.photoItem}>
              <Image source={{ uri: entry.thumbnail }} style={styles.photoImage} />
            </View>
            <View style={styles.photoItem}>
              <Image source={{ uri: entry.thumbnail }} style={styles.photoImage} />
            </View>
            <View style={styles.photoItem}>
              <Image source={{ uri: entry.thumbnail }} style={styles.photoImage} />
              <View style={styles.photoOverlay}>
                <Text style={styles.photoOverlayText}>+{(entry.photoCount || 1) - 3}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      
      default:
        return null;
    }
  };

  const renderTimelineEntry = (entry: TimelineEntry) => {
    const categoryColor = getCategoryColor(entry.category);
    const categoryIcon = getCategoryIcon(entry.category);
    const mediaIcon = getMediaTypeIcon(entry.mediaType);

    return (
      <View key={entry.id} style={styles.entryCard}>
        <View style={styles.entryHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: categoryColor + '20' }]}>
            <Ionicons name={categoryIcon} size={20} color={categoryColor} />
          </View>
          <View style={styles.entryInfo}>
            <Text style={styles.entryTitle}>{entry.title}</Text>
            <Text style={styles.entryDate}>{entry.date}</Text>
          </View>
        </View>
        
        <Text style={styles.entryDescription}>{entry.description}</Text>
        
        {renderMediaContent(entry)}
        
        <View style={styles.entryFooter}>
          <View style={styles.entryTags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{entry.category}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{entry.mediaType}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.entryOptionsButton}
            onPress={() => handleEntryOptions(entry.id)}
          >
            <Ionicons name="ellipsis-vertical" size={16} color={theme.colors.gray[500]} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const groupEntriesByMonth = (entries: TimelineEntry[]) => {
    const grouped: { [key: string]: TimelineEntry[] } = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.date);
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(entry);
    });
    
    return grouped;
  };

  const filteredEntries = selectedCategory === 'All' 
    ? entries 
    : entries.filter(entry => entry.category === selectedCategory);
  
  const groupedEntries = groupEntriesByMonth(filteredEntries);

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
        {Object.entries(groupedEntries).map(([month, monthEntries]) => (
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
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
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
  photoGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  photoItem: {
    flex: 1,
    height: 80,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoOverlayText: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.medium,
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
});

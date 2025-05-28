import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface CapsuleCategory {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  progress: number;
  color: string;
  backgroundColor: string;
}

interface ViewMode {
  id: 'grid' | 'list';
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const MacroCapsuleScreen: React.FC = () => {
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');

  const categories: CapsuleCategory[] = [
    {
      id: 'childhood',
      title: 'Childhood',
      description: 'Early memories and formative experiences',
      icon: 'happy-outline',
      progress: 35,
      color: theme.colors.primary,
      backgroundColor: theme.colors.primary + '20',
    },
    {
      id: 'education',
      title: 'Education',
      description: 'School years and learning journeys',
      icon: 'school-outline',
      progress: 65,
      color: '#F5B0CB',
      backgroundColor: '#F5B0CB20',
    },
    {
      id: 'career',
      title: 'Career',
      description: 'Professional milestones and work life',
      icon: 'briefcase-outline',
      progress: 50,
      color: '#FFD166',
      backgroundColor: '#FFD16620',
    },
    {
      id: 'family',
      title: 'Family',
      description: 'Relationships and family moments',
      icon: 'home-outline',
      progress: 75,
      color: theme.colors.primary,
      backgroundColor: theme.colors.primary + '20',
    },
    {
      id: 'travel',
      title: 'Travel',
      description: 'Adventures and places visited',
      icon: 'airplane-outline',
      progress: 20,
      color: '#F5B0CB',
      backgroundColor: '#F5B0CB20',
    },
    {
      id: 'milestones',
      title: 'Milestones',
      description: 'Life-changing events and achievements',
      icon: 'trophy-outline',
      progress: 40,
      color: '#FFD166',
      backgroundColor: '#FFD16620',
    },
  ];

  const viewModes: ViewMode[] = [
    { id: 'grid', title: 'Grid', icon: 'grid-outline' },
    { id: 'list', title: 'List', icon: 'list-outline' },
  ];

  const handleCategoryPress = (category: CapsuleCategory) => {
    Alert.alert(
      category.title,
      `Open ${category.title} capsule with ${category.progress}% completion`
    );
  };

  const handleCreateCustomCapsule = () => {
    Alert.alert(
      'Create Custom Capsule',
      'Design a category that\'s unique to you'
    );
  };

  const handleSearch = () => {
    Alert.alert('Search', 'Search through your capsules');
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', 'View your notifications');
  };

  const handleFilter = () => {
    Alert.alert('Filter', 'Filter capsules by criteria');
  };

  const renderCapsuleCard = (category: CapsuleCategory) => (
    <TouchableOpacity
      key={category.id}
      style={styles.capsuleCard}
      onPress={() => handleCategoryPress(category)}
      activeOpacity={0.7}
    >
      {/* Icon Container */}
      <View style={[styles.iconContainer, { backgroundColor: category.backgroundColor }]}>
        <View style={[styles.iconCircle, { backgroundColor: category.color + '40' }]}>
          <Ionicons name={category.icon} size={32} color={category.color} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        <Text style={styles.categoryTitle}>{category.title}</Text>
        <Text style={styles.categoryDescription}>{category.description}</Text>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${category.progress}%`,
                  backgroundColor: category.color 
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: category.color }]}>
            {category.progress}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCreateCustomCard = () => (
    <TouchableOpacity
      style={styles.createCustomCard}
      onPress={handleCreateCustomCapsule}
      activeOpacity={0.7}
    >
      <View style={styles.createIconContainer}>
        <Ionicons name="add" size={32} color={theme.colors.primary} />
      </View>
      <Text style={styles.createTitle}>Create Custom Capsule</Text>
      <Text style={styles.createDescription}>Design a category that's unique to you</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons name="arrow-back" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Life Categories</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton} onPress={handleSearch}>
              <Ionicons name="search" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleNotifications}>
              <Ionicons name="notifications" size={20} color={theme.colors.primary} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>
          Select a category to explore or create memories
        </Text>
      </View>

      {/* View Toggle */}
      <View style={styles.viewToggle}>
        <View style={styles.viewButtons}>
          {viewModes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[
                styles.viewButton,
                activeView === mode.id && styles.activeViewButton
              ]}
              onPress={() => setActiveView(mode.id)}
            >
              <Ionicons 
                name={mode.icon} 
                size={14} 
                color={activeView === mode.id ? theme.colors.white : theme.colors.dark}
                style={styles.viewButtonIcon}
              />
              <Text style={[
                styles.viewButtonText,
                activeView === mode.id && styles.activeViewButtonText
              ]}>
                {mode.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
          <Ionicons name="filter" size={14} color={theme.colors.dark} style={styles.filterIcon} />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Capsule Grid */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.capsuleGrid}>
          {categories.map(renderCapsuleCard)}
        </View>
        
        {/* Create Custom Capsule */}
        <View style={styles.createCustomContainer}>
          {renderCreateCustomCard()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F7FF',
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.dark,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F5B0CB',
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: '#6B7280',
    marginTop: 4,
  },
  viewToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  viewButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F9F7FF',
  },
  activeViewButton: {
    backgroundColor: theme.colors.primary,
  },
  viewButtonIcon: {
    marginRight: 6,
  },
  viewButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.dark,
  },
  activeViewButtonText: {
    color: theme.colors.white,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F9F7FF',
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.dark,
  },
  scrollView: {
    flex: 1,
  },
  capsuleGrid: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  capsuleCard: {
    width: '48%',
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  iconContainer: {
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: theme.spacing.md,
  },
  categoryTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
    color: theme.colors.dark,
  },
  categoryDescription: {
    fontSize: theme.typography.fontSize.xs,
    color: '#6B7280',
    marginTop: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '500',
    marginLeft: theme.spacing.sm,
  },
  createCustomContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 100, // Space for bottom navigation
  },
  createCustomCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.primary + '30',
    borderStyle: 'dashed',
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  createTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  createDescription: {
    fontSize: theme.typography.fontSize.xs,
    color: '#6B7280',
    marginTop: 4,
  },
});

export default MacroCapsuleScreen;

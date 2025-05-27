import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  active?: boolean;
}

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
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

const recentActivity: ActivityItem[] = [
  {
    id: '1',
    title: 'First Day at College',
    description: 'Added 3 photos • 2 days ago',
    icon: 'image-outline',
    iconColor: theme.colors.secondary,
    iconBg: theme.colors.secondary + '20',
  },
  {
    id: '2',
    title: 'My First Job Interview',
    description: 'Added audio • 4 days ago',
    icon: 'mic-outline',
    iconColor: theme.colors.primary,
    iconBg: theme.colors.primary + '20',
  },
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

  const renderActivityItem = (item: ActivityItem) => (
    <TouchableOpacity key={item.id} style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: item.iconBg }]}>
        <Ionicons name={item.icon} size={24} color={item.iconColor} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDescription}>{item.description}</Text>
      </View>
      <TouchableOpacity style={styles.activityChevron}>
        <Ionicons name="chevron-forward" size={16} color={theme.colors.gray[400]} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderTimelineItem = (item: TimelineItem, index: number) => (
    <View key={item.id} style={styles.timelineItem}>
      <View style={[styles.timelineDot, { backgroundColor: item.dotColor }]} />
      <View style={styles.timelineCard}>
        <View style={styles.timelineHeader}>
          <Text style={styles.timelineTitle}>{item.title}</Text>
          <Text style={styles.timelineYear}>{item.year}</Text>
        </View>
        <Text style={styles.timelineDescription}>{item.description}</Text>
        <View style={styles.timelineTags}>
          {item.tags.map((tag, tagIndex) => (
            <View key={tagIndex} style={styles.timelineTag}>
              <Text style={styles.timelineTagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logo}>
            <Ionicons name="hourglass-outline" size={20} color={theme.colors.white} />
          </View>
          <Text style={styles.appTitle}>MemoryCapsule</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={20} color={theme.colors.dark} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <Image
              source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
          <View style={styles.promptCard}>
            <View style={styles.promptHeader}>
              <Text style={styles.sectionTitle}>Today's Prompt</Text>
              <TouchableOpacity>
                <Text style={styles.refreshButton}>Refresh</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.promptText}>
              What was your favorite childhood toy and why was it special to you?
            </Text>
            <View style={styles.promptActions}>
              <TouchableOpacity style={styles.promptAction}>
                <Ionicons name="videocam-outline" size={16} color={theme.colors.primary} />
                <Text style={styles.promptActionText}>Video</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.promptAction}>
                <Ionicons name="mic-outline" size={16} color={theme.colors.primary} />
                <Text style={styles.promptActionText}>Audio</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.promptAction}>
                <Ionicons name="create-outline" size={16} color={theme.colors.primary} />
                <Text style={styles.promptActionText}>Text</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllButton}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityList}>
            {recentActivity.map(renderActivityItem)}
          </View>
        </View>

        {/* Timeline Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Timeline</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllButton}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.timelineContainer}>
            <View style={styles.timelineLine} />
            {timelineItems.map(renderTimelineItem)}
          </View>
        </View>

        {/* Bottom spacing for floating button */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={24} color={theme.colors.white} />
      </TouchableOpacity>
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
  logo: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  notificationButton: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.light,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    backgroundColor: theme.colors.secondary,
    borderRadius: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
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
  refreshButton: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
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
});

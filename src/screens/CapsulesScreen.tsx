import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MacroCapsule } from '../types/capsule';
import { CapsuleService } from '../services/capsuleService';
import { theme } from '../theme';

/**
 * Screen that displays the list of available MacroCapsules
 */
const CapsulesScreen = () => {
  const navigation = useNavigation();
  const [capsules, setCapsules] = useState<MacroCapsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCapsules();
  }, []);

  const loadCapsules = async () => {
    try {
      setLoading(true);
      const capsuleData = await CapsuleService.loadCapsules();
      setCapsules(capsuleData);
      setError(null);
    } catch (err) {
      console.error('Error loading capsules:', err);
      setError('Failed to load capsules. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCapsulePress = (capsule: MacroCapsule) => {
    navigation.navigate('CapsuleDetail', { capsuleId: capsule.id, title: capsule.title });
  };

  const renderCapsuleItem = ({ item }: { item: MacroCapsule }) => {
    const completedCount = item.completedCount || 0;
    const totalPrompts = item.prompts.length;
    const progressPercentage = totalPrompts > 0 ? (completedCount / totalPrompts) * 100 : 0;
    
    return (
      <TouchableOpacity 
        style={styles.capsuleItem}
        onPress={() => handleCapsulePress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon as any} size={28} color={theme.colors.primary} />
        </View>
        
        <View style={styles.capsuleContent}>
          <Text style={styles.capsuleTitle}>{item.title}</Text>
          <Text style={styles.capsuleDescription}>
            {item.description || `${totalPrompts} prompts to explore`}
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progressPercentage}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {completedCount}/{totalPrompts} completed
            </Text>
          </View>
        </View>
        
        <Ionicons name="chevron-forward" size={24} color={theme.colors.text.secondary} />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading capsules...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadCapsules}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Memory Capsules</Text>
      <Text style={styles.headerSubtitle}>
        Capture and preserve your life stories through guided prompts
      </Text>
      
      <FlatList
        data={capsules}
        renderItem={renderCapsuleItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={64} color={theme.colors.text.secondary} />
            <Text style={styles.emptyText}>No capsules available</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  headerTitle: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
  },
  listContainer: {
    paddingBottom: theme.spacing.xl,
  },
  capsuleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary + '10', // 10% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  capsuleContent: {
    flex: 1,
  },
  capsuleTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs / 2,
  },
  capsuleDescription: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: theme.colors.gray[200],
    borderRadius: 2,
    marginRight: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  progressText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    minWidth: 70,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.sm,
  },
  retryButtonText: {
    ...theme.typography.button,
    color: theme.colors.text.inverse,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
});

export default CapsulesScreen;

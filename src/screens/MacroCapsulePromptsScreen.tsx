import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MacroCapsule, CapsulePrompt } from '../types/capsule';
import { getCapsuleById } from '../services/capsuleService';
import { theme } from '../theme';

// Define the route params type
type MacroCapsulePromptsRouteParams = {
  CapsuleDetail: {
    capsuleId: string;
    title: string;
  };
};

/**
 * Screen that displays the prompts for a selected MacroCapsule
 */
const MacroCapsulePromptsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MacroCapsulePromptsRouteParams, 'CapsuleDetail'>>();
  const { capsuleId, title } = route.params;
  
  const [capsule, setCapsule] = useState<MacroCapsule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCapsuleDetails();
  }, [capsuleId]);

  const loadCapsuleDetails = async () => {
    try {
      setLoading(true);
      const capsuleData = await getCapsuleById(capsuleId);
      
      if (!capsuleData) {
        setError('Capsule not found');
        return;
      }
      
      setCapsule(capsuleData);
      setError(null);
    } catch (err) {
      console.error('Error loading capsule details:', err);
      setError('Failed to load capsule details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePromptPress = (prompt: CapsulePrompt) => {
    // navigation.navigate('PromptResponse', { 
      // promptId: prompt.id,
      // promptText: prompt.text,
      // capsuleTitle: capsule?.title || ''
    // });
    console.log('Navigate to PromptResponse with prompt:', prompt.id);
  };

  const renderPromptItem = ({ item, index }: { item: CapsulePrompt; index: number }) => {
    const hasResponse = !!item.response;
    
    return (
      <TouchableOpacity 
        style={[
          styles.promptItem,
          hasResponse && styles.promptItemCompleted
        ]}
        onPress={() => handlePromptPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.promptNumberContainer}>
          <Text style={styles.promptNumber}>{index + 1}</Text>
        </View>
        
        <View style={styles.promptContent}>
          <Text style={styles.promptText}>{item.text}</Text>
          
          {hasResponse ? (
            <View style={styles.responseIndicator}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={styles.responseText}>Response saved</Text>
            </View>
          ) : (
            <View style={styles.responseIndicator}>
              <Ionicons name="ellipse-outline" size={16} color={theme.colors.text.secondary} />
              <Text style={styles.responseText}>Tap to respond</Text>
            </View>
          )}
        </View>
        
        <Ionicons 
          name={hasResponse ? "create-outline" : "chevron-forward-outline"} 
          size={24} 
          color={theme.colors.text.secondary} 
        />
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    if (!capsule) return null;
    
    const completedCount = capsule.prompts.filter(p => p.response).length;
    const totalPrompts = capsule.prompts.length;
    const progressPercentage = totalPrompts > 0 ? (completedCount / totalPrompts) * 100 : 0;
    
    return (
      <View style={styles.headerContainer}>
        <View style={styles.iconHeaderContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name={capsule.icon as any} size={32} color={theme.colors.primary} />
          </View>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{capsule.title}</Text>
            <Text style={styles.headerSubtitle}>
              {capsule.description || 'Capture your memories through these prompts'}
            </Text>
          </View>
        </View>
        
        <View style={styles.progressSection}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progressPercentage}%` }
                ]} 
              />
            </View>
          </View>
          
          <Text style={styles.progressText}>
            {completedCount} of {totalPrompts} completed
          </Text>
        </View>
        
        <Text style={styles.promptsTitle}>Prompts</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading capsule details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !capsule) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
          <Text style={styles.errorText}>{error || 'Capsule not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadCapsuleDetails}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitleSmall}>{title}</Text>
          
          <View style={styles.headerRight} />
        </View>
        
        <FlatList
          data={capsule.prompts}
          renderItem={renderPromptItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color={theme.colors.text.secondary} />
              <Text style={styles.emptyText}>No prompts available</Text>
            </View>
          }
        />
      </View>
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
  headerTitleSmall: {
    ...theme.typography.body, // Was h3
    color: theme.colors.text.primary,
  },
  headerRight: {
    width: 40, // To balance the header
  },
  headerContainer: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  iconHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary + '10', // 10% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    ...theme.typography.body, // Was h1
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  progressSection: {
    marginBottom: theme.spacing.lg,
  },
  progressContainer: {
    marginBottom: theme.spacing.xs,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.gray[200],
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  progressText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    textAlign: 'right',
  },
  promptsTitle: {
    ...theme.typography.body, // Was h2
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  listContainer: {
    paddingBottom: theme.spacing.xl, // Was xxl
  },
  promptItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  promptItemCompleted: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
  },
  promptNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  promptNumber: {
    ...theme.typography.caption, // Was subtitle
    color: theme.colors.text.primary,
  },
  promptContent: {
    flex: 1,
  },
  promptText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  responseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  responseText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
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
    borderRadius: theme.borderRadius.md,
  },
  retryButtonText: {
    ...theme.typography.button,
    color: theme.colors.text.inverse,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl, // Was xxl
    marginHorizontal: theme.spacing.lg,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
});

export default MacroCapsulePromptsScreen;

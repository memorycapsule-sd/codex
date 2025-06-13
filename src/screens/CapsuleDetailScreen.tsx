import React, { useEffect, useState, useRef, useLayoutEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Alert, TouchableOpacity, SafeAreaView, Modal, Share } from 'react-native';
import { RouteProp, useRoute, useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CapsulesStackParamList } from '../navigation/CapsulesNavigator';
import { TabNavigatorParamList } from '../navigation/TabNavigator';
import { getCapsuleResponseById, deleteCapsule } from '../services/capsuleService';
import { CapsuleEntry, CapsuleResponse } from '../types/capsule';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

// Define the type for the route parameters
type CapsuleDetailScreenRouteProp = RouteProp<CapsulesStackParamList, 'CapsuleDetailScreen'>;

// Create a composite navigation prop type
type CapsuleDetailScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabNavigatorParamList, 'Capsules'>,
  NativeStackNavigationProp<CapsulesStackParamList>
>;

const CapsuleDetailScreen: React.FC = () => {
  const route = useRoute<CapsuleDetailScreenRouteProp>();
  console.log('[CapsuleDetailScreen] Initial route.params:', JSON.stringify(route.params)); // Log initial params
  const navigation = useNavigation<CapsuleDetailScreenNavigationProp>();
  const { capsuleId } = route.params;
  console.log('[CapsuleDetailScreen] Extracted capsuleId:', capsuleId); // Log extracted capsuleId

  const [capsule, setCapsule] = useState<CapsuleResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<CapsuleEntry | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: capsule?.capsuleTitle || 'Capsule Details',
      headerRight: () => (
        <TouchableOpacity onPress={() => capsule && navigation.navigate('EditCapsule', { capsuleId: capsule.id! })}>
          <Ionicons name="pencil-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, capsule]);

  useEffect(() => {
    const fetchCapsuleData = async () => {
      console.log('[CapsuleDetailScreen] fetchCapsuleData called with capsuleId:', capsuleId); // Log capsuleId at fetch time
      if (!capsuleId) {
        setError('No capsule ID provided.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const fetchedCapsule = await getCapsuleResponseById(capsuleId);
        if (fetchedCapsule) {
          setCapsule(fetchedCapsule);
          setError(null); // Clear any previous error on successful fetch
        } else {
          setError('Capsule not found.');
        }
      } catch (err) {
        setError('Failed to load capsule data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCapsuleData();
  }, [capsuleId]);

  const { featuredMedia, journalEntry, galleryMedia } = useMemo(() => {
    if (!capsule?.entries) return { featuredMedia: null, journalEntry: null, galleryMedia: [] };

    const mediaEntries = capsule.entries.filter(e => e.type === 'photo' || e.type === 'video');
    const textEntries = capsule.entries.filter(e => e.type === 'text');

    const featuredMedia = mediaEntries.length > 0 ? mediaEntries[0] : null;
    const journalEntry = textEntries.length > 0 ? textEntries[0] : null;
    const galleryMedia = mediaEntries.slice(1); // All media except the first one

    return { featuredMedia, journalEntry, galleryMedia };
  }, [capsule]);

  const displayDate = useMemo(() => {
    if (!capsule?.createdAt) return null;
    const date = new Date(capsule.createdAt);
    const dateString = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${dateString} ・ ${timeString}`;
  }, [capsule?.createdAt]);

  const displayLocation = useMemo(() => {
    const locationEntry = featuredMedia || capsule?.entries.find(e => e.metadata?.location?.address);
    return locationEntry?.metadata?.location?.address || null;
  }, [featuredMedia, capsule?.entries]);

  const displayTags = useMemo(() => {
    const allTags = new Set<string>();
    if (capsule?.tags) {
      capsule.tags.forEach(tag => allTags.add(tag));
    }
    capsule?.entries?.forEach(entry => {
      if (entry.metadata?.tags) {
        entry.metadata.tags.forEach(tag => allTags.add(tag));
      }
    });
    return Array.from(allTags);
  }, [capsule]);

  const displayPeople = useMemo(() => {
    const allPeople = new Set<string>();
    capsule?.entries?.forEach(entry => {
      if (entry.metadata?.people) {
        entry.metadata.people.forEach(person => allPeople.add(person));
      }
    });
    return Array.from(allPeople);
  }, [capsule]);

  const handleShare = async () => {
    if (!capsule) return;
    try {
      await Share.share({
        message: `Check out this memory capsule: ${capsule.capsuleTitle}`,
        // In the future, we can add a URL to a web version of the capsule here
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share this capsule.');
    }
  };

  const handleDelete = () => {
    if (!capsule?.id) return;

    Alert.alert(
      'Delete Capsule',
      'Are you sure you want to permanently delete this capsule? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteCapsule(capsule.id!);
              navigation.goBack();
            } catch (err) {
              setLoading(false);
              setError('Failed to delete the capsule. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderFeaturedMedia = () => {
    if (!featuredMedia) {
      return <View style={styles.featuredMediaPlaceholder} />;
    }
    if (featuredMedia.type === 'photo') {
      return <Image source={{ uri: featuredMedia.mediaUri }} style={styles.featuredMedia} />;
    }
    if (featuredMedia.type === 'video') {
      return (
        <Video
          source={{ uri: featuredMedia.mediaUri! }}
          style={styles.featuredMedia}
          useNativeControls
          resizeMode="cover"
        />
      );
    }
    return <View style={styles.featuredMediaPlaceholder} />;
  };

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" color={theme.colors.primary} />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!capsule) {
    return <View style={styles.centered}><Text>Capsule data could not be loaded.</Text></View>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderFeaturedMedia()}

        <View style={styles.contentContainer}>
          {/* --- METADATA --- */}
          <View style={styles.metadataContainer}>
            <Text style={styles.title}>{capsule.capsuleTitle}</Text>
            {displayDate && <Text style={styles.metadataText}>{displayDate}</Text>}
            {displayLocation && <Text style={styles.metadataText}>{displayLocation}</Text>}
          </View>

          {/* --- JOURNAL ENTRY --- */}
          {journalEntry && (
            <View style={styles.sectionContainer}>
              <Text style={styles.journalText}>{journalEntry.textContent}</Text>
            </View>
          )}

          {/* --- MEDIA GALLERY --- */}
          {galleryMedia.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Photos & Media</Text>
              <View style={styles.galleryContainer}>
                {galleryMedia.map(item => (
                  <TouchableOpacity key={item.id} onPress={() => setSelectedMedia(item)}>
                    <Image source={{ uri: item.mediaUri }} style={styles.galleryItem} />
                    {item.type === 'video' && (
                      <View style={styles.playIconContainer}>
                        <Ionicons name="play-circle" size={48} color="rgba(255,255,255,0.8)" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* --- TAGS --- */}
          {displayTags.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {displayTags.map(tag => (
                  <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
                ))}
              </View>
            </View>
          )}

          {/* --- PEOPLE --- */}
          {displayPeople.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>People In This Memory</Text>
              <View style={styles.peopleContainer}>
                {displayPeople.map(person => (
                  <View key={person} style={styles.personContainer}>
                    <View style={styles.avatarPlaceholder}>
                      <Ionicons name="person" size={24} color={theme.colors.text.secondary} />
                    </View>
                    <Text style={styles.personName}>{person}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* --- BOTTOM ACTION BAR --- */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBarButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.bottomBarText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarButton} onPress={() => navigation.navigate('EditCapsule', { capsuleId: capsule.id! })}>
          <Ionicons name="pencil-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.bottomBarText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={24} color={theme.colors.error} />
          <Text style={[styles.bottomBarText, { color: theme.colors.error }]}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* --- MEDIA VIEWER MODAL --- */}
      {selectedMedia && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedMedia(null)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSelectedMedia(null)}>
              <Ionicons name="close" size={32} color={theme.colors.white} />
            </TouchableOpacity>
            {selectedMedia.type === 'photo' ? (
              <Image source={{ uri: selectedMedia.mediaUri }} style={styles.modalImage} resizeMode="contain" />
            ) : (
              <Video
                source={{ uri: selectedMedia.mediaUri! }}
                style={styles.modalVideo}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
              />
            )}
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.light,
  },
  scrollContainer: {
    padding: theme.spacing.md,
    paddingBottom: 80, // Space for FAB
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  metadataContainer: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.title,
    marginBottom: theme.spacing.xs,
  },
  metadataText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  sectionContainer: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.subtitle,
    marginBottom: theme.spacing.xs,
  },
  journalText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryItem: {
    width: '48%',
    height: 150,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  playIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: theme.borderRadius.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xs,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  tagText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  peopleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.lg,
  },
  personContainer: {
    alignItems: 'center',
    width: 80,
    gap: theme.spacing.sm,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  personName: {
    ...theme.typography.caption,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '80%',
  },
  modalVideo: {
    width: '100%',
    height: '80%',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  bottomBarButton: {
    alignItems: 'center',
  },
  bottomBarText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  featuredMedia: {
    width: '100%',
    height: 250,
    borderRadius: theme.borderRadius.md,
  },
  featuredMediaPlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
});

export default CapsuleDetailScreen;

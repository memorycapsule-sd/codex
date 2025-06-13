import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import { RouteProp, useRoute, useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CapsulesStackParamList } from '../navigation/CapsulesNavigator';
import { TabNavigatorParamList } from '../navigation/TabNavigator';
import * as CapsuleService from '../services/capsuleService';
import { CapsuleResponse, CapsuleEntry } from '../types/capsule';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

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
  const videoRef = useRef<Video>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: capsule?.capsuleTitle || 'Capsule Details',
      headerRight: () => (
        <TouchableOpacity onPress={() => capsule && navigation.navigate('EditCapsuleScreen', { capsuleId: capsule.id! })}>
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
        const fetchedCapsule = await CapsuleService.getCapsuleResponseById(capsuleId);
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

  const renderEntryContent = (entry: CapsuleEntry) => {
    const mediaStyle = styles.media;
    switch (entry.type) {
      case 'text':
        console.log('[CapsuleDetailScreen] Rendering text entry:', JSON.stringify(entry));
        return (
          <View style={styles.textEntryContainer}>
            <Text style={styles.entryText}>{entry.textContent || '[No text content]'}</Text>
          </View>
        );
      case 'photo':
        if (!entry.mediaUri) {
          return (
            <View style={[styles.mediaContainer, styles.centered]}>
              <Ionicons name="image-outline" size={48} color={theme.colors.gray[400]} />
              <Text style={styles.errorText}>Photo not available</Text>
            </View>
          );
        }
        return <Image source={{ uri: entry.mediaUri }} style={mediaStyle} resizeMode="cover" />;
      case 'video':
        if (!entry.mediaUri) {
          return (
            <View style={[styles.mediaContainer, styles.centered]}>
              <Ionicons name="videocam-outline" size={48} color={theme.colors.gray[400]} />
              <Text style={styles.errorText}>Video not available</Text>
            </View>
          );
        }
        const isVideoActive = activeVideoId === entry.id;
        return (
          <View style={styles.mediaContainer}>
            <Video
              ref={isVideoActive ? videoRef : null}
              source={{ uri: entry.mediaUri }}
              style={styles.media}
              resizeMode={ResizeMode.COVER}
              isLooping
              useNativeControls={false}
              onPlaybackStatusUpdate={status => {
                if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
                  setActiveVideoId(null);
                }
              }}
            />
            {!isVideoActive && (
              <TouchableOpacity style={styles.videoControls} onPress={() => setActiveVideoId(entry.id)}>
                <Ionicons name="play-circle" size={64} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
            )}
          </View>
        );
      case 'audio':
        if (!entry.mediaUri) {
          return (
            <View style={[styles.audioContainer, styles.centered]}>
              <Ionicons name="mic-outline" size={48} color={theme.colors.gray[400]} />
              <Text style={styles.errorText}>Audio not available</Text>
            </View>
          );
        }
        return (
          <View style={styles.audioContainer}>
            <TouchableOpacity onPress={() => Alert.alert('Play Audio', 'Audio playback not implemented yet.')}>
              <Ionicons name="play-circle-outline" size={48} color={theme.colors.primary} />
            </TouchableOpacity>
            <Text style={styles.audioText}>Audio Entry</Text>
          </View>
        );
      default:
        return (
          <View style={styles.textEntryContainer}>
            <Text style={styles.errorText}>[Unknown or invalid entry type: {entry.type}]</Text>
          </View>
        );
    }
  };

  const renderEntryMetadata = (entry: CapsuleEntry) => (
    <View style={styles.entryMetadataContainer}>
      {entry.createdAt && (
        <Text style={styles.entryDate}>
          {new Date(entry.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
      )}
      {entry.metadata?.userDescription && (
        <Text style={styles.entryDescriptionText}>{entry.metadata.userDescription}</Text>
      )}
    </View>
  );

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
        {capsule.entries && capsule.entries.length > 0 ? (
          capsule.entries.map(entry => (
            <View key={entry.id} style={styles.entryCard}>
              {renderEntryContent(entry)}
              {renderEntryMetadata(entry)}
            </View>
          ))
        ) : (
          <View style={styles.centered}>
            <Text>This capsule has no entries yet.</Text>
          </View>
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Create', { capsuleId: capsule!.id, existingCapsuleTitle: capsule?.capsuleTitle })}
      >
        <LinearGradient
          colors={['#42275a', '#734b6d']}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={30} color={theme.colors.white} />
        </LinearGradient>
      </TouchableOpacity>
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
  entryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: 250,
  },
  mediaContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#000',
  },
  videoControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  textEntryContainer: {
    padding: theme.spacing.lg,
  },
  entryText: {
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.fontSize * theme.typography.body.lineHeight,
    color: theme.colors.text.primary,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  audioText: {
    ...theme.typography.body,
    marginLeft: theme.spacing.md,
    color: theme.colors.text.secondary,
  },
  entryMetadataContainer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  entryDate: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  entryDescriptionText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    ...theme.shadows.lg,
  },
  fabGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
});

export default CapsuleDetailScreen;

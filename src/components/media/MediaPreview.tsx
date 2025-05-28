import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageStyle,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Audio } from 'expo-av';
import { MediaFile, MediaService } from '../../services/media';
import { theme } from '../../theme';

interface MediaPreviewProps {
  mediaFile: MediaFile;
  onRemove?: () => void;
  onEdit?: () => void;
  style?: any;
  showControls?: boolean;
}

const { width } = Dimensions.get('window');

export function MediaPreview({
  mediaFile,
  onRemove,
  onEdit,
  style,
  showControls = true,
}: MediaPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const videoRef = useRef<Video>(null);

  const handlePlayPause = async () => {
    if (mediaFile.type === 'video' && videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else if (mediaFile.type === 'audio') {
      if (isPlaying && sound) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        if (sound) {
          await sound.playAsync();
        } else {
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: mediaFile.uri },
            { shouldPlay: true },
            onPlaybackStatusUpdate
          );
          setSound(newSound);
        }
        setIsPlaying(true);
      }
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPlaybackPosition(status.positionMillis || 0);
      setPlaybackDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying || false);

      if (status.didJustFinish) {
        setIsPlaying(false);
        setPlaybackPosition(0);
      }
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      Alert.alert(
        'Remove Media',
        'Are you sure you want to remove this media file?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: onRemove },
        ]
      );
    }
  };

  const renderImagePreview = () => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: mediaFile.uri }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.imageOverlay}>
        <Ionicons name="image" size={24} color={theme.colors.text.primary} />
      </View>
    </View>
  );

  const renderVideoPreview = () => (
    <View style={styles.videoContainer}>
      <Video
        ref={videoRef}
        source={{ uri: mediaFile.uri }}
        style={styles.video}
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
      />
      <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={32}
          color={theme.colors.text.primary}
        />
      </TouchableOpacity>
      {playbackDuration > 0 && (
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${(playbackPosition / playbackDuration) * 100}%`,
              },
            ]}
          />
        </View>
      )}
    </View>
  );

  const renderAudioPreview = () => (
    <View style={styles.audioContainer}>
      <View style={styles.audioIcon}>
        <Ionicons name="musical-notes" size={32} color={theme.colors.primary} />
      </View>
      <View style={styles.audioInfo}>
        <Text style={styles.audioTitle}>Audio Recording</Text>
        <Text style={styles.audioDuration}>
          {MediaService.formatDuration(mediaFile.duration || 0)}
        </Text>
        {playbackDuration > 0 && (
          <View style={styles.audioProgressContainer}>
            <Text style={styles.audioTime}>
              {MediaService.formatDuration(playbackPosition)}
            </Text>
            <View style={styles.audioProgressTrack}>
              <View
                style={[
                  styles.audioProgressBar,
                  {
                    width: `${(playbackPosition / playbackDuration) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.audioTime}>
              {MediaService.formatDuration(playbackDuration)}
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.audioPlayButton} onPress={handlePlayPause}>
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={24}
          color={theme.colors.text.primary}
        />
      </TouchableOpacity>
    </View>
  );

  const renderMediaContent = () => {
    switch (mediaFile.type) {
      case 'image':
        return renderImagePreview();
      case 'video':
        return renderVideoPreview();
      case 'audio':
        return renderAudioPreview();
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, style]}>
      {renderMediaContent()}
      
      <View style={styles.mediaInfo}>
        <View style={styles.mediaDetails}>
          <Text style={styles.fileName} numberOfLines={1}>
            {mediaFile.filename}
          </Text>
          <Text style={styles.fileSize}>
            {MediaService.formatFileSize(mediaFile.size)}
          </Text>
        </View>

        {showControls && (
          <View style={styles.controls}>
            {onEdit && (
              <TouchableOpacity style={styles.controlButton} onPress={onEdit}>
                <Ionicons name="create" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            )}
            {onRemove && (
              <TouchableOpacity style={styles.controlButton} onPress={handleRemove}>
                <Ionicons name="trash" size={20} color={theme.colors.error} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: theme.spacing.md,
  } as ImageStyle,
  imageOverlay: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    position: 'relative',
    borderRadius: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: theme.colors.border.light,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
  },
  audioIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  audioInfo: {
    flex: 1,
  },
  audioTitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  audioDuration: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
  },
  audioProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  audioTime: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
    minWidth: 40,
  },
  audioProgressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: theme.colors.border.light,
    borderRadius: 2,
    marginHorizontal: theme.spacing.sm,
  },
  audioProgressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  audioPlayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  mediaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  mediaDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  fileSize: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
  },
  controls: {
    flexDirection: 'row',
  },
  controlButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { MediaService, MediaFile } from '../../services/media';
import { theme } from '../../theme';

interface AudioRecorderProps {
  onRecordingComplete: (mediaFile: MediaFile) => void;
  maxDuration?: number; // in seconds
  style?: any;
}

export function AudioRecorder({
  onRecordingComplete,
  maxDuration = 300, // 5 minutes default
  style,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRecording) {
      // Start pulse animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      // Update duration every second
      interval = setInterval(() => {
        setRecordingDuration((prev) => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            handleStopRecording();
          }
          return newDuration;
        });
      }, 1000);
      setTimerInterval(interval);
    } else {
      pulseAnim.setValue(1);
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [isRecording, maxDuration]);

  const handleStartRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Please grant microphone permission to record audio.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const handleStopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      const mediaFile = await MediaService.stopAudioRecording(recording);
      
      if (mediaFile) {
        onRecordingComplete(mediaFile);
      }
      
      setRecording(null);
      setRecordingDuration(0);
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'Failed to stop recording. Please try again.');
    }
  };

  const handleCancelRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      setRecording(null);
      setRecordingDuration(0);
    } catch (error) {
      console.error('Error canceling recording:', error);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRemainingTime = (): string => {
    const remaining = maxDuration - recordingDuration;
    return formatDuration(remaining);
  };

  if (isRecording) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.title}>Audio Recording</Text>
        <Text style={styles.instruction}>
          Tap the microphone to start recording your memory
        </Text>

        <View style={styles.recordingContainer}>
          <Animated.View style={[styles.recordButton, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity
              style={[
                styles.recordButtonInner,
                isRecording ? styles.recordButtonRecording : styles.recordButtonIdle
              ]}
              onPress={isRecording ? handleStopRecording : handleStartRecording}
            >
              <Ionicons
                name={isRecording ? 'stop' : 'mic'}
                size={32}
                color={theme.colors.white}
              />
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.recordingInfo}>
            <Text style={styles.duration}>
              {MediaService.formatDuration(recordingDuration * 1000)}
            </Text>
            <Text style={styles.maxDuration}>
              Max: {MediaService.formatDuration(maxDuration * 1000)}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Audio Recording</Text>
      <Text style={styles.instruction}>
        Tap the microphone to start recording your memory
      </Text>

      <View style={styles.recordingContainer}>
        <Animated.View style={[styles.recordButton, { transform: [{ scale: pulseAnim }] }]}>
          <TouchableOpacity
            style={[
              styles.recordButtonInner,
              isRecording ? styles.recordButtonRecording : styles.recordButtonIdle
            ]}
            onPress={isRecording ? handleStopRecording : handleStartRecording}
          >
            <Ionicons
              name={isRecording ? 'stop' : 'mic'}
              size={32}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.recordingInfo}>
          <Text style={styles.maxDuration}>
            Max: {MediaService.formatDuration(maxDuration * 1000)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.md,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  instruction: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  recordingContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  recordButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonIdle: {
    backgroundColor: theme.colors.primary,
  },
  recordButtonRecording: {
    backgroundColor: theme.colors.error,
  },
  recordingInfo: {
    alignItems: 'center',
  },
  duration: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold as any,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  maxDuration: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
  },
});

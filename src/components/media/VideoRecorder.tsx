import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ExpoCamera from 'expo-camera';
import { CameraView } from 'expo-camera';
import { MediaFile } from '../../services/media';
import { theme } from '../../theme';

interface VideoRecorderProps {
  onVideoRecorded: (mediaFile: MediaFile) => void;
  onCancel: () => void;
  maxDuration?: number; // in seconds
}

const { width, height } = Dimensions.get('window');

export function VideoRecorder({ onVideoRecorded, onCancel, maxDuration = 300 }: VideoRecorderProps) {
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);
  // Use string literals to avoid TypeScript issues with enum imports
  const [cameraType, setCameraType] = useState<ExpoCamera.CameraType>('back');
  const [flashMode, setFlashMode] = useState('off');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [durationTimer, setDurationTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Use any type to avoid TypeScript issues with Camera ref
  const cameraRef = useRef<ExpoCamera.CameraView | null>(null);

  useEffect(() => {
    // Request camera and microphone permissions
    const requestPermissions = async () => {
      try {
        const { status: cameraStatus } = await ExpoCamera.Camera.requestCameraPermissionsAsync();
        const { status: micStatus } = await ExpoCamera.Camera.requestMicrophonePermissionsAsync();
        
        setHasPermissions(
          cameraStatus === 'granted' && micStatus === 'granted'
        );
        
        if (cameraStatus !== 'granted' || micStatus !== 'granted') {
          Alert.alert(
            'Permission required',
            'Camera and microphone permissions are needed to record videos.',
            [{ text: 'OK', onPress: onCancel }]
          );
        }
      } catch (error) {
        console.error('Error requesting permissions:', error);
        setHasPermissions(false);
        Alert.alert('Error', 'Failed to request camera permissions');
      }
    };
    
    requestPermissions();
    
    // Cleanup function to stop recording if component unmounts
    return () => {
      if (isRecording && cameraRef.current) {
        cameraRef.current.stopRecording();
      }
      if (durationTimer) {
        clearInterval(durationTimer);
      }
    };
  }, []);

  const toggleCameraType = () => {
    setCameraType(current => 
      current === 'back' ? 'front' : 'back'
    );
  };

  const toggleFlash = () => {
    setFlashMode(current => 
      current === 'off' ? 'on' : 'off'
    );
  };

  const startRecording = async () => {
    if (!cameraRef.current || isRecording) return;
    
    try {
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start a timer to track recording duration
      const timer = setInterval(() => {
        setRecordingDuration(prev => {
          if (prev >= maxDuration - 1) {
            stopRecording();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
      
      setDurationTimer(timer);
      
      // Start recording
      const videoOptions = {
        maxDuration,
        quality: '720p', // Use 720p for good quality/size balance
        mute: false,
      };
      
      const result = await cameraRef.current.recordAsync(videoOptions);
      
      // This will only execute after stopRecording is called
      if (durationTimer) {
        clearInterval(durationTimer);
        setDurationTimer(null);
      }
      
      // Process the recorded video
      if (result && result.uri) {
        const filename = result.uri.split('/').pop() || `video_${Date.now()}.mp4`;
        
        // Create MediaFile object to return
        const mediaFile: MediaFile = {
          id: Date.now().toString(),
          type: 'video',
          uri: result.uri,
          filename,
          size: 0, // We don't know the exact size here
          mimeType: 'video/mp4',
        };
        
        onVideoRecorded(mediaFile);
      } else {
        console.warn('Video recording finished, but no URI was returned or result was invalid.');
        // Ensure UI consistency if it was still showing recording (this cleanup might already be handled before this block)
        if (isRecording) setIsRecording(false);
        if (durationTimer) { clearInterval(durationTimer); setDurationTimer(null); }
        onCancel(); // Notify calling component that recording was not successful
      }
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Recording Error', 'Failed to record video');
      setIsRecording(false);
      if (durationTimer) {
        clearInterval(durationTimer);
        setDurationTimer(null);
      }
    }
  };

  const stopRecording = () => {
    if (!cameraRef.current || !isRecording) return;
    
    try {
      cameraRef.current.stopRecording();
      setIsRecording(false);
      
      if (durationTimer) {
        clearInterval(durationTimer);
        setDurationTimer(null);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {!hasPermissions ? (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionHeaderText}>
            Camera Permission Required
          </Text>
          <Text style={styles.permissionSubtext}>
            Please grant camera and microphone permissions to record video memories.
          </Text>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Return to App</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.camera}>
          <StatusBar hidden />
          
          <ExpoCamera.CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            facing={cameraType}
            enableTorch={flashMode === 'torch'}
            flash={flashMode === 'torch' ? 'off' : flashMode as 'on' | 'off' | 'auto'}
            // ratio="16:9"
          />
          
          <View style={styles.header}>
            <TouchableOpacity style={styles.cancelIconButton} onPress={onCancel}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            
            {isRecording ? (
              <View style={styles.durationContainer}>
                <View style={[styles.recordingIndicator, styles.recordingActive]} />
                <Text style={styles.recordingText}>
                  {formatDuration(recordingDuration)}
                </Text>
              </View>
            ) : (
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Record Video</Text>
              </View>
            )}
            
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraType}>
              <Ionicons name="camera-reverse" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
              <Ionicons 
                name={flashMode === 'off' ? "flash-off" : "flash"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.recordButton, isRecording && styles.recordButtonActive]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <View style={[styles.recordButtonInner, isRecording && styles.recordButtonInnerActive]} />
            </TouchableOpacity>
            
            <View style={styles.controlsSpacer}>
              <Text style={styles.maxDurationText}>
                Max: {formatDuration(maxDuration)}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  permissionHeaderText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginVertical: 10,
    textAlign: 'center',
  },
  permissionSubtext: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.white,
    textAlign: 'center',
  },
  camera: {
    flex: 1,
    width: width,
    height: height,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  cancelIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  titleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spacer: {
    width: 40,
  },

  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  recordingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
    marginRight: 8,
  },
  recordingActive: {
    backgroundColor: '#f00',
  },
  recordingText: {
    color: 'white',
    fontSize: 14,
  },
  flipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controlsSpacer: {
    width: 60,
    alignItems: 'center',
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonActive: {
    backgroundColor: 'rgba(255,0,0,0.3)',
  },
  recordButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
  },
  recordButtonInnerActive: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#f00',
  },
  maxDurationText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 8,
  },
});

import * as ImagePicker from 'expo-image-picker';
import { Audio, Video } from 'expo-av';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../app/config/auth';

export interface MediaFile {
  id: string;
  type: 'image' | 'video' | 'audio';
  uri: string;
  filename: string;
  size: number;
  duration?: number; // for audio/video
  mimeType?: string;
  uploadUrl?: string; // Firebase Storage URL
}

export interface RecordingResult {
  uri: string;
  duration: number;
  size: number;
}

/**
 * Media service for handling camera, audio recording, and file uploads
 */
export const MediaService = {
  /**
   * Request permissions for camera and microphone
   */
  async requestPermissions(): Promise<boolean> {
    try {
      // Request camera permissions
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      // Request audio permissions
      const audioPermission = await Audio.requestPermissionsAsync();
      
      return (
        cameraPermission.status === 'granted' &&
        mediaLibraryPermission.status === 'granted' &&
        audioPermission.status === 'granted'
      );
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  },

  /**
   * Take a photo using the camera
   */
  async takePhoto(): Promise<MediaFile | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Camera permission not granted');
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          id: Date.now().toString(),
          type: 'image',
          uri: asset.uri,
          filename: asset.fileName || `photo_${Date.now()}.jpg`,
          size: asset.fileSize || 0,
          mimeType: asset.mimeType || 'image/jpeg',
        };
      }

      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      throw error;
    }
  },

  /**
   * Pick an image from the gallery
   */
  async pickImage(): Promise<MediaFile | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Media library permission not granted');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          id: Date.now().toString(),
          type: 'image',
          uri: asset.uri,
          filename: asset.fileName || `image_${Date.now()}.jpg`,
          size: asset.fileSize || 0,
          mimeType: asset.mimeType || 'image/jpeg',
        };
      }

      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      throw error;
    }
  },

  /**
   * Record a video using the camera
   */
  async recordVideo(): Promise<MediaFile | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Camera permission not granted');
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: ImagePicker.VideoQuality.High,
        videoMaxDuration: 300, // 5 minutes max
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          id: Date.now().toString(),
          type: 'video',
          uri: asset.uri,
          filename: asset.fileName || `video_${Date.now()}.mp4`,
          size: asset.fileSize || 0,
          duration: asset.duration || 0,
          mimeType: asset.mimeType || 'video/mp4',
        };
      }

      return null;
    } catch (error) {
      console.error('Error recording video:', error);
      throw error;
    }
  },

  /**
   * Start audio recording
   */
  async startAudioRecording(): Promise<Audio.Recording> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Audio permission not granted');
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      
      return recording;
    } catch (error) {
      console.error('Error starting audio recording:', error);
      throw error;
    }
  },

  /**
   * Stop audio recording and return media file
   */
  async stopAudioRecording(recording: Audio.Recording): Promise<MediaFile | null> {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (uri) {
        const status = await recording.getStatusAsync();
        return {
          id: Date.now().toString(),
          type: 'audio',
          uri,
          filename: `audio_${Date.now()}.m4a`,
          size: 0, // Will be calculated during upload
          duration: status.durationMillis || 0,
          mimeType: 'audio/m4a',
        };
      }

      return null;
    } catch (error) {
      console.error('Error stopping audio recording:', error);
      throw error;
    }
  },

  /**
   * Upload media file to Firebase Storage
   */
  async uploadMediaFile(mediaFile: MediaFile, userId: string): Promise<string> {
    try {
      // Create a reference to the file location
      const fileRef = ref(storage, `media/${userId}/${mediaFile.id}_${mediaFile.filename}`);
      
      // Convert URI to blob for upload
      const response = await fetch(mediaFile.uri);
      const blob = await response.blob();
      
      // Upload the file
      const snapshot = await uploadBytes(fileRef, blob);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading media file:', error);
      throw error;
    }
  },

  /**
   * Delete media file from Firebase Storage
   */
  async deleteMediaFile(mediaFile: MediaFile, userId: string): Promise<void> {
    try {
      const fileRef = ref(storage, `media/${userId}/${mediaFile.id}_${mediaFile.filename}`);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting media file:', error);
      throw error;
    }
  },

  /**
   * Get file size from URI
   */
  async getFileSize(uri: string): Promise<number> {
    try {
      const response = await fetch(uri, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      return contentLength ? parseInt(contentLength, 10) : 0;
    } catch (error) {
      console.error('Error getting file size:', error);
      return 0;
    }
  },

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Format duration for display (milliseconds to MM:SS)
   */
  formatDuration(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  },
};

import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CapsulesStackParamList } from '../../../navigation';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { uploadFile } from '../../services/upload';

export default function ResponseRecorderScreen({ route, navigation }: NativeStackScreenProps<CapsulesStackParamList, 'ResponseRecorder'>) {
  const { capsuleId, promptId } = route.params;
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const handleMedia = async (uri: string, type: 'video' | 'photo' | 'audio') => {
    const url = await uploadFile(uri, `${capsuleId}/${Date.now()}`);
    await addDoc(collection(db, 'responses'), {
      capsuleId,
      promptId,
      mediaType: type,
      mediaURL: url,
      createdAt: serverTimestamp(),
    });
    navigation.goBack();
  };

  const pickVideo = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Videos });
    if (!res.canceled) {
      await handleMedia(res.assets[0].uri, 'video');
    }
  };

  const takePhoto = async () => {
    const res = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!res.canceled) {
      await handleMedia(res.assets[0].uri, 'photo');
    }
  };

  const startAudio = async () => {
    const perm = await Audio.requestPermissionsAsync();
    if (!perm.granted) return;
    const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    setRecording(recording);
  };

  const stopAudio = async () => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    if (uri) {
      await handleMedia(uri, 'audio');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick Video" onPress={pickVideo} />
      <Button title="Take Photo" onPress={takePhoto} />
      {recording ? (
        <Button title="Stop Recording" onPress={stopAudio} />
      ) : (
        <Button title="Record Audio" onPress={startAudio} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
});

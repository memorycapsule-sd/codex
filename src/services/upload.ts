import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export async function uploadFile(uri: string, path: string) {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, path);
  await uploadBytesResumable(storageRef, blob);
  return getDownloadURL(storageRef);
}

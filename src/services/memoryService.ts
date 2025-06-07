import { MediaFile } from './media';
import { MediaService } from './media'; // For uploading media before saving memory
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

export interface Memory extends Omit<MediaFile, 'uri' | 'size' | 'filename' | 'mimeType'> {
  userId: string;
  createdAt: Timestamp;
  // title is already in MediaFile
  // type is already in MediaFile
  // textContent is already in MediaFile
  // duration is already in MediaFile
  mediaUrl?: string; // URL from Firebase Storage for image/video/audio
}

const MEMORIES_COLLECTION = 'memories'; // Top-level collection for all memories
// Or 'users/{userId}/memories' if you prefer per-user subcollections

/**
 * Saves a new memory to Firestore and uploads media to Firebase Storage if applicable.
 * @param memoryData - The MediaFile object, including title and content.
 * @param userId - The ID of the user creating the memory.
 * @returns The full Memory object of the newly created memory document.
 */
export async function saveMemory(memoryData: MediaFile, userId: string): Promise<Memory> {
  if (!userId) {
    throw new Error('User ID is required to save a memory.');
  }
  if (!memoryData.title) {
    throw new Error('Memory title is required.');
  }

  let mediaUrl: string | undefined = undefined;

  // 1. If it's a media file (image, video, audio) with a URI, upload it first
  if ((memoryData.type === 'image' || memoryData.type === 'video' || memoryData.type === 'audio') && memoryData.uri) {
    try {
      // We need to pass the full MediaFile object to uploadMediaFile as it expects filename, etc.
      // However, uploadMediaFile itself might need adjustment if it wasn't designed for this flow.
      // For now, assuming MediaService.uploadMediaFile can handle it or we'll adjust it later.
      mediaUrl = await MediaService.uploadMediaFile(memoryData, userId);
    } catch (error) {
      console.error('Error uploading media to Firebase Storage:', error);
      throw new Error('Failed to upload media file.');
    }
  }

  // 2. Prepare the memory document for Firestore
  const memoryDataToSave: Omit<Memory, 'id'> = {
    userId,
    title: memoryData.title,
    type: memoryData.type,
    createdAt: serverTimestamp() as any,
    ...(memoryData.textContent && { textContent: memoryData.textContent }),
    ...(mediaUrl && { mediaUrl }),
    ...(memoryData.duration && { duration: memoryData.duration }),
    // We don't save local uri, filename, size, mimeType to Firestore directly
    // as the primary media artifact for non-text is the mediaUrl from Storage.
  };

  try {
    // Add a new document with a generated ID to the top-level 'memories' collection
    const docRef = await addDoc(collection(db!, MEMORIES_COLLECTION), memoryDataToSave);
    const savedMemory: Memory = {
      id: docRef.id,
      ...memoryDataToSave,
      // Ensure all fields from Memory interface are present, casting as necessary
      // type, title, textContent, duration are already in memoryDataToSave from mediaFile
      // userId, createdAt, mediaUrl are also in memoryDataToSave
    } as Memory; // Cast to ensure type conformity if memoryDataToSave is less specific
    console.log('Memory saved to Firestore with ID:', docRef.id);
    return savedMemory;
  } catch (error) {
    console.error('Error saving memory to Firestore:', error);
    throw new Error('Failed to save memory.');
  }
}

// Future functions like getMemories, getMemoryById, updateMemory, deleteMemory will go here.

/**
 * Fetches recent memories for a given user from Firestore.
 * @param userId - The ID of the user whose memories to fetch.
 * @param limitCount - The maximum number of memories to fetch.
 * @returns A promise that resolves to an array of Memory objects.
 */
export async function getRecentMemories(userId: string, limitCount: number = 5): Promise<Memory[]> {
  if (!userId) {
    console.error('User ID is required to fetch recent memories.');
    return [];
  }

  try {
    const q = query(
      collection(db!, MEMORIES_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount),
    );
    const querySnapshot = await getDocs(q);
    const memories: Memory[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      memories.push({
        id: docSnapshot.id,
        userId: data.userId,
        title: data.title,
        type: data.type,
        createdAt: data.createdAt as Timestamp,
        ...(data.textContent && { textContent: data.textContent }),
        ...(data.mediaUrl && { mediaUrl: data.mediaUrl }),
        ...(data.duration && { duration: data.duration }),
      } as Memory);
    });

    console.log(`Fetched ${memories.length} recent memories for user ${userId}`);
    return memories;
  } catch (error) {
    console.error('Error fetching recent memories from Firestore:', error);
    throw new Error('Failed to fetch recent memories.');
  }
}

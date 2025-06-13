import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  runTransaction,
  writeBatch, 
  Timestamp, 
  arrayUnion, 
  serverTimestamp,
  updateDoc,
  Transaction, // Added for explicit typing
  QueryDocumentSnapshot, // Added for explicit typing
  DocumentData // Added for explicit typing
} from 'firebase/firestore';
import { app } from '../firebase'; // Assuming your firebase.ts exports the initialized 'app'
import { getStorage, ref, deleteObject } from 'firebase/storage';

import { CapsuleResponse, CapsuleEntry, MediaMetadata, MacroCapsule, CapsulePrompt, CapsuleCollection, BonusCapsules } from '../types/capsule';
import { generateUUID } from '../utils/helpers';
// import { MediaFile, MediaService } from './media'; // MediaService is used in addEntryToCapsuleResponse, ensure it's correctly imported if that method is kept/used

// Initialize Firestore
const db = getFirestore(app); // Get Firestore instance from your initialized app

// Helper function to convert various timestamp formats to milliseconds
function convertTimestampToMillis(timestampInput: any): number {
  if (timestampInput === null || timestampInput === undefined) {
    return Date.now(); // Default to now if no timestamp
  }
  if (typeof timestampInput === 'number') {
    return timestampInput;
  }
  // Firestore Timestamp object from modular SDK
  if (timestampInput instanceof Timestamp) {
    return timestampInput.toMillis();
  }
  // @react-native-firebase/firestore Timestamp or similar structure with toMillis()
  if (typeof timestampInput === 'object' && typeof timestampInput.toMillis === 'function') {
    return timestampInput.toMillis();
  }
  // Structure like { seconds: number, nanoseconds: number } (common from Firebase)
  // or { _seconds: number, _nanoseconds: number } (older SDKs)
  const secondsKey = timestampInput.hasOwnProperty('seconds') ? 'seconds' : timestampInput.hasOwnProperty('_seconds') ? '_seconds' : null;
  const nanosecondsKey = timestampInput.hasOwnProperty('nanoseconds') ? 'nanoseconds' : timestampInput.hasOwnProperty('_nanoseconds') ? '_nanoseconds' : null;

  if (secondsKey && typeof timestampInput[secondsKey] === 'number') {
    const seconds = timestampInput[secondsKey];
    const nanoseconds = (nanosecondsKey && typeof timestampInput[nanosecondsKey] === 'number') ? timestampInput[nanosecondsKey] : 0;
    return (seconds * 1000) + (nanoseconds / 1000000);
  }
  
  // Date object or ISO string that can be parsed by Date constructor
  const date = new Date(timestampInput);
  if (!isNaN(date.getTime())) {
    return date.getTime();
  }
  console.warn(`[CapsuleService] convertTimestampToMillis could not parse timestamp, defaulting to Date.now(). Input:`, timestampInput);
  return Date.now();
}


// Map of capsule titles to Ionicons names - kept from original file if still needed for loadCapsules
const CAPSULE_ICONS: Record<string, string> = {
  Beginning: 'leaf-outline',
  Family: 'people-outline',
  Childhood: 'balloon-outline',
  Adolescence: 'school-outline',
  Pursuits: 'briefcase-outline',
  Connections: 'heart-outline',
  Lessons: 'book-outline',
  Wisdom: 'bulb-outline',
  Travel: 'airplane-outline',
  Friendship: 'people-circle-outline',
  Faith: 'prism-outline',
  Health: 'fitness-outline',
  Hobbies: 'color-palette-outline',
  Money: 'cash-outline',
  Volunteering: 'hand-left-outline',
  Loss: 'flower-outline',
  Moments: 'camera-outline',
  Creativity: 'brush-outline',
  Change: 'sync-outline',
  Home: 'home-outline'
};

// Capsule Service: Exported Functions
// Refactored from class to individual exported functions to adhere to project guidelines.
  /**
   * Loads capsule data from the JSON file and transforms it into MacroCapsule objects.
   * This method seems to be from a different feature set (loading predefined capsules from JSON)
   * and might not be directly related to user-generated CapsuleResponses stored in Firestore.
   * Keeping it for now as it was in the original file content provided.
   */
  export async function loadCapsules(): Promise<MacroCapsule[]> {
    try {
      const capsuleData = require('../../capsules/capsuledetails.json') as CapsuleCollection;
      const macroCapsules: MacroCapsule[] = [];
      Object.entries(capsuleData).forEach(([key, value]) => {
        if (key !== 'Bonus') {
          const promptsArray = value as string[];
          const capsule: MacroCapsule = {
            id: generateUUID(),
            title: key,
            icon: CAPSULE_ICONS[key] || 'help-circle-outline',
            prompts: promptsArray.map(promptText => ({
              id: generateUUID(),
              text: promptText,
              responseType: 'any'
            } as CapsulePrompt)),
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
          macroCapsules.push(capsule);
        }
      });
      const bonusCapsules = capsuleData.Bonus as BonusCapsules;
      Object.entries(bonusCapsules).forEach(([key, promptsArray]) => {
        const capsule: MacroCapsule = {
          id: generateUUID(),
          title: key,
          description: 'Bonus Capsule',
          icon: CAPSULE_ICONS[key] || 'star-outline',
          prompts: promptsArray.map(prompt => ({
            id: generateUUID(),
            text: prompt.text,
            responseType: 'any'
          })),
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        macroCapsules.push(capsule);
      });
      return macroCapsules;
    } catch (error) {
      console.error('Error loading capsules from JSON:', error);
      return [];
    }
  }

  /**
   * Gets a specific predefined capsule by ID from JSON data.
   */
  export async function getCapsuleById(id: string): Promise<MacroCapsule | null> {
    const capsules = await loadCapsules();
    return capsules.find((capsule: MacroCapsule) => capsule.id === id) || null;
  }
  /**
   * Adds a new CapsuleResponse document to Firestore.
   * This is used when creating a brand new capsule with its first entry.
   * Includes a timeout mechanism for the Firestore set operation.
   */
  export async function addCapsuleResponse(userId: string, promptId: string, capsuleTitle: string, initialEntry: CapsuleEntry, tags?: string[], category?: string): Promise<string | null> {
    console.log('[CapsuleService] addCapsuleResponse called for userId:', userId);

    const TIMEOUT_DURATION = 15000; // 15 seconds

    try {
      if (!userId) {
        console.error('[CapsuleService] User not authenticated, cannot add capsule response.');
        return null;
      }
      if (!promptId || !capsuleTitle || !initialEntry) {
        console.error('[CapsuleService] promptId, capsuleTitle, and initialEntry are required.');
        return null;
      }

      const capsuleId = generateUUID();
      const capsuleRef = doc(db, 'userCapsules', capsuleId);

      // Prepare the data, ensuring all timestamps are converted correctly
      const now = Date.now();
      const preparedEntries = [initialEntry].map(entry => ({
        ...entry,
        id: entry.id || generateUUID(),
        createdAt: convertTimestampToMillis(entry.createdAt || now),
        updatedAt: convertTimestampToMillis(entry.updatedAt || now),
        metadata: {
          ...entry.metadata,
          uploadedAt: convertTimestampToMillis(entry.metadata.uploadedAt || now),
          dateTaken: convertTimestampToMillis(entry.metadata.dateTaken || now),
        }
      }));

      const preparedCapsuleData = {
        id: capsuleId,
        userId: userId,
        promptId: promptId,
        capsuleTitle: capsuleTitle,
        entries: preparedEntries,
        createdAt: convertTimestampToMillis(now),
        updatedAt: convertTimestampToMillis(now),
        tags: tags || [],
        category: category || 'uncategorized',
      };

      // Firestore operation with a timeout
      const firestorePromise = setDoc(capsuleRef, preparedCapsuleData);
      
      // Timeout promise
      const timeoutPromise = new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore operation timed out')), TIMEOUT_DURATION)
      );

      // Race the Firestore operation against the timeout
      await Promise.race([firestorePromise, timeoutPromise]);

      console.log(`[CapsuleService] Capsule response with ID ${capsuleId} successfully written for user ${userId}.`);
      return capsuleId;
    } catch (error) {
      console.error('[CapsuleService] Error writing capsule response:', error);
      return null;
    }
  }

  /**
   * Adds a new entry to an existing CapsuleResponse document in Firestore.
   */
  export async function addEntryToCapsule(userId: string, capsuleId: string, entry: CapsuleEntry): Promise<boolean> {
    console.log(`[CapsuleService] addEntryToCapsule called for userId: ${userId}, capsuleId: ${capsuleId}`);
    try {
      if (!userId || !capsuleId || !entry) {
        console.error('[CapsuleService] Invalid parameters for addEntryToCapsule.');
        return false;
      }

      const processedNewEntryData = {
        ...JSON.parse(JSON.stringify(entry)), // Deep clone
        id: entry.id || generateUUID(),
        createdAt: convertTimestampToMillis(entry.createdAt),
        updatedAt: convertTimestampToMillis(entry.updatedAt || Date.now()),
        metadata: {
          ...JSON.parse(JSON.stringify(entry.metadata || {})),
          uploadedAt: convertTimestampToMillis(entry.metadata?.uploadedAt),
          dateTaken: convertTimestampToMillis(entry.metadata?.dateTaken || entry.createdAt),
        }
      };

      const capsuleDocRef = doc(db, 'userCapsules', capsuleId);

      await runTransaction(db, async (transaction: Transaction) => {
        const docSnapshot = await transaction.get(capsuleDocRef);

        if (!docSnapshot.exists()) {
          throw new Error(`[CapsuleService] Document ${capsuleId} does not exist!`);
        }

        const currentData = docSnapshot.data() as CapsuleResponse;
        if (currentData.userId !== userId) {
          throw new Error(`[CapsuleService] User ${userId} does not have permission to update capsule ${capsuleId}`);
        }

        const updatedEntries = [...(currentData.entries || []), processedNewEntryData];
        transaction.update(capsuleDocRef, { 
          entries: updatedEntries, 
          updatedAt: convertTimestampToMillis(Date.now()) 
        });
      });

      console.log(`[CapsuleService] Entry successfully added to capsule ${capsuleId}`);
      return true;
    } catch (error) {
      console.error(`[CapsuleService] Error adding entry to capsule ${capsuleId}:`, error);
      return false;
    }
  }

// Gets a specific capsule response by its document ID from Firestore.
export async function getCapsuleResponseById(capsuleId: string): Promise<CapsuleResponse | null> {
  console.log(`[CapsuleService] getCapsuleResponseById called for capsuleId: ${capsuleId}`);
  if (!capsuleId) {
    console.error('[CapsuleService] getCapsuleResponseById was called with no capsuleId.');
    return null;
  }

  try {
    const capsuleDocRef = doc(db, 'userCapsules', capsuleId);
    const docSnap = await getDoc(capsuleDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const id = docSnap.id;

      // Create a deep copy to avoid issues with readonly Firestore types
      const processedData = JSON.parse(JSON.stringify(data));

      // Convert top-level timestamps
      processedData.createdAt = convertTimestampToMillis(data.createdAt);
      processedData.updatedAt = convertTimestampToMillis(data.updatedAt);
      processedData.openDate = convertTimestampToMillis(data.openDate);

      // Convert timestamps within entries
      if (data.entries && Array.isArray(data.entries)) {
        processedData.entries = data.entries.map((entry: any) => ({
          ...entry,
          createdAt: convertTimestampToMillis(entry.createdAt),
          updatedAt: convertTimestampToMillis(entry.updatedAt),
        }));
      }

      const capsuleResponse = { id, ...processedData } as CapsuleResponse;
      console.log(`[CapsuleService] Found capsule response for ID ${capsuleId}`);
      return capsuleResponse;
    } else {
      console.warn(`[CapsuleService] No capsule response found for ID: ${capsuleId}`);
      return null;
    }
  } catch (error) {
    console.error(`[CapsuleService] Error fetching capsule response by ID ${capsuleId}:`, error);
    return null;
  }
}


  export async function loadUserCapsuleResponses(userId: string): Promise<CapsuleResponse[]> {
    console.log('[CapsuleService] loadUserCapsuleResponses called for userId:', userId);
    try {
      const q = query(
        collection(db, 'userCapsules'),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log('[CapsuleService] No matching capsule responses found for user:', userId);
        return [];
      }
      
      const responses: CapsuleResponse[] = querySnapshot.docs.map((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
        const data = docSnapshot.data();
        
        const entries: CapsuleEntry[] = (data.entries || []).map((entryData: any) => {
          const clonedEntryData = JSON.parse(JSON.stringify(entryData));
          const clonedMetadata = JSON.parse(JSON.stringify(clonedEntryData.metadata || {}));

          const metadata: MediaMetadata = {
            ...clonedMetadata,
            uploadedAt: convertTimestampToMillis(clonedMetadata.uploadedAt),
            dateTaken: convertTimestampToMillis(clonedMetadata.dateTaken || clonedEntryData.createdAt),
          };
          
          return {
            ...clonedEntryData,
            id: clonedEntryData.id || generateUUID(),
            createdAt: convertTimestampToMillis(clonedEntryData.createdAt),
            updatedAt: convertTimestampToMillis(clonedEntryData.updatedAt || clonedEntryData.createdAt),
            metadata: metadata,
          } as CapsuleEntry;
        });

        return {
          ...data,
          id: docSnapshot.id,
          userId: data.userId || userId,
          promptId: data.promptId || 'unknown-prompt',
          capsuleTitle: data.capsuleTitle || 'Untitled Capsule',
          createdAt: convertTimestampToMillis(data.createdAt),
          updatedAt: convertTimestampToMillis(data.updatedAt),
          entries: entries,
          tags: data.tags || [],
          category: data.category || 'uncategorized',
        } as CapsuleResponse;
      });

      console.log(`[CapsuleService] Loaded ${responses.length} capsule responses for user ${userId}`);
      return responses;
    } catch (error) {
      console.error('[CapsuleService] Error loading capsule responses:', error);
      return [];
    }
  }
  
  export async function updateCapsuleEntry(userId: string, capsuleId: string, entryId: string, updatedEntryData: Partial<CapsuleEntry>): Promise<boolean> {
    console.log(`[CapsuleService] updateCapsuleEntry called for user ${userId}, capsule ${capsuleId}, entry ${entryId}`);
    const capsuleDocRef = doc(db, 'userCapsules', capsuleId);

    try {
      await runTransaction(db, async (transaction: Transaction) => {
        const capsuleDoc = await transaction.get(capsuleDocRef);

        if (!capsuleDoc.exists()) {
          throw new Error(`[CapsuleService] Capsule ${capsuleId} not found.`);
        }

        const capsuleData = capsuleDoc.data() as CapsuleResponse;

        // Optional: Verify if the capsule belongs to the user if userId is part of capsuleData and crucial for security here
        // if (capsuleData.userId !== userId) {
        //   throw new Error(`[CapsuleService] User ${userId} does not have permission to update capsule ${capsuleId}.`);
        // }

        const entryIndex = capsuleData.entries.findIndex(entry => entry.id === entryId);

        if (entryIndex === -1) {
          throw new Error(`[CapsuleService] Entry ${entryId} not found in capsule ${capsuleId}.`);
        }

        const originalEntry = capsuleData.entries[entryIndex];

        // Deep merge metadata if it exists in updatedEntryData
        let updatedMetadata = originalEntry.metadata;
        if (updatedEntryData.metadata) {
          updatedMetadata = {
            ...originalEntry.metadata,
            ...updatedEntryData.metadata,
          };
        }

        const updatedEntry: CapsuleEntry = {
          ...originalEntry,
          ...updatedEntryData,
          metadata: updatedMetadata,
          updatedAt: convertTimestampToMillis(Date.now()), // Update entry's timestamp
        };

        // Create a new entries array with the updated entry
        const updatedEntries = [...capsuleData.entries];
        updatedEntries[entryIndex] = updatedEntry;

        transaction.update(capsuleDocRef, {
          entries: updatedEntries,
          updatedAt: convertTimestampToMillis(Date.now()), // Update capsule's timestamp
        });
      });

      console.log(`[CapsuleService] Entry ${entryId} in capsule ${capsuleId} successfully updated.`);
      return true;
    } catch (error) {
      console.error(`[CapsuleService] Error updating entry ${entryId} in capsule ${capsuleId}:`, error);
      return false;
    }
  }

export async function updateCapsule(capsuleId: string, data: Partial<CapsuleResponse>): Promise<void> {
  const capsuleRef = doc(db, 'userCapsules', capsuleId);
  console.log(`[CapsuleService] Starting transaction to update capsule ${capsuleId}`);

  try {
    await runTransaction(db, async (transaction) => {
      const capsuleDoc = await transaction.get(capsuleRef);
      if (!capsuleDoc.exists()) {
        throw new Error(`[CapsuleService] Document for capsule ${capsuleId} does not exist!`);
      }

      // Merge existing data with new data and add the update timestamp
      const updatedData = {
        ...capsuleDoc.data(),
        ...data,
        updatedAt: serverTimestamp(),
      };

      transaction.set(capsuleRef, updatedData, { merge: true });
    });

    console.log(`[CapsuleService] Capsule ${capsuleId} successfully updated via transaction.`);
  } catch (error) {
    console.error(`[CapsuleService] Error updating capsule ${capsuleId}:`, error);
    throw new Error('Failed to update capsule.');
  }
}

export async function deleteCapsule(userId: string, capsuleId: string): Promise<boolean> {
console.log(`[CapsuleService] deleteCapsule called for user ${userId}, capsule ${capsuleId}`);
const capsuleDocRef = doc(db, 'userCapsules', capsuleId);
const storage = getStorage(app);

try {
// Get the capsule document to retrieve media URIs before deleting
const capsuleDocSnap = await getDoc(capsuleDocRef);

      if (!capsuleDocSnap.exists()) {
        console.warn(`[CapsuleService] Capsule ${capsuleId} not found. Nothing to delete.`);
        return false; // Or true if not finding it means it's already 'deleted'
      }

      const capsuleData = capsuleDocSnap.data() as CapsuleResponse;

      // Optional: Verify ownership if userId is part of capsuleData and crucial for security
      // if (capsuleData.userId !== userId) {
      //   console.error(`[CapsuleService] User ${userId} does not have permission to delete capsule ${capsuleId}.`);
      //   return false;
      // }

      // Delete associated media from Firebase Storage
      if (capsuleData.entries && capsuleData.entries.length > 0) {
        for (const entry of capsuleData.entries) {
          if (entry.mediaUri) {
            try {
              const mediaRef = ref(storage, entry.mediaUri);
              await deleteObject(mediaRef);
              console.log(`[CapsuleService] Deleted media from Storage: ${entry.mediaUri}`);
            } catch (storageError: any) {
              if (storageError.code === 'storage/object-not-found') {
                console.warn(`[CapsuleService] Media file not found in Storage, skipping deletion: ${entry.mediaUri}`);
              } else {
                console.error(`[CapsuleService] Error deleting media from Storage ${entry.mediaUri}:`, storageError);
              }
            }
          }
          if (entry.thumbnailUri) {
            try {
              const thumbRef = ref(storage, entry.thumbnailUri);
              await deleteObject(thumbRef);
              console.log(`[CapsuleService] Deleted thumbnail from Storage: ${entry.thumbnailUri}`);
            } catch (storageError: any) {
              if (storageError.code === 'storage/object-not-found') {
                console.warn(`[CapsuleService] Thumbnail file not found in Storage, skipping deletion: ${entry.thumbnailUri}`);
              } else {
                console.error(`[CapsuleService] Error deleting thumbnail from Storage ${entry.thumbnailUri}:`, storageError);
              }
            }
          }
        }
      }

      // Delete the Firestore document
      await runTransaction(db, async (transaction: Transaction) => {
        transaction.delete(capsuleDocRef);
      });

      console.log(`[CapsuleService] Capsule ${capsuleId} and associated media successfully deleted.`);
      return true;
    } catch (error) {
      console.error(`[CapsuleService] Error deleting capsule ${capsuleId}:`, error);
      return false;
    }
  }


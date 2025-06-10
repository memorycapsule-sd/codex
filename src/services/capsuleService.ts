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
  Transaction, // Added for explicit typing
  QueryDocumentSnapshot, // Added for explicit typing
  DocumentData // Added for explicit typing
} from 'firebase/firestore';
import { app } from '../firebase'; // Assuming your firebase.ts exports the initialized 'app'

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

export class CapsuleService {
  /**
   * Loads capsule data from the JSON file and transforms it into MacroCapsule objects.
   * This method seems to be from a different feature set (loading predefined capsules from JSON)
   * and might not be directly related to user-generated CapsuleResponses stored in Firestore.
   * Keeping it for now as it was in the original file content provided.
   */
  static async loadCapsules(): Promise<MacroCapsule[]> {
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
  static async getCapsuleById(id: string): Promise<MacroCapsule | null> {
    const capsules = await this.loadCapsules();
    return capsules.find(capsule => capsule.id === id) || null;
  }
  /**
   * Adds a new CapsuleResponse document to Firestore.
   * This is used when creating a brand new capsule with its first entry.
   * Includes a timeout mechanism for the Firestore set operation.
   */
  static async addCapsuleResponse(userId: string, capsuleData: CapsuleResponse): Promise<boolean> {
    console.log('[CapsuleService] addCapsuleResponse called with userId:', userId, 'and capsuleId:', capsuleData.id);
    try {
      if (!userId) {
        console.error('[CapsuleService] User not authenticated, cannot add capsule response.');
        return false;
      }
      if (!capsuleData || !capsuleData.id) {
        console.error('[CapsuleService] Invalid capsuleData or missing capsuleId.');
        return false;
      }

      // Deep clone and convert timestamps using the helper
      const processedCapsuleData = {
        ...JSON.parse(JSON.stringify(capsuleData)), // Deep clone to handle potential undefined and complex objects
        userId: userId, // Ensure userId is part of the document
        createdAt: convertTimestampToMillis(capsuleData.createdAt),
        updatedAt: convertTimestampToMillis(capsuleData.updatedAt || Date.now()), // Ensure updatedAt is set
        entries: (capsuleData.entries || []).map(entry => ({
          ...JSON.parse(JSON.stringify(entry)), // Deep clone entry
          id: entry.id || generateUUID(), // Ensure entry has an ID
          createdAt: convertTimestampToMillis(entry.createdAt),
          updatedAt: convertTimestampToMillis(entry.updatedAt || Date.now()),
          metadata: {
            ...JSON.parse(JSON.stringify(entry.metadata || {})),
            uploadedAt: convertTimestampToMillis(entry.metadata?.uploadedAt),
            dateTaken: convertTimestampToMillis(entry.metadata?.dateTaken || entry.createdAt), // Fallback for dateTaken
          }
        }))
      };
      
      const capsuleDocRef = doc(db, 'userCapsules', processedCapsuleData.id);
      console.log('[CapsuleService] Attempting to set document with processedCapsuleData:', processedCapsuleData);

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firestore set operation timed out after 15 seconds')), 15000)
      );

      await Promise.race([
        setDoc(capsuleDocRef, processedCapsuleData),
        timeoutPromise
      ]);

      console.log(`[CapsuleService] Document successfully written! Capsule ID: ${processedCapsuleData.id}`);
      return true;
    } catch (error) {
      console.error('[CapsuleService] Error writing document or operation timed out:', error);
      return false;
    }
  }

  /**
   * Adds a new entry to an existing CapsuleResponse document in Firestore.
   */
  static async addEntryToCapsule(userId: string, capsuleId: string, newEntryData: CapsuleEntry): Promise<boolean> {
    console.log(`[CapsuleService] addEntryToCapsule called for userId: ${userId}, capsuleId: ${capsuleId}`);
    try {
      if (!userId || !capsuleId || !newEntryData) {
        console.error('[CapsuleService] Invalid parameters for addEntryToCapsule.');
        return false;
      }

      const processedNewEntryData = {
        ...JSON.parse(JSON.stringify(newEntryData)), // Deep clone
        id: newEntryData.id || generateUUID(),
        createdAt: convertTimestampToMillis(newEntryData.createdAt),
        updatedAt: convertTimestampToMillis(newEntryData.updatedAt || Date.now()),
        metadata: {
          ...JSON.parse(JSON.stringify(newEntryData.metadata || {})),
          uploadedAt: convertTimestampToMillis(newEntryData.metadata?.uploadedAt),
          dateTaken: convertTimestampToMillis(newEntryData.metadata?.dateTaken || newEntryData.createdAt),
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

  /**
   * Loads all capsule responses for a given user from Firestore.
   */
  static async loadUserCapsuleResponses(userId: string): Promise<CapsuleResponse[]> {
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
          // Perform a deep clone of entryData and its metadata to avoid issues with frozen objects from Firestore if any
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
          userId: data.userId || userId, // Ensure userId is present
          title: data.title || 'Untitled Capsule', // Ensure title is present
          createdAt: convertTimestampToMillis(data.createdAt),
          updatedAt: convertTimestampToMillis(data.updatedAt),
          entries: entries,
        } as CapsuleResponse;
      });

      console.log(`[CapsuleService] Loaded ${responses.length} capsule responses for user ${userId}`);
      return responses;
    } catch (error) {
      console.error('[CapsuleService] Error loading capsule responses:', error);
      return [];
    }
  }
  
  // --- Placeholder Methods for future implementation ---
  static async updateCapsuleEntry(userId: string, capsuleId: string, entryId: string, updatedEntryData: Partial<CapsuleEntry>): Promise<boolean> {
    console.warn(`[CapsuleService] updateCapsuleEntry called for capsule ${capsuleId}, entry ${entryId} - NOT IMPLEMENTED`);
    // TODO: Implement logic to find the specific entry within the capsule's entries array and update it.
    // This will likely involve a transaction to read the document, modify the array, and write it back.
    return false;
  }

  static async deleteCapsule(userId: string, capsuleId: string): Promise<boolean> {
    console.warn(`[CapsuleService] deleteCapsule called for capsule ${capsuleId} - NOT IMPLEMENTED`);
    // TODO: Implement logic to delete the capsule document from Firestore.
    // Consider also deleting associated media from Firebase Storage if necessary.
    try {
      // await db.collection('userCapsules').doc(capsuleId).delete();
      // console.log(`[CapsuleService] Capsule ${capsuleId} successfully deleted.`);
      // return true;
      return false; // Placeholder
    } catch (error) {
      // console.error(`[CapsuleService] Error deleting capsule ${capsuleId}:`, error);
      return false;
    }
  }
}

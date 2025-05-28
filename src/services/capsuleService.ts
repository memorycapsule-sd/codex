import { MacroCapsule, CapsulePrompt, CapsuleCollection, BonusCapsules } from '../types/capsule';
import { generateUUID } from '../utils/helpers';
import { Ionicons } from '@expo/vector-icons';

// Map of capsule titles to Ionicons names
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

/**
 * Service to handle loading and managing capsule data
 */
export class CapsuleService {
  /**
   * Loads capsule data from the JSON file and transforms it into MacroCapsule objects
   */
  static async loadCapsules(): Promise<MacroCapsule[]> {
    try {
      // In a real app, this would be loaded from a file or API
      const capsuleData = require('../../capsules/capsuledetails.json') as CapsuleCollection;
      
      // Transform the data into MacroCapsule objects
      const macroCapsules: MacroCapsule[] = [];
      
      // Process main capsules
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
            })),
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
          
          macroCapsules.push(capsule);
        }
      });
      
      // Process bonus capsules
      const bonusCapsules = capsuleData.Bonus as BonusCapsules;
      
      Object.entries(bonusCapsules).forEach(([key, promptsArray]) => {
        const capsule: MacroCapsule = {
          id: generateUUID(),
          title: key,
          description: 'Bonus Capsule',
          icon: CAPSULE_ICONS[key] || 'star-outline',
          prompts: promptsArray.map(promptText => ({
            id: generateUUID(),
            text: promptText,
            responseType: 'any'
          })),
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        
        macroCapsules.push(capsule);
      });
      
      return macroCapsules;
    } catch (error) {
      console.error('Error loading capsules:', error);
      return [];
    }
  }
  
  /**
   * Gets a specific capsule by ID
   */
  static async getCapsuleById(id: string): Promise<MacroCapsule | null> {
    const capsules = await this.loadCapsules();
    return capsules.find(capsule => capsule.id === id) || null;
  }
  
  /**
   * Saves a response to a prompt
   */
  static async saveResponse(promptId: string, response: {
    type: 'text' | 'audio' | 'video' | 'photo';
    content: string;
  }): Promise<boolean> {
    try {
      // In a real app, this would save to Firebase or another backend
      console.log('Saving response:', { promptId, response });
      
      // Mock successful save
      return true;
    } catch (error) {
      console.error('Error saving response:', error);
      return false;
    }
  }
}

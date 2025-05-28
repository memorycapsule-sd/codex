// Types for Memory Capsule features

/**
 * Represents a prompt within a capsule
 */
export interface CapsulePrompt {
  id: string;
  text: string;
  responseType?: 'text' | 'audio' | 'video' | 'photo' | 'any';
  response?: CapsuleResponse;
}

/**
 * Represents a user's response to a prompt
 */
export interface CapsuleResponse {
  id: string;
  promptId: string;
  type: 'text' | 'audio' | 'video' | 'photo';
  content: string; // Text content or media URI
  createdAt: number;
  updatedAt: number;
}

/**
 * Represents a collection of prompts (a MacroCapsule)
 */
export interface MacroCapsule {
  id: string;
  title: string;
  description?: string;
  icon: string;
  prompts: CapsulePrompt[];
  isCompleted?: boolean;
  completedCount?: number;
  createdAt: number;
  updatedAt: number;
}

/**
 * Represents the bonus capsules section which has a different structure
 */
export interface BonusCapsules {
  [key: string]: CapsulePrompt[];
}

/**
 * Represents the entire capsule collection from the JSON file
 */
export interface CapsuleCollection {
  [key: string]: string[] | BonusCapsules;
  Bonus: BonusCapsules;
}

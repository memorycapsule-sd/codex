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
/**
 * Represents metadata for a media file.
 */
export interface MediaMetadata {
  dateTaken?: number; // Timestamp
  location?: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
  uploadedAt: number; // Timestamp, when the media was added to the capsule
  userDescription?: string;
  filename?: string;
  size?: number; // in bytes
  duration?: number; // in seconds, for audio/video
  mimeType?: string;
  width?: number; // for images/videos
  height?: number; // for images/videos
}

/**
 * Represents a single content entry within a capsule's response (text, image, video, audio).
 */
export interface CapsuleEntry {
  id: string; // Unique ID for this specific entry
  type: 'text' | 'audio' | 'video' | 'photo';
  textContent?: string; // For 'text' type
  mediaUri?: string; // For media types (local URI before upload, remote URL after)
  thumbnailUri?: string; // Optional: for video/image previews
  metadata: MediaMetadata; // All media types will have metadata
  createdAt: number; // Timestamp of when this specific entry was created
  updatedAt: number; // Timestamp of when this specific entry was last updated
}

/**
 * Represents a user's collective response to a prompt, which can contain multiple entries.
 */
export interface CapsuleResponse {
  id: string; // ID of this response container
  userId: string; // ID of the user who created this response
  promptId: string; // ID of the prompt this response is for
  capsuleTitle: string; // Title of the macro-capsule this response belongs to
  entries: CapsuleEntry[]; // Array of individual content entries
  createdAt: number; // Timestamp of when the first entry was made for this response
  updatedAt: number; // Timestamp of when the last modification to any entry in this response was made
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

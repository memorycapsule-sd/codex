import * as Linking from 'expo-linking';

/**
 * Generate an unlisted share link for a capsule.
 */
export function generateCapsuleShareLink(capsuleId: string): string {
  const path = `/c/${capsuleId}`;
  return Linking.createURL(path, { isTripleSlashed: false });
}

# Tech Stack – Memory Capsule (Codex Version)

## Platform
- **Expo (React Native)**: Shared codebase for iOS, Android, and web.
- **TypeScript:** Type safety across all platforms.
- **Expo Web:** Use Expo’s web output for a single codebase. Optimize UX for both mobile and desktop, but prioritize mobile-first.
- **Firebase:** Handles Authentication, Firestore (database), and Storage (all media files).

## Why This Stack?
- **Unified development:** Write once, deploy everywhere (iOS, Android, Web).
- **Low friction:** Fast iteration using Expo CLI (no native builds until ready).
- **Instant media storage and auth:** Firebase is serverless, fast, and scalable.

## Future-Proofing
- Structure code for easy addition of AI-based features (transcription, tagging, prompt suggestions).
- Design capsules/modules with privacy and scalability in mind.
- Modular codebase (feature folders for onboarding, capsules, media, etc.).

## NO Native iOS (SwiftUI) code required.
- Remove/ignore SwiftUI/Apple-native instructions unless needed for platform-specific integrations.

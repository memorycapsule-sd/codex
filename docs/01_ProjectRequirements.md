# Project Requirements – Memory Capsule (Codex Version)

## Audience
- Tech-savvy adults (ages 30–50) looking to record, organize, and share their life stories for personal/family legacy.

## Core Features (v1)
- **User onboarding:** Friendly welcome, guided account setup (email, social auth via Firebase).
- **Capsule creation:** Users create “capsules” (a story container) and select privacy (private, unlisted with link, public).
- **Prompt system:** Macro (chapter) and micro (question) prompts to guide story creation.
- **Media capture/upload:** Users respond to prompts with video, audio, photo, or text. All media stored in Firebase.
- **Editing:** Allow users to review, edit, or delete their responses before finalizing.
- **Sharing:** Web portal for users and guests to view capsules, respecting privacy settings.
- **Dashboard:** Organize/view existing capsules and responses.

## Privacy & Sharing
- **Privacy settings:** Users set privacy at both global (default) and capsule-level (override) for each capsule:
    - Private: Only owner can view
    - Unlisted: Shared by secret link
    - Public: Visible to all users (may show up in public gallery in future)

## Future Features (design modularly for these)
- AI: Transcription, smart prompts, tagging, etc.
- Export: User can download all their data/media as ZIP
- Admin dashboard: For management/moderation

## Platform Constraints
- **Expo-first:** All features must run on iOS, Android, and web (Expo web output).
- **Firebase:** Single source of truth for user data, capsules, media.

## Design
- Mobile-first UI, accessible and modern
- Modular file/folder structure (one feature per folder)

## Out of Scope (for v1)
- AI features (design modular hooks for later)
- Advanced export/download (plan for future)
- Admin dashboard (plan for future)

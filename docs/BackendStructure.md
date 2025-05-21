# Backend Structure – Memory Capsule (Codex Version)

## Platform & Architecture
- **Firebase-first architecture**
  - **Authentication:** Email/password, social logins (Google/Apple), managed by Firebase Auth.
  - **Database:** Cloud Firestore (NoSQL, real-time, scalable).
  - **Storage:** Firebase Storage (all media files: video, audio, photo).
  - **Serverless Logic:** Firebase Cloud Functions (business logic, triggers, notifications).

## Key Design Patterns
- **Microservices style:** Each Cloud Function has a single responsibility (e.g., media processing, notification sending).
- **Repository pattern:** Separate data access logic from business logic for clean, maintainable functions.
- **Event-driven triggers:** Cloud Functions respond to changes in Firestore/Storage (e.g., after a media file is uploaded, process metadata).

## Data Models (suggested Firestore structure)
- **Users**
  - `/users/{userId}`
    - profile info, global privacy defaults, subscription status
- **Capsules**
  - `/capsules/{capsuleId}`
    - owner (userId), privacy setting (private/unlisted/public), metadata (title, date, description)
    - list of prompt responses (references to /responses)
- **Responses**
  - `/responses/{responseId}`
    - capsuleId, promptId, media type (video/audio/text/photo), media URL, transcription (future), createdAt, editedAt

## Media Management
- **Uploads:** All media files are uploaded directly to Firebase Storage, linked to their parent response in Firestore.
- **Privacy Control:** 
  - Privacy setting inherited from capsule but can be overridden at response/media level if needed in future.
  - Functions enforce access control for private/unlisted/public viewing.

## Access & Sharing
- **Capsule sharing:** Generate secure, unguessable links for “unlisted” capsules.
- **Web access:** Serve capsule content via web (Expo web) with privacy gating.

## Security & Compliance
- **Auth checks:** All reads/writes secured via Firebase Auth/Firestore Security Rules.
- **No server access keys or sensitive data in client code.**
- **CORS and file size/type restrictions** enforced on uploads.
<!-- firestore-rules: only authenticated users may read/write their own capsules and responses.
Capsule docs: /capsules/{capsuleId} (owner, title, createdAt)
Response docs: /responses/{responseId} (capsuleId, promptId, mediaType, mediaURL, createdAt) -->

## Cloud Functions (examples for v1)
- On user creation: initialize user doc, send welcome email (optional).
- On media upload: validate file, update Firestore, enqueue for AI (future).
- On capsule sharing: create/share link, set/unset public/unlisted state.

## Future-Proofing
- **AI/ML integration:** Place Cloud Functions hooks for processing uploaded media (transcription, facial recognition, tagging).
- **Admin actions:** Design functions to support moderation, export, or reporting if/when needed.
- **Batch export:** Reserve endpoint/function for ZIP export of user data/media.

## Out of Scope (for v1 MVP)
- Admin dashboard, full AI integration, bulk export (plan for modular addition).

---

*All backend logic, data models, and security rules should be compatible with Expo/React Native and Firebase. Modularize code and functions for easy scaling and future feature additions.*

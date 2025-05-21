# AGENTS.md

## Purpose
This file provides instructions, context, and best practices for AI agents (e.g., OpenAI Codex, Cursor, Windsurf) interacting with the Memory Capsule codebase.

---

## Project Context

**Memory Capsule** is a cross-platform application (iOS, Android, Web) built with Expo (React Native + Web) and Firebase. It enables users to capture, organize, and selectively share multimedia “capsules” of their life stories. The app is modular and designed for extensibility (future AI, export, admin features).

---

## General Instructions for AI Agents

1. **Project Scope**
   - Only generate code compatible with Expo (React Native + Web) and Firebase.
   - Avoid any native-only code (Swift/Java/Kotlin).
   - Assume mobile-first UI, but all components/screens must work on web.

2. **Directory & File Structure**
   - Use feature-based folders (e.g., `/features/onboarding/OnboardingScreen.tsx`).
   - Place global context/state in a `/context` or `/store` directory.
   - Keep utility and shared components in `/components`.

3. **Frontend Development**
   - Use TypeScript for all files.
   - Prefer functional React components.
   - Use React Navigation for all routing (stack, tab, or drawer as appropriate).
   - Ensure all media uploads interact with Firebase Storage securely.
   - Respect light/dark mode and accessibility best practices.

4. **Backend/Cloud Functions**
   - All business logic should be implemented with Firebase Cloud Functions.
   - Write modular, single-responsibility functions.
   - Secure all endpoints with Firebase Auth.
   - Place function code in `/functions`.

5. **Testing**
   - Use Jest and @testing-library/react-native for all tests.
   - Place tests alongside components (`ComponentName.test.tsx`).

6. **Documentation**
   - Add JSDoc comments to all exported functions/components.
   - If unsure about business logic, refer to `/docs` or prompt for clarification.

---

## AI Agent Behavior

- **Be modular:** Generate small, focused pull requests or code suggestions—do not change unrelated files.
- **Preserve context:** Reference the most recent `PROJECT_REQUIREMENTS.md`, `TECH_STACK.md`, and `FRONTEND_GUIDELINES.md` when generating new code.
- **Ask for clarification:** If requirements are ambiguous or missing, add a TODO comment and/or request clarification.
- **Future features:** Place hooks and stubs (e.g., for AI, export, admin) but do not implement full functionality unless instructed.

---

## Out of Scope (For Now)

- Native mobile code (Swift, Java/Kotlin)
- Full-featured AI/ML (transcription, tagging, etc.)
- Admin dashboard (stub only if needed)
- Data export (stub only if needed)

---

## Contact

For further clarification, consult the repo owner ([Sean at Memoria Films](https://memoriafilms.com/)) or reference `/docs`.


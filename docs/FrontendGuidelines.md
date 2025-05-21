# Frontend Guidelines – Memory Capsule (Codex Version)

## Frameworks & Tooling
- **Expo (React Native) with TypeScript**: One codebase for iOS, Android, and web.
- **Expo Web**: All screens/components should work responsively on web browsers as well as mobile devices.
- **Component Library:** Use Expo/React Native Paper or similar for UI consistency.

## Design Principles
- **Mobile-first, but responsive**: Prioritize touch-friendly UI, but all screens should gracefully adapt to web/desktop.
- **Accessibility:** Use accessible color contrast, label all inputs, and ensure navigability via screen readers.
- **Modular structure:**  
  - Organize components/screens by feature folder (e.g., `/features/onboarding/OnboardingScreen.tsx`).
  - Use reusable UI components (e.g., Button, Input, CapsuleCard).

## Navigation
- **React Navigation (Expo)** for screen routing (stack/tab/drawer as appropriate).
- *Single navigation structure shared across mobile and web.*

## State Management
- **Use Context API and/or Redux Toolkit** for global state (user, auth, capsule data).
- Local state for form/interaction components.

## Media Handling
- **Media Picker:** Use Expo’s ImagePicker/VideoPicker for file uploads.
- **Media Uploads:** All uploads go to Firebase Storage via secure API calls.

## Theming
- **Light/Dark Mode:** Support both; base theme colors on Expo’s Appearance API.
- **Custom Branding:** Allow for custom accent colors (e.g., Memoria Films palette).

## Forms & Validation
- Use `react-hook-form` or Formik for multi-step forms (onboarding, capsule creation, etc.).
- Validate required fields and provide clear, friendly error messages.

## Testing
- Snapshot/unit test major components with Jest.
- End-to-end (E2E) testing for core flows (optional in v1).

## Linting & Formatting
- Use ESLint + Prettier with a strict config.  
  - Include lint and format scripts in `package.json`.

## File Naming & Structure
- Use PascalCase for components and screens.
- Organize by feature (not by type).

## Code Documentation
- JSDoc-style comments for all exported functions/components.

## Out of Scope (for v1)
- Native-only features, platform-specific Swift/Java code.
- AI/ML functionality (place hooks for future enhancements).

---

*Use these guidelines to scaffold, review, and generate all frontend code for Memory Capsule. All code must be Expo-compatible and responsive for both web and mobile.*

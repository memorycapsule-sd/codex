# Memory Capsule

[![CI](https://github.com/username/repo/actions/workflows/ci.yml/badge.svg)](https://github.com/username/repo/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-80%25-brightgreen.svg)](#)

A cross-platform (iOS, Android, Web) app for capturing, organizing, and sharing
personal life stories as multimedia “capsules.” Built with Expo (React Native +
Web) and Firebase for seamless media storage and privacy control.

## Features

- Guided storytelling prompts (text, audio, photo, video)
- Capsule-based organization (with custom privacy: private, unlisted, public)
- One codebase: iOS, Android, and web (Expo)
- Secure Firebase media storage
- Modular design for future AI, export, and admin features

## Roadmap

- [ ] Core user onboarding & registration
- [ ] Capsule creation & media upload (video, audio, photo, text)
- [ ] Privacy controls (private, unlisted, public)
- [ ] Web access to finished capsules
- [ ] [Future] AI-powered features (auto transcription, smart prompts, tagging)
- [ ] [Future] Media export (ZIP)
- [ ] [Future] Admin dashboard

## Tech Stack

- [Expo (React Native + Web)](https://expo.dev/)
- [Firebase](https://firebase.google.com/) (Authentication, Firestore, Storage)
- TypeScript

## Getting Started

1. **Install dependencies:** `npm install`
2. **Start the app:** `npm start`
3. **Configure Firebase:** create a `.env` file or use environment variables with
   your Firebase credentials (see `app/config/firebase.ts`).

The project uses Expo, so it can run on iOS, Android, or the web from a single
codebase. Future features such as AI-assisted prompts and export functionality
will plug into the modular folder structure under `src/features`.

## License

[MIT License](LICENSE)

---

**Contact:**
Created by [Sean at Memoria Films](https://memoriafilms.com/)

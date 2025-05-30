#!/bin/bash

echo "🧹 Resetting Metro bundler and clearing caches..."

# Kill any running Metro instances
echo "Stopping Metro bundler..."
pkill -f "metro" || true

# Clear Metro cache
echo "Clearing Metro cache..."
npx expo start --clear

# Clear watchman (if installed)
if command -v watchman &> /dev/null; then
    echo "Clearing watchman..."
    watchman watch-del-all
fi

# Clear React Native cache
echo "Clearing React Native cache..."
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*

# Clear node modules and reinstall
echo "Removing node_modules..."
rm -rf node_modules

# Clear package lock
echo "Removing package-lock.json..."
rm -f package-lock.json

# Clear iOS Pods (if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Clearing iOS Pods..."
    cd ios 2>/dev/null && rm -rf Pods Podfile.lock && cd .. || true
fi

# Reinstall dependencies
echo "Installing dependencies..."
npm install

# Install iOS Pods (if on macOS and ios folder exists)
if [[ "$OSTYPE" == "darwin"* ]] && [ -d "ios" ]; then
    echo "Installing iOS Pods..."
    cd ios && pod install && cd ..
fi

echo "✅ Reset complete! Now run 'npm start' or 'expo start' to restart the app."

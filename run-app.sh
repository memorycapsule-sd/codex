#!/bin/bash

# Kill any existing Expo processes
echo "Stopping any existing Expo processes..."
pkill -f "expo start" || true

# Clear cache and start Expo
echo "Starting Expo server with cleared cache..."
cd "$(dirname "$0")"
npx expo start --clear

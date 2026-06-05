# Motif

Motif is a mobile language-learning notebook app prototype built with Expo and React Native.

The app is designed around a simple workflow:

1. Search a word
2. Add useful translations to a personal notebook
3. Practice saved words with study modes

## Current Features

- Multi-language theme system
- Turkish-to-target-language vocabulary workflow
- Wordbook screen
- Study screen prototype
- Bottom navigation
- React Context for theme and wordbook state

## Target Languages

- French
- German
- Spanish
- Italian
- English

## Tech Stack

- Expo
- React Native
- JavaScript
- React Context API

## Project Structure

motif-expo/
  App.js
  package.json
  package-lock.json
  src/
    context/
      ThemeContext.js
      WordbookContext.js
    screens/
      SozlukScreen.js
      DefterScreen.js
      CalisScreen.js
  screenshots/

## Run Locally

Install dependencies:

npm install

Start the Expo development server:

npx expo start --lan --clear

## Screenshots

Add app screenshots in the screenshots/ folder.

Recommended files:

screenshots/search-screen.png
screenshots/notebook-screen.png
screenshots/study-screen.png
screenshots/prototype-preview.png

## Roadmap

- Improve glassmorphism UI
- Add real search input
- Add local storage with AsyncStorage
- Add spaced repetition logic
- Add quiz modes
- Prepare iOS and Android builds

## Status

This project is currently an early mobile app prototype. The main goal is to transform the visual language prototype into a working Expo application for iOS and Android.

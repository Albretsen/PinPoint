# PinPoint

A location-based game where you and your friends compete to guess each other's locations.

## Features

- Take photos at your current location
- Share them with your group
- Others try to guess where you are
- Points are awarded based on accuracy
- Support for multiple languages (English, Norwegian)
- Dark/Light theme support

## Tech Stack

- React Native with Expo
- TypeScript
- Supabase for backend
- Zustand for state management
- React Query for data fetching
- i18n for internationalization

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator
- Supabase account

## Environment Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

## Development

1. Start the development server:
   ```bash
   npm start
   ```
2. Press 'i' for iOS simulator or 'a' for Android emulator

## Project Structure

```
app/
  ├── (auth)/           # Authentication related screens
  ├── (protected)/      # Protected screens requiring authentication
  └── _layout.tsx       # Root layout
src/
  ├── components/       # Reusable components
  ├── context/         # React Context providers
  ├── i18n/            # Internationalization
  ├── lib/             # Third-party library configurations
  ├── store/           # Zustand stores
  ├── types/           # TypeScript type definitions
  └── utils/           # Utility functions
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## Code Style

- Use TypeScript for type safety
- Follow the existing file structure
- Use the provided components (PinText, Card, etc.)
- Follow the established naming conventions
- Use the translation system for all text
- Use the theme system for colors and styling

## Testing

```bash
npm test
```

## Building for Production

```bash
npm run build
```
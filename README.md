# PinPoint 📍

[![Expo](https://img.shields.io/badge/Expo-000000?style=flat&logo=expo&logoColor=white)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactnative.dev)

A location-based game where you and your friends compete to guess each other's locations.

## Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

## 🛠 Tech Stack

- **Frontend**: React Native (Expo)
- **Backend**: Supabase
- **State**: Zustand + React Query
- **Languages**: TypeScript
- **i18n**: Built-in localization

## 🔧 Setup

1. Clone the repo
2. Create `.env` in root:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```
3. Run `npm install`
4. Start with `npm start`

## 📁 Project Structure

```
app/                  # App screens and navigation
├── (auth)/          # Authentication screens
├── (protected)/     # Protected screens
└── _layout.tsx      # Root layout
src/
├── components/      # Shared components
├── lib/            # Configurations
├── store/          # State management
└── utils/          # Helpers
```

## 🤝 Contributing

1. Branch from `develop`: `feat/xx/feature-name`
2. Make changes
3. PR to `develop`
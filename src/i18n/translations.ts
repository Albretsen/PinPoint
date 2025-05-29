export const translations = {
  en: {
    // Auth
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      username: 'Username',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account? Sign In',
      createProfile: 'Create Profile',
      chooseUsername: 'Choose a username',
      avatarGenerated: 'Your avatar will be generated based on your username',
      continue: 'Continue',
    },

    // Home
    home: {
      noGroups: 'You haven\'t joined any groups yet',
      guessLocation: 'Guess Location',
      failedToFetchGroups: 'Failed to fetch groups',
    },

    // Navigation
    navigation: {
      back: 'Back',
      home: 'Home',
      groups: 'Groups',
      camera: 'Camera',
      settings: 'Settings',
      profile: 'Profile',
      guessLocation: 'Guess Location',
      linkAccount: 'Link Account',
    },

    // Profile
    profile: {
      signOutWarning: 'Sign Out Warning',
      anonymousSignOutWarning: 'You are signed in as an anonymous user. If you sign out, you will lose access to this account and all associated data.',
      cancel: 'Cancel',
      linkAccount: 'Link Account',
      continueSignOut: 'Continue Sign Out',
    },

    // Onboarding
    onboarding: {
      welcome: 'Welcome to PinPoint',
      description: 'PinPoint is a location-based game where you and your friends compete to guess each other\'s locations. Here\'s how it works:',
      howItWorks: [
        'Take a photo at your current location',
        'Share it with your group',
        'Others try to guess where you are',
        'Points are awarded based on accuracy',
      ],
      readyToStart: 'Ready to start playing?',
      getStarted: 'Get Started',
    },
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en; 
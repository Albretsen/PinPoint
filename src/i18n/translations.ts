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
      needAccount: 'Need an account? Sign Up',
      clearStorage: 'Clear Storage (Debug)',
      storageCleared: 'Storage cleared successfully',
      storageClearFailed: 'Failed to clear storage',
      required: 'is required',
      supabase: {
        invalidCredentials: 'Invalid email or password',
        emailNotConfirmed: 'Please confirm your email before signing in',
        userNotFound: 'User not found',
        emailAlreadyRegistered: 'Email is already registered',
        networkError: 'Network error. Please try again.',
        unknown: 'An unknown error occurred',
      },
    },

    // Groups
    groups: {
      myGroups: 'My Groups',
      discoverPublicGroups: 'Discover Public Groups',
      member: 'member',
      members: 'members',
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
      anonymous: 'Anonymous',
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
      joinOrCreateGroup: 'Join or Create a Group',
      groupDescription: 'This screen will allow you to join an existing group or create a new one. For now, just continue to the next step.',
    },

    // Settings
    settings: {
      appearance: 'Appearance',
      language: 'Language',
      selectLanguage: 'Select Language',
    },

    // Link Account
    linkAccount: {
      title: 'Link Your Account',
      description: 'Link your anonymous account to keep your data and progress.',
      linkWithEmail: 'Link with Email',
      linkWithGoogle: 'Link with Google',
      cancel: 'Cancel',
      fillAllFields: 'Please fill in all fields',
      googleSignInFailed: 'Google sign-in was cancelled or failed',
    },

    // Error
    error: {
      somethingWentWrong: 'Something went wrong',
      unknownError: 'An unknown error occurred',
      tryAgain: 'Try Again',
      networkError: 'Network error. Please check your connection.',
      serverError: 'Server error. Please try again later.',
      notFound: 'Not found',
      unauthorized: 'Unauthorized',
      forbidden: 'Forbidden',
    },

    list: {
      error: {
        title: 'Something went wrong',
        retry: 'Try Again',
        empty: 'No items found',
      },
    },
  },
  no: {
    // Auth
    auth: {
      signIn: 'Logg inn',
      signUp: 'Registrer deg',
      signOut: 'Logg ut',
      email: 'E-post',
      password: 'Passord',
      username: 'Brukernavn',
      createAccount: 'Opprett konto',
      alreadyHaveAccount: 'Har du allerede en konto? Logg inn',
      createProfile: 'Opprett profil',
      chooseUsername: 'Velg et brukernavn',
      avatarGenerated: 'Din avatar vil bli generert basert på ditt brukernavn',
      continue: 'Fortsett',
      needAccount: 'Trenger du en konto? Registrer deg',
      clearStorage: 'Tøm lagring (Debug)',
      storageCleared: 'Lagring tømt',
      storageClearFailed: 'Kunne ikke tømme lagring',
      required: 'er påkrevd',
      supabase: {
        invalidCredentials: 'Ugyldig e-post eller passord',
        emailNotConfirmed: 'Vennligst bekreft e-posten din før du logger inn',
        userNotFound: 'Bruker ikke funnet',
        emailAlreadyRegistered: 'E-post er allerede registrert',
        networkError: 'Nettverksfeil. Prøv igjen.',
        unknown: 'En ukjent feil oppstod',
      },
    },

    // Groups
    groups: {
      myGroups: 'Mine grupper',
      discoverPublicGroups: 'Oppdag offentlige grupper',
      member: 'medlem',
      members: 'medlemmer',
    },

    // Home
    home: {
      noGroups: 'Du har ikke blitt med i noen grupper ennå',
      guessLocation: 'Gjett plassering',
      failedToFetchGroups: 'Kunne ikke hente grupper',
    },

    // Navigation
    navigation: {
      back: 'Tilbake',
      home: 'Hjem',
      groups: 'Grupper',
      camera: 'Kamera',
      settings: 'Innstillinger',
      profile: 'Profil',
      guessLocation: 'Gjett plassering',
      linkAccount: 'Koble til konto',
    },

    // Profile
    profile: {
      signOutWarning: 'Advarsel om utlogging',
      anonymousSignOutWarning: 'Du er logget inn som en anonym bruker. Hvis du logger ut, vil du miste tilgang til denne kontoen og all tilknyttet data.',
      cancel: 'Avbryt',
      linkAccount: 'Koble til konto',
      continueSignOut: 'Fortsett utlogging',
      anonymous: 'Anonym',
    },

    // Onboarding
    onboarding: {
      welcome: 'Velkommen til PinPoint',
      description: 'PinPoint er et plasseringsbasert spill hvor du og dine venner konkurrerer om å gjette hverandres plasseringer. Slik fungerer det:',
      howItWorks: [
        'Ta et bilde på din nåværende plassering',
        'Del det med gruppen din',
        'Andre prøver å gjette hvor du er',
        'Poeng tildeles basert på nøyaktighet',
      ],
      readyToStart: 'Klar til å begynne å spille?',
      getStarted: 'Kom i gang',
      joinOrCreateGroup: 'Bli med i eller opprett en gruppe',
      groupDescription: 'Denne skjermen lar deg bli med i en eksisterende gruppe eller opprette en ny. For nå, bare fortsett til neste steg.',
    },

    // Settings
    settings: {
      appearance: 'Utseende',
      language: 'Språk',
      selectLanguage: 'Velg språk',
    },

    // Link Account
    linkAccount: {
      title: 'Koble til konto',
      description: 'Koble til din anonyme konto for å beholde dataene og fremgangen din.',
      linkWithEmail: 'Koble til med e-post',
      linkWithGoogle: 'Koble til med Google',
      cancel: 'Avbryt',
      fillAllFields: 'Vennligst fyll ut alle felt',
      googleSignInFailed: 'Google-innlogging ble avbrutt eller mislyktes',
    },

    // Error
    error: {
      somethingWentWrong: 'Noe gikk galt',
      unknownError: 'En ukjent feil oppstod',
      tryAgain: 'Prøv igjen',
      networkError: 'Nettverksfeil. Sjekk internettilkoblingen din.',
      serverError: 'Serverfeil. Vennligst prøv igjen senere.',
      notFound: 'Ikke funnet',
      unauthorized: 'Ikke autorisert',
      forbidden: 'Forbudt',
    },

    list: {
      error: {
        title: 'Noe gikk galt',
        retry: 'Prøv igjen',
        empty: 'Ingen elementer funnet',
      },
    },
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en; 
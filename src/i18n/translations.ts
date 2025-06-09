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
      discoverPublicGroups: 'Public Groups',
      member: 'member',
      members: 'Members',
      memberCount: '{{count}} members',
      public: 'Public',
      private: 'Private',
      join: 'Join',
      joinGroup: 'Join group',
      joining: 'Joining...',
      leaveGroup: 'Leave group',
      leaving: 'Leaving...',
      leftGroup: 'Successfully left the group',
      errorLeavingGroup: 'Error leaving group',
      noGroups: 'You are not a member of any groups yet',
      noGroupsJoined: 'You haven\'t joined any groups yet',
      noGroupsFound: 'No groups found',
      noPublicGroups: 'No public groups available',
      viewMembers: 'View Members',
      admin: 'Admin',
      kickMember: 'Kick Member',
      memberKicked: 'Member has been kicked from the group',
      noMembers: 'No members found',
      joinedGroup: 'Successfully joined the group',
      errorJoiningGroup: 'Error joining group',
      notAdmin: 'You must be an admin to perform this action',
      errorKickingMember: 'Error kicking member from group',
      deleteGroup: 'Delete Group',
      searchPlaceholder: 'Search groups...',
      sort: {
        trending: 'Trending',
        members: 'Most Members',
        new: 'Newest',
      },
      create: {
        title: 'Create New Group',
        basicInfo: {
          title: 'Basic Information',
          name: 'Group Name',
          namePlaceholder: 'Enter group name',
          description: 'Description',
          descriptionPlaceholder: 'Enter group description',
          coverPhoto: 'Cover Photo',
          selectCoverPhoto: 'Select Cover Photo',
          charactersLeft: '{{count}} characters left',
        },
        privacy: {
          title: 'Privacy & Rules',
          public: 'Public Group',
          publicDescription: 'Anyone can find and join this group',
          private: 'Private Group',
          privateDescription: 'Only people with the invite code can join',
          inviteCode: 'Invite Code',
          copyInviteCode: 'Copy Invite Code',
          copiedToClipboard: 'Copied to clipboard',
          dailyChallengeTime: 'Daily Challenge Time',
          selectTime: 'Select Time',
        },
        preview: {
          title: 'Preview & Confirm',
          confirm: 'Create Group',
          cancel: 'Go Back',
        },
        success: {
          title: 'Group Created!',
          description: 'Your group has been created successfully',
          viewGroup: 'View Group',
        },
      },
    },

    // Home
    home: {
      noGroups: 'You haven\'t joined any groups yet',
      guessLocation: 'Guess Location',
      failedToFetchGroups: 'Failed to fetch groups',
    },

    // Navigation
    navigation: {
      next: 'Next',
      back: 'Back',
      home: 'Home',
      groups: 'Groups',
      camera: 'Camera',
      settings: 'Settings',
      profile: 'Profile',
      guessLocation: 'Guess Location',
      linkAccount: 'Link Account',
      previewAndShare: 'Preview & Share',
      noImageSelected: 'No image selected',
      shareWithGroups: 'Share with Groups',
      selectAll: 'Select All',
      deselectAll: 'Deselect All',
      shareWithX: 'Share with {{count}} groups',
      upload: {
        success: 'Image uploaded successfully',
        error: {
          unauthorized: 'You are not authorized to upload images to these groups',
          storage: 'Failed to upload image to storage',
          database: 'Failed to save image information',
          unknown: 'An error occurred while uploading the image'
        }
      },
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

    // Challenge
    challenge: {
      ended: 'Challenge ended',
      noChallengeToday: 'No challenge today',
      yourGuess: 'Your guess',
      guessLocation: 'Guess Location',
      topGuesses: 'Top Guesses',
      timeRemaining: 'Time remaining',
      meters: 'meters',
      loading: 'Loading challenge...',
    },

    leaderboard: {
      title: 'Leaderboard',
      today: 'Today',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      allTime: 'All Time',
      noData: 'No data available',
      loading: 'Loading leaderboard...',
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
      discoverPublicGroups: 'Offentlige grupper',
      member: 'medlem',
      members: 'Medlemmer',
      memberCount: '{{count}} medlemmer',
      public: 'Offentlig',
      private: 'Privat',
      join: 'Bli med',
      joinGroup: 'Bli med i gruppe',
      joining: 'Bli med...',
      leaveGroup: 'Forlat gruppe',
      leaving: 'Forlater...',
      leftGroup: 'Forlot gruppen',
      errorLeavingGroup: 'Kunne ikke forlate gruppen',
      noGroups: 'Du er ikke medlem av noen grupper ennå',
      noGroupsJoined: 'Du har ikke blitt med i noen grupper ennå',
      noGroupsFound: 'Ingen grupper funnet',
      noPublicGroups: 'Ingen offentlige grupper tilgjengelig',
      viewMembers: 'Se medlemmer',
      admin: 'Admin',
      kickMember: 'Kast ut medlem',
      memberKicked: 'Medlem har blitt kastet ut av gruppen',
      noMembers: 'Ingen medlemmer funnet',
      joinedGroup: 'Ble med i gruppen',
      errorJoiningGroup: 'Kunne ikke bli med i gruppen',
      notAdmin: 'Du må være admin for å utføre denne handlingen',
      errorKickingMember: 'Kunne ikke kaste ut medlem fra gruppen',
      deleteGroup: 'Slett gruppe',
      searchPlaceholder: 'Søk i grupper...',
      sort: {
        trending: 'Populære',
        members: 'Flest medlemmer',
        new: 'Nyeste',
      },
      create: {
        title: 'Opprett ny gruppe',
        basicInfo: {
          title: 'Grunnleggende informasjon',
          name: 'Gruppenavn',
          namePlaceholder: 'Skriv inn gruppenavn',
          description: 'Beskrivelse',
          descriptionPlaceholder: 'Skriv inn gruppebeskrivelse',
          coverPhoto: 'Forsidebilde',
          selectCoverPhoto: 'Velg forsidebilde',
          charactersLeft: '{{count}} tegn igjen',
        },
        privacy: {
          title: 'Personvern & Regler',
          public: 'Offentlig gruppe',
          publicDescription: 'Alle kan finne og bli med i denne gruppen',
          private: 'Privat gruppe',
          privateDescription: 'Bare personer med invitasjonskode kan bli med',
          inviteCode: 'Invitasjonskode',
          copyInviteCode: 'Kopier invitasjonskode',
          copiedToClipboard: 'Kopiert til utklippstavle',
          dailyChallengeTime: 'Daglig utfordringstid',
          selectTime: 'Velg tid',
        },
        preview: {
          title: 'Forhåndsvis & Bekreft',
          confirm: 'Opprett gruppe',
          cancel: 'Gå tilbake',
        },
        success: {
          title: 'Gruppe opprettet!',
          description: 'Gruppen din har blitt opprettet',
          viewGroup: 'Se gruppe',
        },
      },
    },

    // Home
    home: {
      noGroups: 'Du har ikke blitt med i noen grupper ennå',
      guessLocation: 'Gjett plassering',
      failedToFetchGroups: 'Kunne ikke hente grupper',
    },

    // Navigation
    navigation: {
      next: 'Neste',
      back: 'Tilbake',
      home: 'Hjem',
      groups: 'Grupper',
      camera: 'Kamera',
      settings: 'Innstillinger',
      profile: 'Profil',
      guessLocation: 'Gjett plassering',
      linkAccount: 'Koble til konto',
      previewAndShare: 'Forhåndsvis & Del',
      noImageSelected: 'Ingen bilde valgt',
      shareWithGroups: 'Del med grupper',
      selectAll: 'Velg alle',
      deselectAll: 'Fjern alle',
      shareWithX: 'Del med {{count}} grupper',
      upload: {
        success: 'Bildet ble lastet opp',
        error: {
          unauthorized: 'Du har ikke tillatelse til å laste opp bilder til disse gruppene',
          storage: 'Kunne ikke laste opp bildet til lagring',
          database: 'Kunne ikke lagre bildeinformasjon',
          unknown: 'En feil oppstod under opplasting av bildet'
        }
      },
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

    // Challenge
    challenge: {
      ended: 'Utfordring avsluttet',
      noChallengeToday: 'Ingen utfordring i dag',
      yourGuess: 'Din gjetning',
      guessLocation: 'Gjett plassering',
      topGuesses: 'Topp gjetninger',
      timeRemaining: 'Gjenstående tid',
      meters: 'meter',
      loading: 'Laster utfordring...',
    },

    leaderboard: {
      title: 'Toppliste',
      today: 'I dag',
      thisWeek: 'Denne uken',
      thisMonth: 'Denne måneden',
      allTime: 'All tid',
      noData: 'Ingen data tilgjengelig',
      loading: 'Laster toppliste...',
    },
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en; 
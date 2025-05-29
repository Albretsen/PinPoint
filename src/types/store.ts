import { ThemeName } from './theme';

export type ThemeState = {
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
};

export type OnboardingState = {
  username: string | null;
  setUsername: (username: string) => void;
  clearOnboarding: () => void;
}; 
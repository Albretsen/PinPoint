export type ThemeColors = {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  border: string;
  card: string;
  error: string;
  success: string;
  frameBorder: string;
  frameBackground: string;
};

export type Theme = {
  name: string;
  colors: ThemeColors;
  fontFamily: string;
};

export type ThemeName = 'light' | 'dark' | 'fun' | 'professional';

export type ThemeContextType = {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
};

// Define all available themes
export const themes = {
  light: {
    name: 'Light',
    colors: {
      background: '#FFFFFF',
      text: '#000000',
      primary: '#007AFF',
      secondary: '#5856D6',
      border: '#E5E5EA',
      card: '#F2F2F7',
      error: '#FF3B30',
      success: '#34C759',
      frameBorder: '#1A1A2E',
      frameBackground: '#F5F5F5',
    },
    fontFamily: 'Satoshi',
  },
  dark: {
    name: 'Dark',
    colors: {
      background: '#000000',
      text: '#FFFFFF',
      primary: '#0A84FF',
      secondary: '#5E5CE6',
      border: '#38383A',
      card: '#1C1C1E',
      error: '#FF453A',
      success: '#32D74B',
      frameBorder: '#1A1A2E',
      frameBackground: '#1C1C1E',
    },
    fontFamily: 'Satoshi',
  },
  fun: {
    name: 'Fun',
    colors: {
      background: '#FFE5E5',
      text: '#2D2D2D',
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      border: '#FFB8B8',
      card: '#FFF0F0',
      error: '#FF4757',
      success: '#2ED573',
      frameBorder: '#1A1A2E',
      frameBackground: '#FFF0F0',
    },
    fontFamily: 'Satoshi',
  },
  professional: {
    name: 'Professional',
    colors: {
      background: '#F8F9FA',
      text: '#212529',
      primary: '#495057',
      secondary: '#6C757D',
      border: '#DEE2E6',
      card: '#FFFFFF',
      error: '#DC3545',
      success: '#28A745',
      frameBorder: '#1A1A2E',
      frameBackground: '#FFFFFF',
    },
    fontFamily: 'Satoshi',
  },
} as const; 
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
  inputBorder: string;
  buttonFilledBackground: string;
  buttonFilledText: string;
  skeleton: string;
};

export type ThemeSpacing = {
  spacing2: number;
  spacing4: number;
  spacing8: number;
  spacing12: number;
  spacing16: number;
  spacing24: number;
  spacing32: number;
  spacing40: number;
  spacing48: number;
};

export type Theme = {
  name: string;
  colors: ThemeColors;
  fontFamily: string;
  spacing: ThemeSpacing;
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
      inputBorder: '#1C1C1C',
      buttonFilledBackground: '#000022',
      buttonFilledText: '#FDFDFD',
      skeleton: '#E5E5EA',
    },
    fontFamily: 'Satoshi',
    spacing: {
      spacing2: 2,
      spacing4: 4,
      spacing8: 8,
      spacing12: 12,
      spacing16: 16,
      spacing24: 24,
      spacing32: 32,
      spacing40: 40,
      spacing48: 48,
    },
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
      inputBorder: '#1C1C1C',
      buttonFilledBackground: '#222244',
      buttonFilledText: '#FDFDFD',
      skeleton: '#38383A',
    },
    fontFamily: 'Satoshi',
    spacing: {
      spacing2: 2,
      spacing4: 4,
      spacing8: 8,
      spacing12: 12,
      spacing16: 16,
      spacing24: 24,
      spacing32: 32,
      spacing40: 40,
      spacing48: 48,
    },
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
      inputBorder: '#1C1C1C',
      buttonFilledBackground: '#FF6B6B',
      buttonFilledText: '#FFFFFF',
      skeleton: '#FFB8B8',
    },
    fontFamily: 'Satoshi',
    spacing: {
      spacing2: 2,
      spacing4: 4,
      spacing8: 8,
      spacing12: 12,
      spacing16: 16,
      spacing24: 24,
      spacing32: 32,
      spacing40: 40,
      spacing48: 48,
    },
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
      inputBorder: '#1C1C1C',
      buttonFilledBackground: '#212529',
      buttonFilledText: '#FDFDFD',
      skeleton: '#DEE2E6',
    },
    fontFamily: 'Satoshi',
    spacing: {
      spacing2: 2,
      spacing4: 4,
      spacing8: 8,
      spacing12: 12,
      spacing16: 16,
      spacing24: 24,
      spacing32: 32,
      spacing40: 40,
      spacing48: 48,
    },
  },
} as const; 
import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

// Define the theme structure
export type ThemeColors = {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  border: string;
  card: string;
  error: string;
  success: string;
};

// Define the complete theme type
export type Theme = {
  name: string;
  colors: ThemeColors;
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
    },
  },
} as const;

export type ThemeName = keyof typeof themes;

// Create the theme context
type ThemeContextType = {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

// Create a hook to use the theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Create the theme provider component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeName, setThemeName] = useState<ThemeName>(
    systemColorScheme === 'dark' ? 'dark' : 'light'
  );

  // Update theme when system theme changes
  useEffect(() => {
    if (systemColorScheme === 'dark' && themeName === 'light') {
      setThemeName('dark');
    } else if (systemColorScheme === 'light' && themeName === 'dark') {
      setThemeName('light');
    }
  }, [systemColorScheme]);

  const theme = themes[themeName];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeName,
        setTheme: setThemeName,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
} 
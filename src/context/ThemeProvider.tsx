import { useThemeStore } from '@/src/store/themeStore';
import { ThemeContextType, themes } from '@/src/types/theme';
import { createContext, useContext, useEffect, useState } from 'react';
import { Platform, StatusBar, useColorScheme } from 'react-native';

// Create the theme context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: themes.light,
  themeName: 'light',
  setTheme: () => {},
});

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
  const { themeName, setTheme } = useThemeStore();
  const systemColorScheme = useColorScheme();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme based on system preference if no theme is stored
  useEffect(() => {
    if (!themeName) {
      setTheme(systemColorScheme === 'dark' ? 'dark' : 'light');
    }
    setIsInitialized(true);
  }, []); // Empty dependency array since we only want this to run once on mount

  const theme = themes[themeName || 'light'];

  // Update status bar style based on theme
  useEffect(() => {
    if (!isInitialized) return;

    const isDarkTheme = themeName === 'dark';
    StatusBar.setBarStyle(isDarkTheme ? 'light-content' : 'dark-content');
    
    // Android-specific status bar configuration
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, [themeName, isInitialized]);

  // Don't render children until theme is initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeName: themeName || 'light',
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
} 
import { ThemeName } from '@/src/context/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ThemeState = {
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeName: 'light',
      setTheme: (themeName) => set({ themeName }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 
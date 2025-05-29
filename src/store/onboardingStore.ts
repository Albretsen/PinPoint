import { OnboardingState } from '@/src/types/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      username: null,
      setUsername: (username) => set({ username }),
      clearOnboarding: () => set({ username: null }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 
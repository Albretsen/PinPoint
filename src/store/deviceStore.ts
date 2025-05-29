import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type DeviceState = {
  hasLoggedInBefore: boolean;
  setHasLoggedInBefore: (value: boolean) => void;
  lastLoginDate: string | null;
  setLastLoginDate: (date: string | null) => void;
  // Add more device-specific state as needed
};

export const useDeviceStore = create<DeviceState>()(
  persist(
    (set) => ({
      hasLoggedInBefore: false,
      setHasLoggedInBefore: (value) => set({ hasLoggedInBefore: value }),
      lastLoginDate: null,
      setLastLoginDate: (date) => set({ lastLoginDate: date }),
    }),
    {
      name: 'device-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 
import { supabase } from '@/src/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Define the base config type with known fields
interface BaseConfig {
  app_version: string;
  last_fetched_at: string;
}

// Create a type that allows for additional fields
type RemoteConfig = BaseConfig & Record<string, any>;

interface ConfigState {
  config: RemoteConfig | null;
  isLoading: boolean;
  error: Error | null;
  fetchConfig: () => Promise<void>;
  shouldRefetch: () => boolean;
}

// Constants for config management
const CONFIG_FETCH_INTERVAL = 1000 * 60 * 60; // 1 hour
const CONFIG_FETCH_RETRY_INTERVAL = 1000 * 60 * 5; // 5 minutes

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      config: null,
      isLoading: false,
      error: null,

      fetchConfig: async () => {
        try {
          set({ isLoading: true, error: null });

          const { data, error } = await supabase
            .from('configs')
            .select('*')
            .order('id', { ascending: false })
            .limit(1)
            .single();

          if (error) throw error;

          // Add the fetch timestamp to the config
          const configWithTimestamp = {
            ...data,
            last_fetched_at: new Date().toISOString(),
          };

          set({ config: configWithTimestamp, isLoading: false });
        } catch (error) {
          set({ error: error as Error, isLoading: false });
        }
      },

      shouldRefetch: () => {
        const { config } = get();
        
        // If no config exists, we should fetch
        if (!config) return true;

        const lastFetched = new Date(config.last_fetched_at).getTime();
        const now = new Date().getTime();
        const timeSinceLastFetch = now - lastFetched;

        // If the last fetch was more than CONFIG_FETCH_INTERVAL ago, we should fetch
        if (timeSinceLastFetch > CONFIG_FETCH_INTERVAL) return true;

        // If there was an error in the last fetch and it's been more than CONFIG_FETCH_RETRY_INTERVAL, we should retry
        if (get().error && timeSinceLastFetch > CONFIG_FETCH_RETRY_INTERVAL) return true;

        return false;
      },
    }),
    {
      name: 'config-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 
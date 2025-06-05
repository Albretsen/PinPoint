import { useConfigStore } from '@/src/store/configStore';
import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useRemoteConfig() {
  const { config, isLoading, error, fetchConfig, shouldRefetch } = useConfigStore();

  useEffect(() => {
    // Initial fetch if needed
    if (shouldRefetch()) {
      fetchConfig();
    }

    // Set up app state change listener
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && shouldRefetch()) {
        fetchConfig();
      }
    });

    // Set up periodic fetch
    const intervalId = setInterval(() => {
      if (shouldRefetch()) {
        fetchConfig();
      }
    }, 1000 * 60 * 5); // Check every 5 minutes

    return () => {
      subscription.remove();
      clearInterval(intervalId);
    };
  }, [fetchConfig, shouldRefetch]);

  return {
    config,
    isLoading,
    error,
    refetch: fetchConfig,
  };
} 
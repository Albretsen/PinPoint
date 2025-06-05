import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { PinToastProvider } from '@/src/components/PinToast';
import { AuthProvider } from '@/src/context/AuthProvider';
import { ThemeProvider } from '@/src/context/ThemeProvider';
import { useRemoteConfig } from '@/src/hooks/useRemoteConfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';
import { enableScreens } from 'react-native-screens';

// Enable native screens for better performance and animations
enableScreens(true);

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function RootLayout() {
  // Initialize remote config
  useRemoteConfig();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <PinToastProvider>
                <MenuProvider>
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      animation: Platform.select({
                        ios: 'default',
                        android: 'fade',
                      }),
                      animationDuration: 200,
                      presentation: 'card',
                    }}
                  >
                    <Stack.Screen
                      name="(auth)"
                      options={{
                        animation: 'slide_from_left',
                      }}
                    />
                    <Stack.Screen
                      name="(protected)"
                      options={{
                        animation: 'slide_from_right',
                      }}
                    />
                  </Stack>
                </MenuProvider>
              </PinToastProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
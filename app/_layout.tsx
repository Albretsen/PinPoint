import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { PinToastProvider } from '@/src/components/PinToast';
import { AuthProvider } from '@/src/context/AuthProvider';
import { ThemeProvider } from '@/src/context/ThemeProvider';
import { useLoadFonts } from '@/src/hooks/useFont';
import { useRemoteConfig } from '@/src/hooks/useRemoteConfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';
import { enableScreens } from 'react-native-screens';

enableScreens(true);

// Prevent auto-hiding splash screen
SplashScreen.preventAutoHideAsync();

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useLoadFonts();

  useRemoteConfig();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#000' }} />;
  }

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
                      options={{ animation: 'slide_from_left' }}
                    />
                    <Stack.Screen
                      name="(protected)"
                      options={{ animation: 'slide_from_right' }}
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

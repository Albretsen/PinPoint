import { AuthProvider } from '@/src/context/AuthProvider';
import { ThemeProvider } from '@/src/context/ThemeProvider';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { enableScreens } from 'react-native-screens';

// Enable native screens for better performance and animations
enableScreens(true);

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
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
      </AuthProvider>
    </ThemeProvider>
  );
}
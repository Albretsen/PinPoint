import { useTheme } from '@/src/context/ThemeProvider';
import { useUserStore } from '@/src/store/userStore';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

function useProtectedRoute(session: any) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // Redirect to the sign-in page with a slide from left animation
      router.push({
        pathname: '/login',
        params: { animation: 'slide_from_left' }
      });
    } else if (session && inAuthGroup) {
      // Redirect away from the sign-in page with a push animation
      router.push('/home');
    }
  }, [session, segments]);
}

export default function ProtectedLayout() {
  const { session } = useUserStore();
  const { theme } = useTheme();

  useProtectedRoute(session);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        animation: Platform.select({
          ios: 'default',
          android: 'fade',
        }),
        presentation: 'card',
        animationDuration: 200,
      }}
    >
      <Stack.Screen 
        name="home"
        options={{
          title: 'Home',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
} 
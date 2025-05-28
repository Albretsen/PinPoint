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

    if (session && inAuthGroup) {
      // Redirect away from the sign-in page with a push animation
      router.replace('/home');
    }
  }, [session, segments]);
}

export default function AuthLayout() {
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
        name="login"
        options={{
          title: 'Sign In',
          animation: 'slide_from_right',
          animationTypeForReplace: 'pop',
        }}
      />
    </Stack>
  );
} 
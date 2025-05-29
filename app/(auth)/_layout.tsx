import { useTheme } from '@/src/context/ThemeProvider';
import { useUserStore } from '@/src/store/userStore';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

function useProtectedRoute(session: any) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (session && inAuthGroup) {
      router.replace('/home');
    }
  }, [session, segments, router]);
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
        animation: 'none',
        presentation: 'card',
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: 'Sign In',
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: 'Sign Up',
        }}
      />
    </Stack>
  );
} 
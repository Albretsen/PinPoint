import { useTheme } from '@/src/context/ThemeProvider';
import { useDeviceStore } from '@/src/store/deviceStore';
import { useUserStore } from '@/src/store/userStore';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

function useProtectedRoute(session: any) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (session && inAuthGroup) {
      router.replace('/(protected)/(tabs)/home');
    }
  }, [session, segments, router]);
}

export default function AuthLayout() {
  const { session } = useUserStore();
  const { theme } = useTheme();
  const { hasLoggedInBefore } = useDeviceStore();
  const router = useRouter();

  useProtectedRoute(session);

  // Redirect to signup if user has never logged in before
  useEffect(() => {
    if (!hasLoggedInBefore) {
      router.replace('/onboarding/username');
    }
  }, [hasLoggedInBefore, router]);

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
        name="onboarding/username"
        options={{
          title: 'Create Profile',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="onboarding/group"
        options={{
          title: 'Join or Create Group',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="onboarding/intro"
        options={{
          title: 'Welcome to PinPoint',
          headerShown: false,
        }}
      />
    </Stack>
  );
} 
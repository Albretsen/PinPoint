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
  const segments = useSegments();

  useProtectedRoute(session);

  // Redirect to onboarding if user has never logged in before, but allow onboarding and signup routes
  useEffect(() => {
    const inOnboarding = segments.includes('onboarding');
    const inSignup = segments.includes('signup');
    if (!hasLoggedInBefore && !inOnboarding && !inSignup) {
      router.replace('/onboarding/username');
    }
  }, [hasLoggedInBefore, router, segments]);

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
          headerShown: false,
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
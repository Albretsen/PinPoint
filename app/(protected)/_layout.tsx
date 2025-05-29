import { useTheme } from '@/src/context/ThemeProvider';
import { Stack } from 'expo-router';

export default function ProtectedLayout() {
  const { theme } = useTheme();

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
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="link-account"
        options={{
          title: 'Link Account',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
} 
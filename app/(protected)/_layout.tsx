import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { Stack } from 'expo-router';

export default function ProtectedLayout() {
  const { theme } = useTheme();
  const { t } = useTranslation();

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
          title: t('navigation.linkAccount'),
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="guess"
        options={{
          title: t('navigation.guessLocation'),
          headerShown: true,
          headerBackTitle: t('navigation.back'),
        }}
      />
    </Stack>
  );
} 
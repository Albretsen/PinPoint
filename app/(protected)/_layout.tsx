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
      <Stack.Screen
        name="create-group/basic-info"
        options={{
          title: t('groups.create.basicInfo.title'),
          headerBackTitle: t('navigation.back'),
        }}
      />
      <Stack.Screen
        name="create-group/privacy"
        options={{
          title: t('groups.create.privacy.title'),
          headerBackTitle: t('navigation.back'),
        }}
      />
      <Stack.Screen
        name="create-group/preview"
        options={{
          title: t('groups.create.preview.title'),
          headerBackTitle: t('navigation.back'),
        }}
      />
      <Stack.Screen
        name="create-group/success"
        options={{
          title: t('groups.create.success.title'),
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
} 
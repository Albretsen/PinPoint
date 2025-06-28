import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { supabase } from '@/src/lib/supabase';
import { useDeviceStore } from '@/src/store/deviceStore';
import { useOnboardingStore } from '@/src/store/onboardingStore';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function IntroScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { setHasLoggedInBefore } = useDeviceStore();
  const { username, clearOnboarding } = useOnboardingStore();
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleComplete = async () => {
    try {
      if (!username) {
        throw new Error(t('auth.username') + ' is required');
      }

      // Sign in anonymously
      const { data, error: signInError } = await supabase.auth.signInAnonymously({
        options: {
          data: {
            username,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/png?seed=${username}`,
          },
        }
      });

      if (signInError) {
        throw signInError;
      }

      // Clear onboarding data and update device state
      clearOnboarding();
      setHasLoggedInBefore(true);

      // Navigate to home
      router.replace('/(protected)/(tabs)/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {t('onboarding.welcome')}
      </Text>

      <Text style={[styles.description, { color: theme.colors.text }]}>
        {t('onboarding.description')}

        {'\n\n'}{t('onboarding.howItWorks.0')}
        {'\n'}{t('onboarding.howItWorks.1')}
        {'\n'}{t('onboarding.howItWorks.2')}
        {'\n'}{t('onboarding.howItWorks.3')}
        {'\n\n'}{t('onboarding.readyToStart')}
      </Text>

      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title={t('onboarding.getStarted')}
          onPress={handleComplete}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7,
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 20,
  },
  error: {
    marginBottom: 15,
    textAlign: 'center',
  },
}); 
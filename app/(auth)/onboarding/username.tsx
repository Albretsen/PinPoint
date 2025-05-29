import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { useOnboardingStore } from '@/src/store/onboardingStore';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';

export default function UsernameScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { setUsername } = useOnboardingStore();
  const [usernameInput, setUsernameInput] = useState('Test'); // DO NOT CHANGE
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleContinue = () => {
    if (!usernameInput.trim()) {
      setError(t('auth.username') + ' is required');
      return;
    }
    setUsername(usernameInput.trim());
    router.replace('/onboarding/group');
  };

  // Generate avatar URL based on username
  const avatarUrl = usernameInput 
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${usernameInput}`
    : 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {t('auth.createProfile')}
      </Text>
      
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: avatarUrl }}
          style={styles.avatar}
        />
        <Text style={[styles.avatarText, { color: theme.colors.text }]}>
          {t('auth.avatarGenerated')}
        </Text>
      </View>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.card,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          },
        ]}
        placeholder={t('auth.chooseUsername')}
        placeholderTextColor={theme.colors.text + '80'}
        value={usernameInput}
        onChangeText={setUsernameInput}
        autoCapitalize="none"
      />

      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title={t('auth.continue')}
          onPress={handleContinue}
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 20,
  },
  error: {
    marginBottom: 15,
    textAlign: 'center',
  },
}); 
import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { useUserStore } from '@/src/store/userStore';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SignUpScreen() {
  const { theme } = useTheme();
  const { signUp } = useUserStore();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleSignUp = async () => {
    try {
      setError(null);
      if (!username.trim()) {
        setError(t('auth.username') + ' is required');
        return;
      }
      await signUp(email, password, username);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {t('auth.createAccount')}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.card,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          },
        ]}
        placeholder={t('auth.email')}
        placeholderTextColor={theme.colors.text + '80'}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.card,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          },
        ]}
        placeholder={t('auth.password')}
        placeholderTextColor={theme.colors.text + '80'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.card,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          },
        ]}
        placeholder={t('auth.username')}
        placeholderTextColor={theme.colors.text + '80'}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>
      )}
      <View style={styles.buttonContainer}>
        <Button
          title={t('auth.signUp')}
          onPress={handleSignUp}
        />
        <Button
          title={t('auth.alreadyHaveAccount')}
          onPress={() => router.replace('/login')}
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
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  buttonContainer: {
    gap: 10,
  },
  error: {
    marginBottom: 15,
    textAlign: 'center',
  },
}); 
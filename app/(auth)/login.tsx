import { PinButton } from '@/src/components/PinButton';
import PinText from '@/src/components/PinText';
import { PinTextInput } from '@/src/components/PinTextInput';
import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { useUserStore } from '@/src/store/userStore';
import { DEBUG_MODE, clearZustandStorage } from '@/src/utils/debug';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const { theme } = useTheme();
  const { signIn } = useUserStore();
  const router = useRouter();
  const [email, setEmail] = useState(''); // DO NOT CHANGE
  const [password, setPassword] = useState(''); // DO NOT CHANGE
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSignIn = async () => {
    try {
      setError(null);
      setLoading(true);
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClearStorage = async () => {
    const success = await clearZustandStorage();
    if (success) {
      setError(t('auth.storageCleared'));
    } else {
      setError(t('auth.storageClearFailed'));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>  
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>PinPoint</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.formInner}>
          <View style={styles.inputsContainer}>
            <PinTextInput
              label={t('auth.email')}
              placeholder={t('auth.email')}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <PinTextInput
              label={t('auth.password')}
              placeholder={t('auth.password')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity onPress={() => {}} style={styles.forgotPasswordButton}>
              <Text style={[styles.forgotPasswordText, { color: theme.colors.text }]}>Forgot password?</Text>
            </TouchableOpacity>
            {error && (
              <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.signInGroup}>
              <PinButton
                onPress={handleSignIn}
                loading={loading}
                disabled={loading}
              >
                {t('auth.signIn')}
              </PinButton>
              <View style={styles.signupRow}>
                <PinText style={[styles.signupText, { color: theme.colors.text }]}>No account? </PinText>
                <TouchableOpacity onPress={() => {}}>
                  <PinText style={[styles.signupLink, { color: theme.colors.text }]}>Sign up</PinText>
                </TouchableOpacity>
              </View>
            </View>
            <Button
              title={t('auth.needAccount')}
              onPress={() => router.replace('/signup')}
            />
            {DEBUG_MODE && (
              <Button
                title={t('auth.clearStorage')}
                onPress={handleClearStorage}
                color="#FF3B30"
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 20,
  },
  titleContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
  },
  formInner: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  inputsContainer: {
    marginBottom: 24,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 10,
  },
  signInGroup: {
    gap: 8,
  },
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
  },
  signupLink: {
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  error: {
    marginBottom: 15,
    textAlign: 'center',
  },
}); 
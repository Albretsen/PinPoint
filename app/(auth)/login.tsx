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
    <View style={[styles.container, { backgroundColor: theme.colors.background, padding: theme.spacing.spacing24 }]}>  
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.colors.text, marginBottom: theme.spacing.spacing32 }]}>PinPoint</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.formInner}>
          <View style={[styles.inputsContainer, { marginBottom: theme.spacing.spacing24 }] }>
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
            <TouchableOpacity onPress={() => {}} style={[styles.forgotPasswordButton] }>
              <PinText style={[styles.forgotPasswordText, { color: theme.colors.text }]}>Forgot password?</PinText>
            </TouchableOpacity>
            {error && (
              <PinText style={[styles.error, { color: theme.colors.error, marginBottom: theme.spacing.spacing8 }]}>{error}</PinText>
            )}
          </View>
          <View style={[styles.buttonContainer, { gap: theme.spacing.spacing16 }] }>
            <View style={[styles.signInGroup, { gap: theme.spacing.spacing8 }] }>
              <PinButton
                onPress={handleSignIn}
                loading={loading}
                disabled={loading}
              >
                {t('auth.signIn')}
              </PinButton>
              <View style={[styles.signupRow] }>
                <PinText style={[styles.signupText, { color: theme.colors.text }]}>No account? </PinText>
                <TouchableOpacity onPress={() => router.replace('/signup')}>
                  <PinText style={[styles.signupLink, { color: theme.colors.text }]}>Sign up</PinText>
                </TouchableOpacity>
              </View>
            </View>
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
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontWeight: '500',
  },
  buttonContainer: {
  },
  signInGroup: {
  },
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  error: {
    textAlign: 'center',
  },
}); 
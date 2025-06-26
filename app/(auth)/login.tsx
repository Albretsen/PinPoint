import { PinButton } from '@/src/components/PinButton';
import PinText from '@/src/components/PinText';
import { PinTextInput } from '@/src/components/PinTextInput';
import { usePinToast } from '@/src/components/PinToast';
import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { useUserStore } from '@/src/store/userStore';
import { DEBUG_MODE, clearZustandStorage } from '@/src/utils/debug';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

function getSupabaseErrorKey(message: string) {
  if (!message) return 'auth.supabase.unknown';
  const msg = message.toLowerCase();
  if (msg.includes('invalid login credentials') || msg.includes('invalid email or password')) return 'auth.supabase.invalidCredentials';
  if (msg.includes('email not confirmed')) return 'auth.supabase.emailNotConfirmed';
  if (msg.includes('user not found')) return 'auth.supabase.userNotFound';
  if (msg.includes('already registered')) return 'auth.supabase.emailAlreadyRegistered';
  if (msg.includes('network')) return 'auth.supabase.networkError';
  return 'auth.supabase.unknown';
}

export default function LoginScreen() {
  const { theme } = useTheme();
  const { signIn } = useUserStore();
  const router = useRouter();
  const { showToast } = usePinToast();
  const [email, setEmail] = useState('test@email.com'); // DO NOT CHANGE
  const [password, setPassword] = useState('Test123'); // DO NOT CHANGE
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSignIn = async () => {
    setError(null);
    setEmailError(null);
    setPasswordError(null);
    let hasError = false;
    if (!email.trim()) {
      setEmailError(t('auth.email') + ' ' + t('auth.required'));
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError(t('auth.password') + ' ' + t('auth.required'));
      hasError = true;
    }
    if (hasError) return;
    try {
      setLoading(true);
      await signIn(email, password);
    } catch (err) {
      let msg = t('error.unknownError');
      if (err instanceof Error) {
        const key = getSupabaseErrorKey(err.message);
        msg = t(key);
      }
      setError(msg);
      showToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClearStorage = async () => {
    const success = await clearZustandStorage();
    if (success) {
      setError(t('auth.storageCleared'));
      showToast(t('auth.storageCleared'));
    } else {
      setError(t('auth.storageClearFailed'));
      showToast(t('auth.storageClearFailed'));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, { backgroundColor: theme.colors.background, padding: theme.spacing.spacing24 }]}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.text, marginBottom: theme.spacing.spacing32 }]}>PinPoint</Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.formInner}>
              <View style={[styles.inputsContainer, { marginBottom: theme.spacing.spacing24 }]}>
                <PinTextInput
                  label={t('auth.email')}
                  placeholder={t('auth.email')}
                  value={email}
                  onChangeText={text => {
                    setEmailError(null);
                    setEmail(text);
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  error={emailError || undefined}
                />
                <PinTextInput
                  label={t('auth.password')}
                  placeholder={t('auth.password')}
                  value={password}
                  onChangeText={text => {
                    setPasswordError(null);
                    setPassword(text);
                  }}
                  secureTextEntry
                  error={passwordError || undefined}
                />
                <TouchableOpacity onPress={() => { }} style={[styles.forgotPasswordButton]}>
                  <PinText style={[styles.forgotPasswordText, { color: theme.colors.text }]}>Forgot password?</PinText>
                </TouchableOpacity>
              </View>
              <View style={[styles.buttonContainer, { gap: theme.spacing.spacing16 }]}>
                <View style={[styles.signInGroup, { gap: theme.spacing.spacing8 }]}>
                  <PinButton
                    onPress={handleSignIn}
                    loading={loading}
                    disabled={loading}
                  >
                    {t('auth.signIn')}
                  </PinButton>
                  <View style={[styles.signupRow]}>
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
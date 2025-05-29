import { useTheme } from '@/src/context/ThemeProvider';
import { useUserStore } from '@/src/store/userStore';
import { DEBUG_MODE, clearZustandStorage } from '@/src/utils/debug';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const { theme } = useTheme();
  const { signIn } = useUserStore();
  const router = useRouter();
  const [email, setEmail] = useState('test@email.com'); // DO NOT CHANGE
  const [password, setPassword] = useState('Test123'); // DO NOT CHANGE
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setError(null);
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleClearStorage = async () => {
    const success = await clearZustandStorage();
    if (success) {
      setError('Storage cleared successfully');
    } else {
      setError('Failed to clear storage');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Welcome Back
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
        placeholder="Email"
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
        placeholder="Password"
        placeholderTextColor={theme.colors.text + '80'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>
      )}
      <View style={styles.buttonContainer}>
        <Button
          title="Sign In"
          onPress={handleSignIn}
        />
        <Button
          title="Need an account? Sign Up"
          onPress={() => router.replace('/signup')}
        />
        {DEBUG_MODE && (
          <Button
            title="Clear Storage (Debug)"
            onPress={handleClearStorage}
            color="#FF3B30"
          />
        )}
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
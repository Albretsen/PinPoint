import PinText from '@/src/components/PinText';
import { useTheme } from '@/src/context/ThemeProvider';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';

export default function LinkAccountScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLinkAccount = async () => {
    try {
      // TODO: Implement account linking logic
      setError('Account linking not implemented yet');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <PinText style={[styles.title, { color: theme.colors.text }]}>
        Link Your Account
      </PinText>
      
      <PinText style={[styles.description, { color: theme.colors.text }]}>
        Link your anonymous account to an email to keep your data and progress.
      </PinText>

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
        keyboardType="email-address"
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
        <PinText style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </PinText>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Link Account"
          onPress={handleLinkAccount}
        />
        <Button
          title="Cancel"
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
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
    gap: 10,
    marginTop: 20,
  },
  error: {
    marginBottom: 15,
    textAlign: 'center',
  },
}); 
import PinText from '@/src/components/PinText';
import { useTheme } from '@/src/context/ThemeProvider';
import { supabase } from '@/src/lib/supabase';
import { useUserStore } from '@/src/store/userStore';
import { ResponseType, useAuthRequest } from 'expo-auth-session';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';

// Initialize WebBrowser for auth
WebBrowser.maybeCompleteAuthSession();

export default function LinkAccountScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { session } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const SUPABASE_CALLBACK = 'https://urcrrsoujovthztwtomd.supabase.co/auth/v1/callback'; 

  const redirectUri = SUPABASE_CALLBACK;

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
      redirectUri,
      responseType: ResponseType.Code,
      scopes: ['profile', 'email'],
    },
    {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
    }
  );

  // Handle the OAuth response
  const handleGoogleResponse = async (response: any) => {
    if (response?.type === 'success') {
      try {
        const { code } = response.params;
        
        // Exchange the code for a session
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUri,
          },
        });

        if (error) throw error;

        // Navigate back to profile on success
        router.back();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } else if (response?.type === 'error') {
      setError('Google sign-in was cancelled or failed');
    }
  };

  // Watch for response changes
  useEffect(() => {
    if (response) {
      handleGoogleResponse(response);
    }
  }, [response]);

  const handleLinkWithEmail = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      // Link the anonymous account with email/password
      const { error: linkError } = await supabase.auth.updateUser({
        email,
        password,
      });

      if (linkError) throw linkError;

      // Navigate back to profile on success
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await promptAsync();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <PinText style={[styles.title, { color: theme.colors.text }]}>
        Link Your Account
      </PinText>
      
      <PinText style={[styles.description, { color: theme.colors.text }]}>
        Link your anonymous account to keep your data and progress.
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
        editable={!isLoading}
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
        editable={!isLoading}
      />

      {error && (
        <PinText style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </PinText>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Link with Email"
          onPress={handleLinkWithEmail}
          disabled={isLoading}
        />
        <Button
          title="Cancel"
          onPress={() => router.back()}
          disabled={isLoading}
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    opacity: 0.7,
  },
}); 
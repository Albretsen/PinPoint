import { useTheme } from '@/src/context/ThemeProvider';
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

  const handleComplete = async () => {
    try {
      if (!username) {
        throw new Error('Username is required');
      }

      // Sign in anonymously
      const { data, error: signInError } = await supabase.auth.signInAnonymously({
        options: { data: {
          username,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        },
      }});

      console.log("data", data);
      console.log("signInError", signInError);
      
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
        Welcome to PinPoint
      </Text>
      
      <Text style={[styles.description, { color: theme.colors.text }]}>
        PinPoint is a location-based game where you and your friends compete to guess each other's locations. Here's how it works:

        {'\n\n'}1. Take a photo at your current location
        {'\n'}2. Share it with your group
        {'\n'}3. Others try to guess where you are
        {'\n'}4. Points are awarded based on accuracy
        {'\n\n'}Ready to start playing?
      </Text>

      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
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
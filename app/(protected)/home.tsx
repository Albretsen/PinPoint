import { ThemeSelector } from '@/src/components/ThemeSelector';
import { useAuth } from '@/src/context/AuthProvider';
import { useTheme } from '@/src/context/ThemeProvider';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { signOut } = useAuth();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Welcome to the Protected Home Screen!
      </Text>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Choose a Theme
        </Text>
        <ThemeSelector />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Sign Out" onPress={signOut} />
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
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
}); 
import Card from '@/src/components/Card';
import PinText from '@/src/components/PinText';
import { ThemeSelector } from '@/src/components/ThemeSelector';
import { useTheme } from '@/src/context/ThemeProvider';
import { useUserStore } from '@/src/store/userStore';
import { Button, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const { signOut } = useUserStore();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <PinText style={[styles.title, { color: theme.colors.text }]}>
        Welcome to the Protected Home Screen!
      </PinText>
      <Card
        image={require('@/assets/images/partial-react-logo.png')}
        header="Bergen Brothers"
        subheading="Reveals in 02:34:02 seconds"
        buttonLabel="Guess Location"
        onButtonPress={() => {}}
      />
      <View style={styles.section}>
        <PinText style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Choose a Theme
        </PinText>
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
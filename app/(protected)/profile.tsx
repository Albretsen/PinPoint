import PinText from '@/src/components/PinText';
import { useTheme } from '@/src/context/ThemeProvider';
import { StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <PinText style={[styles.title, { color: theme.colors.text }]}>
        Profile
      </PinText>
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
}); 
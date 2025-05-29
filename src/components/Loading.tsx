import { useTheme } from '@/src/context/ThemeProvider';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import PinText from './PinText';

interface LoadingProps {
  message?: string;
}

export function Loading({ message }: LoadingProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message && (
        <PinText style={[styles.message, { color: theme.colors.text }]}>
          {message}
        </PinText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.7,
  },
}); 
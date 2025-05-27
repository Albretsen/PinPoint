import { useTheme } from '@/src/context/ThemeProvider';
import { Pressable, StyleSheet, Text } from 'react-native';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? 0.7 : 1 },
      ]}
      onPress={toggleTheme}
    >
      <Text style={styles.text}>
        {isDark ? '🌞 Light' : '🌙 Dark'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  },
}); 
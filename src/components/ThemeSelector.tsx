import { useTheme } from '@/src/context/ThemeProvider';
import { ThemeName, themes } from '@/src/types/theme';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function ThemeSelector() {
  const { themeName, setTheme } = useTheme();

  return (
    <View style={styles.container}>
      {Object.entries(themes).map(([key, themeOption]) => (
        <Pressable
          key={key}
          style={[
            styles.themeButton,
            {
              backgroundColor: themeOption.colors.card,
              borderColor: themeOption.colors.border,
            },
            themeName === key && styles.selectedTheme,
          ]}
          onPress={() => setTheme(key as ThemeName)}
        >
          <Text
            style={[
              styles.themeText,
              { color: themeOption.colors.text },
            ]}
          >
            {themeOption.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 8,
  },
  themeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectedTheme: {
    borderWidth: 2,
  },
  themeText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 
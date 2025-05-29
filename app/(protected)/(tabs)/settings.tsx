import PinText from '@/src/components/PinText';
import { ThemeSelector } from '@/src/components/ThemeSelector';
import { useTheme } from '@/src/context/ThemeProvider';
import { useTranslation } from '@/src/i18n/useTranslation';
import { StyleSheet, View } from 'react-native';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.section}>
        <PinText style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('settings.appearance')}
        </PinText>
        <ThemeSelector />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
}); 
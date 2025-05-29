import { useTheme } from '@/src/context/ThemeProvider';
import { Language } from '@/src/i18n/translations';
import { useTranslation } from '@/src/i18n/useTranslation';
import { Button, StyleSheet, View } from 'react-native';
import PinText from './PinText';

const languages: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'no', name: 'Norsk' },
];

export function LanguageSelector() {
  const { theme } = useTheme();
  const { t, currentLanguage, setLanguage } = useTranslation();

  return (
    <View style={styles.container}>
      <PinText style={[styles.title, { color: theme.colors.text }]}>
        {t('settings.selectLanguage')}
      </PinText>
      <View style={styles.buttonContainer}>
        {languages.map((language) => (
          <Button
            key={language.code}
            title={language.name}
            onPress={() => setLanguage(language.code)}
            color={currentLanguage === language.code ? theme.colors.primary : undefined}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    gap: 10,
  },
}); 